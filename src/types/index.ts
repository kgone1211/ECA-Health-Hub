// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'coach' | 'client';
  coachId?: string;
  createdAt: Date;
  isActive: boolean;
  branding?: BrandingConfig;
}

// Health Metrics
export interface HealthMetric {
  id: string;
  userId: string;
  date: Date;
  type: 'temperature' | 'energy' | 'fatigue' | 'recovery' | 'bowel_movement' | 'sleep' | 'weight' | 'body_fat' | 'muscle_mass' | 'water_intake' | 'steps' | 'heart_rate';
  value: number | string;
  unit?: string;
  notes?: string;
  score?: 'red' | 'yellow' | 'green';
}

// Check-in Forms
export interface CheckInForm {
  id: string;
  coachId: string;
  name: string;
  frequency: 'bi-weekly' | 'monthly';
  fields: FormField[];
  isActive: boolean;
  createdAt: Date;
}

export interface FormField {
  id: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'photo' | 'measurement' | 'symptom';
  label: string;
  required: boolean;
  options?: string[];
  unit?: string;
  min?: number;
  max?: number;
}

export interface CheckInSubmission {
  id: string;
  userId: string;
  formId: string;
  responses: FormResponse[];
  photos: PhotoSubmission[];
  measurements: MeasurementSubmission[];
  submittedAt: Date;
}

export interface FormResponse {
  fieldId: string;
  value: string | number | boolean;
}

export interface PhotoSubmission {
  id: string;
  type: 'front' | 'side' | 'back' | 'progress';
  url: string;
  date: Date;
}

export interface MeasurementSubmission {
  id: string;
  type: 'weight' | 'body_fat' | 'muscle_mass' | 'waist' | 'chest' | 'arms' | 'thighs';
  value: number;
  unit: string;
  date: Date;
}

// Journal System
export interface JournalEntry {
  id: string;
  userId: string;
  date: Date;
  gratitude: string;
  priorities: string[];
  habits: HabitEntry[];
  mood: number;
  energy: number;
  sleep: number;
  notes?: string;
}

export interface HabitEntry {
  id: string;
  name: string;
  completed: boolean;
  notes?: string;
}

// Gamification
export interface Points {
  id: string;
  userId: string;
  points: number;
  source: 'journal_entry' | 'check_in' | 'streak' | 'achievement' | 'challenge';
  description: string;
  earnedAt: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  requirements: AchievementRequirement[];
}

export interface AchievementRequirement {
  type: 'streak' | 'points' | 'habits' | 'check_ins' | 'journal_entry';
  value: number;
  timeframe?: 'daily' | 'weekly' | 'monthly';
}

export interface Streak {
  id: string;
  userId: string;
  type: 'journal' | 'check_in' | 'habits';
  current: number;
  longest: number;
  lastActivity: Date;
}

export interface Leaderboard {
  id: string;
  name: string;
  type: 'points' | 'streaks' | 'check_ins';
  entries: LeaderboardEntry[];
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  updatedAt: Date;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  value: number;
  rank: number;
  avatar?: string;
}

// Challenges
export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  requirements: ChallengeRequirement[];
  rewards: ChallengeReward[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  participants: string[];
}

export interface ChallengeRequirement {
  type: 'journal_entries' | 'check_ins' | 'habits' | 'points';
  value: number;
  timeframe: 'daily' | 'weekly' | 'monthly';
}

export interface ChallengeReward {
  type: 'points' | 'badge' | 'achievement';
  value: string | number;
}

// Branding
export interface BrandingConfig {
  id: string;
  userId: string;
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  companyName: string;
  customCss?: string;
}

// Analytics
export interface ClientInsight {
  id: string;
  userId: string;
  type: 'trend' | 'anomaly' | 'achievement' | 'concern';
  title: string;
  description: string;
  data: any;
  severity: 'low' | 'medium' | 'high';
  createdAt: Date;
}

// Notifications
export interface Notification {
  id: string;
  userId: string;
  type: 'reminder' | 'achievement' | 'alert' | 'update';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

// Wearable Data
export interface WearableData {
  id: string;
  userId: string;
  device: 'apple_watch' | 'fitbit' | 'garmin' | 'other';
  dataType: 'steps' | 'heart_rate' | 'sleep' | 'calories' | 'distance';
  value: number;
  unit: string;
  timestamp: Date;
  rawData?: any;
}

// Macros Targets
export interface MacrosTarget {
  id: string;
  clientId: string;
  coachId: string;
  protein: number; // grams per day
  carbs: number; // grams per day
  fats: number; // grams per day
  calories: number; // total calories per day
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

// Macros Log Entry
export interface MacrosLog {
  id: string;
  clientId: string;
  date: Date;
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  notes?: string;
}

// Workout Templates
export interface WorkoutTemplate {
  id: string;
  coachId: string;
  clientId: string;
  name: string;
  description?: string;
  category: 'strength' | 'cardio' | 'hiit' | 'yoga' | 'pilates' | 'functional' | 'sports' | 'other';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // minutes
  exercises: WorkoutExercise[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

// Workout Exercise
export interface WorkoutExercise {
  id: string;
  name: string;
  description?: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'balance' | 'plyometric';
  muscleGroups: string[];
  equipment: string[];
  sets: number;
  reps?: number;
  duration?: number; // seconds for time-based exercises
  weight?: number; // lbs
  restTime: number; // seconds between sets
  notes?: string;
  order: number; // order in workout
}

// Workout Sessions (actual completed workouts)
export interface WorkoutSession {
  id: string;
  clientId: string;
  templateId: string;
  templateName: string;
  date: Date;
  startTime: Date;
  endTime?: Date;
  duration?: number; // minutes
  status: 'planned' | 'in_progress' | 'completed' | 'skipped';
  exercises: WorkoutSessionExercise[];
  notes?: string;
  rating?: number; // 1-5 stars
  difficulty?: 'too_easy' | 'just_right' | 'too_hard';
  createdAt: Date;
}

// Workout Session Exercise (actual performance)
export interface WorkoutSessionExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
  notes?: string;
}

// Workout Set (individual set performance)
export interface WorkoutSet {
  id: string;
  setNumber: number;
  reps?: number;
  weight?: number; // lbs
  duration?: number; // seconds
  restTime?: number; // seconds
  completed: boolean;
  notes?: string;
}
