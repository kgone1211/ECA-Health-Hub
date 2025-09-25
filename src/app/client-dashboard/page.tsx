'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Award, 
  Target,
  TrendingUp,
  Heart,
  Activity,
  Moon,
  Droplets,
  Plus,
  Eye,
  BarChart3,
  Shield,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Dumbbell,
} from 'lucide-react';
import { db } from '@/lib/database';
import { CheckInForm, FormResponse, PhotoSubmission, MeasurementSubmission, MacrosLog, WorkoutSession } from '@/types';
import { MarchPhaseAssessment, MarchPhase } from '@/types/march';
import HabitCalendar from '@/components/HabitCalendar';
import ClientFormSubmission from '@/components/ClientFormSubmission';
import WeightTrendChart from '@/components/WeightTrendChart';
import WeeklyWorkoutView from '@/components/WeeklyWorkoutView';
import ClientMacrosDisplay from '@/components/ClientMacrosDisplay';
import ClientWorkoutView from '@/components/ClientWorkoutView';
import ClientChallenges from '@/components/ClientChallenges';

export default function ClientDashboard() {
  const [userId] = useState('2'); // Client user
  const [selectedForm, setSelectedForm] = useState<CheckInForm | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'forms' | 'progress' | 'journal' | 'habits' | 'metrics' | 'macros' | 'workouts'>('overview');
  const [marchPhase, setMarchPhase] = useState<MarchPhaseAssessment | null>(null);
  const [marchLoading, setMarchLoading] = useState(true);
  const [marchError, setMarchError] = useState<string | null>(null);

  const user = db.getUserById(userId);
  const forms = db.getCheckInForms('1'); // Coach's forms
  const journalEntries = db.getJournalEntries(userId);
  const checkInSubmissions = db.getCheckInSubmissions(userId);
  const healthMetrics = db.getHealthMetrics(userId);
  const trainingLogs = db.getTrainingLogs(userId);
  const bodyMetrics = db.getBodyMetrics(userId);
  const userPoints = db.getUserPoints(userId);
  const streaks = db.getUserStreaks(userId);
  const macrosTarget = db.getMacrosTargetByClient(userId);
  const macrosLogs = db.getMacrosLogsByClient(userId);
  const workoutTemplates = db.getWorkoutTemplatesByClient(userId);
  const workoutSessions = db.getWorkoutSessionsByClient(userId);

  // Fetch M.A.R.C.H. phase data
  useEffect(() => {
    const fetchMarchPhase = async () => {
      try {
        setMarchLoading(true);
        const response = await fetch(`/api/march-phase?clientId=${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch M.A.R.C.H. phase data');
        }

        const data = await response.json();
        setMarchPhase(data.assessment);
      } catch (err) {
        setMarchError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setMarchLoading(false);
      }
    };

    fetchMarchPhase();
  }, [userId]);

  const handleFormSubmit = (responses: FormResponse[], photos: PhotoSubmission[], measurements: MeasurementSubmission[]) => {
    console.log('Form submitted:', { responses, photos, measurements });
    // In a real app, this would save to the database
    setSelectedForm(null);
    alert('Check-in submitted successfully! +10 points');
  };

  const handleAddMacrosLog = (log: Omit<MacrosLog, 'id'>) => {
    db.createMacrosLog(log);
    // In a real app, you'd update the UI state here
    window.location.reload(); // Simple refresh for demo
  };

  const stats = [
    {
      title: 'Current Streak',
      value: `${streaks.find(s => s.type === 'journal')?.current || 0} days`,
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Points Earned',
      value: userPoints,
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Forms Completed',
      value: '12',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Health Score',
      value: '85%',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    }
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'journal',
      message: 'Completed daily journal entry',
      time: '2 hours ago',
      icon: Activity,
      color: 'text-blue-600'
    },
    {
      id: '2',
      type: 'form',
      message: 'Submitted weekly health check-in',
      time: '1 day ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: '3',
      type: 'achievement',
      message: 'Earned "Consistency King" badge',
      time: '3 days ago',
      icon: Award,
      color: 'text-purple-600'
    }
  ];

  const upcomingForms = forms.filter(form => form.isActive).slice(0, 3);

  // M.A.R.C.H. phase icons and colors
  const phaseIcons: Record<MarchPhase, any> = {
    MITOCHONDRIA: Activity,
    ABSORPTION_DETOX: Heart,
    RESILIENCE: Shield,
    CYCLICAL: RefreshCw,
    HYPERTROPHY_HEALTHSPAN: TrendingUp
  };

  const phaseColors: Record<MarchPhase, string> = {
    MITOCHONDRIA: 'text-orange-600 bg-orange-100',
    ABSORPTION_DETOX: 'text-red-600 bg-red-100',
    RESILIENCE: 'text-blue-600 bg-blue-100',
    CYCLICAL: 'text-purple-600 bg-purple-100',
    HYPERTROPHY_HEALTHSPAN: 'text-green-600 bg-green-100'
  };

  const formatPhaseName = (phase: MarchPhase): string => {
    return phase.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };



  const handleStartWorkout = (templateId: string) => {
    const template = workoutTemplates.find(t => t.id === templateId);
    if (!template) return;

    const newSession: Omit<WorkoutSession, 'id' | 'createdAt'> = {
      clientId: userId,
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

    return db.createWorkoutSession(newSession);
  };

  const handleCompleteWorkout = (sessionId: string, sessionData: Partial<WorkoutSession>) => {
    db.updateWorkoutSession(sessionId, sessionData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Health Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-1 rounded-lg">
                <Award className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">{userPoints} points</span>
              </div>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: BarChart3 },
                { id: 'forms', name: 'Check-ins', icon: CheckCircle },
                { id: 'progress', name: 'Progress', icon: TrendingUp },
                { id: 'journal', name: 'Journal', icon: Activity },
                { id: 'habits', name: 'Habits', icon: Target },
                { id: 'metrics', name: 'Metrics', icon: BarChart3 },
                { id: 'macros', name: 'Macros', icon: Target },
                { id: 'workouts', name: 'Workouts', icon: Dumbbell }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'overview' | 'forms' | 'progress' | 'journal' | 'habits' | 'metrics' | 'macros' | 'workouts')}
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
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            {/* M.A.R.C.H. Phase Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Your Current Health Phase</h3>
                <div className="text-sm text-gray-500">
                  Updated weekly based on your health data
                </div>
              </div>

              {marchLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : marchError ? (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <span>Unable to load phase data</span>
                </div>
              ) : marchPhase ? (
                <div className="space-y-6">
                  {/* Current Phase Display */}
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${phaseColors[marchPhase.decidedPhase]} march-phase-primary`}>
                      {React.createElement(phaseIcons[marchPhase.decidedPhase], { className: "h-8 w-8" })}
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900">
                        {formatPhaseName(marchPhase.decidedPhase)}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Confidence:</span>
                        <span className={`text-sm font-medium ${
                          Math.round(marchPhase.confidence * 100) >= 80 ? 'text-green-600' :
                          Math.round(marchPhase.confidence * 100) >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {Math.round(marchPhase.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Phase Description */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">What this means for you:</h5>
                    <div className="space-y-2">
                      {marchPhase.rationale.slice(0, 3).map((reason, index) => (
                        <div key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Phase Guidance */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h5 className="text-sm font-medium text-blue-900 mb-2">This Week's Focus</h5>
                      <p className="text-sm text-blue-800">
                        {marchPhase.decidedPhase === 'MITOCHONDRIA' && 'Focus on energy foundation and recovery. Prioritize sleep, manage stress, and include gentle movement.'}
                        {marchPhase.decidedPhase === 'ABSORPTION_DETOX' && 'Address digestive health and nutrient absorption. Identify food triggers and support gut health.'}
                        {marchPhase.decidedPhase === 'RESILIENCE' && 'Build stress management and recovery. Implement stress reduction techniques and optimize recovery.'}
                        {marchPhase.decidedPhase === 'CYCLICAL' && 'Optimize hormonal balance and cycle. Track your cycle and adjust training accordingly.'}
                        {marchPhase.decidedPhase === 'HYPERTROPHY_HEALTHSPAN' && 'Focus on strength building and long-term health. Progressive overload and optimize nutrition.'}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h5 className="text-sm font-medium text-green-900 mb-2">Key Actions</h5>
                      <ul className="text-sm text-green-800 space-y-1">
                        {marchPhase.decidedPhase === 'MITOCHONDRIA' && (
                          <>
                            <li>• Prioritize 7-8 hours of sleep</li>
                            <li>• Practice stress management</li>
                            <li>• Include gentle movement daily</li>
                          </>
                        )}
                        {marchPhase.decidedPhase === 'ABSORPTION_DETOX' && (
                          <>
                            <li>• Identify food triggers</li>
                            <li>• Support gut microbiome</li>
                            <li>• Focus on easily digestible foods</li>
                          </>
                        )}
                        {marchPhase.decidedPhase === 'RESILIENCE' && (
                          <>
                            <li>• Implement stress reduction</li>
                            <li>• Optimize recovery protocols</li>
                            <li>• Manage training load carefully</li>
                          </>
                        )}
                        {marchPhase.decidedPhase === 'CYCLICAL' && (
                          <>
                            <li>• Track menstrual cycle</li>
                            <li>• Adjust training to cycle phases</li>
                            <li>• Manage PMS symptoms</li>
                          </>
                        )}
                        {marchPhase.decidedPhase === 'HYPERTROPHY_HEALTHSPAN' && (
                          <>
                            <li>• Progressive overload training</li>
                            <li>• Optimize protein intake</li>
                            <li>• Monitor recovery markers</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Phase Progress */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Phase Scores</h5>
                    <div className="space-y-2">
                      {Object.entries(marchPhase.phaseScores)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 3)
                        .map(([phase, score]) => {
                          const isCurrentPhase = phase === marchPhase.decidedPhase;
                          const PhaseIcon = phaseIcons[phase as MarchPhase];
                          const phaseColor = phaseColors[phase as MarchPhase];
                          
                          return (
                            <div key={phase} className="flex items-center justify-between p-2 rounded ${
                              isCurrentPhase ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                            }">
                              <div className="flex items-center space-x-2">
                                <PhaseIcon className={`h-4 w-4 ${phaseColor.split(' ')[0]}`} />
                                <span className={`text-sm font-medium ${
                                  isCurrentPhase ? 'text-blue-600' : 'text-gray-600'
                                }`}>
                                  {formatPhaseName(phase as MarchPhase)}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      isCurrentPhase ? 'bg-blue-600' : 'bg-gray-400'
                                    }`}
                                    style={{ width: `${score}%` }}
                                  ></div>
                                </div>
                                <span className={`text-sm font-medium w-8 ${
                                  isCurrentPhase ? 'text-blue-600' : 'text-gray-600'
                                }`}>
                                  {Math.round(score)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Phase Data Available</h4>
                  <p className="text-gray-600 mb-4">
                    Complete your health check-ins to get your personalized phase assessment.
                  </p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Complete Check-in
                  </button>
                </div>
              )}
            </div>

            {/* Habit Calendar */}
            <HabitCalendar 
              journalEntries={journalEntries}
              healthMetrics={healthMetrics}
              trainingLogs={trainingLogs}
              bodyMetrics={bodyMetrics}
              className="mb-8"
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activities */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="px-6 py-4 flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-gray-100">
                        <activity.icon className={`h-5 w-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.message}
                        </p>
                        <p className="text-sm text-gray-600">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Check-ins */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Upcoming Check-ins</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {upcomingForms.length === 0 ? (
                    <div className="px-6 py-8 text-center">
                      <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming check-ins</h3>
                      <p className="text-gray-600">Your coach hasn&apos;t scheduled any check-ins yet.</p>
                    </div>
                  ) : (
                    upcomingForms.map((form) => (
                      <div key={form.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{form.name}</h4>
                            <p className="text-xs text-gray-500">
                              {form.frequency === 'bi-weekly' ? 'Bi-weekly' : 'Monthly'} • {form.fields.length} questions
                            </p>
                          </div>
                          <button
                            onClick={() => setSelectedForm(form)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Start
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Challenges Section */}
            <ClientChallenges clientId={userId} />
          </div>
        )}

        {activeTab === 'forms' && (
          <div className="space-y-6">
            {/* Available Forms */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Available Check-in Forms</h3>
                <p className="text-sm text-gray-600">Complete these forms to track your progress</p>
              </div>
              <div className="divide-y divide-gray-200">
                {forms.filter(form => form.isActive).map((form) => (
                  <div key={form.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900">{form.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {form.frequency === 'bi-weekly' ? 'Bi-weekly' : 'Monthly'} check-in form
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="mr-1">{form.fields.length}</span>
                            <span>questions</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="mr-1">{form.fields.filter(f => f.required).length}</span>
                            <span>required</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedForm(form)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Complete Form
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Past Submissions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Submissions</h3>
                <p className="text-sm text-gray-600">Your recent check-in responses and progress</p>
              </div>
              <div className="divide-y divide-gray-200">
                {checkInSubmissions.length === 0 ? (
                  <div className="px-6 py-8 text-center">
                    <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No Submissions Yet</h4>
                    <p className="text-gray-600 mb-4">Complete a check-in form to see your submissions here</p>
                  </div>
                ) : (
                  checkInSubmissions
                    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
                    .map((submission) => {
                      const form = forms.find(f => f.id === submission.formId);
                      return (
                        <div key={submission.id} className="px-6 py-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="text-lg font-medium text-gray-900">
                                {form?.name || 'Check-in Form'}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Submitted on {new Date(submission.submittedAt).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-600">Completed</span>
                            </div>
                          </div>

                          {/* Responses */}
                          <div className="space-y-3">
                            {submission.responses.map((response, index) => {
                              const field = form?.fields.find(f => f.id === response.fieldId);
                              return (
                                <div key={index} className="bg-gray-50 rounded-lg p-3">
                                  <h5 className="text-sm font-medium text-gray-900 mb-1">
                                    {field?.label || `Question ${index + 1}`}
                                  </h5>
                                  <p className="text-sm text-gray-600">
                                    {typeof response.value === 'string' ? response.value : response.value.toString()}
                                  </p>
                                </div>
                              );
                            })}
                          </div>

                          {/* Measurements */}
                          {submission.measurements.length > 0 && (
                            <div className="mt-4">
                              <h5 className="text-sm font-medium text-gray-900 mb-2">Measurements</h5>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {submission.measurements.map((measurement) => (
                                  <div key={measurement.id} className="bg-blue-50 rounded-lg p-3 text-center">
                                    <div className="text-lg font-semibold text-blue-900">
                                      {measurement.value} {measurement.unit}
                                    </div>
                                    <div className="text-xs text-blue-700 capitalize">
                                      {measurement.type.replace('_', ' ')}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Progress</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Heart className="h-12 w-12 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Energy Level</h4>
                  <p className="text-3xl font-bold text-green-600">8.5/10</p>
                  <p className="text-sm text-gray-600">+0.5 from last week</p>
                </div>
                <div className="text-center">
                  <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Moon className="h-12 w-12 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Sleep Quality</h4>
                  <p className="text-3xl font-bold text-blue-600">7.2/10</p>
                  <p className="text-sm text-gray-600">+0.3 from last week</p>
                </div>
                <div className="text-center">
                  <div className="h-24 w-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Droplets className="h-12 w-12 text-purple-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Hydration</h4>
                  <p className="text-3xl font-bold text-purple-600">85%</p>
                  <p className="text-sm text-gray-600">+5% from last week</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'journal' && (
          <div className="space-y-6">
            {/* Journal Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Daily Journal</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  + New Entry
                </button>
              </div>
              <p className="text-gray-600 mb-4">Track your daily habits, mood, and reflections</p>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span>{journalEntries.length} entries</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>{streaks.find(s => s.type === 'journal')?.current || 0} day streak</span>
                </div>
              </div>
            </div>

            {/* Journal Entries */}
            <div className="space-y-4">
              {journalEntries.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Journal Entries Yet</h4>
                  <p className="text-gray-600 mb-4">Start tracking your daily progress and reflections</p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Create First Entry
                  </button>
                </div>
              ) : (
                journalEntries
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((entry) => (
                    <div key={entry.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </h4>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <span className="text-sm text-gray-600">Mood:</span>
                            <span className={`text-sm font-medium ${
                              entry.mood >= 8 ? 'text-green-600' :
                              entry.mood >= 6 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {entry.mood}/10
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm text-gray-600">Energy:</span>
                            <span className={`text-sm font-medium ${
                              entry.energy >= 8 ? 'text-green-600' :
                              entry.energy >= 6 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {entry.energy}/10
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm text-gray-600">Sleep:</span>
                            <span className={`text-sm font-medium ${
                              entry.sleep >= 8 ? 'text-green-600' :
                              entry.sleep >= 6 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {entry.sleep}/10
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Gratitude */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-900 mb-2">Gratitude</h5>
                          <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
                            {entry.gratitude}
                          </p>
                        </div>

                        {/* Priorities */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-900 mb-2">Today's Priorities</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {entry.priorities.map((priority, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <div className="h-1.5 w-1.5 bg-blue-600 rounded-full"></div>
                                <span>{priority}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Habits */}
                      <div className="mt-4">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Habits</h5>
                        <div className="space-y-2">
                          {entry.habits.map((habit) => (
                            <div key={habit.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <div className={`h-4 w-4 rounded-full flex items-center justify-center ${
                                  habit.completed ? 'bg-green-500' : 'bg-gray-300'
                                }`}>
                                  {habit.completed && <CheckCircle className="h-3 w-3 text-white" />}
                                </div>
                                <span className={`text-sm ${
                                  habit.completed ? 'text-gray-900' : 'text-gray-500'
                                }`}>
                                  {habit.name}
                                </span>
                              </div>
                              {habit.notes && (
                                <span className="text-xs text-gray-500">{habit.notes}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      {entry.notes && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-900 mb-2">Notes</h5>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {entry.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'habits' && (
          <div className="space-y-6">
            <HabitCalendar 
              journalEntries={journalEntries}
              healthMetrics={healthMetrics}
              trainingLogs={trainingLogs}
              bodyMetrics={bodyMetrics}
            />
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <WeightTrendChart 
              bodyMetrics={bodyMetrics}
              className="mb-6"
            />
            <WeeklyWorkoutView 
              trainingLogs={trainingLogs}
            />
          </div>
        )}

        {activeTab === 'macros' && (
          <div className="space-y-6">
            <ClientMacrosDisplay
              macrosTarget={macrosTarget}
              macrosLogs={macrosLogs}
              onAddLog={handleAddMacrosLog}
            />
          </div>
        )}

        {activeTab === 'workouts' && (
          <div className="space-y-6">
            <ClientWorkoutView
              clientId={userId}
              templates={workoutTemplates}
              sessions={workoutSessions}
              onStartWorkout={handleStartWorkout}
              onCompleteWorkout={handleCompleteWorkout}
            />
          </div>
        )}
      </main>

      {/* Form Submission Modal */}
      {selectedForm && (
        <ClientFormSubmission
          form={selectedForm}
          onSubmit={handleFormSubmit}
          onCancel={() => setSelectedForm(null)}
        />
      )}

    </div>
  );
}
