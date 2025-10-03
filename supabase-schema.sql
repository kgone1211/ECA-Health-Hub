-- ECA Health Hub Database Schema
-- Run this in Supabase SQL Editor to create all tables

-- 1. Users Table (extends Whop authentication)
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  whop_user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  username TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'client', -- 'client' or 'coach'
  is_coach BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Coaches Table (additional coach information)
CREATE TABLE IF NOT EXISTS coaches (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  specialization TEXT,
  bio TEXT,
  certifications TEXT[],
  years_experience INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 3. Coach-Client Relationships
CREATE TABLE IF NOT EXISTS coach_clients (
  id BIGSERIAL PRIMARY KEY,
  coach_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  client_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active', -- 'active', 'inactive', 'pending'
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(coach_id, client_id)
);

-- 4. Coaching Sessions
CREATE TABLE IF NOT EXISTS sessions (
  id BIGSERIAL PRIMARY KEY,
  coach_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  client_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled', 'no-show'
  session_type TEXT, -- 'initial', 'follow-up', 'check-in', etc.
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Health Metrics (all tracked health data)
CREATE TABLE IF NOT EXISTS health_metrics (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL, -- 'weight', 'blood_pressure', 'heart_rate', 'steps', 'sleep', 'mood', 'water', 'calories', etc.
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL, -- 'lbs', 'kg', 'mmHg', 'bpm', 'hours', 'oz', 'kcal', etc.
  notes TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries by user and metric type
CREATE INDEX IF NOT EXISTS idx_health_metrics_user_type ON health_metrics(user_id, metric_type, recorded_at DESC);

-- 6. Goals
CREATE TABLE IF NOT EXISTS goals (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  goal_type TEXT NOT NULL, -- 'weight_loss', 'muscle_gain', 'cardio', 'nutrition', 'sleep', etc.
  title TEXT NOT NULL,
  description TEXT,
  target_value NUMERIC,
  target_unit TEXT,
  current_value NUMERIC,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  target_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'abandoned'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Session Notes (detailed notes from coach sessions)
CREATE TABLE IF NOT EXISTS session_notes (
  id BIGSERIAL PRIMARY KEY,
  session_id BIGINT REFERENCES sessions(id) ON DELETE CASCADE,
  coach_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  note_type TEXT, -- 'observation', 'recommendation', 'progress', 'concern', etc.
  content TEXT NOT NULL,
  is_visible_to_client BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. User Settings/Preferences
CREATE TABLE IF NOT EXISTS user_settings (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  preferred_units TEXT DEFAULT 'imperial', -- 'imperial' or 'metric'
  notifications_enabled BOOLEAN DEFAULT true,
  reminder_time TIME,
  theme TEXT DEFAULT 'system', -- 'light', 'dark', 'system'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 9. Activity Log (for tracking user engagement)
CREATE TABLE IF NOT EXISTS activity_log (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'login', 'metric_added', 'goal_created', 'session_completed', etc.
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster activity queries
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON activity_log(user_id, created_at DESC);

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Basic - Users can only see their own data)

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = whop_user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = whop_user_id);

-- Health Metrics: Users can view/insert/update their own metrics
CREATE POLICY "Users can view own health metrics" ON health_metrics
  FOR SELECT USING (user_id IN (SELECT id FROM users WHERE whop_user_id = auth.uid()::text));

CREATE POLICY "Users can insert own health metrics" ON health_metrics
  FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE whop_user_id = auth.uid()::text));

CREATE POLICY "Users can update own health metrics" ON health_metrics
  FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE whop_user_id = auth.uid()::text));

-- Goals: Users can view/insert/update their own goals
CREATE POLICY "Users can view own goals" ON goals
  FOR SELECT USING (user_id IN (SELECT id FROM users WHERE whop_user_id = auth.uid()::text));

CREATE POLICY "Users can insert own goals" ON goals
  FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE whop_user_id = auth.uid()::text));

CREATE POLICY "Users can update own goals" ON goals
  FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE whop_user_id = auth.uid()::text));

-- Sessions: Users can view sessions they're involved in (as coach or client)
CREATE POLICY "Users can view own sessions" ON sessions
  FOR SELECT USING (
    coach_id IN (SELECT id FROM users WHERE whop_user_id = auth.uid()::text) OR
    client_id IN (SELECT id FROM users WHERE whop_user_id = auth.uid()::text)
  );

-- Coaches can insert sessions
CREATE POLICY "Coaches can create sessions" ON sessions
  FOR INSERT WITH CHECK (coach_id IN (SELECT id FROM users WHERE whop_user_id = auth.uid()::text AND is_coach = true));

-- User Settings: Users can view/update their own settings
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (user_id IN (SELECT id FROM users WHERE whop_user_id = auth.uid()::text));

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE whop_user_id = auth.uid()::text));

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE whop_user_id = auth.uid()::text));

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coaches_updated_at BEFORE UPDATE ON coaches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_session_notes_updated_at BEFORE UPDATE ON session_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample metric types for reference (optional)
COMMENT ON TABLE health_metrics IS 'Supported metric_types: weight, blood_pressure_systolic, blood_pressure_diastolic, heart_rate, steps, sleep_hours, mood (1-10), water_oz, calories, protein_g, carbs_g, fat_g, exercise_minutes';

