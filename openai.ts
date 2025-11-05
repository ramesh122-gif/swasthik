const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIChatOptions {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

const SYSTEM_PROMPT = `You are Swasthik AI, a compassionate and empathetic mental health companion. Your role is to:

1. Provide emotional support and active listening
2. Help users explore their feelings in a safe, non-judgmental space
3. Suggest healthy coping strategies and self-care practices
4. Recognize signs of crisis and guide users to professional help when needed
5. Never provide medical diagnoses or replace professional mental health care

Guidelines:
- Be warm, empathetic, and understanding
- Ask thoughtful follow-up questions to encourage reflection
- Validate emotions without dismissing concerns
- Suggest evidence-based coping techniques (breathing exercises, mindfulness, journaling)
- If you detect crisis language (suicidal ideation, self-harm), immediately encourage professional help
- Keep responses conversational and accessible (2-4 sentences typically)
- Remember this is a supportive conversation, not therapy

Important: Always remind users that you're an AI companion for support, not a replacement for professional mental health care.`;

export async function sendChatGPTMessage(
  userMessage: string,
  conversationHistory: ChatMessage[] = [],
  detectedEmotion?: string
): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your environment variables.');
  }

  const emotionContext = detectedEmotion
    ? `\n\nNote: The user's detected emotion from facial analysis is: ${detectedEmotion}. Consider this in your response.`
    : '';

  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT + emotionContext },
    ...conversationHistory.slice(-10),
    { role: 'user', content: userMessage },
  ];

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'I apologize, but I had trouble generating a response. Please try again.';
  } catch (error) {
    console.error('OpenAI API error:', error);

    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw error;
      }
    }

    return "I'm having trouble connecting right now. Please try again in a moment. If you're in crisis, please reach out to a mental health professional immediately.";
  }
}

export async function streamChatGPTMessage(
  userMessage: string,
  conversationHistory: ChatMessage[] = [],
  onChunk: (chunk: string) => void,
  detectedEmotion?: string
): Promise<void> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your environment variables.');
  }

  const emotionContext = detectedEmotion
    ? `\n\nNote: The user's detected emotion from facial analysis is: ${detectedEmotion}. Consider this in your response.`
    : '';

  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT + emotionContext },
    ...conversationHistory.slice(-10),
    { role: 'user', content: userMessage },
  ];

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 500,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No reader available');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            continue;
          }
        }
      }
    }
  } catch (error) {
    console.error('Streaming error:', error);
    throw error;
  }
}

export function detectCrisisLanguage(message: string): boolean {
  const crisisKeywords = [
    'suicide', 'kill myself', 'end my life', 'want to die', 'no reason to live',
    'better off dead', 'self harm', 'hurt myself', 'cut myself', 'overdose'
  ];

  const lowerMessage = message.toLowerCase();
  return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
}
