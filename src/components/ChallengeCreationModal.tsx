'use client';

import React, { useState } from 'react';
import { X, Trophy, Target, Calendar, Users } from 'lucide-react';
import { Challenge, ChallengeRequirement, ChallengeReward } from '@/types';

interface ChallengeCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (challenge: Omit<Challenge, 'id'>) => void;
}

export default function ChallengeCreationModal({ isOpen, onClose, onSave }: ChallengeCreationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'daily' as 'daily' | 'weekly' | 'monthly',
    startDate: '',
    endDate: '',
    requirements: [] as ChallengeRequirement[],
    rewards: [] as ChallengeReward[]
  });

  const [newRequirement, setNewRequirement] = useState({
    type: 'journal_entries' as 'journal_entries' | 'check_ins' | 'habits' | 'points',
    value: 1,
    timeframe: 'daily' as 'daily' | 'weekly' | 'monthly'
  });

  const [newReward, setNewReward] = useState({
    type: 'points' as 'points' | 'badge' | 'achievement',
    value: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addRequirement = () => {
    if (newRequirement.value > 0) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, { ...newRequirement }]
      }));
      setNewRequirement({
        type: 'journal_entries',
        value: 1,
        timeframe: 'daily'
      });
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addReward = () => {
    if (newReward.value.trim()) {
      setFormData(prev => ({
        ...prev,
        rewards: [...prev.rewards, { ...newReward }]
      }));
      setNewReward({
        type: 'points',
        value: ''
      });
    }
  };

  const removeReward = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rewards: prev.rewards.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim() || !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.requirements.length === 0) {
      alert('Please add at least one requirement');
      return;
    }

    const challenge: Omit<Challenge, 'id'> = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      type: formData.type,
      requirements: formData.requirements,
      rewards: formData.rewards,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      isActive: true,
      participants: []
    };

    onSave(challenge);
    onClose();
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      type: 'daily',
      startDate: '',
      endDate: '',
      requirements: [],
      rewards: []
    });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Challenge</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Challenge Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 30-Day Journal Challenge"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe what participants need to do..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Challenge Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Requirements</h3>
            
            <div className="space-y-3">
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {req.value} {req.type.replace('_', ' ')} per {req.timeframe}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="ml-auto text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <select
                value={newRequirement.type}
                onChange={(e) => setNewRequirement(prev => ({ ...prev, type: e.target.value as any }))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700"
              >
                <option value="journal_entries">Journal Entries</option>
                <option value="check_ins">Check-ins</option>
                <option value="habits">Habits</option>
                <option value="points">Points</option>
              </select>

              <input
                type="number"
                min="1"
                value={newRequirement.value}
                onChange={(e) => setNewRequirement(prev => ({ ...prev, value: parseInt(e.target.value) || 1 }))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                placeholder="Amount"
              />

              <select
                value={newRequirement.timeframe}
                onChange={(e) => setNewRequirement(prev => ({ ...prev, timeframe: e.target.value as any }))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>

              <button
                type="button"
                onClick={addRequirement}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Rewards */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rewards</h3>
            
            <div className="space-y-3">
              {formData.rewards.map((reward, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {reward.type}: {reward.value}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeReward(index)}
                    className="ml-auto text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <select
                value={newReward.type}
                onChange={(e) => setNewReward(prev => ({ ...prev, type: e.target.value as any }))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700"
              >
                <option value="points">Points</option>
                <option value="badge">Badge</option>
                <option value="achievement">Achievement</option>
              </select>

              <input
                type="text"
                value={newReward.value}
                onChange={(e) => setNewReward(prev => ({ ...prev, value: e.target.value }))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                placeholder="Reward value"
              />

              <button
                type="button"
                onClick={addReward}
                className="px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
              >
                Add Reward
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Create Challenge
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
