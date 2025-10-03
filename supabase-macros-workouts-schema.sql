-- Add macro_targets table
CREATE TABLE IF NOT EXISTS macro_targets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  calories INTEGER NOT NULL,
  protein DECIMAL(10, 2) NOT NULL,
  carbs DECIMAL(10, 2) NOT NULL,
  fats DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Add workout_templates table
CREATE TABLE IF NOT EXISTS workout_templates (
  id SERIAL PRIMARY KEY,
  coach_id INTEGER NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  exercises JSONB NOT NULL,
  assigned_to INTEGER[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policies
ALTER TABLE macro_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_templates ENABLE ROW LEVEL SECURITY;

-- Macro targets policies
CREATE POLICY "Coaches can view their clients' macro targets"
  ON macro_targets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM coach_clients
      WHERE coach_clients.client_id = macro_targets.user_id
    )
  );

CREATE POLICY "Coaches can set their clients' macro targets"
  ON macro_targets FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM coach_clients
      WHERE coach_clients.client_id = macro_targets.user_id
    )
  );

CREATE POLICY "Coaches can update their clients' macro targets"
  ON macro_targets FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM coach_clients
      WHERE coach_clients.client_id = macro_targets.user_id
    )
  );

CREATE POLICY "Users can view their own macro targets"
  ON macro_targets FOR SELECT
  USING (user_id = current_setting('app.user_id', true)::INTEGER);

-- Workout templates policies
CREATE POLICY "Coaches can view their own workout templates"
  ON workout_templates FOR SELECT
  USING (coach_id = current_setting('app.coach_id', true)::INTEGER);

CREATE POLICY "Coaches can create workout templates"
  ON workout_templates FOR INSERT
  WITH CHECK (coach_id = current_setting('app.coach_id', true)::INTEGER);

CREATE POLICY "Coaches can update their own workout templates"
  ON workout_templates FOR UPDATE
  USING (coach_id = current_setting('app.coach_id', true)::INTEGER);

CREATE POLICY "Coaches can delete their own workout templates"
  ON workout_templates FOR DELETE
  USING (coach_id = current_setting('app.coach_id', true)::INTEGER);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_macro_targets_user_id ON macro_targets(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_templates_coach_id ON workout_templates(coach_id);
CREATE INDEX IF NOT EXISTS idx_workout_templates_assigned_to ON workout_templates USING GIN(assigned_to);

COMMENT ON TABLE macro_targets IS 'Stores daily macro nutrition targets set by coaches for their clients';
COMMENT ON TABLE workout_templates IS 'Workout templates created by coaches that can be assigned to clients';

