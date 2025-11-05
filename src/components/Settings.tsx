import { useState, useEffect } from 'react';
import { User, Bell, Lock, CreditCard, HelpCircle, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import EditProfileModal from './EditProfileModal';
import NotificationPreferences from './NotificationPreferences';

export default function Settings() {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [profile, setProfile] = useState<{ full_name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle();

      setProfile({
        full_name: profileData?.full_name || 'User',
        email: user.email || '',
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account and preferences</p>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="animate-pulse flex items-center gap-6">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {profile ? getInitials(profile.full_name) : 'U'}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {profile?.full_name || 'User'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{profile?.email}</p>
                <button
                  onClick={() => setShowEditProfile(true)}
                  className="mt-2 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold text-sm"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <button
              onClick={() => setShowEditProfile(true)}
              className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-800 dark:text-gray-100">Personal Information</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Update your name, phone, and bio</p>
              </div>
              <span className="text-gray-400 dark:text-gray-500">›</span>
            </button>

            <button
              onClick={() => setShowNotifications(true)}
              className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-800 dark:text-gray-100">Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage reminders and notification permissions</p>
              </div>
              <span className="text-gray-400 dark:text-gray-500">›</span>
            </button>

            <button className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-800 dark:text-gray-100">Privacy & Security</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Control your data and privacy settings</p>
              </div>
              <span className="text-gray-400 dark:text-gray-500">›</span>
            </button>

            <button className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-800 dark:text-gray-100">Billing & Subscription</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage your payment methods</p>
              </div>
              <span className="text-gray-400 dark:text-gray-500">›</span>
            </button>

            <button className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <HelpCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-800 dark:text-gray-100">Help & Support</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get help or contact support</p>
              </div>
              <span className="text-gray-400 dark:text-gray-500">›</span>
            </button>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-red-600 dark:text-red-400"
            >
              <LogOut className="w-5 h-5" />
              <div className="flex-1 text-left">
                <p className="font-semibold">Sign Out</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sign out of your account</p>
              </div>
              <span className="text-red-400 dark:text-red-500">›</span>
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-xl shadow-md p-6 border border-teal-200 dark:border-teal-800">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Emergency Contact</h3>
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
            Set up an emergency contact who will be notified if we detect a crisis situation.
          </p>
          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-semibold">
            Add Emergency Contact
          </button>
        </div>
      </div>

      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onSuccess={loadProfile}
      />

      <NotificationPreferences
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
}
