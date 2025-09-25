'use client';

import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  Target, 
  TrendingUp, 
  Users, 
  Star,
  Zap,
  Crown,
  Medal,
  Flame,
  CheckCircle
} from 'lucide-react';
import { db } from '@/lib/database';
import { Challenge } from '@/types';
import ChallengeCreationModal from '@/components/ChallengeCreationModal';

export default function GamificationPage() {
  const [userId] = useState('2');
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'achievements' | 'challenges'>('leaderboard');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const userPoints = db.getUserPoints(userId);
  const userStreaks = db.getUserStreaks(userId);
  const achievements = db.getAchievements();
  const challenges = db.getAllChallenges();

  // Mock leaderboard data
  const leaderboardData = [
    { rank: 1, name: 'Emma Davis', points: 1250, avatar: 'ED', streak: 15, isCurrentUser: false },
    { rank: 2, name: 'John Smith', points: 1180, avatar: 'JS', streak: 12, isCurrentUser: true },
    { rank: 3, name: 'Sarah Wilson', points: 1100, avatar: 'SW', streak: 10, isCurrentUser: false },
    { rank: 4, name: 'Mike Chen', points: 950, avatar: 'MC', streak: 8, isCurrentUser: false },
    { rank: 5, name: 'Lisa Brown', points: 890, avatar: 'LB', streak: 7, isCurrentUser: false }
  ];


  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-orange-500" />;
      default: return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gamification Hub</h1>
              <p className="text-sm text-gray-600">Track your progress, compete, and earn rewards</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-yellow-50 px-4 py-2 rounded-lg">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium text-yellow-800">{userPoints} points</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Points</p>
                <p className="text-2xl font-bold text-gray-900">{userPoints}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-orange-100">
                <Flame className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userStreaks.find(s => s.type === 'journal')?.current || 0} days
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Achievements</p>
                <p className="text-2xl font-bold text-gray-900">3/12</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rank</p>
                <p className="text-2xl font-bold text-gray-900">#2</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'leaderboard', name: 'Leaderboard', icon: Trophy },
                { id: 'achievements', name: 'Achievements', icon: Award },
                { id: 'challenges', name: 'Challenges', icon: Target }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'leaderboard' | 'achievements' | 'challenges')}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
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

        {/* Tab Content */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            {/* Weekly Leaderboard */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Weekly Leaderboard</h3>
                <p className="text-sm text-gray-600">Top performers this week</p>
              </div>
              <div className="divide-y divide-gray-200">
                {leaderboardData.map((user) => (
                  <div
                    key={user.rank}
                    className={`px-6 py-4 flex items-center justify-between ${
                      user.isCurrentUser ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8">
                        {getRankIcon(user.rank)}
                      </div>
                      <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">{user.avatar}</span>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${user.isCurrentUser ? 'text-blue-900' : 'text-gray-900'}`}>
                          {user.name} {user.isCurrentUser && '(You)'}
                        </p>
                        <p className="text-xs text-gray-500">{user.streak} day streak</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{user.points}</p>
                        <p className="text-xs text-gray-500">points</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-green-600">+{Math.floor(Math.random() * 50) + 10}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-4xl">{achievement.icon}</div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{achievement.name}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      {achievement.points} points
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Earned
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="space-y-6">
            {/* Header with Create Button */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Active Challenges</h3>
                <p className="text-sm text-gray-600">Create and manage challenges for your clients</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Target className="h-4 w-4 mr-2" />
                Create Challenge
              </button>
            </div>

            {/* Challenges Grid */}
            {challenges.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No challenges yet</h3>
                <p className="text-gray-600 mb-6">
                  Create your first challenge to start motivating your clients
                </p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Target className="h-5 w-5 mr-2" />
                  Create Your First Challenge
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.map((challenge) => {
                  const daysRemaining = Math.ceil((challenge.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  const isExpired = daysRemaining < 0;
                  const isExpiringSoon = daysRemaining <= 7 && daysRemaining >= 0;

                  return (
                    <div
                      key={challenge.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{challenge.name}</h4>
                          <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                          <div className="flex items-center space-x-2 mb-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              challenge.type === 'daily' ? 'bg-green-100 text-green-800' :
                              challenge.type === 'weekly' ? 'bg-blue-100 text-blue-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {challenge.type.toUpperCase()}
                            </span>
                            {isExpired && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                EXPIRED
                              </span>
                            )}
                            {isExpiringSoon && !isExpired && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                ENDING SOON
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Requirements */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Requirements</h5>
                        <div className="space-y-1">
                          {challenge.requirements.map((req, index) => (
                            <div key={index} className="text-xs text-gray-600">
                              • {req.value} {req.type.replace('_', ' ')} per {req.timeframe}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Rewards */}
                      {challenge.rewards.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-900 mb-2">Rewards</h5>
                          <div className="space-y-1">
                            {challenge.rewards.map((reward, index) => (
                              <div key={index} className="text-xs text-yellow-600">
                                • {reward.type}: {reward.value}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="text-xs text-gray-500">
                          {challenge.participants.length} participants
                        </div>
                        <div className="text-xs text-gray-500">
                          {isExpired ? 'Expired' : `${daysRemaining} days left`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Challenge Creation Modal */}
      <ChallengeCreationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={(challengeData) => {
          db.createChallenge(challengeData);
          setIsCreateModalOpen(false);
          // In a real app, you'd update the UI state here
          window.location.reload(); // Simple refresh for demo
        }}
      />
    </div>
  );
}
