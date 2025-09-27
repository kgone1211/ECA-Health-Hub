'use client';

import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Target, 
  Dumbbell, 
  CheckCircle, 
  Circle,
  Star,
  Calendar,
  TrendingUp,
  Award,
  Timer
} from 'lucide-react';
import { WorkoutTemplate, WorkoutSession, WorkoutExercise, WorkoutSet } from '@/types';

interface ClientWorkoutViewProps {
  clientId: string;
  templates: WorkoutTemplate[];
  sessions: WorkoutSession[];
  onStartWorkout: (templateId: string) => void;
  onCompleteWorkout: (sessionId: string, sessionData: Partial<WorkoutSession>) => void;
}

export default function ClientWorkoutView({ 
  clientId, 
  templates, 
  sessions, 
  onStartWorkout, 
  onCompleteWorkout 
}: ClientWorkoutViewProps) {
  const [activeTab, setActiveTab] = useState<'templates' | 'history' | 'progress'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<WorkoutTemplate | null>(null);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [sessionData, setSessionData] = useState<Partial<WorkoutSession>>({});

  const activeTemplates = templates.filter(t => t.isActive);
  const recentSessions = sessions.slice(0, 10);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strength': return Dumbbell;
      case 'cardio': return TrendingUp;
      case 'hiit': return Target;
      case 'yoga': return Target;
      case 'pilates': return Target;
      case 'functional': return Target;
      case 'sports': return Target;
      default: return Dumbbell;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartWorkout = (template: WorkoutTemplate) => {
    const newSession: Omit<WorkoutSession, 'id' | 'createdAt'> = {
      clientId,
      templateId: template.id,
      templateName: template.name,
      date: new Date(),
      startTime: new Date(),
      status: 'in_progress',
      exercises: template.exercises.map(exercise => ({
        id: Date.now().toString() + Math.random(),
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        sets: Array.from({ length: exercise.sets }, (_, i) => ({
          id: Date.now().toString() + Math.random() + i,
          setNumber: i + 1,
          reps: exercise.reps,
          weight: exercise.weight,
          duration: exercise.duration,
          completed: false
        })),
        notes: ''
      })),
      notes: ''
    };

    const session = onStartWorkout(template.id);
    setActiveSession(session as any);
    setSelectedTemplate(template);
    setCurrentExerciseIndex(0);
    setCurrentSetIndex(0);
  };

  const handleCompleteSet = (exerciseId: string, setIndex: number, setData: Partial<WorkoutSet>) => {
    if (!activeSession) return;

    const updatedSession = {
      ...activeSession,
      exercises: activeSession.exercises.map(exercise => {
        if (exercise.exerciseId === exerciseId) {
          return {
            ...exercise,
            sets: exercise.sets.map((set, i) => 
              i === setIndex ? { ...set, ...setData, completed: true } : set
            )
          };
        }
        return exercise;
      })
    };

    setActiveSession(updatedSession);
    
    // Move to next set or exercise
    const currentExercise = updatedSession.exercises[currentExerciseIndex];
    if (currentSetIndex < currentExercise.sets.length - 1) {
      setCurrentSetIndex(currentSetIndex + 1);
    } else if (currentExerciseIndex < updatedSession.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSetIndex(0);
    } else {
      // Workout complete
      handleFinishWorkout(updatedSession);
    }
  };

  const handleFinishWorkout = (session: WorkoutSession) => {
    const completedSession = {
      ...session,
      status: 'completed' as const,
      endTime: new Date(),
      duration: Math.round((new Date().getTime() - session.startTime.getTime()) / 60000)
    };

    onCompleteWorkout(session.id, completedSession);
    setActiveSession(null);
    setSelectedTemplate(null);
    setCurrentExerciseIndex(0);
    setCurrentSetIndex(0);
  };

  const getWorkoutStats = () => {
    const completedSessions = sessions.filter(s => s.status === 'completed');
    const totalWorkouts = completedSessions.length;
    const totalDuration = completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const avgRating = completedSessions.length > 0 
      ? completedSessions.reduce((sum, s) => sum + (s.rating || 0), 0) / completedSessions.length 
      : 0;

    return { totalWorkouts, totalDuration, avgRating };
  };

  const stats = getWorkoutStats();

  if (activeSession && selectedTemplate) {
    const currentExercise = activeSession.exercises[currentExerciseIndex];
    const currentSet = currentExercise.sets[currentSetIndex];
    const progress = ((currentExerciseIndex * 100) + ((currentSetIndex + 1) / currentExercise.sets.length) * 100) / activeSession.exercises.length;

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Active Workout Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{selectedTemplate.name}</h1>
                <p className="text-sm text-gray-600">
                  Exercise {currentExerciseIndex + 1} of {activeSession.exercises.length}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-gray-600">Progress</div>
                  <div className="text-lg font-bold text-blue-600">{Math.round(progress)}%</div>
                </div>
                <button
                  onClick={() => handleFinishWorkout(activeSession)}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Square className="h-4 w-4 mr-2" />
                  End Workout
                </button>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Current Exercise */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentExercise.exerciseName}</h2>
              <p className="text-gray-600">Set {currentSetIndex + 1} of {currentExercise.sets.length}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {currentSet.reps || currentSet.duration}
                </div>
                <div className="text-sm text-gray-600">
                  {currentSet.reps ? 'Reps' : 'Seconds'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {currentSet.weight || 'BW'}
                </div>
                <div className="text-sm text-gray-600">
                  {currentSet.weight ? 'lbs' : 'Body Weight'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {selectedTemplate.exercises.find(ex => ex.id === currentExercise.exerciseId)?.restTime || 60}
                </div>
                <div className="text-sm text-gray-600">Rest (sec)</div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => handleCompleteSet(currentExercise.exerciseId, currentSetIndex, {
                  reps: currentSet.reps,
                  weight: currentSet.weight,
                  duration: currentSet.duration
                })}
                className="flex items-center px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mx-auto text-lg font-medium"
              >
                <CheckCircle className="h-6 w-6 mr-3" />
                Complete Set
              </button>
            </div>
          </div>

          {/* Exercise List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Workout Progress</h3>
            <div className="space-y-3">
              {activeSession.exercises.map((exercise, exIndex) => (
                <div key={exercise.id} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    exIndex < currentExerciseIndex 
                      ? 'bg-green-100 text-green-600' 
                      : exIndex === currentExerciseIndex 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-400'
                  }`}>
                    {exIndex < currentExerciseIndex ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{exIndex + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{exercise.exerciseName}</div>
                    <div className="text-sm text-gray-600">
                      {exercise.sets.filter(s => s.completed).length} / {exercise.sets.length} sets completed
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Workouts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalWorkouts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Time</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDuration} min</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-100">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'templates', name: 'Workout Templates', icon: Dumbbell },
            { id: 'history', name: 'Workout History', icon: Calendar },
            { id: 'progress', name: 'Progress', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
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

      {/* Tab Content */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Available Workouts</h2>
            <span className="text-sm text-gray-600">{activeTemplates.length} templates</span>
          </div>

          {activeTemplates.length === 0 ? (
            <div className="text-center py-12">
              <Dumbbell className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No workout templates available</h3>
              <p className="text-gray-600">Your coach hasn't created any workout templates yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeTemplates.map((template) => {
                const CategoryIcon = getCategoryIcon(template.category);
                return (
                  <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-blue-100">
                            <CategoryIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{template.name}</h3>
                            <p className="text-sm text-gray-600 capitalize">{template.category}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                          {template.difficulty}
                        </span>
                      </div>

                      {template.description && (
                        <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {template.estimatedDuration} min
                          </span>
                          <span className="flex items-center">
                            <Target className="h-4 w-4 mr-1" />
                            {template.exercises.length} exercises
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {template.exercises.slice(0, 3).map((exercise) => (
                          <span key={exercise.id} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {exercise.name}
                          </span>
                        ))}
                        {template.exercises.length > 3 && (
                          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            +{template.exercises.length - 3} more
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleStartWorkout(template)}
                        className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Start Workout
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Workout History</h2>
            <span className="text-sm text-gray-600">{recentSessions.length} workouts</span>
          </div>

          {recentSessions.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No workout history</h3>
              <p className="text-gray-600">Complete your first workout to see your history here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentSessions.map((session) => (
                <div key={session.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{session.templateName}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(session.date).toLocaleDateString()} at {session.startTime.toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      {session.rating && (
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < session.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        session.status === 'completed' ? 'bg-green-100 text-green-800' :
                        session.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      {session.duration && (
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {session.duration} min
                        </span>
                      )}
                      <span className="flex items-center">
                        <Target className="h-4 w-4 mr-1" />
                        {session.exercises.length} exercises
                      </span>
                    </div>
                    {session.difficulty && (
                      <span className="text-sm text-gray-500 capitalize">
                        Felt {session.difficulty.replace('_', ' ')}
                      </span>
                    )}
                  </div>

                  {session.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{session.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Workout Progress</h2>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {sessions.filter(s => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(s.date) >= weekAgo && s.status === 'completed';
                  }).length}
                </div>
                <div className="text-sm text-gray-600">This Week</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {sessions.filter(s => {
                    const monthAgo = new Date();
                    monthAgo.setMonth(monthAgo.getMonth() - 1);
                    return new Date(s.date) >= monthAgo && s.status === 'completed';
                  }).length}
                </div>
                <div className="text-sm text-gray-600">This Month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {Math.round(stats.totalDuration / Math.max(stats.totalWorkouts, 1))}
                </div>
                <div className="text-sm text-gray-600">Avg Duration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
            <div className="space-y-3">
              {stats.totalWorkouts >= 5 && (
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <Award className="h-6 w-6 text-yellow-600" />
                  <div>
                    <div className="font-medium text-yellow-800">5 Workouts Complete!</div>
                    <div className="text-sm text-yellow-700">You've completed 5 workouts. Keep it up!</div>
                  </div>
                </div>
              )}
              {stats.totalWorkouts >= 10 && (
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Award className="h-6 w-6 text-green-600" />
                  <div>
                    <div className="font-medium text-green-800">10 Workouts Complete!</div>
                    <div className="text-sm text-green-700">Amazing dedication! You're building great habits.</div>
                  </div>
                </div>
              )}
              {stats.totalDuration >= 300 && (
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Award className="h-6 w-6 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-800">5 Hours of Training!</div>
                    <div className="text-sm text-blue-700">You've logged over 5 hours of training time.</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


