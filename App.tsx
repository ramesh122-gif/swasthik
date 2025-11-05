import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import FloatingChatbot from './components/FloatingChatbot';
import Dashboard from './components/Dashboard';
import MoodTracker from './components/MoodTracker';
import Journal from './components/Journal';
import MindGame from './components/MindGame';
import YogaSessions from './components/YogaSessions';
import Counseling from './components/Counseling';
import Settings from './components/Settings';
import Auth from './components/Auth';
import CustomCursor from './components/CustomCursor';
import ProfileHeader from './components/ProfileHeader';
import StreakRewardsPortal from './components/StreakRewardsPortal';
import { ThemeProvider } from './context/ThemeContext';
import { supabase } from './lib/supabase';

function AppContent() {
  const [activeTab, setActiveTab] = useState('mood');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showStreakPortal, setShowStreakPortal] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [moodTrackerAutoStarted, setMoodTrackerAutoStarted] = useState(false);

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        loadStreakData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated && !moodTrackerAutoStarted) {
      setActiveTab('mood');
      setMoodTrackerAutoStarted(true);
    }
  }, [isAuthenticated, moodTrackerAutoStarted]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    if (session) {
      await loadStreakData(session.user.id);
      await recordDailyActivity(session.user.id);
    }
    setLoading(false);
  };

  const loadStreakData = async (userId: string) => {
    try {
      const { data: streak } = await supabase.rpc('calculate_current_streak', { p_user_id: userId });
      setCurrentStreak(streak || 0);
    } catch (error) {
      console.error('Error loading streak:', error);
    }
  };

  const recordDailyActivity = async (userId: string) => {
    try {
      await supabase.rpc('record_daily_activity', { p_user_id: userId });
    } catch (error) {
      console.error('Error recording activity:', error);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleStreakClick = () => {
    setShowStreakPortal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'mood':
        return <MoodTracker />;
      case 'journal':
        return <Journal />;
      case 'game':
        return <MindGame />;
      case 'yoga':
        return <YogaSessions />;
      case 'counseling':
        return <Counseling />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentStreak={currentStreak}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        onStreakClick={handleStreakClick}
      />

      <div className={`${isSidebarCollapsed ? 'ml-0' : 'ml-64'} transition-all duration-300 p-8`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-end mb-6">
            <ProfileHeader />
          </div>
          {renderContent()}
        </div>
      </div>

      <FloatingChatbot />

      <StreakRewardsPortal
        isOpen={showStreakPortal}
        onClose={() => setShowStreakPortal(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CustomCursor />
      <AppContent />
    </ThemeProvider>
  );
}
