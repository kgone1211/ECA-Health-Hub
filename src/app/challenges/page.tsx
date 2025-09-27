'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Plus, Calendar, Users, Target, Award, Edit, Trash2 } from 'lucide-react';
import { Challenge } from '@/types';
import { db } from '@/lib/database';
import ChallengeCreationModal from '@/components/ChallengeCreationModal';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = () => {
    try {
      const allChallenges = db.getAllChallenges();
      setChallenges(allChallenges);
    } catch (error) {
      console.error('Failed to load challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChallenge = (challengeData: Omit<Challenge, 'id'>) => {
    try {
      const newChallenge = db.createChallenge(challengeData);
      setChallenges(prev => [...prev, newChallenge]);
    } catch (error) {
      console.error('Failed to create challenge:', error);
      alert('Failed to create challenge. Please try again.');
    }
  };

  const handleDeleteChallenge = (challengeId: string) => {
    if (window.confirm('Are you sure you want to delete this challenge?')) {
      try {
        const success = db.deleteChallenge(challengeId);
        if (success) {
          setChallenges(prev => prev.filter(c => c.id !== challengeId));
        }
      } catch (error) {
        console.error('Failed to delete challenge:', error);
        alert('Failed to delete challenge. Please try again.');
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getChallengeTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'weekly': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'monthly': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getDaysRemaining = (endDate: Date) => {
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Challenges</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Create and manage challenges to motivate your clients
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Create Challenge</span>
          </button>
        </div>

        {/* Challenges Grid */}
        {challenges.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No challenges yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first challenge to start motivating your clients
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Create Your First Challenge</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => {
              const daysRemaining = getDaysRemaining(challenge.endDate);
              const isExpired = daysRemaining < 0;
              const isExpiringSoon = daysRemaining <= 7 && daysRemaining >= 0;

              return (
                <div
                  key={challenge.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {challenge.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getChallengeTypeColor(challenge.type)}`}>
                          {challenge.type.toUpperCase()}
                        </span>
                        {isExpired && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                            EXPIRED
                          </span>
                        )}
                        {isExpiringSoon && !isExpired && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                            ENDING SOON
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => {/* TODO: Edit functionality */}}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteChallenge(challenge.id)}
                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {challenge.description}
                  </p>

                  {/* Requirements */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                      <Target className="h-4 w-4 mr-1" />
                      Requirements
                    </h4>
                    <div className="space-y-1">
                      {challenge.requirements.map((req, index) => (
                        <div key={index} className="text-xs text-gray-600 dark:text-gray-400">
                          • {req.value} {req.type.replace('_', ' ')} per {req.timeframe}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rewards */}
                  {challenge.rewards.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                        <Award className="h-4 w-4 mr-1" />
                        Rewards
                      </h4>
                      <div className="space-y-1">
                        {challenge.rewards.map((reward, index) => (
                          <div key={index} className="text-xs text-yellow-600 dark:text-yellow-400">
                            • {reward.type}: {reward.value}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{challenge.participants.length} participants</span>
                      </div>
                    </div>
                    {!isExpired && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {daysRemaining > 0 ? `${daysRemaining} days left` : 'Ends today'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Create Challenge Modal */}
        <ChallengeCreationModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreateChallenge}
        />
      </div>
    </div>
  );
}

