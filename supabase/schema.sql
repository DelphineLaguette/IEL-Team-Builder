-- Leadership Tracker – Supabase schema
-- Run this in the Supabase SQL editor after creating your project.

CREATE TABLE reflections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,

  -- Personal info
  leader_name TEXT NOT NULL,
  email TEXT NOT NULL,
  team TEXT NOT NULL,

  -- Leadership inspiration
  quality_1 TEXT,
  quality_2 TEXT,
  quality_3 TEXT,
  admired_behaviours TEXT,

  -- Team perception (1–5)
  team_clear_direction INTEGER CHECK (team_clear_direction BETWEEN 1 AND 5),
  team_understands_purpose INTEGER CHECK (team_understands_purpose BETWEEN 1 AND 5),
  team_treated_fairly INTEGER CHECK (team_treated_fairly BETWEEN 1 AND 5),
  team_encouraged_to_grow INTEGER CHECK (team_encouraged_to_grow BETWEEN 1 AND 5),
  team_safe_to_share INTEGER CHECK (team_safe_to_share BETWEEN 1 AND 5),
  team_trusts_word INTEGER CHECK (team_trusts_word BETWEEN 1 AND 5),
  team_feel_more TEXT,

  -- Principle 1: Lead with Purpose & Clarity
  p1_rating INTEGER CHECK (p1_rating BETWEEN 1 AND 5),
  p1_evidence TEXT,

  -- Principle 2: Role-Model Our Values
  p2_rating INTEGER CHECK (p2_rating BETWEEN 1 AND 5),
  p2_evidence TEXT,

  -- Principle 3: Set High Standards & Drive Excellence
  p3_rating INTEGER CHECK (p3_rating BETWEEN 1 AND 5),
  p3_evidence TEXT,

  -- Principle 4: Enable Innovation & Progress
  p4_rating INTEGER CHECK (p4_rating BETWEEN 1 AND 5),
  p4_evidence TEXT,

  -- Principle 5: Act with Responsibility & Long-Term Perspective
  p5_rating INTEGER CHECK (p5_rating BETWEEN 1 AND 5),
  p5_evidence TEXT,

  -- Principle 6: Build Trust through Accountability
  p6_rating INTEGER CHECK (p6_rating BETWEEN 1 AND 5),
  p6_evidence TEXT,

  -- Reflection summary
  strongest_principle TEXT,
  main_development_area TEXT,
  development_area_why TEXT,
  leadership_intention TEXT
);

-- Row Level Security
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view all reflections (for the dashboard)
CREATE POLICY "Authenticated users can view all reflections"
  ON reflections FOR SELECT
  TO authenticated
  USING (true);

-- Users can insert only their own reflection
CREATE POLICY "Users can insert own reflection"
  ON reflections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update only their own reflection
CREATE POLICY "Users can update own reflection"
  ON reflections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);
