/*
  # Bhishma AI Mental Health Platform Schema

  ## Overview
  Complete database schema for Bhishma AI mental health application with real-time emotion detection,
  mood tracking, AI chat history, yoga sessions, and counseling bookings.

  ## 1. New Tables
    - `users` - User profiles and authentication data
    - `mood_entries` - Manual and AI-detected mood logs with emotion analysis
    - `emotion_detections` - Real-time facial emotion recognition data
    - `chat_conversations` - AI chatbot conversation sessions
    - `chat_messages` - Individual messages with context memory
    - `yoga_sessions` - Yoga video tutorials and wellness content
    - `user_yoga_progress` - User's yoga session history with before/after emotion
    - `therapists` - Licensed counselor profiles
    - `counseling_bookings` - Therapy session bookings with video call info
    - `user_insights` - AI-generated insights and recommendations

  ## 2. Security
    - Enable RLS on all tables
    - Users can only access their own data
    - Therapists can access assigned patient data
    - Public read access to yoga_sessions and therapists

  ## 3. Features
    - Real-time emotion detection logging
    - Conversation context for AI chatbot
    - Before/after emotion tracking for yoga
    - Secure counseling session management
    - Privacy-first data handling
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  subscription_tier text DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
  emergency_contact_name text,
  emergency_contact_phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Mood entries (manual + AI-detected)
CREATE TABLE IF NOT EXISTS mood_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  mood_score integer NOT NULL CHECK (mood_score >= 1 AND mood_score <= 10),
  emotions text[] DEFAULT '{}',
  triggers text[] DEFAULT '{}',
  notes text,
  entry_source text DEFAULT 'manual' CHECK (entry_source IN ('manual', 'ai_detected', 'yoga_session')),
  detection_confidence decimal(5,2),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_mood_entries_user_date ON mood_entries(user_id, created_at DESC);

ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own mood entries"
  ON mood_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood entries"
  ON mood_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Real-time emotion detections
CREATE TABLE IF NOT EXISTS emotion_detections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  detected_emotion text NOT NULL,
  confidence decimal(5,2) NOT NULL,
  all_emotions jsonb,
  context text,
  session_id uuid,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_emotion_detections_user ON emotion_detections(user_id, created_at DESC);

ALTER TABLE emotion_detections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own emotion detections"
  ON emotion_detections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emotion detections"
  ON emotion_detections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Chat conversations
CREATE TABLE IF NOT EXISTS chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text,
  started_at timestamptz DEFAULT now(),
  last_message_at timestamptz DEFAULT now(),
  message_count integer DEFAULT 0,
  context_summary text
);

CREATE INDEX idx_conversations_user ON chat_conversations(user_id, last_message_at DESC);

ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations"
  ON chat_conversations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON chat_conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON chat_conversations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES chat_conversations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  detected_emotion text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_messages_conversation ON chat_messages(conversation_id, created_at ASC);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Yoga sessions
CREATE TABLE IF NOT EXISTS yoga_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  duration_minutes integer NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'all_levels')),
  focus_area text NOT NULL,
  instructor_name text,
  video_url text,
  thumbnail_emoji text,
  rating_average decimal(3,2) DEFAULT 0,
  rating_count integer DEFAULT 0,
  is_premium boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_yoga_sessions_focus ON yoga_sessions(focus_area);

ALTER TABLE yoga_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view yoga sessions"
  ON yoga_sessions FOR SELECT
  TO authenticated
  USING (true);

-- User yoga progress
CREATE TABLE IF NOT EXISTS user_yoga_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  session_id uuid REFERENCES yoga_sessions(id) ON DELETE SET NULL,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  duration_minutes integer,
  emotion_before text,
  emotion_after text,
  mood_improvement integer,
  user_rating integer CHECK (user_rating >= 1 AND user_rating <= 5),
  completed boolean DEFAULT false
);

CREATE INDEX idx_user_yoga_progress ON user_yoga_progress(user_id, started_at DESC);

ALTER TABLE user_yoga_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own yoga progress"
  ON user_yoga_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own yoga progress"
  ON user_yoga_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own yoga progress"
  ON user_yoga_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Therapists
CREATE TABLE IF NOT EXISTS therapists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  title text NOT NULL,
  email text UNIQUE NOT NULL,
  bio text,
  specializations text[] DEFAULT '{}',
  experience_years integer,
  rating_average decimal(3,2) DEFAULT 0,
  review_count integer DEFAULT 0,
  session_types text[] DEFAULT '{"video"}',
  rate_per_hour integer NOT NULL,
  avatar_emoji text,
  next_available text,
  is_accepting_patients boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE therapists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view therapists"
  ON therapists FOR SELECT
  TO authenticated
  USING (is_accepting_patients = true);

-- Counseling bookings
CREATE TABLE IF NOT EXISTS counseling_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  therapist_id uuid REFERENCES therapists(id) ON DELETE CASCADE NOT NULL,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer DEFAULT 60,
  session_type text NOT NULL CHECK (session_type IN ('video', 'phone', 'chat')),
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  video_room_id text,
  session_notes text,
  amount_paid integer,
  is_free_trial boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_bookings_user ON counseling_bookings(user_id, scheduled_at DESC);
CREATE INDEX idx_bookings_therapist ON counseling_bookings(therapist_id, scheduled_at ASC);

ALTER TABLE counseling_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings"
  ON counseling_bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookings"
  ON counseling_bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON counseling_bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- User insights (AI-generated)
CREATE TABLE IF NOT EXISTS user_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  insight_type text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  recommendation text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_insights_user ON user_insights(user_id, created_at DESC);

ALTER TABLE user_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own insights"
  ON user_insights FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own insights"
  ON user_insights FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert sample yoga sessions
INSERT INTO yoga_sessions (title, description, duration_minutes, difficulty, focus_area, instructor_name, thumbnail_emoji, rating_average, rating_count) VALUES
('Morning Energy Flow', 'Start your day with energizing yoga poses', 15, 'beginner', 'energy', 'Sarah Johnson', '🌅', 4.8, 234),
('Anxiety Relief Practice', 'Gentle poses to calm your mind and body', 20, 'all_levels', 'anxiety', 'Maya Patel', '🧘', 4.9, 567),
('Stress Relief Yoga', 'Release tension and find inner peace', 30, 'intermediate', 'stress', 'David Chen', '🌿', 4.7, 189),
('Better Sleep Sequence', 'Wind down with calming stretches', 25, 'beginner', 'sleep', 'Emma Williams', '🌙', 4.9, 423),
('Mood Boost Flow', 'Uplifting practice to improve your mood', 20, 'intermediate', 'depression', 'Sarah Johnson', '☀️', 4.8, 312),
('Quick Breathing Exercise', 'Fast relief for anxious moments', 5, 'all_levels', 'anxiety', 'Maya Patel', '🌬️', 5.0, 891);

-- Insert sample therapists
INSERT INTO therapists (full_name, title, email, bio, specializations, experience_years, rating_average, review_count, session_types, rate_per_hour, avatar_emoji, next_available) VALUES
('Dr. Emma Williams', 'Licensed Psychologist', 'emma@therapists.com', 'Specializing in evidence-based CBT for anxiety and depression with over 12 years of experience.', ARRAY['Anxiety', 'Depression', 'CBT'], 12, 4.9, 89, ARRAY['video', 'phone'], 150, '👩‍⚕️', 'Tomorrow at 2:00 PM'),
('Dr. James Chen', 'Clinical Psychologist', 'james@therapists.com', 'Trauma-informed care specialist helping clients heal from PTSD and chronic stress.', ARRAY['Trauma', 'PTSD', 'Stress'], 15, 5.0, 124, ARRAY['video', 'phone', 'chat'], 175, '👨‍⚕️', 'Thursday at 10:00 AM'),
('Dr. Sarah Martinez', 'Licensed Therapist', 'sarah@therapists.com', 'Compassionate therapist focused on helping clients navigate life changes and build confidence.', ARRAY['Relationships', 'Life Transitions', 'Self-esteem'], 8, 4.8, 67, ARRAY['video', 'chat'], 120, '👩‍💼', 'Today at 4:00 PM'),
('Dr. Michael Brown', 'Psychiatrist', 'michael@therapists.com', 'Board-certified psychiatrist with expertise in medication management and mood disorders.', ARRAY['Medication Management', 'Bipolar', 'Depression'], 20, 4.9, 156, ARRAY['video', 'phone'], 200, '👨‍⚕️', 'Friday at 9:00 AM');