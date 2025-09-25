'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Target, Award, Calendar, Users, CheckCircle, Clock } from 'lucide-react';
import { Challenge } from '@/types';
import { db } from '@/lib/database';

interface ClientChallengesProps {
  clientId: string;
}

export default function ClientChallenges({ clientId }: ClientChallengesProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChallenges();
  }, [clientId]);

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

  const joinChallenge = (challengeId: string) => {
    try {
      const success = db.addParticipantToChallenge(challengeId, clientId);
      if (success) {
        // Reload challenges to show updated participation
        loadChallenges();
      }
    } catch (error) {
      console.error('Failed to join challenge:', error);
      alert('Failed to join challenge. Please try again.');
    }
  };

  const leaveChallenge = (challengeId: string) => {
    try {
      const success = db.removeParticipantFromChallenge(challengeId, clientId);
      if (success) {
        // Reload challenges to show updated participation
        loadChallenges();
      }
    } catch (error) {
      console.error('Failed to leave challenge:', error);
      alert('Failed to leave challenge. Please try again.');
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

  const getProgressPercentage = (challenge: Challenge) => {
    const now = new Date();
    const startTime = challenge.startDate.getTime();
    const endTime = challenge.endDate.getTime();
    const currentTime = now.getTime();
    
    if (currentTime < startTime) return 0;
    if (currentTime > endTime) return 100;
    
    const totalDuration = endTime - startTime;
    const elapsed = currentTime - startTime;
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  const isParticipating = (challenge: Challenge) => {
    return challenge.participants.includes(clientId);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Available Challenges</h2>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {challenges.length} challenge{challenges.length !== 1 ? 's' : ''}
        </span>
      </div>

      {challenges.length === 0 ? (
        <div className="text-center py-8">
          <Trophy className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No challenges available</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Your coach hasn't created any challenges yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {challenges.map((challenge) => {
            const daysRemaining = getDaysRemaining(challenge.endDate);
            const isExpired = daysRemaining < 0;
            const isExpiringSoon = daysRemaining <= 7 && daysRemaining >= 0;
            const progressPercentage = getProgressPercentage(challenge);

            return (
              <div
                key={challenge.id}
                className={`border rounded-lg p-4 transition-all ${
                  isExpired 
                    ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10' 
                    : isExpiringSoon
                    ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
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
                      {isParticipating(challenge) && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          JOINED
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                    {isExpired ? (
                      <Clock className="h-4 w-4" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    <span>
                      {isExpired ? 'Expired' : `${daysRemaining} days left`}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {challenge.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isExpired 
                          ? 'bg-red-500' 
                          : isExpiringSoon 
                          ? 'bg-yellow-500' 
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                    <Target className="h-4 w-4 mr-1" />
                    Requirements
                  </h4>
                  <div className="space-y-1">
                    {challenge.requirements.map((req, index) => (
                      <div key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        {req.value} {req.type.replace('_', ' ')} per {req.timeframe}
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
                        <div key={index} className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                          {reward.type}: {reward.value}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Join/Leave Button */}
                <div className="mb-4">
                  {isParticipating(challenge) ? (
                    <button
                      onClick={() => leaveChallenge(challenge.id)}
                      className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      Leave Challenge
                    </button>
                  ) : (
                    <button
                      onClick={() => joinChallenge(challenge.id)}
                      disabled={isExpired}
                      className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        isExpired
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isExpired ? 'Challenge Expired' : 'Join Challenge'}
                    </button>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
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
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
