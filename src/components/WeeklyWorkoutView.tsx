'use client';

import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Dumbbell, 
  Activity, 
  Clock,
  Calendar,
  Target,
  TrendingUp
} from 'lucide-react';
import { TrainingLog } from '@/types';

interface WeeklyWorkoutViewProps {
  trainingLogs: TrainingLog[];
  className?: string;
}

interface WeeklyData {
  weekStart: Date;
  weekEnd: Date;
  workouts: TrainingLog[];
  totalDuration: number;
  totalVolume: number;
  strengthSessions: number;
  cardioSessions: number;
  avgRPE: number;
}

export default function WeeklyWorkoutView({ trainingLogs, className = '' }: WeeklyWorkoutViewProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Group workouts by week
  const getWeekData = (weekStart: Date): WeeklyData => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekWorkouts = trainingLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= weekStart && logDate <= weekEnd;
    });

    const totalDuration = weekWorkouts.reduce((sum, log) => sum + (log.durationMin || 0), 0);
    const totalVolume = weekWorkouts.reduce((sum, log) => sum + (log.volumeLoad || 0), 0);
    const strengthSessions = weekWorkouts.filter(log => log.sessionType === 'STRENGTH').length;
    const cardioSessions = weekWorkouts.filter(log => log.sessionType === 'CARDIO').length;
    const avgRPE = weekWorkouts.length > 0 
      ? weekWorkouts.reduce((sum, log) => sum + (log.rpe || 0), 0) / weekWorkouts.length 
      : 0;

    return {
      weekStart,
      weekEnd,
      workouts: weekWorkouts,
      totalDuration,
      totalVolume,
      strengthSessions,
      cardioSessions,
      avgRPE
    };
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(new Date());
  };

  const weekData = getWeekData(new Date(currentWeek.getTime() - currentWeek.getDay() * 24 * 60 * 60 * 1000));

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'STRENGTH':
        return <Dumbbell className="h-4 w-4 text-blue-500" />;
      case 'CARDIO':
        return <Activity className="h-4 w-4 text-green-500" />;
      default:
        return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'STRENGTH':
        return 'bg-blue-100 text-blue-800';
      case 'CARDIO':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Calendar className="h-6 w-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Weekly Workout View</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToCurrentWeek}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            This Week
          </button>
          <button
            onClick={() => navigateWeek('next')}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Week Display */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {weekData.weekStart.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })} - {weekData.weekEnd.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}
        </h2>
      </div>

      {/* Week Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{weekData.workouts.length}</div>
          <div className="text-sm text-blue-800">Total Workouts</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{weekData.strengthSessions}</div>
          <div className="text-sm text-green-800">Strength</div>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{weekData.cardioSessions}</div>
          <div className="text-sm text-orange-800">Cardio</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {formatDuration(weekData.totalDuration)}
          </div>
          <div className="text-sm text-purple-800">Total Time</div>
        </div>
      </div>

      {/* Workout Details */}
      {weekData.workouts.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <Dumbbell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No workouts this week</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Workout Sessions</h4>
          {weekData.workouts
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            .map((workout, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getSessionTypeIcon(workout.sessionType)}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      {workout.sessionType}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSessionTypeColor(workout.sessionType)}`}>
                      {workout.sessionType}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(workout.timestamp).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                {workout.durationMin && (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{workout.durationMin}m</span>
                  </div>
                )}
                {workout.rpe && (
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>RPE {workout.rpe}</span>
                  </div>
                )}
                {workout.volumeLoad && workout.volumeLoad > 0 && (
                  <div className="text-gray-500">
                    {workout.volumeLoad.toLocaleString()} kg
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Additional Stats */}
      {weekData.workouts.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {weekData.avgRPE.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Average RPE</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {weekData.totalVolume.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Volume (kg)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


