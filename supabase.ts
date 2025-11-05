import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface MoodEntry {
  id: string;
  user_id: string;
  mood_score: number;
  emotions: string[];
  triggers: string[];
  notes: string | null;
  entry_source: 'manual' | 'ai_detected' | 'yoga_session';
  detection_confidence: number | null;
  created_at: string;
}

export interface EmotionDetection {
  id: string;
  user_id: string;
  detected_emotion: string;
  confidence: number;
  all_emotions: Record<string, number>;
  context: string | null;
  session_id: string | null;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  detected_emotion: string | null;
  created_at: string;
}

export interface YogaSession {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  difficulty: string;
  focus_area: string;
  instructor_name: string;
  video_url: string | null;
  thumbnail_emoji: string;
  rating_average: number;
  rating_count: number;
  is_premium: boolean;
}

export interface UserYogaProgress {
  id: string;
  user_id: string;
  session_id: string;
  started_at: string;
  completed_at: string | null;
  duration_minutes: number | null;
  emotion_before: string | null;
  emotion_after: string | null;
  mood_improvement: number | null;
  user_rating: number | null;
  completed: boolean;
}

export interface Therapist {
  id: string;
  full_name: string;
  title: string;
  email: string;
  bio: string;
  specializations: string[];
  experience_years: number;
  rating_average: number;
  review_count: number;
  session_types: string[];
  rate_per_hour: number;
  avatar_emoji: string;
  next_available: string;
  is_accepting_patients: boolean;
}

export interface CounselingBooking {
  id: string;
  user_id: string;
  therapist_id: string;
  scheduled_at: string;
  duration_minutes: number;
  session_type: 'video' | 'phone' | 'chat';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  video_room_id: string | null;
  session_notes: string | null;
  amount_paid: number | null;
  is_free_trial: boolean;
}
