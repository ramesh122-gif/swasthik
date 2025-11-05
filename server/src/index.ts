import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatRequest {
  userId: string;
  conversationId?: string;
  message: string;
  detectedEmotion?: string;
}

interface ChatContext {
  recentMessages: Array<{ role: string; content: string }>;
  userMoodTrend: string;
  userName: string;
}

async function getChatContext(userId: string, conversationId?: string): Promise<ChatContext> {
  const { data: user } = await supabase
    .from('users')
    .select('full_name')
    .eq('id', userId)
    .single();

  let recentMessages: Array<{ role: string; content: string }> = [];

  if (conversationId) {
    const { data: messages } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(10);

    if (messages) {
      recentMessages = messages;
    }
  }

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const { data: moodData } = await supabase
    .from('mood_entries')
    .select('mood_score, created_at')
    .eq('user_id', userId)
    .gte('created_at', oneWeekAgo.toISOString())
    .order('created_at', { ascending: true });

  let userMoodTrend = 'stable';
  if (moodData && moodData.length >= 2) {
    const recentAvg = moodData.slice(-3).reduce((sum, entry) => sum + entry.mood_score, 0) / Math.min(3, moodData.length);
    const olderAvg = moodData.slice(0, 3).reduce((sum, entry) => sum + entry.mood_score, 0) / Math.min(3, moodData.length);

    if (recentAvg > olderAvg + 1) userMoodTrend = 'improving';
    else if (recentAvg < olderAvg - 1) userMoodTrend = 'declining';
  }

  return {
    recentMessages,
    userMoodTrend,
    userName: user?.full_name || 'there',
  };
}

app.post('/api/chat', async (req, res) => {
  try {
    const { userId, conversationId, message, detectedEmotion }: ChatRequest = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const context = await getChatContext(userId, conversationId);

    let currentConversationId = conversationId;
    if (!currentConversationId) {
      const { data: newConv, error } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: userId,
          title: message.substring(0, 50),
        })
        .select()
        .single();

      if (error) throw error;
      currentConversationId = newConv.id;
    }

    await supabase.from('chat_messages').insert({
      conversation_id: currentConversationId,
      user_id: userId,
      role: 'user',
      content: message,
      detected_emotion: detectedEmotion,
    });

    const systemPrompt = `You are Bhishma AI, a caring and empathetic mental health companion. You are NOT a therapist or medical professional.

Your personality:
- Warm, caring, and non-judgmental
- Use the person's name (${context.userName}) occasionally to personalize
- Be conversational and friendly, not clinical
- Validate emotions and provide support
- Offer gentle suggestions for coping strategies

User context:
- Recent mood trend: ${context.userMoodTrend}
${detectedEmotion ? `- Current detected emotion: ${detectedEmotion}` : ''}

Guidelines:
- NEVER provide medical advice or diagnoses
- Always recommend professional help for serious concerns
- Keep responses concise (2-4 sentences)
- Ask gentle follow-up questions
- Suggest app features when relevant (yoga, breathing exercises, counseling)
- Detect crisis keywords and immediately provide crisis resources

If you detect keywords like "suicide", "self-harm", "end my life", respond with:
"I'm really concerned about you. Please reach out to a crisis helpline immediately: National Suicide Prevention Lifeline: 988. You can also text HOME to 741741. Would you like me to help you find a counselor?"`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...context.recentMessages.slice(-6),
      { role: 'user' as const, content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages,
      temperature: 0.8,
      max_tokens: 200,
    });

    const assistantMessage = completion.choices[0].message.content || 'I'm here to listen. How can I support you?';

    await supabase.from('chat_messages').insert({
      conversation_id: currentConversationId,
      user_id: userId,
      role: 'assistant',
      content: assistantMessage,
    });

    await supabase
      .from('chat_conversations')
      .update({
        last_message_at: new Date().toISOString(),
        message_count: context.recentMessages.length + 2,
      })
      .eq('id', currentConversationId);

    res.json({
      conversationId: currentConversationId,
      message: assistantMessage,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

app.post('/api/mood', async (req, res) => {
  try {
    const { userId, moodScore, emotions, triggers, notes, source } = req.body;

    if (!userId || !moodScore) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('mood_entries')
      .insert({
        user_id: userId,
        mood_score: moodScore,
        emotions: emotions || [],
        triggers: triggers || [],
        notes: notes || null,
        entry_source: source || 'manual',
      })
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Mood entry error:', error);
    res.status(500).json({ error: 'Failed to save mood entry' });
  }
});

app.get('/api/mood/analytics/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { period = 'week' } = req.query;

    const daysAgo = period === 'week' ? 7 : period === 'month' ? 30 : 365;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    const { data: moodData, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    if (!moodData || moodData.length === 0) {
      return res.json({
        averageMood: 0,
        totalEntries: 0,
        moodTrend: 'insufficient_data',
        emotionFrequency: {},
      });
    }

    const averageMood = moodData.reduce((sum, entry) => sum + entry.mood_score, 0) / moodData.length;

    const emotionFrequency: Record<string, number> = {};
    moodData.forEach(entry => {
      entry.emotions.forEach((emotion: string) => {
        emotionFrequency[emotion] = (emotionFrequency[emotion] || 0) + 1;
      });
    });

    const recentAvg = moodData.slice(-3).reduce((sum, entry) => sum + entry.mood_score, 0) / Math.min(3, moodData.length);
    const olderAvg = moodData.slice(0, 3).reduce((sum, entry) => sum + entry.mood_score, 0) / Math.min(3, moodData.length);

    let moodTrend = 'stable';
    if (recentAvg > olderAvg + 1) moodTrend = 'improving';
    else if (recentAvg < olderAvg - 1) moodTrend = 'declining';

    res.json({
      averageMood: parseFloat(averageMood.toFixed(1)),
      totalEntries: moodData.length,
      moodTrend,
      emotionFrequency,
      dailyData: moodData,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

app.get('/api/yoga/tutorials', async (req, res) => {
  try {
    const { focusArea, difficulty } = req.query;

    let query = supabase.from('yoga_sessions').select('*');

    if (focusArea) {
      query = query.eq('focus_area', focusArea);
    }
    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }

    const { data, error } = await query.order('rating_average', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Yoga tutorials error:', error);
    res.status(500).json({ error: 'Failed to fetch yoga tutorials' });
  }
});

app.post('/api/counseling/book', async (req, res) => {
  try {
    const { userId, therapistId, scheduledAt, sessionType, isFreeTrial } = req.body;

    if (!userId || !therapistId || !scheduledAt || !sessionType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data: therapist } = await supabase
      .from('therapists')
      .select('rate_per_hour')
      .eq('id', therapistId)
      .single();

    const { data, error } = await supabase
      .from('counseling_bookings')
      .insert({
        user_id: userId,
        therapist_id: therapistId,
        scheduled_at: scheduledAt,
        session_type: sessionType,
        is_free_trial: isFreeTrial || false,
        amount_paid: isFreeTrial ? 0 : therapist?.rate_per_hour || 0,
        video_room_id: `room_${Date.now()}`,
      })
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Bhishma AI API server running on port ${PORT}`);
});

export default app;
