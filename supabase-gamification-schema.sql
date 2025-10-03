-- Gamification Schema for EFH Health Hub
-- Run this in your Supabase SQL Editor

-- =====================================================
-- 1. ACHIEVEMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS achievements (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL, -- Icon name (e.g., 'trophy', 'star', 'fire')
  points INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL, -- 'milestone', 'consistency', 'performance', 'social'
  requirement_type TEXT NOT NULL, -- 'sessions_count', 'streak_days', 'metrics_logged', 'goals_completed'
  requirement_value INTEGER NOT NULL,
  badge_color TEXT NOT NULL DEFAULT 'blue', -- 'blue', 'purple', 'gold', 'silver', 'bronze'
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 2. USER ACHIEVEMENTS TABLE (Junction table)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id BIGINT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- =====================================================
-- 3. USER POINTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_points (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_points INTEGER NOT NULL DEFAULT 0,
  current_level INTEGER NOT NULL DEFAULT 1,
  points_to_next_level INTEGER NOT NULL DEFAULT 100,
  lifetime_points INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- =====================================================
-- 4. POINTS TRANSACTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS points_transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  reason TEXT NOT NULL, -- 'session_completed', 'goal_achieved', 'metric_logged', 'achievement_earned', 'daily_checkin'
  reference_type TEXT, -- 'session', 'goal', 'metric', 'achievement', 'checkin'
  reference_id BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 5. CHALLENGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS challenges (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  challenge_type TEXT NOT NULL, -- 'daily', 'weekly', 'monthly', 'custom'
  goal_type TEXT NOT NULL, -- 'sessions', 'metrics', 'streaks', 'points'
  goal_value INTEGER NOT NULL,
  points_reward INTEGER NOT NULL DEFAULT 0,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 6. USER CHALLENGES TABLE (Junction table)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_challenges (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_id BIGINT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  current_progress INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

-- =====================================================
-- 7. STREAKS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS streaks (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  streak_type TEXT NOT NULL, -- 'daily_checkin', 'metrics_logging', 'session_attendance'
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, streak_type)
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_user_points_user_id ON user_points(user_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_user_id ON points_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_user_id ON user_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_challenge_id ON user_challenges(challenge_id);
CREATE INDEX IF NOT EXISTS idx_streaks_user_id ON streaks(user_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

-- Achievements: Everyone can read, only admins can create
CREATE POLICY "Achievements are viewable by everyone" ON achievements FOR SELECT USING (true);
CREATE POLICY "Achievements can be created by service role" ON achievements FOR INSERT WITH CHECK (true);
CREATE POLICY "Achievements can be updated by service role" ON achievements FOR UPDATE USING (true);

-- User Achievements: Users can only see their own
CREATE POLICY "Users can view their own achievements" ON user_achievements FOR SELECT USING (true);
CREATE POLICY "User achievements can be created by service role" ON user_achievements FOR INSERT WITH CHECK (true);

-- User Points: Users can only see their own points
CREATE POLICY "Users can view their own points" ON user_points FOR SELECT USING (true);
CREATE POLICY "User points can be managed by service role" ON user_points FOR ALL USING (true);

-- Points Transactions: Users can see their own transactions
CREATE POLICY "Users can view their own transactions" ON points_transactions FOR SELECT USING (true);
CREATE POLICY "Transactions can be created by service role" ON points_transactions FOR INSERT WITH CHECK (true);

-- Challenges: Everyone can read
CREATE POLICY "Challenges are viewable by everyone" ON challenges FOR SELECT USING (true);
CREATE POLICY "Challenges can be managed by service role" ON challenges FOR ALL USING (true);

-- User Challenges: Users can see their own challenge progress
CREATE POLICY "Users can view their own challenges" ON user_challenges FOR SELECT USING (true);
CREATE POLICY "User challenges can be managed by service role" ON user_challenges FOR ALL USING (true);

-- Streaks: Users can see their own streaks
CREATE POLICY "Users can view their own streaks" ON streaks FOR SELECT USING (true);
CREATE POLICY "Streaks can be managed by service role" ON streaks FOR ALL USING (true);

-- =====================================================
-- SEED DATA - Default Achievements
-- =====================================================
INSERT INTO achievements (name, description, icon, points, category, requirement_type, requirement_value, badge_color) VALUES
  ('First Steps', 'Complete your first coaching session', 'check-circle', 10, 'milestone', 'sessions_count', 1, 'bronze'),
  ('Getting Started', 'Complete 5 coaching sessions', 'calendar', 25, 'milestone', 'sessions_count', 5, 'silver'),
  ('Dedicated Client', 'Complete 10 coaching sessions', 'award', 50, 'milestone', 'sessions_count', 10, 'gold'),
  ('Health Champion', 'Complete 25 coaching sessions', 'trophy', 100, 'milestone', 'sessions_count', 25, 'gold'),
  
  ('3-Day Streak', 'Log health metrics for 3 days in a row', 'fire', 15, 'consistency', 'streak_days', 3, 'bronze'),
  ('Week Warrior', 'Log health metrics for 7 days in a row', 'flame', 30, 'consistency', 'streak_days', 7, 'silver'),
  ('Consistency King', 'Log health metrics for 30 days in a row', 'zap', 100, 'consistency', 'streak_days', 30, 'gold'),
  
  ('Goal Getter', 'Complete your first health goal', 'target', 20, 'performance', 'goals_completed', 1, 'bronze'),
  ('Goal Crusher', 'Complete 5 health goals', 'crosshair', 50, 'performance', 'goals_completed', 5, 'silver'),
  ('Overachiever', 'Complete 10 health goals', 'trophy', 100, 'performance', 'goals_completed', 10, 'gold'),
  
  ('Data Tracker', 'Log 10 health metrics', 'activity', 15, 'milestone', 'metrics_logged', 10, 'bronze'),
  ('Health Analyst', 'Log 50 health metrics', 'bar-chart', 40, 'milestone', 'metrics_logged', 50, 'silver'),
  ('Metrics Master', 'Log 100 health metrics', 'trending-up', 80, 'milestone', 'metrics_logged', 100, 'gold')
ON CONFLICT DO NOTHING;

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to calculate level from points
CREATE OR REPLACE FUNCTION calculate_level(total_points INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Level formula: Level = floor(sqrt(total_points / 50)) + 1
  -- Level 1: 0-49 points
  -- Level 2: 50-199 points
  -- Level 3: 200-449 points, etc.
  RETURN FLOOR(SQRT(total_points / 50.0)) + 1;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to calculate points needed for next level
CREATE OR REPLACE FUNCTION points_to_next_level(current_points INTEGER)
RETURNS INTEGER AS $$
DECLARE
  current_level INTEGER;
  next_level INTEGER;
  points_for_next_level INTEGER;
BEGIN
  current_level := calculate_level(current_points);
  next_level := current_level + 1;
  -- Points needed for next level = (next_level - 1)^2 * 50
  points_for_next_level := POWER(next_level - 1, 2) * 50;
  RETURN points_for_next_level - current_points;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

