const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export interface MoodData {
  date: string;
  mood_score: number;
  notes?: string;
}

export interface HealthMetrics {
  steps?: number;
  heartRate?: number;
  sleep?: number;
  calories?: number;
}

export interface InsightData {
  moodHistory: MoodData[];
  healthMetrics?: HealthMetrics;
  activityLog?: string[];
}

async function callGeminiAPI(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your environment variables.');
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate insight.';
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

export async function generateDailyInsight(data: InsightData): Promise<{ title: string; content: string }> {
  const recentMoods = data.moodHistory.slice(-7);
  const avgMood = recentMoods.reduce((sum, m) => sum + m.mood_score, 0) / recentMoods.length;

  const prompt = `As a mental health AI companion, analyze this user's recent wellness data and provide ONE actionable daily insight.

Recent mood scores (1-10 scale, last 7 days): ${recentMoods.map(m => m.mood_score).join(', ')}
Average mood: ${avgMood.toFixed(1)}
${data.healthMetrics ? `Health metrics: ${JSON.stringify(data.healthMetrics)}` : ''}
${data.activityLog ? `Recent activities: ${data.activityLog.join(', ')}` : ''}

Provide your response in this exact format:
TITLE: [A short, encouraging title (5-8 words)]
CONTENT: [One specific, actionable recommendation based on the data (2-3 sentences max)]

Focus on:
- Identifying positive patterns to reinforce
- Suggesting one specific action they can take today
- Being encouraging and supportive
- Keeping it brief and actionable

Do not include any other text, formatting, or explanations.`;

  try {
    const response = await callGeminiAPI(prompt);
    const titleMatch = response.match(/TITLE:\s*(.+)/);
    const contentMatch = response.match(/CONTENT:\s*(.+)/s);

    return {
      title: titleMatch?.[1]?.trim() || 'Your Daily Wellness Insight',
      content: contentMatch?.[1]?.trim() || 'Keep focusing on your mental health journey. Every small step counts.',
    };
  } catch (error) {
    return {
      title: 'Stay Connected to Your Wellness',
      content: 'Continue tracking your mood and practicing self-care. Consistency is key to understanding your mental health patterns.',
    };
  }
}

export async function analyzeMoodTrends(moodHistory: MoodData[]): Promise<string> {
  if (moodHistory.length < 3) {
    return 'Keep tracking your mood to see patterns emerge over time.';
  }

  const recentMoods = moodHistory.slice(-14);
  const scores = recentMoods.map(m => m.mood_score);
  const average = scores.reduce((a, b) => a + b, 0) / scores.length;

  const prompt = `Analyze these mood scores from the past 2 weeks (1-10 scale): ${scores.join(', ')}
Average: ${average.toFixed(1)}

Provide a brief, encouraging analysis in 2-3 sentences that:
1. Identifies the main trend (improving, stable, or declining)
2. Highlights any notable patterns
3. Gives one positive, actionable suggestion

Keep it supportive and non-clinical.`;

  try {
    return await callGeminiAPI(prompt);
  } catch (error) {
    return `Your average mood is ${average.toFixed(1)}/10. Continue tracking to identify patterns and celebrate your progress.`;
  }
}

export async function generateYogaRecommendation(
  currentMood: number,
  energy: string,
  experience: string
): Promise<{ sessionName: string; duration: string; description: string }> {
  const prompt = `Recommend ONE specific yoga session for:
- Current mood: ${currentMood}/10
- Energy level: ${energy}
- Experience: ${experience}

Provide response in this format:
SESSION: [Yoga session name]
DURATION: [Time in minutes]
DESCRIPTION: [Brief 1-sentence benefit]

Be specific and practical. Session names should be real yoga styles.`;

  try {
    const response = await callGeminiAPI(prompt);
    const sessionMatch = response.match(/SESSION:\s*(.+)/);
    const durationMatch = response.match(/DURATION:\s*(.+)/);
    const descMatch = response.match(/DESCRIPTION:\s*(.+)/);

    return {
      sessionName: sessionMatch?.[1]?.trim() || 'Gentle Hatha Yoga',
      duration: durationMatch?.[1]?.trim() || '20 minutes',
      description: descMatch?.[1]?.trim() || 'Perfect for relaxation and stress relief',
    };
  } catch (error) {
    return {
      sessionName: 'Mindful Breathing Flow',
      duration: '15 minutes',
      description: 'Great for centering yourself and reducing stress',
    };
  }
}

export async function analyzeDietQuality(
  meals: string[],
  healthGoal: string
): Promise<{ score: number; feedback: string; suggestions: string[] }> {
  const prompt = `Analyze these recent meals for someone with goal: ${healthGoal}
Meals: ${meals.join(', ')}

Provide response in this format:
SCORE: [0-100]
FEEDBACK: [One encouraging sentence about their diet]
SUGGESTIONS: [3 specific, brief suggestions separated by | ]

Focus on mental wellness benefits of nutrition.`;

  try {
    const response = await callGeminiAPI(prompt);
    const scoreMatch = response.match(/SCORE:\s*(\d+)/);
    const feedbackMatch = response.match(/FEEDBACK:\s*(.+)/);
    const suggestionsMatch = response.match(/SUGGESTIONS:\s*(.+)/);

    const suggestions = suggestionsMatch?.[1]
      ?.split('|')
      .map(s => s.trim())
      .filter(Boolean) || [
      'Add more omega-3 rich foods for brain health',
      'Include colorful vegetables in your meals',
      'Stay hydrated throughout the day',
    ];

    return {
      score: parseInt(scoreMatch?.[1] || '70'),
      feedback: feedbackMatch?.[1]?.trim() || 'Your nutrition choices support your mental wellness!',
      suggestions: suggestions.slice(0, 3),
    };
  } catch (error) {
    return {
      score: 75,
      feedback: 'Balanced nutrition supports mental and physical wellbeing.',
      suggestions: [
        'Include more whole grains and lean proteins',
        'Add colorful fruits and vegetables daily',
        'Stay well-hydrated for optimal brain function',
      ],
    };
  }
}

export async function generateWeeklyReport(data: InsightData): Promise<string> {
  const recentMoods = data.moodHistory.slice(-7);
  const avgMood = recentMoods.reduce((sum, m) => sum + m.mood_score, 0) / recentMoods.length;

  const prompt = `Create a brief weekly mental health summary:
- Average mood: ${avgMood.toFixed(1)}/10
- Daily scores: ${recentMoods.map(m => m.mood_score).join(', ')}
${data.healthMetrics ? `- Health data: ${JSON.stringify(data.healthMetrics)}` : ''}

Provide an encouraging 3-4 sentence summary highlighting:
1. Overall progress
2. One positive pattern
3. One area of focus for next week

Be supportive and actionable.`;

  try {
    return await callGeminiAPI(prompt);
  } catch (error) {
    return `This week your average mood was ${avgMood.toFixed(1)}/10. Keep up the great work tracking your mental wellness. Focus on consistency in your self-care practices for continued growth.`;
  }
}

export async function correlateHealthWithMood(
  moodData: MoodData[],
  healthMetrics: HealthMetrics[]
): Promise<string> {
  if (moodData.length < 5 || healthMetrics.length < 5) {
    return 'Track more data to see correlations between your health metrics and mood.';
  }

  const prompt = `Analyze correlation between mood and health metrics:
Mood scores: ${moodData.map(m => m.mood_score).join(', ')}
Health data: ${JSON.stringify(healthMetrics)}

Identify ONE clear correlation in 2 sentences and suggest ONE specific action.`;

  try {
    return await callGeminiAPI(prompt);
  } catch (error) {
    return 'Continue tracking to discover how your physical health influences your mood and wellbeing.';
  }
}
