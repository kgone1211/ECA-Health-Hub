// Supabase client configuration for ECA Health Hub
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

