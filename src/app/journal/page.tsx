'use client';

import React, { useState } from 'react';
import { 
  Heart, 
  Sun, 
  Moon, 
  Droplets, 
  Dumbbell, 
  Brain,
  CheckCircle,
  Circle,
  Plus,
  Save,
  Calendar,
  Target,
  Award,
  TrendingUp
} from 'lucide-react';
import { db } from '@/lib/database';
import { JournalEntry, HabitEntry } from '@/types';

export default function JournalPage() {
  const [userId] = useState('2'); // Client user
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>({
    gratitude: ['', '', ''],
    priorities: ['', '', ''],
    habits: [
      { id: '1', type: 'water_intake', completed: false, value: 8, unit: 'glasses' },
      { id: '2', type: 'sunlight_am', completed: false },
      { id: '3', type: 'sunlight_pm', completed: false },
      { id: '4', type: 'exercise', completed: false },
      { id: '5', type: 'meditation', completed: false },
      { id: '6', type: 'sleep_early', completed: false },
      { id: '7', type: 'no_screens_bedtime', completed: false }
    ],
    mood: 5,
    energy: 5,
    notes: '',
    completed: false
  });

  const existingEntry = db.getJournalEntries(userId).find(entry => 
    entry.date.toISOString().split('T')[0] === selectedDate
  );

  const habitTypes = [
    { id: 'water_intake', name: 'Water Intake', icon: Droplets, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { id: 'sunlight_am', name: 'Morning Sunlight', icon: Sun, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { id: 'sunlight_pm', name: 'Evening Sunlight', icon: Sun, color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { id: 'exercise', name: 'Exercise', icon: Dumbbell, color: 'text-green-600', bgColor: 'bg-green-100' },
    { id: 'meditation', name: 'Meditation', icon: Brain, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { id: 'sleep_early', name: 'Early Sleep', icon: Moon, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
    { id: 'no_screens_bedtime', name: 'No Screens Before Bed', icon: Moon, color: 'text-gray-600', bgColor: 'bg-gray-100' }
  ];

  const moodEmojis = ['😢', '😔', '😐', '🙂', '😊', '😄', '🤩', '🥳', '🎉', '💯'];
  const energyEmojis = ['😴', '😑', '😐', '🙂', '😊', '😄', '🤩', '🥳', '⚡', '🔥'];

  const handleHabitToggle = (habitId: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      habits: prev.habits?.map(habit => 
        habit.id === habitId 
          ? { ...habit, completed: !habit.completed }
          : habit
      )
    }));
  };

  const handleGratitudeChange = (index: number, value: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      gratitude: prev.gratitude?.map((item, i) => i === index ? value : item)
    }));
  };

  const handlePriorityChange = (index: number, value: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      priorities: prev.priorities?.map((item, i) => i === index ? value : item)
    }));
  };

  const handleSave = () => {
    const entry: Omit<JournalEntry, 'id'> = {
      userId,
      date: new Date(selectedDate),
      gratitude: currentEntry.gratitude?.filter(g => g.trim() !== '') || [],
      priorities: currentEntry.priorities?.filter(p => p.trim() !== '') || [],
      habits: currentEntry.habits || [],
      mood: currentEntry.mood || 5,
      energy: currentEntry.energy || 5,
      notes: currentEntry.notes || '',
      completed: true
    };

    db.createJournalEntry(entry);
    
    // Award points for journal entry
    db.addPoints(userId, 10, 'journal_entry', 'Daily journal entry completed');
    
    // Update streak
    db.updateStreak(userId, 'journal');
    
    alert('Journal entry saved successfully! +10 points');
  };

  const completedHabits = currentEntry.habits?.filter(h => h.completed).length || 0;
  const totalHabits = currentEntry.habits?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Daily Journal</h1>
              <p className="text-sm text-gray-600">Track your daily progress and gratitude</p>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Today&apos;s Progress</h2>
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                {completedHabits}/{totalHabits} habits completed
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(completedHabits / totalHabits) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Journal Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gratitude Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Heart className="h-5 w-5 text-red-500 mr-2" />
                Gratitude (3 things)
              </h3>
              <div className="space-y-3">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-gray-400">{index + 1}.</span>
                    <input
                      type="text"
                      value={currentEntry.gratitude?.[index] || ''}
                      onChange={(e) => handleGratitudeChange(index, e.target.value)}
                      placeholder={`What are you grateful for today? ${index + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Priorities Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 text-blue-500 mr-2" />
                Today&apos;s Priorities (3 goals)
              </h3>
              <div className="space-y-3">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-gray-400">{index + 1}.</span>
                    <input
                      type="text"
                      value={currentEntry.priorities?.[index] || ''}
                      onChange={(e) => handlePriorityChange(index, e.target.value)}
                      placeholder={`What&apos;s your priority today? ${index + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Habits Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Daily Habits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentEntry.habits?.map((habit) => {
                  const habitType = habitTypes.find(h => h.id === habit.type);
                  return (
                    <div
                      key={habit.id}
                      onClick={() => handleHabitToggle(habit.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        habit.completed
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${habitType?.bgColor}`}>
                          {habitType && <habitType.icon className={`h-5 w-5 ${habitType.color}`} />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {habitType?.name}
                          </p>
                          {habit.value && (
                            <p className="text-xs text-gray-500">
                              {habit.value} {habit.unit}
                            </p>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          {habit.completed ? (
                            <CheckCircle className="h-6 w-6 text-green-500" />
                          ) : (
                            <Circle className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mood & Energy */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How are you feeling?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Mood (1-10)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={currentEntry.mood || 5}
                      onChange={(e) => setCurrentEntry(prev => ({ ...prev, mood: parseInt(e.target.value) }))}
                      className="flex-1"
                    />
                    <span className="text-2xl">{moodEmojis[(currentEntry.mood || 5) - 1]}</span>
                    <span className="text-sm font-medium text-gray-600 w-8">
                      {currentEntry.mood || 5}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Energy (1-10)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={currentEntry.energy || 5}
                      onChange={(e) => setCurrentEntry(prev => ({ ...prev, energy: parseInt(e.target.value) }))}
                      className="flex-1"
                    />
                    <span className="text-2xl">{energyEmojis[(currentEntry.energy || 5) - 1]}</span>
                    <span className="text-sm font-medium text-gray-600 w-8">
                      {currentEntry.energy || 5}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h3>
              <textarea
                value={currentEntry.notes || ''}
                onChange={(e) => setCurrentEntry(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional thoughts or observations about your day..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Save className="h-5 w-5 mr-2" />
                Save Journal Entry
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Streak Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 text-yellow-500 mr-2" />
                Your Streaks
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Journal Entries</span>
                  <span className="text-lg font-bold text-blue-600">5 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Habit Completion</span>
                  <span className="text-lg font-bold text-green-600">3 days</span>
                </div>
              </div>
            </div>

            {/* Monthly Topic */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month&apos;s Focus</h3>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
                <h4 className="font-semibold mb-2">Mitochondrial Health</h4>
                <p className="text-sm opacity-90">
                  Learn how to optimize your cellular energy production through proper nutrition and lifestyle habits.
                </p>
              </div>
            </div>

            {/* Daily Tip */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Tip</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Morning Sunlight:</strong> Get 10-15 minutes of direct sunlight within the first hour of waking to help regulate your circadian rhythm.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
