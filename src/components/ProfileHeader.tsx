import { useState, useEffect } from 'react';
import { Moon, Sun, User, Crown, Coins } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';

export default function ProfileHeader() {
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<{
    full_name: string | null;
    avatar_url: string | null;
    subscription_type: string;
  } | null>(null);
  const [totalCoins, setTotalCoins] = useState(0);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserEmail(user.email || '');

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      } else {
        await supabase.from('profiles').insert({
          id: user.id,
          full_name: user.email?.split('@')[0] || 'User',
          subscription_type: 'free',
        });

        setProfile({
          full_name: user.email?.split('@')[0] || 'User',
          avatar_url: null,
          subscription_type: 'free',
        });
      }

      const { data: rewardsData } = await supabase
        .from('user_rewards')
        .select('total_coins')
        .eq('user_id', user.id)
        .maybeSingle();

      if (rewardsData) {
        setTotalCoins(rewardsData.total_coins || 0);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const getSubscriptionBadge = (type: string) => {
    switch (type) {
      case 'premium':
        return { label: 'Premium', color: 'from-blue-500 to-cyan-500', icon: Crown };
      case 'elite':
        return { label: 'Elite', color: 'from-purple-500 to-pink-500', icon: Crown };
      default:
        return { label: 'Free', color: 'from-gray-500 to-gray-600', icon: User };
    }
  };

  const badge = profile ? getSubscriptionBadge(profile.subscription_type) : null;
  const BadgeIcon = badge?.icon || User;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-2 rounded-lg border border-yellow-300 dark:border-yellow-700">
        <Coins className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        <span className="font-bold text-yellow-700 dark:text-yellow-300">{totalCoins}</span>
      </div>

      <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white font-bold">
            {profile?.full_name?.charAt(0).toUpperCase() || userEmail.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
            {profile?.full_name || userEmail.split('@')[0]}
          </span>
          {badge && (
            <div className={`flex items-center gap-1 bg-gradient-to-r ${badge.color} px-2 py-0.5 rounded text-xs text-white font-semibold`}>
              <BadgeIcon className="w-3 h-3" />
              <span>{badge.label}</span>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={toggleTheme}
        className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-gray-700" />
        )}
      </button>
    </div>
  );
}
