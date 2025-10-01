'use client';

import { useState, useEffect } from 'react';
import { Trophy, Award, Target, TrendingUp, Star, Zap, Users, Gift, Medal, Crown, Flame } from 'lucide-react';

interface GamificationData {
  points: {
    total_points: number;
    current_level: number;
    points_to_next_level: number;
    lifetime_points: number;
  } | null;
  achievements: any[];
  challenges: any[];
  transactions: any[];
}

export default function GamificationPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'challenges' | 'leaderboard'>('overview');
  const [data, setData] = useState<GamificationData | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock user ID - in production, get from auth
  const userId = 1;

  useEffect(() => {
    loadGamificationData();
  }, []);

  const loadGamificationData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/gamification?userId=${userId}`);
      const result = await response.json();
      setData(result);

      // Load leaderboard
      const lbResponse = await fetch(`/api/gamification?userId=${userId}&action=leaderboard`);
      const lbResult = await lbResponse.json();
      setLeaderboard(lbResult.leaderboard || []);
    } catch (error) {
      console.error('Failed to load gamification data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeColor = (color: string) => {
    const colors: Record<string, string> = {
      gold: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      silver: 'bg-gray-100 text-gray-800 border-gray-300',
      bronze: 'bg-orange-100 text-orange-800 border-orange-300',
      blue: 'bg-blue-100 text-blue-800 border-blue-300',
      purple: 'bg-purple-100 text-purple-800 border-purple-300'
    };
    return colors[color] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getIconForCategory = (category: string) => {
    const icons: Record<string, any> = {
      milestone: Target,
      consistency: Flame,
      performance: TrendingUp,
      social: Users
    };
    return icons[category] || Award;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Trophy className="h-12 w-12 text-purple-600 mx-auto mb-4 animate-bounce" />
          <p className="text-gray-600">Loading gamification...</p>
        </div>
      </div>
    );
  }

  const levelProgress = data?.points 
    ? ((data.points.total_points % 50) / 50) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Gamification</h1>
              <p className="text-purple-100 mt-1">Track your progress and earn rewards</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <Crown className="h-8 w-8" />
                <div>
                  <p className="text-sm text-purple-100">Level</p>
                  <p className="text-3xl font-bold">{data?.points?.current_level || 1}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Points Card */}
          <div className="mt-6 bg-white/10 backdrop-blur rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-purple-200 text-sm mb-1">Total Points</p>
                <p className="text-3xl font-bold">{data?.points?.total_points?.toLocaleString() || 0}</p>
              </div>
              <div>
                <p className="text-purple-200 text-sm mb-1">Lifetime Points</p>
                <p className="text-3xl font-bold">{data?.points?.lifetime_points?.toLocaleString() || 0}</p>
              </div>
              <div>
                <p className="text-purple-200 text-sm mb-1">Next Level</p>
                <p className="text-xl font-bold mb-2">{data?.points?.points_to_next_level || 0} points</p>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-500"
                    style={{ width: `${levelProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: TrendingUp },
              { id: 'achievements', name: 'Achievements', icon: Award },
              { id: 'challenges', name: 'Challenges', icon: Target },
              { id: 'leaderboard', name: 'Leaderboard', icon: Trophy }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {data?.transactions && data.transactions.length > 0 ? (
                  data.transactions.map((transaction: any) => (
                    <div key={transaction.id} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Star className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {transaction.reason.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">+{transaction.points}</p>
                        <p className="text-xs text-gray-500">points</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center text-gray-500">
                    <Star className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p>No activity yet. Start earning points!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Achievements ({data?.achievements?.length || 0})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.achievements && data.achievements.length > 0 ? (
                  data.achievements.map((ua: any) => {
                    const achievement = ua.achievement;
                    const Icon = getIconForCategory(achievement.category);
                    return (
                      <div
                        key={ua.id}
                        className={`p-4 border-2 rounded-xl ${getBadgeColor(achievement.badge_color)}`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-white rounded-lg">
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold">{achievement.name}</h4>
                            <p className="text-sm mt-1">{achievement.description}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs font-medium">+{achievement.points} points</span>
                              <span className="text-xs">
                                {new Date(ua.earned_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-8">
                    <Medal className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No achievements earned yet. Keep going!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Challenges</h3>
              <div className="space-y-4">
                {data?.challenges && data.challenges.length > 0 ? (
                  data.challenges.map((uc: any) => {
                    const challenge = uc.challenge;
                    const progress = (uc.current_progress / challenge.goal_value) * 100;
                    return (
                      <div key={uc.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-gray-900">{challenge.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-purple-600">
                              +{challenge.points_reward} points
                            </p>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">
                              {uc.current_progress} / {challenge.goal_value}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No active challenges. Check back soon!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Top Users</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {leaderboard.map((entry: any, index: number) => {
                const user = entry.user;
                const isTop3 = index < 3;
                const rankColors = ['text-yellow-600', 'text-gray-400', 'text-orange-600'];
                
                return (
                  <div
                    key={entry.id}
                    className={`px-6 py-4 flex items-center justify-between ${
                      isTop3 ? 'bg-gradient-to-r from-gray-50 to-white' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`text-2xl font-bold ${isTop3 ? rankColors[index] : 'text-gray-400'}`}>
                        {index + 1}
                      </div>
                      <div className="h-10 w-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {user?.username?.[0]?.toUpperCase() || user?.full_name?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user?.full_name || user?.username || 'User'}
                        </p>
                        <p className="text-sm text-gray-500">Level {entry.current_level}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-purple-600">
                        {entry.total_points.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">points</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
