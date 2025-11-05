import { useState, useEffect } from 'react';
import { Lightbulb, TrendingUp, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { generateDailyInsight, InsightData } from '../lib/gemini';

export default function AIInsightsWidget() {
  const [insight, setInsight] = useState<{ title: string; content: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadInsight();
  }, []);

  const loadInsight = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];

      const { data: existingInsight } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('user_id', user.id)
        .eq('insight_type', 'daily')
        .gte('generated_at', today)
        .maybeSingle();

      if (existingInsight) {
        setInsight({
          title: existingInsight.title,
          content: existingInsight.content,
        });
      } else {
        await generateNewInsight(user.id);
      }
    } catch (error) {
      console.error('Error loading insight:', error);
      setInsight({
        title: 'Stay Connected to Your Wellness',
        content: 'Continue tracking your mood and practicing self-care. Every small step toward better mental health matters.',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateNewInsight = async (userId: string) => {
    setGenerating(true);
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { data: moodData } = await supabase
        .from('mood_entries')
        .select('mood_score, notes, created_at')
        .eq('user_id', userId)
        .gte('created_at', oneWeekAgo.toISOString())
        .order('created_at', { ascending: true });

      const insightData: InsightData = {
        moodHistory: moodData?.map(m => ({
          date: m.created_at,
          mood_score: m.mood_score,
          notes: m.notes,
        })) || [],
      };

      const generatedInsight = await generateDailyInsight(insightData);

      await supabase.from('ai_insights').insert({
        user_id: userId,
        insight_type: 'daily',
        title: generatedInsight.title,
        content: generatedInsight.content,
        data_points: { moodCount: moodData?.length || 0 },
        generated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });

      setInsight(generatedInsight);
    } catch (error) {
      console.error('Error generating insight:', error);
      setInsight({
        title: 'Keep Going Strong',
        content: 'Your commitment to mental wellness is inspiring. Continue tracking your progress and celebrating small wins.',
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleRefresh = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await generateNewInsight(user.id);
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-xl shadow-md p-6 border border-teal-200 dark:border-teal-800">
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-teal-200 dark:bg-teal-800 rounded-full"></div>
            <div className="h-5 bg-teal-200 dark:bg-teal-800 rounded w-1/3"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-teal-200 dark:bg-teal-800 rounded w-full"></div>
            <div className="h-4 bg-teal-200 dark:bg-teal-800 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-xl shadow-md p-6 border border-teal-200 dark:border-teal-800">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-400 rounded-full flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              {insight?.title || 'Daily Insight'}
            </h3>
            <button
              onClick={handleRefresh}
              disabled={generating}
              className="ml-auto p-1 hover:bg-teal-100 dark:hover:bg-teal-900/50 rounded transition-colors disabled:opacity-50"
              title="Generate new insight"
            >
              <RefreshCw className={`w-4 h-4 text-teal-600 dark:text-teal-400 ${generating ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {insight?.content || 'Loading your personalized insight...'}
          </p>
          <p className="text-xs text-teal-600 dark:text-teal-400 mt-3 font-medium">
            Powered by Gemini AI
          </p>
        </div>
      </div>
    </div>
  );
}
