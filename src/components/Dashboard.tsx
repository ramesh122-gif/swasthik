import { useState, useEffect } from 'react';
import { Heart, Calendar, BookOpen, Brain } from 'lucide-react';
import { supabase } from '../lib/supabase';
import DietQualityAnalyzer from './DietQualityAnalyzer';
import SmartWatchIntegration from './SmartWatchIntegration';
import AIInsightsWidget from './AIInsightsWidget';

export default function Dashboard() {
  const [weekStats, setWeekStats] = useState({
    avgMood: 0,
    moodEntries: 0,
    yogaSessions: 0,
    journalEntries: 0,
    gamesPlayed: 0,
  });
  const [moodData, setMoodData] = useState<{ day: string; mood: number | null }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const [moodResult, yogaResult, journalResult, gameResult] = await Promise.all([
        supabase
          .from('mood_entries')
          .select('mood_score, created_at')
          .eq('user_id', user.id)
          .gte('created_at', oneWeekAgo.toISOString()),
        supabase
          .from('user_yoga_progress')
          .select('id')
          .eq('user_id', user.id)
          .eq('completed', true)
          .gte('started_at', oneWeekAgo.toISOString()),
        supabase
          .from('journal_entries')
          .select('id')
          .eq('user_id', user.id)
          .gte('created_at', oneWeekAgo.toISOString()),
        supabase
          .from('mind_game_scores')
          .select('id')
          .eq('user_id', user.id)
          .gte('created_at', oneWeekAgo.toISOString()),
      ]);

      const moodEntries = moodResult.data || [];
      const avgMood = moodEntries.length > 0
        ? moodEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / moodEntries.length
        : 0;

      setWeekStats({
        avgMood: parseFloat(avgMood.toFixed(1)),
        moodEntries: moodEntries.length,
        yogaSessions: yogaResult.data?.length || 0,
        journalEntries: journalResult.data?.length || 0,
        gamesPlayed: gameResult.data?.length || 0,
      });

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date;
      });

      const weekMoodData = last7Days.map(date => {
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));

        const dayMoods = moodEntries.filter(entry => {
          const entryDate = new Date(entry.created_at);
          return entryDate >= dayStart && entryDate <= dayEnd;
        });

        const avgDayMood = dayMoods.length > 0
          ? dayMoods.reduce((sum, entry) => sum + entry.mood_score, 0) / dayMoods.length
          : null;

        return {
          day: dayName,
          mood: avgDayMood ? parseFloat(avgDayMood.toFixed(1)) : null,
        };
      });

      setMoodData(weekMoodData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const hasAnyData = weekStats.moodEntries > 0 || weekStats.yogaSessions > 0 || weekStats.journalEntries > 0 || weekStats.gamesPlayed > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Welcome back!</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">How are you feeling today?</p>
        </div>
      </div>

      {!hasAnyData ? (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8 text-center">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Start Your Wellness Journey
          </h3>
          <p className="text-blue-700 dark:text-blue-300 mb-4">
            Begin tracking your mood, practicing yoga, or journaling to see your progress here.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-rose-100 text-sm">Avg Mood</p>
                  <p className="text-3xl font-bold mt-1">
                    {weekStats.avgMood > 0 ? `${weekStats.avgMood}/10` : 'N/A'}
                  </p>
                </div>
                <Heart className="w-12 h-12 text-rose-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Yoga Sessions</p>
                  <p className="text-3xl font-bold mt-1">{weekStats.yogaSessions}</p>
                </div>
                <Calendar className="w-12 h-12 text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Journal Entries</p>
                  <p className="text-3xl font-bold mt-1">{weekStats.journalEntries}</p>
                </div>
                <BookOpen className="w-12 h-12 text-purple-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="teal-100 text-sm">Games Played</p>
                  <p className="text-3xl font-bold mt-1">{weekStats.gamesPlayed}</p>
                </div>
                <Brain className="w-12 h-12 text-teal-200" />
              </div>
            </div>
          </div>

          {weekStats.moodEntries > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Your Week at a Glance</h2>
              <div className="flex items-end justify-between h-48 gap-2">
                {moodData.map((data, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="flex-1 w-full flex items-end">
                      {data.mood !== null ? (
                        <div
                          className="w-full bg-gradient-to-t from-teal-500 to-teal-400 rounded-t-lg transition-all hover:from-teal-600 hover:to-teal-500"
                          style={{ height: `${(data.mood / 10) * 100}%` }}
                        ></div>
                      ) : (
                        <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{data.day}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {data.mood !== null ? `${data.mood}/10` : '-'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Health Tracking</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DietQualityAnalyzer />
          <SmartWatchIntegration />
        </div>
      </div>

      <AIInsightsWidget />
    </div>
  );
}
