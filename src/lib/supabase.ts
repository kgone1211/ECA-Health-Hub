// Supabase client configuration for EFH Health Hub
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create an admin client that bypasses RLS (for server-side operations)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase;

// Database Types
export interface User {
  id: number;
  whop_user_id: string;
  email: string;
  username?: string;
  full_name?: string;
  role: 'client' | 'coach';
  is_coach: boolean;
  created_at: string;
  updated_at: string;
}

export interface Coach {
  id: number;
  user_id: number;
  specialization?: string;
  bio?: string;
  certifications?: string[];
  years_experience?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CoachClient {
  id: number;
  coach_id: number;
  client_id: number;
  status: 'active' | 'inactive' | 'pending';
  start_date: string;
  end_date?: string;
  created_at: string;
}

export interface Session {
  id: number;
  coach_id: number;
  client_id: number;
  session_date: string;
  duration_minutes: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  session_type?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface HealthMetric {
  id: number;
  user_id: number;
  metric_type: string;
  value: number;
  unit: string;
  notes?: string;
  recorded_at: string;
  created_at: string;
}

export interface Goal {
  id: number;
  user_id: number;
  goal_type: string;
  title: string;
  description?: string;
  target_value?: number;
  target_unit?: string;
  current_value?: number;
  start_date: string;
  target_date?: string;
  status: 'active' | 'completed' | 'abandoned';
  created_at: string;
  updated_at: string;
}

export interface SessionNote {
  id: number;
  session_id: number;
  coach_id: number;
  note_type?: string;
  content: string;
  is_visible_to_client: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: number;
  user_id: number;
  preferred_units: 'imperial' | 'metric';
  notifications_enabled: boolean;
  reminder_time?: string;
  theme: 'light' | 'dark' | 'system';
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: number;
  user_id: number;
  activity_type: string;
  metadata?: any;
  created_at: string;
}

// Gamification Types
export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  points: number;
  category: 'milestone' | 'consistency' | 'performance' | 'social';
  requirement_type: string;
  requirement_value: number;
  badge_color: 'blue' | 'purple' | 'gold' | 'silver' | 'bronze';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  id: number;
  user_id: number;
  achievement_id: number;
  earned_at: string;
  achievement?: Achievement;
}

export interface UserPoints {
  id: number;
  user_id: number;
  total_points: number;
  current_level: number;
  points_to_next_level: number;
  lifetime_points: number;
  updated_at: string;
}

export interface PointsTransaction {
  id: number;
  user_id: number;
  points: number;
  reason: string;
  reference_type?: string;
  reference_id?: number;
  created_at: string;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  challenge_type: 'daily' | 'weekly' | 'monthly' | 'custom';
  goal_type: 'sessions' | 'metrics' | 'streaks' | 'points';
  goal_value: number;
  points_reward: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_by?: number;
  created_at: string;
}

export interface UserChallenge {
  id: number;
  user_id: number;
  challenge_id: number;
  current_progress: number;
  is_completed: boolean;
  completed_at?: string;
  joined_at: string;
  challenge?: Challenge;
}

export interface Streak {
  id: number;
  user_id: number;
  streak_type: 'daily_checkin' | 'metrics_logging' | 'session_attendance';
  current_streak: number;
  longest_streak: number;
  last_activity_date?: string;
  updated_at: string;
}

