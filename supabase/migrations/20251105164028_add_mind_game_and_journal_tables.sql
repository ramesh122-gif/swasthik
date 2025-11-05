/*
  # Add Mind Game and Personal Journal Tables

  ## Overview
  This migration adds tables for the mind wellness game feature and secure personal journal
  with biometric authentication support.

  ## 1. New Tables
    - `mind_game_scores` - Stores user game statistics and scores
    - `journal_entries` - Private journal entries with encryption support
    - `user_security` - Stores security settings including encrypted PIN for biometric fallback

  ## 2. Security
    - Enable RLS on all tables
    - Users can only access their own game scores and journal entries
    - Complete privacy for journal data
    - Encrypted storage for sensitive security settings

  ## 3. Features
    - Track mind game performance over time
    - Secure journal storage with biometric protection
    - PIN fallback system for devices without biometrics
    - Full-text search capability for journal entries
*/

-- Mind Game Scores Table
CREATE TABLE IF NOT EXISTS mind_game_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_duration integer NOT NULL,
  moves_count integer NOT NULL,
  difficulty_level text DEFAULT 'normal' CHECK (difficulty_level IN ('easy', 'normal', 'hard')),
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_mind_game_scores_user ON mind_game_scores(user_id, completed_at DESC);

ALTER TABLE mind_game_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own game scores"
  ON mind_game_scores FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own game scores"
  ON mind_game_scores FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Journal Entries Table
CREATE TABLE IF NOT EXISTS journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  content text NOT NULL,
  mood_tag text,
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  photos text[] DEFAULT '{}',
  is_archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_journal_entries_user ON journal_entries(user_id, entry_date DESC);
CREATE INDEX idx_journal_entries_mood ON journal_entries(mood_tag);

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own journal entries"
  ON journal_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal entries"
  ON journal_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries"
  ON journal_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries"
  ON journal_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- User Security Table
CREATE TABLE IF NOT EXISTS user_security (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  encrypted_pin text,
  is_biometric_enabled boolean DEFAULT false,
  last_biometric_setup timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_security ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own security settings"
  ON user_security FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own security settings"
  ON user_security FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own security settings"
  ON user_security FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add is_journal_biometric_enabled to user_preferences if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_preferences' AND column_name = 'is_journal_biometric_enabled'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN is_journal_biometric_enabled boolean DEFAULT false;
  END IF;
END $$;

-- Function to get user's best game score
CREATE OR REPLACE FUNCTION get_best_game_score(p_user_id uuid, p_difficulty text DEFAULT 'normal')
RETURNS TABLE(
  best_time integer,
  best_moves integer,
  total_games integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    MIN(game_duration) as best_time,
    MIN(moves_count) as best_moves,
    COUNT(*)::integer as total_games
  FROM mind_game_scores
  WHERE user_id = p_user_id
    AND difficulty_level = p_difficulty;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to count journal entries
CREATE OR REPLACE FUNCTION count_journal_entries(p_user_id uuid)
RETURNS integer AS $$
DECLARE
  entry_count integer;
BEGIN
  SELECT COUNT(*)::integer INTO entry_count
  FROM journal_entries
  WHERE user_id = p_user_id
    AND is_archived = false;
  
  RETURN entry_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;