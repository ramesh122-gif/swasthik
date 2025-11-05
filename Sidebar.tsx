import { Home, Heart, Calendar, Activity, Flame, Settings, BookOpen, Brain, Lock, Menu, X } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentStreak?: number;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onStreakClick: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, currentStreak = 7, isCollapsed, setIsCollapsed, onStreakClick }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'mood', label: 'Mood Tracker', icon: Activity },
    { id: 'journal', label: 'Personal Journal', icon: BookOpen, locked: true },
    { id: 'game', label: 'Mind Game', icon: Brain },
    { id: 'yoga', label: 'Yoga & Wellness', icon: Heart },
    { id: 'counseling', label: 'Counseling', icon: Calendar },
  ];

  return (
    <>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700"
      >
        {isCollapsed ? <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" /> : <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />}
      </button>

      <div className={`${isCollapsed ? '-translate-x-full' : 'translate-x-0'} w-64 bg-white dark:bg-gray-800 h-screen shadow-lg fixed left-0 top-0 flex flex-col border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 z-40`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 mt-14">
          <h1 className="text-2xl font-bold gradient-text">Swasthik</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Mental Health Companion</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-semibold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {item.locked && <Lock className="w-4 h-4 ml-auto" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-4 mb-4">
          <button
            onClick={onStreakClick}
            className="w-full bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-4 text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-xs font-medium">Current Streak</p>
                <p className="text-3xl font-bold mt-1">{currentStreak}</p>
                <p className="text-orange-100 text-xs">days</p>
              </div>
              <Flame className="w-10 h-10 text-orange-200" />
            </div>
          </button>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'settings'
                ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-semibold'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>

          <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4 border border-teal-200 dark:border-teal-800">
            <p className="text-sm font-semibold text-teal-900 dark:text-teal-100 mb-1">Need immediate help?</p>
            <p className="text-xs text-teal-700 dark:text-teal-300 mb-2">Crisis support available 24/7</p>
            <a
              href="https://wa.me/919789053303"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-xs bg-teal-600 dark:bg-teal-500 text-white px-3 py-1.5 rounded-md hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors w-full"
            >
              Get Help Now
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
