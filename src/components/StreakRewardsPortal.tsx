import { useState, useEffect } from 'react';
import { X, Flame, Coins, Trophy, Gift, TrendingUp, Award } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface StreakRewardsPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RewardTransaction {
  id: string;
  amount: number;
  reason: string;
  streak_days: number;
  created_at: string;
  transaction_type: string;
}

export default function StreakRewardsPortal({ isOpen, onClose }: StreakRewardsPortalProps) {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [lifetimeCoins, setLifetimeCoins] = useState(0);
  const [transactions, setTransactions] = useState<RewardTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextMilestone, setNextMilestone] = useState(10);

  useEffect(() => {
    if (isOpen) {
      loadRewardsData();
    }
  }, [isOpen]);

  const loadRewardsData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const streakResult = await supabase.rpc('calculate_current_streak', { p_user_id: user.id });
      const streak = streakResult.data || 0;
      setCurrentStreak(streak);

      const nextMilestoneCalc = Math.ceil((streak + 1) / 10) * 10;
      setNextMilestone(nextMilestoneCalc);

      const { data: rewardsData } = await supabase
        .from('user_rewards')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (rewardsData) {
        setTotalCoins(rewardsData.total_coins || 0);
        setLifetimeCoins(rewardsData.lifetime_coins || 0);
      }

      const { data: transactionsData } = await supabase
        .from('reward_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setTransactions(transactionsData || []);
    } catch (error) {
      console.error('Error loading rewards data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMilestoneReward = (days: number) => {
    if (days < 10) return 0;
    const baseReward = (days / 10) * 10;
    const bonus = days >= 20 ? ((days / 10) - 1) * 5 : 0;
    return baseReward + bonus;
  };

  const canClaim300Reward = totalCoins >= 300;

  const claimSpecialReward = async () => {
    if (!canClaim300Reward) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error: updateError } = await supabase
        .from('user_rewards')
        .update({ total_coins: totalCoins - 300 })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      await supabase.from('reward_transactions').insert({
        user_id: user.id,
        transaction_type: 'spent',
        amount: -300,
        reason: 'Claimed 300 coin special reward',
      });

      alert('Congratulations! You have claimed your special reward!');
      loadRewardsData();
    } catch (error) {
      console.error('Error claiming reward:', error);
      alert('Failed to claim reward. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flame className="w-8 h-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Streak Rewards</h2>
              <p className="text-orange-100 text-sm">Keep your momentum going!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading your rewards...</p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white">
                <Flame className="w-8 h-8 mb-2" />
                <p className="text-orange-100 text-sm">Current Streak</p>
                <p className="text-4xl font-bold mt-1">{currentStreak}</p>
                <p className="text-orange-100 text-xs">days</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl p-6 text-white">
                <Coins className="w-8 h-8 mb-2" />
                <p className="text-yellow-100 text-sm">Total Coins</p>
                <p className="text-4xl font-bold mt-1">{totalCoins}</p>
                <p className="text-yellow-100 text-xs">available</p>
              </div>

              <div className="bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl p-6 text-white">
                <Trophy className="w-8 h-8 mb-2" />
                <p className="text-teal-100 text-sm">Lifetime Coins</p>
                <p className="text-4xl font-bold mt-1">{lifetimeCoins}</p>
                <p className="text-teal-100 text-xs">earned total</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Next Milestone</h3>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>{currentStreak} days</span>
                  <span>{nextMilestone} days</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-teal-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(currentStreak / nextMilestone) * 100}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {nextMilestone - currentStreak} more days until your next reward of{' '}
                <span className="font-bold text-yellow-600 dark:text-yellow-400">
                  {getMilestoneReward(nextMilestone)} coins
                </span>
                !
              </p>
            </div>

            {canClaim300Reward && (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Gift className="w-8 h-8" />
                  <div>
                    <h3 className="text-xl font-bold">Special Reward Available!</h3>
                    <p className="text-purple-100 text-sm">You've earned 300+ coins</p>
                  </div>
                </div>
                <p className="mb-4 text-purple-100">
                  Congratulations! You can claim an exclusive reward with your 300 coins.
                </p>
                <button
                  onClick={claimSpecialReward}
                  className="bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  Claim Special Reward (300 coins)
                </button>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Milestone Rewards</h3>
              </div>
              <div className="space-y-3">
                {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((milestone) => {
                  const reward = getMilestoneReward(milestone);
                  const achieved = currentStreak >= milestone;
                  return (
                    <div
                      key={milestone}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        achieved
                          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                          : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Flame className={`w-5 h-5 ${achieved ? 'text-orange-500' : 'text-gray-400'}`} />
                        <span className={`font-semibold ${achieved ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'}`}>
                          {milestone} Day Streak
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Coins className={`w-4 h-4 ${achieved ? 'text-yellow-500' : 'text-gray-400'}`} />
                        <span className={`font-bold ${achieved ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-600 dark:text-gray-400'}`}>
                          {reward} coins
                        </span>
                        {achieved && (
                          <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                            Earned
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {transactions.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Recent Transactions</h3>
                <div className="space-y-2">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{transaction.reason}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Coins className={`w-4 h-4 ${transaction.transaction_type === 'earned' ? 'text-green-500' : 'text-red-500'}`} />
                        <span className={`font-bold ${transaction.transaction_type === 'earned' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {transaction.transaction_type === 'earned' ? '+' : ''}{transaction.amount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-6 border border-teal-200 dark:border-teal-800">
              <h3 className="font-semibold text-teal-900 dark:text-teal-100 mb-2">How Rewards Work</h3>
              <ul className="text-sm text-teal-700 dark:text-teal-300 space-y-2">
                <li>• Complete daily activities to maintain your streak</li>
                <li>• Earn coins at every 10-day milestone</li>
                <li>• Bonus coins increase with longer streaks (e.g., 20 days = extra 5 coins)</li>
                <li>• Collect 300 coins to unlock special rewards</li>
                <li>• The longer you stay consistent, the more you earn!</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
