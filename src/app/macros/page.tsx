'use client';

import React, { useState } from 'react';
import { Apple, Plus, X, TrendingUp, Target, Flame } from 'lucide-react';

interface MacroLog {
  id: string;
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  meal_name?: string;
  notes?: string;
}

export default function MacrosPage() {
  const [macros, setMacros] = useState<MacroLog[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Daily targets (TODO: Make this user-configurable)
  const targets = {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fats: 67
  };

  const [formData, setFormData] = useState({
    mealName: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.calories || !formData.protein || !formData.carbs || !formData.fats) {
      alert('Please fill in all macro fields');
      return;
    }

    setSaving(true);
    try {
      const macro: MacroLog = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        calories: parseInt(formData.calories),
        protein: parseFloat(formData.protein),
        carbs: parseFloat(formData.carbs),
        fats: parseFloat(formData.fats),
        meal_name: formData.mealName || undefined,
        notes: formData.notes || undefined
      };

      // TODO: Replace with actual API call
      setMacros([macro, ...macros]);
      
      setFormData({
        mealName: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
        notes: ''
      });
      setShowForm(false);
      alert('Macros logged successfully!');
    } catch (error) {
      console.error('Error logging macros:', error);
      alert('Failed to log macros');
    } finally {
      setSaving(false);
    }
  };

  // Calculate today's totals
  const today = new Date().toDateString();
  const todayMacros = macros.filter(m => new Date(m.date).toDateString() === today);
  const todayTotals = {
    calories: todayMacros.reduce((sum, m) => sum + m.calories, 0),
    protein: todayMacros.reduce((sum, m) => sum + m.protein, 0),
    carbs: todayMacros.reduce((sum, m) => sum + m.carbs, 0),
    fats: todayMacros.reduce((sum, m) => sum + m.fats, 0)
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage < 80) return 'text-yellow-600 bg-yellow-100';
    if (percentage > 120) return 'text-red-600 bg-red-100';
    return 'text-green-600 bg-green-100';
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Macro Tracker</h1>
              <p className="text-sm text-gray-600">Track your daily nutrition</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {showForm ? <X className="h-5 w-5 mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
              {showForm ? 'Cancel' : 'Log Food'}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Today's Progress */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Today's Progress</h2>
            <p className="text-sm text-gray-600">{new Date().toLocaleDateString()}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Calories */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Calories</span>
                <span className="text-sm font-bold text-gray-900">
                  {todayTotals.calories} / {targets.calories}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-red-600 h-3 rounded-full transition-all"
                  style={{ width: `${getProgressPercentage(todayTotals.calories, targets.calories)}%` }}
                />
              </div>
            </div>

            {/* Protein */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Protein (g)</span>
                <span className="text-sm font-bold text-gray-900">
                  {todayTotals.protein} / {targets.protein}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${getProgressPercentage(todayTotals.protein, targets.protein)}%` }}
                />
              </div>
            </div>

            {/* Carbs */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Carbs (g)</span>
                <span className="text-sm font-bold text-gray-900">
                  {todayTotals.carbs} / {targets.carbs}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-yellow-600 h-3 rounded-full transition-all"
                  style={{ width: `${getProgressPercentage(todayTotals.carbs, targets.carbs)}%` }}
                />
              </div>
            </div>

            {/* Fats */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Fats (g)</span>
                <span className="text-sm font-bold text-gray-900">
                  {todayTotals.fats} / {targets.fats}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-purple-600 h-3 rounded-full transition-all"
                  style={{ width: `${getProgressPercentage(todayTotals.fats, targets.fats)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Macro Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Log Food/Meal</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meal Name (Optional)
                </label>
                <input
                  type="text"
                  value={formData.mealName}
                  onChange={(e) => setFormData({ ...formData, mealName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Breakfast, Lunch, Protein Shake"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calories
                  </label>
                  <input
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.protein}
                    onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.carbs}
                    onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fats (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.fats}
                    onChange={(e) => setFormData({ ...formData, fats: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Any notes about this meal..."
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
                  {saving ? 'Saving...' : 'Log Macros'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Macros List */}
        {macros.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Apple className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Meals Logged</h3>
            <p className="text-gray-600 mb-4">Start tracking your nutrition by logging your first meal</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Log First Meal
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Meals</h2>
            {macros.map((macro) => (
              <div key={macro.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {macro.meal_name || 'Meal'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(macro.date).toLocaleDateString()} at {new Date(macro.date).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{macro.calories}</p>
                    <p className="text-xs text-gray-500">calories</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Protein</p>
                    <p className="text-xl font-bold text-blue-600">{macro.protein}g</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-gray-600">Carbs</p>
                    <p className="text-xl font-bold text-yellow-600">{macro.carbs}g</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Fats</p>
                    <p className="text-xl font-bold text-purple-600">{macro.fats}g</p>
                  </div>
                </div>

                {macro.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">{macro.notes}</p>
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
