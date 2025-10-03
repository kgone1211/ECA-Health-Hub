'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  CheckCircle,
  Clock,
  Users,
  BarChart3,
  X,
  Scale,
  Activity,
  Zap,
  Moon
} from 'lucide-react';

interface CheckIn {
  id: number;
  user_id: number;
  check_in_date: string;
  weight?: number;
  energy_level?: number;
  sleep_quality?: number;
  mood?: number;
  notes?: string;
  created_at: string;
}

export default function CheckInsPage() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    userId: 1, // TODO: Get from auth context
    weight: '',
    energyLevel: '5',
    sleepQuality: '5',
    mood: '5',
    notes: ''
  });

  const stats = [
    {
      title: 'Total Check-ins',
      value: checkIns.length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'This Week',
      value: checkIns.filter(c => {
        const checkInDate = new Date(c.check_in_date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return checkInDate >= weekAgo;
      }).length,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Avg Energy',
      value: checkIns.length > 0 
        ? (checkIns.reduce((sum, c) => sum + (c.energy_level || 0), 0) / checkIns.length).toFixed(1)
        : '0',
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Avg Sleep',
      value: checkIns.length > 0
        ? (checkIns.reduce((sum, c) => sum + (c.sleep_quality || 0), 0) / checkIns.length).toFixed(1)
        : '0',
      icon: Moon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    }
  ];

  useEffect(() => {
    loadCheckIns();
  }, []);

  const loadCheckIns = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/check-ins?userId=1'); // TODO: Dynamic user
      if (response.ok) {
        const data = await response.json();
        setCheckIns(data.checkIns || []);
      }
    } catch (error) {
      console.error('Error loading check-ins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    try {
      const response = await fetch('/api/check-ins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: formData.userId,
          weight: formData.weight ? parseFloat(formData.weight) : undefined,
          energyLevel: parseInt(formData.energyLevel),
          sleepQuality: parseInt(formData.sleepQuality),
          mood: parseInt(formData.mood),
          notes: formData.notes
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCheckIns([data.checkIn, ...checkIns]);
        setFormData({
          userId: 1,
          weight: '',
          energyLevel: '5',
          sleepQuality: '5',
          mood: '5',
          notes: ''
        });
        setShowForm(false);
        alert('Check-in saved successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving check-in:', error);
      alert('Failed to save check-in');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Daily Check-ins</h1>
              <p className="text-sm text-gray-600">Track your daily wellness metrics</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {showForm ? <X className="h-5 w-5 mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
              {showForm ? 'Cancel' : 'New Check-in'}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Check-in Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Check-in</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Scale className="inline h-4 w-4 mr-1" />
                    Weight (lbs) - Optional
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter weight"
                  />
                </div>

                {/* Energy Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Zap className="inline h-4 w-4 mr-1" />
                    Energy Level (1-10)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.energyLevel}
                      onChange={(e) => setFormData({ ...formData, energyLevel: e.target.value })}
                      className="flex-1"
                    />
                    <span className="text-2xl font-bold text-gray-900 w-12 text-center">
                      {formData.energyLevel}
                    </span>
                  </div>
                </div>

                {/* Sleep Quality */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Moon className="inline h-4 w-4 mr-1" />
                    Sleep Quality (1-10)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.sleepQuality}
                      onChange={(e) => setFormData({ ...formData, sleepQuality: e.target.value })}
                      className="flex-1"
                    />
                    <span className="text-2xl font-bold text-gray-900 w-12 text-center">
                      {formData.sleepQuality}
                    </span>
                  </div>
                </div>

                {/* Mood */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Activity className="inline h-4 w-4 mr-1" />
                    Mood (1-10)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.mood}
                      onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                      className="flex-1"
                    />
                    <span className="text-2xl font-bold text-gray-900 w-12 text-center">
                      {formData.mood}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={4}
                  placeholder="How are you feeling today? Any observations?"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Check-in'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Check-ins List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="mt-2 text-gray-600">Loading check-ins...</p>
          </div>
        ) : checkIns.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Check-ins Yet</h3>
            <p className="text-gray-600 mb-4">Start tracking your daily wellness by completing your first check-in</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Create First Check-in
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {checkIns.map((checkIn) => (
              <div key={checkIn.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {new Date(checkIn.check_in_date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Recorded at {new Date(checkIn.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {checkIn.weight && (
                    <div className="flex items-center gap-2">
                      <Scale className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Weight</p>
                        <p className="text-lg font-semibold text-gray-900">{checkIn.weight} lbs</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600">Energy</p>
                      <p className="text-lg font-semibold text-gray-900">{checkIn.energy_level}/10</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Moon className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600">Sleep</p>
                      <p className="text-lg font-semibold text-gray-900">{checkIn.sleep_quality}/10</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600">Mood</p>
                      <p className="text-lg font-semibold text-gray-900">{checkIn.mood}/10</p>
                    </div>
                  </div>
                </div>

                {checkIn.notes && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                    <p className="text-gray-600">{checkIn.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
