'use client';

import React, { useState } from 'react';
import { 
  Target, 
  Zap, 
  Apple, 
  Droplets,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Edit
} from 'lucide-react';
import { MacrosTarget, MacrosLog } from '@/types';

interface ClientMacrosDisplayProps {
  macrosTarget: MacrosTarget | undefined;
  macrosLogs: MacrosLog[];
  onAddLog: (log: Omit<MacrosLog, 'id'>) => void;
  className?: string;
}

export default function ClientMacrosDisplay({ 
  macrosTarget, 
  macrosLogs, 
  onAddLog, 
  className = '' 
}: ClientMacrosDisplayProps) {
  const [isAddingLog, setIsAddingLog] = useState(false);
  const [logData, setLogData] = useState({
    protein: 0,
    carbs: 0,
    fats: 0,
    calories: 0,
    notes: ''
  });

  const handleSubmitLog = (e: React.FormEvent) => {
    e.preventDefault();
    onAddLog({
      clientId: macrosTarget?.clientId || '',
      date: new Date(),
      protein: logData.protein,
      carbs: logData.carbs,
      fats: logData.fats,
      calories: logData.calories,
      notes: logData.notes
    });
    
    setLogData({
      protein: 0,
      carbs: 0,
      fats: 0,
      calories: 0,
      notes: ''
    });
    setIsAddingLog(false);
  };

  const getProgressPercentage = (actual: number, target: number) => {
    if (target === 0) return 0;
    return Math.min((actual / target) * 100, 100);
  };

  const getProgressColor = (actual: number, target: number) => {
    const percentage = getProgressPercentage(actual, target);
    if (percentage >= 90 && percentage <= 110) return 'text-green-600';
    if (percentage >= 80 && percentage <= 120) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressIcon = (actual: number, target: number) => {
    const percentage = getProgressPercentage(actual, target);
    if (percentage >= 90 && percentage <= 110) return <TrendingUp className="h-4 w-4" />;
    if (percentage >= 80 && percentage <= 120) return <Minus className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };

  const todayLog = macrosLogs.find(log => 
    new Date(log.date).toDateString() === new Date().toDateString()
  );

  if (!macrosTarget) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Macros Set</h3>
          <p className="text-gray-600">
            Your coach hasn't set macro targets for you yet. Check back later!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Target className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Daily Macros</h3>
            <p className="text-sm text-gray-600">Track your protein, carbs, and fats</p>
          </div>
        </div>
        <button
          onClick={() => setIsAddingLog(true)}
          className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Log Food
        </button>
      </div>

      {/* Today's Progress */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Today's Progress</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Protein */}
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Zap className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Protein</span>
            </div>
            <div className={`text-2xl font-bold ${getProgressColor(todayLog?.protein || 0, macrosTarget.protein)}`}>
              {todayLog?.protein || 0}g
            </div>
            <div className="text-sm text-gray-600">of {macrosTarget.protein}g</div>
            <div className="mt-2 flex items-center justify-center">
              {getProgressIcon(todayLog?.protein || 0, macrosTarget.protein)}
              <span className="ml-1 text-xs text-gray-500">
                {getProgressPercentage(todayLog?.protein || 0, macrosTarget.protein).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Carbs */}
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Apple className="h-5 w-5 text-orange-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Carbs</span>
            </div>
            <div className={`text-2xl font-bold ${getProgressColor(todayLog?.carbs || 0, macrosTarget.carbs)}`}>
              {todayLog?.carbs || 0}g
            </div>
            <div className="text-sm text-gray-600">of {macrosTarget.carbs}g</div>
            <div className="mt-2 flex items-center justify-center">
              {getProgressIcon(todayLog?.carbs || 0, macrosTarget.carbs)}
              <span className="ml-1 text-xs text-gray-500">
                {getProgressPercentage(todayLog?.carbs || 0, macrosTarget.carbs).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Fats */}
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Droplets className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Fats</span>
            </div>
            <div className={`text-2xl font-bold ${getProgressColor(todayLog?.fats || 0, macrosTarget.fats)}`}>
              {todayLog?.fats || 0}g
            </div>
            <div className="text-sm text-gray-600">of {macrosTarget.fats}g</div>
            <div className="mt-2 flex items-center justify-center">
              {getProgressIcon(todayLog?.fats || 0, macrosTarget.fats)}
              <span className="ml-1 text-xs text-gray-500">
                {getProgressPercentage(todayLog?.fats || 0, macrosTarget.fats).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Calories */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Calories</span>
            </div>
            <div className={`text-2xl font-bold ${getProgressColor(todayLog?.calories || 0, macrosTarget.calories)}`}>
              {todayLog?.calories || 0}
            </div>
            <div className="text-sm text-gray-600">of {macrosTarget.calories}</div>
            <div className="mt-2 flex items-center justify-center">
              {getProgressIcon(todayLog?.calories || 0, macrosTarget.calories)}
              <span className="ml-1 text-xs text-gray-500">
                {getProgressPercentage(todayLog?.calories || 0, macrosTarget.calories).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Log Form */}
      {isAddingLog && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Log Today's Food</h4>
          <form onSubmit={handleSubmitLog} className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Protein (g)</label>
                <input
                  type="number"
                  value={logData.protein}
                  onChange={(e) => setLogData(prev => ({ ...prev, protein: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Carbs (g)</label>
                <input
                  type="number"
                  value={logData.carbs}
                  onChange={(e) => setLogData(prev => ({ ...prev, carbs: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Fats (g)</label>
                <input
                  type="number"
                  value={logData.fats}
                  onChange={(e) => setLogData(prev => ({ ...prev, fats: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Calories</label>
                <input
                  type="number"
                  value={logData.calories}
                  onChange={(e) => setLogData(prev => ({ ...prev, calories: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="1"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Notes (Optional)</label>
              <input
                type="text"
                value={logData.notes}
                onChange={(e) => setLogData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="What did you eat today?"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsAddingLog(false)}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Save Log
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Recent Logs */}
      {macrosLogs.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-4">Recent Logs</h4>
          <div className="space-y-2">
            {macrosLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {new Date(log.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-red-600 font-medium">{log.protein}g</span>
                  <span className="text-orange-600 font-medium">{log.carbs}g</span>
                  <span className="text-yellow-600 font-medium">{log.fats}g</span>
                  <span className="text-gray-900 font-medium">{log.calories} cal</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coach Notes */}
      {macrosTarget.notes && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Coach's Notes</h4>
          <p className="text-sm text-blue-800">{macrosTarget.notes}</p>
        </div>
      )}
    </div>
  );
}

