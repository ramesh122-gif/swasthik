import { useState, useEffect } from 'react';
import { Play, Clock, TrendingUp, Star, Heart, X, Pause, RotateCcw } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface YogaSession {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  difficulty: string;
  focus_area: string;
  instructor_name: string;
  video_url: string | null;
  thumbnail_emoji: string;
  rating_average: number;
  rating_count: number;
}

export default function YogaSessions() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [sessions, setSessions] = useState<YogaSession[]>([]);
  const [activeSession, setActiveSession] = useState<YogaSession | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    loadYogaSessions();
  }, []);

  const loadYogaSessions = async () => {
    const { data, error } = await supabase
      .from('yoga_sessions')
      .select('*')
      .order('rating_average', { ascending: false });

    if (data) {
      setSessions(data);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeRemaining]);

  const categories = [
    { id: 'all', label: 'All Sessions' },
    { id: 'anxiety', label: 'Anxiety' },
    { id: 'stress', label: 'Stress' },
    { id: 'sleep', label: 'Sleep' },
    { id: 'energy', label: 'Energy' },
    { id: 'depression', label: 'Mood' },
  ];

  const filteredSessions =
    selectedCategory === 'all'
      ? sessions
      : sessions.filter((s) => s.focus_area.toLowerCase() === selectedCategory.toLowerCase());

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartSession = (session: YogaSession) => {
    setActiveSession(session);
    setTimeRemaining(session.duration_minutes * 60);
    setTimerRunning(true);
  };

  const handlePauseTimer = () => {
    setTimerRunning(false);
  };

  const handleResumeTimer = () => {
    setTimerRunning(true);
  };

  const handleResetTimer = () => {
    if (activeSession) {
      setTimeRemaining(activeSession.duration_minutes * 60);
      setTimerRunning(false);
    }
  };

  const handleSessionComplete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !activeSession) return;

      await supabase.from('user_yoga_progress').insert({
        user_id: user.id,
        session_id: activeSession.id,
        completed_at: new Date().toISOString(),
        duration_minutes: activeSession.duration_minutes,
        completed: true,
      });
    } catch (error) {
      console.error('Error saving yoga progress:', error);
    }
  };

  const handleCloseSession = () => {
    setActiveSession(null);
    setTimerRunning(false);
    setTimeRemaining(0);
  };

  if (activeSession) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        <div className="bg-gray-900 p-4 flex items-center justify-between">
          <div className="text-white">
            <h2 className="text-xl font-bold">{activeSession.title}</h2>
            <p className="text-sm text-gray-400">{activeSession.instructor_name}</p>
          </div>
          <button
            onClick={handleCloseSession}
            className="text-white hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center">
          {activeSession.video_url ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${activeSession.video_url}?autoplay=1`}
              title={activeSession.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          ) : (
            <div className="text-white text-center">
              <p className="text-6xl mb-4">{activeSession.thumbnail_emoji}</p>
              <p className="text-2xl font-bold mb-2">{activeSession.title}</p>
              <p className="text-gray-400">{activeSession.description}</p>
            </div>
          )}
        </div>

        <div className="bg-gray-900 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-4">
              <div className="text-5xl font-bold text-white mb-2">
                {formatTime(timeRemaining)}
              </div>
              <div className="text-gray-400">
                {activeSession.duration_minutes} minute session
              </div>
            </div>

            <div className="flex justify-center gap-4">
              {!timerRunning ? (
                <button
                  onClick={handleResumeTimer}
                  className="flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-semibold"
                >
                  <Play className="w-5 h-5" />
                  Resume
                </button>
              ) : (
                <button
                  onClick={handlePauseTimer}
                  className="flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-semibold"
                >
                  <Pause className="w-5 h-5" />
                  Pause
                </button>
              )}
              <button
                onClick={handleResetTimer}
                className="flex items-center gap-2 bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Yoga & Wellness</h1>
        <p className="text-gray-600 mt-1">Find peace through movement and breath</p>
      </div>

      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Your Progress This Week</h2>
            <div className="flex gap-6 mt-4">
              <div>
                <p className="text-teal-100 text-sm">Sessions Completed</p>
                <p className="text-3xl font-bold">8</p>
              </div>
              <div>
                <p className="text-teal-100 text-sm">Total Minutes</p>
                <p className="text-3xl font-bold">145</p>
              </div>
              <div>
                <p className="text-teal-100 text-sm">Mood Improvement</p>
                <p className="text-3xl font-bold">+2.3</p>
              </div>
            </div>
          </div>
          <div className="text-6xl">🏆</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.map((session) => (
          <div
            key={session.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative bg-gradient-to-br from-teal-400 to-teal-500 h-48 flex items-center justify-center text-7xl">
              {session.thumbnail_emoji}
              <button
                onClick={() => toggleFavorite(session.id)}
                className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${
                    favorites.has(session.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  }`}
                />
              </button>
            </div>

            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-800 mb-2">{session.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{session.description}</p>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{session.duration_minutes} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>{session.difficulty}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{session.rating_average}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{session.instructor_name}</span>
                <span className="px-2 py-1 bg-teal-50 text-teal-700 text-xs rounded-full">
                  {session.focus_area}
                </span>
              </div>

              <button
                onClick={() => handleStartSession(session)}
                className="mt-4 w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start Session
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
