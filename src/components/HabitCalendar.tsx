'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  Minus,
  Dumbbell,
  TrendingUp,
  TrendingDown,
  Heart,
  Activity,
  Weight,
  Zap
} from 'lucide-react';
import { JournalEntry, HabitEntry, HealthMetric, TrainingLog, BodyMetrics } from '@/types';

interface HabitCalendarProps {
  journalEntries: JournalEntry[];
  healthMetrics?: HealthMetric[];
  trainingLogs?: TrainingLog[];
  bodyMetrics?: BodyMetrics[];
  className?: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  habits: HabitStatus[];
  exercises: ExerciseData[];
  weightChange?: WeightChange;
  biometrics: BiometricData;
}

interface HabitStatus {
  name: string;
  completed: boolean;
  notes?: string;
}

interface ExerciseData {
  type: string;
  volumeLoad?: number;
  rpe?: number;
  duration?: number;
}

interface WeightChange {
  current: number;
  previous?: number;
  change?: number;
  unit: string;
}

interface BiometricData {
  energy?: number;
  mood?: number;
  sleep?: number;
  stress?: number;
}

export default function HabitCalendar({ 
  journalEntries, 
  healthMetrics = [], 
  trainingLogs = [], 
  bodyMetrics = [], 
  className = '' 
}: HabitCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  // Get all unique habits from journal entries
  const allHabits = React.useMemo(() => {
    const habitSet = new Set<string>();
    journalEntries.forEach(entry => {
      entry.habits.forEach(habit => habitSet.add(habit.name));
    });
    return Array.from(habitSet);
  }, [journalEntries]);

  // Initialize selected habits with all habits
  useEffect(() => {
    if (allHabits.length > 0 && selectedHabits.length === 0) {
      setSelectedHabits(allHabits);
    }
  }, [allHabits, selectedHabits.length]);

  // Generate calendar days
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    // First day of the week (Sunday = 0)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Last day of the week
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    const days: CalendarDay[] = [];
    const today = new Date();
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dayDate = new Date(date);
      const journalEntry = journalEntries.find(entry => 
        entry.date.toDateString() === dayDate.toDateString()
      );
      
      // Get habits
      const habits: HabitStatus[] = selectedHabits.map(habitName => {
        const habit = journalEntry?.habits.find(h => h.name === habitName);
        return {
          name: habitName,
          completed: habit?.completed || false,
          notes: habit?.notes
        };
      });
      
      // Get exercises for this day
      const dayExercises: ExerciseData[] = trainingLogs
        .filter(log => new Date(log.timestamp).toDateString() === dayDate.toDateString())
        .map(log => ({
          type: log.sessionType,
          volumeLoad: log.volumeLoad,
          rpe: log.rpe,
          duration: log.durationMin
        }));
      
      
      // Get weight change for this day
      const dayWeight = bodyMetrics.find(metric => 
        new Date(metric.timestamp).toDateString() === dayDate.toDateString()
      );
      
      const previousWeight = bodyMetrics
        .filter(metric => new Date(metric.timestamp) < dayDate)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
      
      const weightChange: WeightChange | undefined = dayWeight ? {
        current: dayWeight.weightKg, // This is actually pounds now
        previous: previousWeight?.weightKg, // This is actually pounds now
        change: previousWeight ? dayWeight.weightKg - previousWeight.weightKg : undefined,
        unit: 'lbs'
      } : undefined;
      
      
      // Get biometrics from journal entry
      const biometrics: BiometricData = {
        energy: journalEntry?.energy,
        mood: journalEntry?.mood,
        sleep: journalEntry?.sleep,
        stress: journalEntry?.mood ? 10 - journalEntry.mood : undefined // Inverse of mood as stress indicator
      };
      
      days.push({
        date: dayDate,
        isCurrentMonth: dayDate.getMonth() === month,
        isToday: dayDate.toDateString() === today.toDateString(),
        habits,
        exercises: dayExercises,
        weightChange,
        biometrics
      });
    }
    
    setCalendarDays(days);
  }, [currentDate, journalEntries, selectedHabits, trainingLogs, bodyMetrics]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const toggleHabit = (habitName: string) => {
    setSelectedHabits(prev => 
      prev.includes(habitName) 
        ? prev.filter(h => h !== habitName)
        : [...prev, habitName]
    );
  };

  const toggleDayExpansion = (dayKey: string) => {
    setExpandedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dayKey)) {
        newSet.delete(dayKey);
      } else {
        newSet.add(dayKey);
      }
      return newSet;
    });
  };

  const getHabitConsistency = (habitName: string) => {
    const entriesWithHabit = journalEntries.filter(entry => 
      entry.habits.some(h => h.name === habitName)
    );
    
    if (entriesWithHabit.length === 0) return 0;
    
    const completedCount = entriesWithHabit.reduce((count, entry) => {
      const habit = entry.habits.find(h => h.name === habitName);
      return count + (habit?.completed ? 1 : 0);
    }, 0);
    
    return Math.round((completedCount / entriesWithHabit.length) * 100);
  };

  const getStreak = (habitName: string) => {
    const sortedEntries = journalEntries
      .filter(entry => entry.habits.some(h => h.name === habitName))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let streak = 0;
    for (const entry of sortedEntries) {
      const habit = entry.habits.find(h => h.name === habitName);
      if (habit?.completed) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <CalendarIcon className="h-6 w-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Habit Calendar</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            Today
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Month/Year Display */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {currentDate.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          })}
        </h2>
      </div>

      {/* Habit Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Tracked Habits</h4>
        <div className="flex flex-wrap gap-2">
          {allHabits.map(habit => {
            const consistency = getHabitConsistency(habit);
            const streak = getStreak(habit);
            const isSelected = selectedHabits.includes(habit);
            
            return (
              <button
                key={habit}
                onClick={() => toggleHabit(habit)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>{habit}</span>
                  {isSelected && (
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-blue-600">
                        {consistency}%
                      </span>
                      <span className="text-xs text-blue-600">
                        ({streak} streak)
                      </span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`p-2 min-h-[120px] border border-gray-200 rounded-lg ${
              day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
            } ${day.isToday ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-sm font-medium ${
                day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
              } ${day.isToday ? 'text-blue-600' : ''}`}>
                {day.date.getDate()}
              </span>
              {day.isToday && (
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              )}
            </div>

            {/* Habits for this day */}
            {day.habits.length > 0 && (
              <div className="space-y-1 mb-2">
                {day.habits.slice(0, expandedDays.has(day.date.toDateString()) ? day.habits.length : 2).map((habit, habitIndex) => (
                  <div
                    key={habitIndex}
                    className="flex items-center space-x-1"
                    title={`${habit.name}: ${habit.completed ? 'Completed' : 'Not completed'}${habit.notes ? ` - ${habit.notes}` : ''}`}
                  >
                    {habit.completed ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-400" />
                    )}
                    <span className="text-xs text-gray-600 truncate">
                      {habit.name}
                    </span>
                  </div>
                ))}
                {day.habits.length > 2 && (
                  <button
                    onClick={() => toggleDayExpansion(day.date.toDateString())}
                    className="text-xs text-blue-500 hover:text-blue-700 hover:underline"
                  >
                    {expandedDays.has(day.date.toDateString()) 
                      ? 'Show less' 
                      : `+${day.habits.length - 2} more`
                    }
                  </button>
                )}
              </div>
            )}

            {/* Exercises for this day */}
            {day.exercises.length > 0 && (
              <div className="space-y-1 mb-2">
                {day.exercises.slice(0, expandedDays.has(day.date.toDateString()) ? day.exercises.length : 2).map((exercise, exerciseIndex) => (
                  <div
                    key={exerciseIndex}
                    className="flex items-center space-x-1"
                    title={`${exercise.type} - RPE: ${exercise.rpe}/10 - Duration: ${exercise.duration}min`}
                  >
                    <Dumbbell className="h-3 w-3 text-blue-500" />
                    <span className="text-xs text-gray-600 truncate">
                      {exercise.type}
                    </span>
                    {exercise.rpe && (
                      <span className="text-xs text-gray-500">
                        RPE {exercise.rpe}
                      </span>
                    )}
                  </div>
                ))}
                {day.exercises.length > 2 && (
                  <button
                    onClick={() => toggleDayExpansion(day.date.toDateString())}
                    className="text-xs text-blue-500 hover:text-blue-700 hover:underline"
                  >
                    {expandedDays.has(day.date.toDateString()) 
                      ? 'Show less' 
                      : `+${day.exercises.length - 2} more`
                    }
                  </button>
                )}
              </div>
            )}

            {/* Weight change for this day */}
            {day.weightChange && (
              <div className="flex items-center space-x-1 mb-1">
                <Weight className="h-3 w-3 text-purple-500" />
                <span className="text-xs text-gray-600">
                  {day.weightChange.current}{day.weightChange.unit}
                </span>
                {day.weightChange.change !== undefined && (
                  <div className="flex items-center">
                    {day.weightChange.change > 0 ? (
                      <TrendingUp className="h-3 w-3 text-red-500" />
                    ) : day.weightChange.change < 0 ? (
                      <TrendingDown className="h-3 w-3 text-green-500" />
                    ) : (
                      <Minus className="h-3 w-3 text-gray-400" />
                    )}
                    <span className={`text-xs ${
                      day.weightChange.change > 0 ? 'text-red-500' : 
                      day.weightChange.change < 0 ? 'text-green-500' : 'text-gray-500'
                    }`}>
                      {Math.abs(day.weightChange.change).toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Biometric indicators */}
            <div className="flex items-center space-x-2">
              {day.biometrics.energy && (
                <div className="flex items-center space-x-1" title={`Energy: ${day.biometrics.energy}/10`}>
                  <Zap className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs text-gray-600">{day.biometrics.energy}</span>
                </div>
              )}
              {day.biometrics.mood && (
                <div className="flex items-center space-x-1" title={`Mood: ${day.biometrics.mood}/10`}>
                  <Heart className="h-3 w-3 text-pink-500" />
                  <span className="text-xs text-gray-600">{day.biometrics.mood}</span>
                </div>
              )}
              {day.biometrics.sleep && (
                <div className="flex items-center space-x-1" title={`Sleep: ${day.biometrics.sleep}/10`}>
                  <Activity className="h-3 w-3 text-indigo-500" />
                  <span className="text-xs text-gray-600">{day.biometrics.sleep}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6">
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Habit completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <XCircle className="h-4 w-4 text-red-400" />
            <span>Habit missed</span>
          </div>
          <div className="flex items-center space-x-2">
            <Dumbbell className="h-4 w-4 text-blue-500" />
            <span>Exercise</span>
          </div>
          <div className="flex items-center space-x-2">
            <Weight className="h-4 w-4 text-purple-500" />
            <span>Weight</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>Energy</span>
          </div>
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-pink-500" />
            <span>Mood</span>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-indigo-500" />
            <span>Sleep</span>
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Monthly Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedHabits.map(habit => {
            const consistency = getHabitConsistency(habit);
            const streak = getStreak(habit);
            const totalDays = journalEntries.filter(entry => 
              entry.habits.some(h => h.name === habit)
            ).length;
            
            return (
              <div key={habit} className="text-center">
                <div className="text-lg font-semibold text-gray-900">{habit}</div>
                <div className="text-2xl font-bold text-blue-600">{consistency}%</div>
                <div className="text-sm text-gray-600">
                  {streak} day streak • {totalDays} days tracked
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
