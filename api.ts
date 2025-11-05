const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ChatResponse {
  conversationId: string;
  message: string;
  timestamp: string;
}

export async function sendChatMessage(
  userId: string,
  message: string,
  conversationId?: string,
  detectedEmotion?: string
): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      message,
      conversationId,
      detectedEmotion,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return response.json();
}

export async function getMoodAnalytics(userId: string, period: string = 'week') {
  const response = await fetch(`${API_BASE_URL}/api/mood/analytics/${userId}?period=${period}`);

  if (!response.ok) {
    throw new Error('Failed to fetch mood analytics');
  }

  return response.json();
}
