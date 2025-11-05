# Bhishma AI - Product Specification Document

## Table of Contents
1. [Product Overview](#product-overview)
2. [User Personas](#user-personas)
3. [Feature Specifications](#feature-specifications)
4. [UI/UX Wireframes](#uiux-wireframes)
5. [Data Models](#data-models)
6. [API Specifications](#api-specifications)
7. [Security & Privacy](#security--privacy)
8. [Technical Architecture](#technical-architecture)
9. [Integration Points](#integration-points)
10. [Success Metrics](#success-metrics)

---

## Product Overview

### Vision Statement
Bhishma AI is a comprehensive mental health companion application that combines AI-powered emotional support, physical wellness through yoga and exercise, and professional counseling services to provide holistic mental health care.

### Core Value Proposition
- **24/7 AI Support**: Immediate emotional support through an empathetic AI chatbot
- **Holistic Wellness**: Integration of mental and physical health through yoga and exercise
- **Professional Access**: Easy booking and access to licensed mental health professionals
- **Privacy-First**: End-to-end encryption and HIPAA-compliant data handling
- **Personalized Experience**: Adaptive recommendations based on user mood and progress

### Key Features
1. **AI Chatbot** - Empathetic conversational AI for emotional support
2. **Mood Tracking** - Daily mood logging with emotion recognition
3. **Yoga & Exercise Modules** - Guided sessions for stress relief and wellness
4. **Counseling Booking** - Schedule sessions with licensed therapists
5. **Progress Analytics** - Track mental health journey over time
6. **Crisis Support** - Immediate access to crisis helplines and resources

### Target Market
- Primary: Adults aged 18-45 experiencing stress, anxiety, or depression
- Secondary: Individuals seeking preventative mental health care
- Geographic: Global, starting with English-speaking markets

---

## User Personas

### Persona 1: Sarah - The Stressed Professional
**Demographics**
- Age: 28
- Occupation: Marketing Manager
- Location: Urban area
- Tech Savviness: High

**Goals**
- Manage work-related stress
- Find quick relaxation techniques during breaks
- Track mood patterns to identify triggers

**Pain Points**
- No time for traditional therapy
- Needs immediate support during high-stress moments
- Struggles with work-life balance

**Use Case**
Sarah uses Bhishma AI during her lunch break to chat with the AI about work stress, follows a 10-minute yoga session, and tracks her mood daily to identify patterns.

### Persona 2: Michael - The College Student
**Demographics**
- Age: 21
- Occupation: University Student
- Location: College town
- Tech Savviness: Very High

**Goals**
- Deal with academic pressure and anxiety
- Find affordable mental health support
- Build healthy coping mechanisms

**Pain Points**
- Limited budget for therapy
- Stigma around seeking mental health help
- Irregular schedule makes appointments difficult

**Use Case**
Michael uses the AI chatbot late at night when anxiety peaks, explores free yoga sessions for anxiety relief, and occasionally books virtual counseling during semester breaks.

### Persona 3: Priya - The New Mother
**Demographics**
- Age: 32
- Occupation: Software Engineer (Maternity Leave)
- Location: Suburban area
- Tech Savviness: High

**Goals**
- Manage postpartum emotions
- Find support without leaving home
- Maintain physical wellness despite time constraints

**Pain Points**
- Can't easily attend in-person therapy
- Unpredictable schedule with newborn
- Feels isolated and overwhelmed

**Use Case**
Priya checks in daily with mood tracking, uses the AI chatbot for emotional validation during difficult moments, and attends virtual counseling sessions from home.

---

## Feature Specifications

### 1. AI Chatbot Module

#### 1.1 Core Functionality
- Natural language conversation interface
- Context-aware responses based on conversation history
- Emotion detection from text input
- Supportive and non-judgmental tone
- Crisis detection and appropriate resource routing

#### 1.2 Conversation Features
- **Active Listening**: Acknowledgment and validation of feelings
- **CBT Techniques**: Guided cognitive behavioral therapy exercises
- **Coping Strategies**: Personalized recommendations based on mood
- **Progress Reflection**: Review past conversations and growth
- **Resource Suggestions**: Articles, videos, and exercises based on conversation

#### 1.3 Safety Features
- Crisis keyword detection (suicide, self-harm, etc.)
- Automatic escalation to crisis resources
- Clear disclaimer: AI is not a replacement for professional help
- Regular prompts to consider professional counseling

#### 1.4 Technical Requirements
- Response time: < 2 seconds
- Conversation history: Last 30 days accessible
- Offline mode: Pre-loaded responses for basic support
- Multi-language support (Phase 2)

### 2. Mood Tracking Module

#### 2.1 Daily Check-ins
- Simple mood scale (1-10)
- Emotion selection (happy, sad, anxious, angry, calm, etc.)
- Optional notes/journal entry
- Trigger identification
- Energy level tracking

#### 2.2 Mood Analytics
- Weekly/monthly mood trends
- Correlation analysis (sleep, exercise, weather)
- Trigger pattern identification
- Mood calendar visualization
- Shareable reports for therapists

#### 2.3 Integration
- Pre-populate chatbot context with current mood
- Recommend exercises based on mood
- Notify counselor before session
- Export data for external health apps

### 3. Yoga & Exercise Module

#### 3.1 Content Library
**Yoga Sessions**
- Beginner to Advanced levels
- Duration: 5, 10, 20, 30, 45 minutes
- Focus areas: Anxiety, Stress, Sleep, Energy, Depression
- Video demonstrations with voice guidance
- Modifications for different abilities

**Exercise Programs**
- Cardio workouts for mood boost
- Breathing exercises for anxiety
- Progressive muscle relaxation
- Mindfulness meditation
- Walking meditation guides

#### 3.2 Features
- Personalized recommendations based on mood
- Progress tracking (sessions completed, time spent)
- Favorites and custom playlists
- Downloadable content for offline use
- Integration with fitness wearables

#### 3.3 Instructor Profiles
- Certified yoga instructors
- Mental health-focused training
- Diverse representation
- Instructor ratings and reviews

### 4. Counseling Session Booking

#### 4.1 Therapist Discovery
- Filter by specialization (anxiety, depression, trauma, etc.)
- Filter by language, gender, ethnicity
- View credentials and certifications
- Read therapist bios and approaches
- See availability calendar
- View ratings and reviews (verified patients only)

#### 4.2 Booking Flow
1. Browse or search therapists
2. View available time slots
3. Select session type (video, phone, chat)
4. Choose duration (30, 45, 60 minutes)
5. Confirm booking and payment
6. Receive confirmation and calendar invite
7. Pre-session questionnaire (optional)

#### 4.3 Session Types
- **Initial Consultation**: 30 minutes, discounted
- **Individual Therapy**: 45-60 minutes
- **Couples Therapy**: 60-90 minutes
- **Group Sessions**: 60 minutes
- **Crisis Support**: Immediate/priority booking

#### 4.4 Session Management
- Reschedule up to 24 hours before
- Cancel with refund (24hr notice)
- Session notes sharing (therapist to patient)
- Homework assignments
- Progress reports

#### 4.5 Virtual Session Features
- HIPAA-compliant video conferencing
- Screen sharing capability
- Secure chat during session
- Recording option (with consent)
- Background blur for privacy
- Connection quality indicator

### 5. Crisis Support Module

#### 5.1 Features
- One-tap access to crisis hotlines
- Geolocation-based emergency services
- Safety planning tool
- Emergency contact notification
- Immediate chat with crisis counselor (partner integration)
- Offline access to coping resources

#### 5.2 Crisis Detection
- AI chatbot keyword monitoring
- Mood check-in red flags
- Risk assessment questionnaire
- Proactive outreach based on patterns

---

## UI/UX Wireframes

### Design Principles
1. **Calming Aesthetic**: Soft colors, gentle animations, minimal clutter
2. **Accessibility**: WCAG 2.1 AA compliance, screen reader support
3. **Privacy by Design**: Clear data indicators, easy privacy controls
4. **Progressive Disclosure**: Simple entry points, advanced features discoverable
5. **Empathetic Language**: Warm, non-clinical tone throughout

### Color Palette
- **Primary**: Soft Teal (#4DB6AC) - Calming, trust
- **Secondary**: Warm Coral (#FF8A80) - Energy, hope
- **Accent**: Gentle Lavender (#9FA8DA) - Peace, healing
- **Neutral**: Warm Grays (#F5F5F5, #757575)
- **Success**: Soft Green (#81C784)
- **Warning**: Warm Orange (#FFB74D)
- **Error**: Muted Red (#E57373)

### Typography
- **Headings**: Inter, Semi-bold, 24-32px
- **Body**: Inter, Regular, 16px
- **Captions**: Inter, Regular, 14px
- **Line Height**: 1.6 for readability

### Navigation Structure
```
Bottom Navigation (Primary)
├── Home (Dashboard)
├── Chat (AI Chatbot)
├── Wellness (Yoga & Exercise)
├── Sessions (Counseling)
└── Profile
```

### Screen Wireframes

#### 1. Home Dashboard
```
┌─────────────────────────────────────┐
│  Good morning, Sarah        [☰]     │
│  How are you feeling today?         │
│                                      │
│  ┌──────────────────────────────┐  │
│  │  😊  😐  😔  😰  😡         │  │
│  │  [Quick Mood Check-in]        │  │
│  └──────────────────────────────┘  │
│                                      │
│  Your Daily Insights                 │
│  ┌─────────┐ ┌─────────┐           │
│  │ Mood    │ │ Sleep   │           │
│  │ Trend   │ │ Quality │           │
│  │ [Chart] │ │ [Stat]  │           │
│  └─────────┘ └─────────┘           │
│                                      │
│  Recommended for You                 │
│  ┌──────────────────────────────┐  │
│  │ [Video] 10-min Morning Yoga   │  │
│  │ Boost your mood               │  │
│  └──────────────────────────────┘  │
│                                      │
│  ┌──────────────────────────────┐  │
│  │ Continue your conversation     │  │
│  │ with Bhishma AI               │  │
│  │ [Continue Chat →]             │  │
│  └──────────────────────────────┘  │
│                                      │
│  Upcoming Sessions                   │
│  Dr. Smith - Tomorrow at 2:00 PM    │
│  [View Details]                      │
└─────────────────────────────────────┘
```

#### 2. AI Chatbot Interface
```
┌─────────────────────────────────────┐
│  ← Bhishma AI                 [⋮]   │
│  Online • Here to listen            │
├─────────────────────────────────────┤
│                                      │
│         Hey Sarah, I'm here.        │
│         How are you feeling?   ●●●  │
│                                      │
│  I'm feeling really stressed    ●●● │
│  about work today                   │
│                            10:23 AM │
│                                      │
│         I hear you. Work stress ●●● │
│         can be overwhelming.        │
│         What specifically is        │
│         weighing on you?       ●●●  │
│                            10:23 AM │
│                                      │
│  [Type your message...]       [🎤] │
│                                      │
│  Quick Actions:                      │
│  [Breathing Exercise] [Resources]   │
└─────────────────────────────────────┘
```

#### 3. Yoga & Exercise Library
```
┌─────────────────────────────────────┐
│  ← Wellness                   [🔍]  │
│                                      │
│  [For You] [Yoga] [Exercise] [Audio]│
│                                      │
│  Based on your mood: Anxious         │
│                                      │
│  ┌──────────────────────────────┐  │
│  │ [▶]  Calming Yoga Flow       │  │
│  │      15 min • Beginner        │  │
│  │      ⭐ 4.8 (234 reviews)     │  │
│  └──────────────────────────────┘  │
│                                      │
│  ┌──────────────────────────────┐  │
│  │ [▶]  Anxiety Relief Breathing│  │
│  │      5 min • All Levels       │  │
│  │      ⭐ 4.9 (567 reviews)     │  │
│  └──────────────────────────────┘  │
│                                      │
│  Popular This Week                   │
│  ┌────────┐ ┌────────┐ ┌────────┐ │
│  │[Thumb] │ │[Thumb] │ │[Thumb] │ │
│  │Morning │ │Stress  │ │Sleep   │ │
│  │Yoga    │ │Relief  │ │Better  │ │
│  │15 min  │ │10 min  │ │20 min  │ │
│  └────────┘ └────────┘ └────────┘ │
└─────────────────────────────────────┘
```

#### 4. Therapist Booking
```
┌─────────────────────────────────────┐
│  ← Find a Therapist          [⚙]   │
│                                      │
│  [Search therapists...]      [🔍]  │
│                                      │
│  Filters: [Anxiety] [×]             │
│          [Video Sessions] [×]       │
│                                      │
│  ┌──────────────────────────────┐  │
│  │ [Photo] Dr. Emma Williams     │  │
│  │         Licensed Therapist    │  │
│  │         Anxiety, Depression   │  │
│  │         ⭐ 4.9 (89 reviews)   │  │
│  │         Next: Tomorrow 2PM    │  │
│  │         [View Profile]        │  │
│  └──────────────────────────────┘  │
│                                      │
│  ┌──────────────────────────────┐  │
│  │ [Photo] Dr. James Chen        │  │
│  │         Clinical Psychologist │  │
│  │         Trauma, PTSD          │  │
│  │         ⭐ 5.0 (124 reviews)  │  │
│  │         Next: Thu 10AM        │  │
│  │         [View Profile]        │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

#### 5. Mood Tracking
```
┌─────────────────────────────────────┐
│  ← Daily Check-in                   │
│                                      │
│  How are you feeling today?         │
│                                      │
│  ┌─────────────────────────────┐   │
│  │  😊   😌   😐   😔   😰   │   │
│  │ Great Good  Okay  Low Anxious│   │
│  │              [😐 Selected]    │   │
│  └─────────────────────────────┘   │
│                                      │
│  Rate your mood (1-10)              │
│  ━━━━━━●━━━━━━━━━                 │
│         6                            │
│                                      │
│  What emotions are you feeling?     │
│  [Tired] [Stressed] [Worried]       │
│  [Lonely] [Hopeful] [Calm]          │
│  [Frustrated] [Content]             │
│                                      │
│  What triggered this mood?          │
│  [Work] [Relationships] [Health]    │
│  [Finances] [Family] [Other]        │
│                                      │
│  Add a note (optional)              │
│  [Text area...]                     │
│                                      │
│  [Save Check-in]                    │
└─────────────────────────────────────┘
```

#### 6. Session Video Call
```
┌─────────────────────────────────────┐
│  Session with Dr. Williams          │
│  [Camera] [Mic] [End Call]          │
│                                      │
│  ┌──────────────────────────────┐  │
│  │                                │  │
│  │    [Therapist Video Feed]      │  │
│  │                                │  │
│  │                                │  │
│  │                                │  │
│  └──────────────────────────────┘  │
│                                      │
│  ┌─────────┐  [Your Video]          │
│  │  [You]  │  22:45 elapsed          │
│  └─────────┘                         │
│                                      │
│  [Share Screen] [Chat] [Notes]      │
│                                      │
│  Connection: ●●●● Excellent         │
└─────────────────────────────────────┘
```

### Interaction Patterns

#### Mood Check-in Flow
1. User opens app → Gentle prompt appears
2. Select emoji/slider → Quick selection
3. Optional: Add details → Progressive disclosure
4. Confirmation → Visual feedback + personalized message
5. Recommendations → Based on mood

#### Crisis Detection Flow
1. Crisis keyword detected → Immediate modal
2. "Are you in crisis?" → Yes/No options
3. If Yes → Display crisis resources + call button
4. If No → Continue with support options
5. Follow-up → Check-in notification next day

#### Session Booking Flow
1. Browse therapists → Filter by needs
2. View profile → Detailed credentials
3. Select time → Calendar view
4. Choose session type → Video/phone/chat
5. Payment → Secure checkout
6. Confirmation → Email + calendar invite

---

## Data Models

### Entity Relationship Diagram
```
Users ─┬─< Mood_Entries
       ├─< Chat_Conversations ─< Chat_Messages
       ├─< Exercise_Sessions
       ├─< Counseling_Bookings ─> Therapists
       ├─< User_Progress
       └─< Crisis_Events

Therapists ─┬─< Therapist_Availability
            ├─< Therapist_Specializations
            ├─< Therapist_Reviews
            └─< Counseling_Bookings

Exercises ─< Exercise_Sessions
Yoga_Videos ─< Exercise_Sessions
```

### Database Schema (PostgreSQL/Supabase)

#### 1. users
```sql
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  date_of_birth date,
  gender text,
  phone_number text,
  timezone text DEFAULT 'UTC',
  emergency_contact_name text,
  emergency_contact_phone text,
  onboarding_completed boolean DEFAULT false,
  profile_picture_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_active_at timestamptz,

  -- Privacy settings
  data_sharing_consent boolean DEFAULT false,
  analytics_consent boolean DEFAULT true,

  -- Subscription
  subscription_tier text DEFAULT 'free', -- free, premium, enterprise
  subscription_expires_at timestamptz,

  CONSTRAINT valid_gender CHECK (gender IN ('male', 'female', 'non-binary', 'other', 'prefer-not-to-say')),
  CONSTRAINT valid_subscription CHECK (subscription_tier IN ('free', 'premium', 'enterprise'))
);
```

#### 2. mood_entries
```sql
CREATE TABLE mood_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  mood_score integer NOT NULL, -- 1-10 scale
  emotions text[] DEFAULT '{}', -- array of emotion tags
  triggers text[] DEFAULT '{}', -- array of trigger tags
  notes text,
  energy_level integer, -- 1-5 scale
  sleep_quality integer, -- 1-5 scale
  created_at timestamptz DEFAULT now(),

  CONSTRAINT valid_mood_score CHECK (mood_score >= 1 AND mood_score <= 10),
  CONSTRAINT valid_energy CHECK (energy_level >= 1 AND energy_level <= 5),
  CONSTRAINT valid_sleep CHECK (sleep_quality >= 1 AND sleep_quality <= 5)
);

CREATE INDEX idx_mood_entries_user_date ON mood_entries(user_id, created_at DESC);
```

#### 3. chat_conversations
```sql
CREATE TABLE chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text, -- auto-generated from first message
  started_at timestamptz DEFAULT now(),
  last_message_at timestamptz DEFAULT now(),
  message_count integer DEFAULT 0,
  crisis_detected boolean DEFAULT false,
  archived boolean DEFAULT false
);

CREATE INDEX idx_conversations_user ON chat_conversations(user_id, last_message_at DESC);
```

#### 4. chat_messages
```sql
CREATE TABLE chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES chat_conversations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL, -- 'user' or 'assistant'
  content text NOT NULL,
  detected_emotion text, -- AI-detected emotion from user message
  crisis_keywords text[], -- if any detected
  created_at timestamptz DEFAULT now(),

  CONSTRAINT valid_role CHECK (role IN ('user', 'assistant'))
);

CREATE INDEX idx_messages_conversation ON chat_messages(conversation_id, created_at ASC);
```

#### 5. exercises
```sql
CREATE TABLE exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text NOT NULL, -- yoga, breathing, meditation, cardio, etc.
  difficulty_level text NOT NULL, -- beginner, intermediate, advanced
  duration_minutes integer NOT NULL,
  video_url text,
  thumbnail_url text,
  instructor_name text,
  focus_areas text[] DEFAULT '{}', -- anxiety, stress, sleep, energy, etc.
  instructions jsonb, -- step-by-step instructions
  equipment_needed text[] DEFAULT '{}',
  calories_burned integer,
  rating_average decimal(3,2) DEFAULT 0,
  rating_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  is_premium boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  CONSTRAINT valid_type CHECK (type IN ('yoga', 'breathing', 'meditation', 'cardio', 'strength', 'stretching')),
  CONSTRAINT valid_difficulty CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced'))
);

CREATE INDEX idx_exercises_type_difficulty ON exercises(type, difficulty_level);
CREATE INDEX idx_exercises_focus ON exercises USING gin(focus_areas);
```

#### 6. exercise_sessions
```sql
CREATE TABLE exercise_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  exercise_id uuid REFERENCES exercises(id) ON DELETE SET NULL,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  duration_minutes integer,
  completed boolean DEFAULT false,
  user_rating integer, -- 1-5 stars
  user_feedback text,
  mood_before integer, -- 1-10
  mood_after integer, -- 1-10

  CONSTRAINT valid_rating CHECK (user_rating >= 1 AND user_rating <= 5),
  CONSTRAINT valid_mood_before CHECK (mood_before >= 1 AND mood_before <= 10),
  CONSTRAINT valid_mood_after CHECK (mood_after >= 1 AND mood_after <= 10)
);

CREATE INDEX idx_exercise_sessions_user ON exercise_sessions(user_id, started_at DESC);
```

#### 7. therapists
```sql
CREATE TABLE therapists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE, -- if therapist also has user account
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone_number text,
  bio text,
  profile_picture_url text,
  credentials text[] DEFAULT '{}', -- PhD, LCSW, etc.
  license_number text NOT NULL,
  license_state text,
  years_of_experience integer,
  specializations text[] DEFAULT '{}',
  languages text[] DEFAULT '{"English"}',
  approach text, -- CBT, DBT, psychodynamic, etc.
  session_types text[] DEFAULT '{"video"}', -- video, phone, chat
  base_rate_per_hour decimal(10,2) NOT NULL,
  accepts_insurance boolean DEFAULT false,
  insurance_providers text[] DEFAULT '{}',
  rating_average decimal(3,2) DEFAULT 0,
  rating_count integer DEFAULT 0,
  total_sessions integer DEFAULT 0,
  is_accepting_patients boolean DEFAULT true,
  is_verified boolean DEFAULT false,
  timezone text DEFAULT 'UTC',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_therapists_specializations ON therapists USING gin(specializations);
CREATE INDEX idx_therapists_accepting ON therapists(is_accepting_patients, is_verified);
```

#### 8. therapist_availability
```sql
CREATE TABLE therapist_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id uuid REFERENCES therapists(id) ON DELETE CASCADE NOT NULL,
  day_of_week integer NOT NULL, -- 0-6 (Sunday-Saturday)
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_active boolean DEFAULT true,

  CONSTRAINT valid_day CHECK (day_of_week >= 0 AND day_of_week <= 6),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

CREATE INDEX idx_availability_therapist ON therapist_availability(therapist_id, day_of_week);
```

#### 9. counseling_bookings
```sql
CREATE TABLE counseling_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  therapist_id uuid REFERENCES therapists(id) ON DELETE CASCADE NOT NULL,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 60,
  session_type text NOT NULL, -- video, phone, chat
  status text NOT NULL DEFAULT 'scheduled', -- scheduled, completed, cancelled, no-show
  cancellation_reason text,
  cancelled_at timestamptz,
  cancelled_by text, -- user, therapist, system

  -- Session details
  video_room_url text,
  session_notes text, -- therapist notes (encrypted)
  homework_assigned text,
  next_session_recommended timestamptz,

  -- Payment
  amount_paid decimal(10,2),
  payment_status text DEFAULT 'pending', -- pending, paid, refunded
  payment_method text,
  transaction_id text,

  -- Pre-session
  pre_session_questionnaire jsonb,
  user_concerns text,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  CONSTRAINT valid_session_type CHECK (session_type IN ('video', 'phone', 'chat')),
  CONSTRAINT valid_status CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no-show')),
  CONSTRAINT valid_payment_status CHECK (payment_status IN ('pending', 'paid', 'refunded'))
);

CREATE INDEX idx_bookings_user ON counseling_bookings(user_id, scheduled_at DESC);
CREATE INDEX idx_bookings_therapist ON counseling_bookings(therapist_id, scheduled_at ASC);
CREATE INDEX idx_bookings_upcoming ON counseling_bookings(scheduled_at) WHERE status = 'scheduled';
```

#### 10. therapist_reviews
```sql
CREATE TABLE therapist_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES counseling_bookings(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  therapist_id uuid REFERENCES therapists(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL, -- 1-5 stars
  review_text text,
  would_recommend boolean,
  created_at timestamptz DEFAULT now(),

  CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5),
  UNIQUE(booking_id) -- one review per booking
);

CREATE INDEX idx_reviews_therapist ON therapist_reviews(therapist_id, created_at DESC);
```

#### 11. crisis_events
```sql
CREATE TABLE crisis_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  event_type text NOT NULL, -- chat_detection, mood_red_flag, user_reported
  severity text NOT NULL, -- low, medium, high, critical
  source text NOT NULL, -- chatbot, mood_tracker, manual
  details jsonb, -- context about the event
  keywords_detected text[],

  -- Response
  resources_provided text[],
  hotline_called boolean DEFAULT false,
  emergency_contact_notified boolean DEFAULT false,
  follow_up_required boolean DEFAULT true,
  follow_up_completed boolean DEFAULT false,
  follow_up_at timestamptz,

  resolved boolean DEFAULT false,
  resolved_at timestamptz,
  resolution_notes text,

  created_at timestamptz DEFAULT now(),

  CONSTRAINT valid_event_type CHECK (event_type IN ('chat_detection', 'mood_red_flag', 'user_reported')),
  CONSTRAINT valid_severity CHECK (severity IN ('low', 'medium', 'high', 'critical'))
);

CREATE INDEX idx_crisis_events_user ON crisis_events(user_id, created_at DESC);
CREATE INDEX idx_crisis_events_unresolved ON crisis_events(follow_up_at) WHERE NOT resolved;
```

#### 12. user_progress
```sql
CREATE TABLE user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  week_start_date date NOT NULL,

  -- Engagement metrics
  chat_sessions_count integer DEFAULT 0,
  exercise_sessions_count integer DEFAULT 0,
  exercise_minutes integer DEFAULT 0,
  mood_entries_count integer DEFAULT 0,
  counseling_sessions_count integer DEFAULT 0,

  -- Mood metrics
  avg_mood_score decimal(3,2),
  mood_variance decimal(5,2),
  positive_days integer DEFAULT 0,

  -- Streak
  current_streak_days integer DEFAULT 0,
  longest_streak_days integer DEFAULT 0,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(user_id, week_start_date)
);

CREATE INDEX idx_progress_user ON user_progress(user_id, week_start_date DESC);
```

#### 13. notifications
```sql
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL, -- reminder, booking, milestone, system
  title text NOT NULL,
  message text NOT NULL,
  action_url text,
  priority text DEFAULT 'normal', -- low, normal, high, urgent

  read boolean DEFAULT false,
  read_at timestamptz,

  sent_via text[] DEFAULT '{}', -- push, email, sms
  scheduled_for timestamptz,
  sent_at timestamptz,

  created_at timestamptz DEFAULT now(),

  CONSTRAINT valid_type CHECK (type IN ('reminder', 'booking', 'milestone', 'system', 'crisis')),
  CONSTRAINT valid_priority CHECK (priority IN ('low', 'normal', 'high', 'urgent'))
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE NOT read;
```

#### 14. safety_plans
```sql
CREATE TABLE safety_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,

  -- Warning signs
  warning_signs text[],

  -- Coping strategies
  internal_coping_strategies text[],
  distraction_activities text[],

  -- Support contacts
  people_to_contact jsonb, -- [{name, phone, relationship}]

  -- Professional contacts
  therapist_contact jsonb,
  crisis_services jsonb,

  -- Environment safety
  safe_environment_steps text[],

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(user_id)
);
```

---

## API Specifications

### API Architecture
- **Protocol**: RESTful API + WebSockets (for chat)
- **Base URL**: `https://api.bhishma-ai.com/v1`
- **Authentication**: JWT Bearer tokens
- **Rate Limiting**: 100 requests/minute per user
- **Response Format**: JSON

### Authentication Endpoints

#### POST /auth/signup
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "date_of_birth": "1995-05-15"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe"
  },
  "access_token": "jwt_token",
  "refresh_token": "refresh_token"
}
```

#### POST /auth/login
Authenticate existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe"
  },
  "access_token": "jwt_token",
  "refresh_token": "refresh_token"
}
```

#### POST /auth/refresh
Refresh access token.

**Request Body:**
```json
{
  "refresh_token": "refresh_token"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "new_jwt_token"
}
```

### User Profile Endpoints

#### GET /users/me
Get current user profile.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "date_of_birth": "1995-05-15",
  "profile_picture_url": "https://...",
  "subscription_tier": "premium",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### PATCH /users/me
Update user profile.

**Request Body:**
```json
{
  "full_name": "John Smith",
  "timezone": "America/New_York",
  "emergency_contact_name": "Jane Doe",
  "emergency_contact_phone": "+1234567890"
}
```

**Response:** `200 OK`

### Mood Tracking Endpoints

#### POST /mood-entries
Create a new mood entry.

**Request Body:**
```json
{
  "mood_score": 7,
  "emotions": ["happy", "content", "calm"],
  "triggers": ["work", "exercise"],
  "energy_level": 4,
  "sleep_quality": 5,
  "notes": "Had a productive day at work"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "mood_score": 7,
  "emotions": ["happy", "content", "calm"],
  "created_at": "2024-01-01T10:00:00Z"
}
```

#### GET /mood-entries
Get mood history.

**Query Parameters:**
- `start_date`: ISO date (optional)
- `end_date`: ISO date (optional)
- `limit`: number (default: 30)

**Response:** `200 OK`
```json
{
  "entries": [
    {
      "id": "uuid",
      "mood_score": 7,
      "emotions": ["happy", "content"],
      "created_at": "2024-01-01T10:00:00Z"
    }
  ],
  "analytics": {
    "average_mood": 6.8,
    "most_common_emotion": "content",
    "trend": "improving"
  }
}
```

#### GET /mood-entries/analytics
Get detailed mood analytics.

**Query Parameters:**
- `period`: "week" | "month" | "year"

**Response:** `200 OK`
```json
{
  "period": "month",
  "average_mood": 6.8,
  "mood_distribution": {
    "1-3": 5,
    "4-6": 12,
    "7-10": 13
  },
  "common_emotions": [
    {"emotion": "content", "count": 15},
    {"emotion": "anxious", "count": 8}
  ],
  "common_triggers": [
    {"trigger": "work", "count": 12},
    {"trigger": "sleep", "count": 7}
  ],
  "daily_trends": [
    {"date": "2024-01-01", "avg_mood": 7.5},
    {"date": "2024-01-02", "avg_mood": 6.8}
  ]
}
```

### AI Chatbot Endpoints

#### WebSocket /chat/ws
Real-time chat connection.

**Connection:** `wss://api.bhishma-ai.com/v1/chat/ws?token={jwt_token}`

**Client Message:**
```json
{
  "type": "message",
  "conversation_id": "uuid",
  "content": "I'm feeling really stressed today"
}
```

**Server Response:**
```json
{
  "type": "message",
  "role": "assistant",
  "content": "I hear you. Stress can be really overwhelming...",
  "detected_emotion": "stressed",
  "suggested_actions": [
    {
      "type": "exercise",
      "title": "5-Minute Breathing Exercise",
      "id": "uuid"
    }
  ]
}
```

#### POST /chat/conversations
Start a new conversation.

**Request Body:**
```json
{
  "initial_message": "I need someone to talk to"
}
```

**Response:** `201 Created`
```json
{
  "conversation_id": "uuid",
  "started_at": "2024-01-01T10:00:00Z"
}
```

#### GET /chat/conversations
Get conversation history.

**Query Parameters:**
- `limit`: number (default: 20)
- `offset`: number (default: 0)

**Response:** `200 OK`
```json
{
  "conversations": [
    {
      "id": "uuid",
      "title": "Stress and anxiety conversation",
      "last_message_at": "2024-01-01T10:30:00Z",
      "message_count": 15,
      "crisis_detected": false
    }
  ],
  "total": 45
}
```

#### GET /chat/conversations/:id/messages
Get messages from a conversation.

**Response:** `200 OK`
```json
{
  "messages": [
    {
      "id": "uuid",
      "role": "user",
      "content": "I'm feeling stressed",
      "created_at": "2024-01-01T10:00:00Z"
    },
    {
      "id": "uuid",
      "role": "assistant",
      "content": "I understand. Tell me more...",
      "created_at": "2024-01-01T10:00:15Z"
    }
  ]
}
```

### Exercise Endpoints

#### GET /exercises
Get exercise library.

**Query Parameters:**
- `type`: "yoga" | "breathing" | "meditation" | "cardio"
- `difficulty`: "beginner" | "intermediate" | "advanced"
- `duration_max`: number (minutes)
- `focus_area`: string (e.g., "anxiety", "stress")
- `limit`: number (default: 20)
- `offset`: number (default: 0)

**Response:** `200 OK`
```json
{
  "exercises": [
    {
      "id": "uuid",
      "title": "Morning Yoga Flow",
      "type": "yoga",
      "difficulty_level": "beginner",
      "duration_minutes": 15,
      "video_url": "https://...",
      "thumbnail_url": "https://...",
      "instructor_name": "Sarah Johnson",
      "focus_areas": ["stress", "energy"],
      "rating_average": 4.8,
      "rating_count": 234,
      "is_premium": false
    }
  ],
  "total": 156
}
```

#### GET /exercises/:id
Get exercise details.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "title": "Morning Yoga Flow",
  "description": "Start your day with gentle stretches...",
  "type": "yoga",
  "difficulty_level": "beginner",
  "duration_minutes": 15,
  "video_url": "https://...",
  "thumbnail_url": "https://...",
  "instructor_name": "Sarah Johnson",
  "focus_areas": ["stress", "energy"],
  "instructions": {
    "steps": [
      {
        "step": 1,
        "title": "Mountain Pose",
        "duration_seconds": 30,
        "description": "Stand tall with feet together..."
      }
    ]
  },
  "equipment_needed": ["yoga mat"],
  "rating_average": 4.8,
  "rating_count": 234
}
```

#### POST /exercise-sessions
Start an exercise session.

**Request Body:**
```json
{
  "exercise_id": "uuid",
  "mood_before": 5
}
```

**Response:** `201 Created`
```json
{
  "session_id": "uuid",
  "started_at": "2024-01-01T10:00:00Z"
}
```

#### PATCH /exercise-sessions/:id
Complete an exercise session.

**Request Body:**
```json
{
  "completed": true,
  "mood_after": 8,
  "user_rating": 5,
  "user_feedback": "Really helped me feel better!"
}
```

**Response:** `200 OK`

#### GET /exercise-sessions
Get user's exercise history.

**Query Parameters:**
- `start_date`: ISO date
- `end_date`: ISO date
- `limit`: number

**Response:** `200 OK`
```json
{
  "sessions": [
    {
      "id": "uuid",
      "exercise": {
        "title": "Morning Yoga Flow",
        "duration_minutes": 15
      },
      "started_at": "2024-01-01T10:00:00Z",
      "completed": true,
      "mood_before": 5,
      "mood_after": 8
    }
  ],
  "stats": {
    "total_sessions": 45,
    "total_minutes": 680,
    "avg_mood_improvement": 2.3
  }
}
```

### Therapist Endpoints

#### GET /therapists
Search for therapists.

**Query Parameters:**
- `specialization`: string (e.g., "anxiety", "depression")
- `language`: string
- `session_type`: "video" | "phone" | "chat"
- `accepts_insurance`: boolean
- `min_rating`: number (1-5)
- `availability_date`: ISO date
- `limit`: number (default: 20)
- `offset`: number (default: 0)

**Response:** `200 OK`
```json
{
  "therapists": [
    {
      "id": "uuid",
      "full_name": "Dr. Emma Williams",
      "credentials": ["PhD", "Licensed Psychologist"],
      "specializations": ["anxiety", "depression", "CBT"],
      "years_of_experience": 12,
      "languages": ["English", "Spanish"],
      "session_types": ["video", "phone"],
      "base_rate_per_hour": 150.00,
      "rating_average": 4.9,
      "rating_count": 89,
      "next_available": "2024-01-15T14:00:00Z",
      "profile_picture_url": "https://...",
      "bio": "Specializing in anxiety and depression..."
    }
  ],
  "total": 34
}
```

#### GET /therapists/:id
Get therapist details.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "full_name": "Dr. Emma Williams",
  "credentials": ["PhD", "Licensed Psychologist"],
  "license_number": "PSY12345",
  "specializations": ["anxiety", "depression", "CBT"],
  "years_of_experience": 12,
  "bio": "I have been practicing for over 12 years...",
  "approach": "I use evidence-based CBT techniques...",
  "languages": ["English", "Spanish"],
  "session_types": ["video", "phone"],
  "base_rate_per_hour": 150.00,
  "accepts_insurance": true,
  "insurance_providers": ["BlueCross", "Aetna"],
  "rating_average": 4.9,
  "rating_count": 89,
  "total_sessions": 456,
  "reviews": [
    {
      "rating": 5,
      "review_text": "Dr. Williams is amazing...",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### GET /therapists/:id/availability
Get therapist availability.

**Query Parameters:**
- `start_date`: ISO date (default: today)
- `end_date`: ISO date (default: +14 days)

**Response:** `200 OK`
```json
{
  "availability": [
    {
      "date": "2024-01-15",
      "slots": [
        {
          "start_time": "09:00:00",
          "end_time": "10:00:00",
          "available": true
        },
        {
          "start_time": "10:00:00",
          "end_time": "11:00:00",
          "available": false
        }
      ]
    }
  ]
}
```

### Booking Endpoints

#### POST /bookings
Create a new counseling booking.

**Request Body:**
```json
{
  "therapist_id": "uuid",
  "scheduled_at": "2024-01-15T14:00:00Z",
  "duration_minutes": 60,
  "session_type": "video",
  "user_concerns": "I've been experiencing anxiety...",
  "pre_session_questionnaire": {
    "first_time_therapy": false,
    "medications": ["Lexapro 10mg"],
    "emergency_contact": "Jane Doe - 555-0123"
  }
}
```

**Response:** `201 Created`
```json
{
  "booking_id": "uuid",
  "therapist": {
    "full_name": "Dr. Emma Williams"
  },
  "scheduled_at": "2024-01-15T14:00:00Z",
  "session_type": "video",
  "amount_paid": 150.00,
  "payment_status": "paid",
  "confirmation_code": "BHS-12345"
}
```

#### GET /bookings
Get user's bookings.

**Query Parameters:**
- `status`: "scheduled" | "completed" | "cancelled"
- `limit`: number (default: 20)

**Response:** `200 OK`
```json
{
  "bookings": [
    {
      "id": "uuid",
      "therapist": {
        "id": "uuid",
        "full_name": "Dr. Emma Williams",
        "profile_picture_url": "https://..."
      },
      "scheduled_at": "2024-01-15T14:00:00Z",
      "duration_minutes": 60,
      "session_type": "video",
      "status": "scheduled",
      "video_room_url": "https://meet.bhishma-ai.com/session-uuid"
    }
  ]
}
```

#### PATCH /bookings/:id
Update booking (reschedule/cancel).

**Request Body (Reschedule):**
```json
{
  "action": "reschedule",
  "new_scheduled_at": "2024-01-16T14:00:00Z"
}
```

**Request Body (Cancel):**
```json
{
  "action": "cancel",
  "cancellation_reason": "Schedule conflict"
}
```

**Response:** `200 OK`

#### POST /bookings/:id/review
Submit a review after session.

**Request Body:**
```json
{
  "rating": 5,
  "review_text": "Dr. Williams was incredibly helpful...",
  "would_recommend": true
}
```

**Response:** `201 Created`

### Progress & Analytics Endpoints

#### GET /progress/dashboard
Get user's progress dashboard.

**Response:** `200 OK`
```json
{
  "current_streak": 7,
  "longest_streak": 14,
  "week_summary": {
    "chat_sessions": 5,
    "exercise_minutes": 120,
    "mood_entries": 7,
    "counseling_sessions": 1,
    "avg_mood": 7.2
  },
  "month_summary": {
    "chat_sessions": 18,
    "exercise_minutes": 450,
    "mood_entries": 28,
    "counseling_sessions": 3,
    "avg_mood": 6.8,
    "mood_trend": "improving"
  },
  "achievements": [
    {
      "title": "Week Warrior",
      "description": "Logged mood for 7 days straight",
      "earned_at": "2024-01-07T00:00:00Z"
    }
  ]
}
```

#### GET /progress/insights
Get AI-generated insights.

**Response:** `200 OK`
```json
{
  "insights": [
    {
      "type": "mood_pattern",
      "title": "Your mood improves after exercise",
      "description": "We noticed your mood scores are 2.3 points higher after yoga sessions",
      "recommendation": "Try scheduling yoga in the morning for better days"
    },
    {
      "type": "trigger_alert",
      "title": "Work stress pattern detected",
      "description": "Your mood drops on Mondays and Wednesdays",
      "recommendation": "Consider scheduling therapy sessions on Tuesday mornings"
    }
  ]
}
```

### Crisis Support Endpoints

#### POST /crisis/report
Report a crisis situation.

**Request Body:**
```json
{
  "severity": "high",
  "description": "Having thoughts of self-harm",
  "immediate_danger": true
}
```

**Response:** `200 OK`
```json
{
  "crisis_id": "uuid",
  "hotlines": [
    {
      "name": "National Suicide Prevention Lifeline",
      "phone": "988",
      "available_24_7": true
    },
    {
      "name": "Crisis Text Line",
      "text": "HOME to 741741",
      "available_24_7": true
    }
  ],
  "emergency_services": {
    "police": "911",
    "ambulance": "911"
  },
  "safety_plan": {
    "id": "uuid",
    "coping_strategies": ["..."]
  }
}
```

#### GET /crisis/resources
Get crisis resources.

**Response:** `200 OK`
```json
{
  "hotlines": [...],
  "local_resources": [...],
  "articles": [...]
}
```

---

## Security & Privacy

### Data Protection

#### Encryption
- **In Transit**: TLS 1.3 for all API communications
- **At Rest**: AES-256 encryption for database
- **End-to-End**: Session notes and sensitive messages encrypted
- **Key Management**: AWS KMS for key storage and rotation

#### Data Retention
- **Chat Messages**: 90 days (user can extend or delete)
- **Mood Entries**: Indefinite (user-controlled)
- **Session Notes**: 7 years (regulatory requirement)
- **Video Recordings**: 30 days (with explicit consent only)
- **Deleted Data**: Permanent deletion after 30-day grace period

#### User Rights
- **Access**: Download all personal data
- **Rectification**: Update any personal information
- **Erasure**: Right to be forgotten (except legal holds)
- **Portability**: Export data in JSON/CSV format
- **Consent**: Granular consent for each data use

### Compliance

#### HIPAA Compliance
- **Business Associate Agreements**: With all third-party services
- **Audit Logs**: All PHI access logged and monitored
- **Access Controls**: Role-based access with MFA
- **Breach Notification**: Automated breach detection and notification
- **Risk Analysis**: Annual security risk assessments

#### GDPR Compliance
- **Data Processing Agreement**: Clear purpose for data collection
- **Consent Management**: Explicit opt-in for all data uses
- **Data Protection Officer**: Designated privacy contact
- **Impact Assessments**: DPIA for high-risk processing
- **Cross-Border Transfers**: Standard Contractual Clauses

#### Additional Standards
- **SOC 2 Type II**: Annual certification
- **ISO 27001**: Information security management
- **PCI DSS**: Payment card data security

### Authentication & Authorization

#### Multi-Factor Authentication
- **SMS**: Text message codes
- **Authenticator Apps**: TOTP (Time-based OTP)
- **Biometric**: Face ID / Touch ID on mobile
- **Required For**: Payment changes, data exports, counseling access

#### Session Management
- **Access Token**: Short-lived (15 minutes)
- **Refresh Token**: Long-lived (30 days), rotating
- **Device Tracking**: Log all active sessions
- **Forced Logout**: Suspicious activity detection

#### Role-Based Access
```
User Roles:
├── Patient (default)
│   ├── Own data: full access
│   ├── Therapist data: read-only (public profiles)
│   └── Other users: no access
│
├── Therapist
│   ├── Own data: full access
│   ├── Assigned patients: read/write session notes
│   └── Other users: no access
│
├── Admin
│   ├── User management: full access
│   ├── Content management: full access
│   ├── Analytics: aggregated only
│   └── PHI: no access without explicit reason
│
└── Support
    ├── User accounts: read-only
    ├── Troubleshooting: limited access
    └── PHI: redacted view only
```

### API Security

#### Rate Limiting
```
Tier-based limits:
- Free: 100 requests/minute
- Premium: 500 requests/minute
- Therapist: 1000 requests/minute
- Admin: 5000 requests/minute

Exceeded limits: HTTP 429 with Retry-After header
```

#### Input Validation
- **SQL Injection**: Parameterized queries only
- **XSS**: Content Security Policy + sanitization
- **CSRF**: Token validation on state-changing operations
- **File Uploads**: Type validation, size limits, virus scanning

#### API Keys & Secrets
- **Environment Variables**: Never in code
- **Rotation**: Quarterly rotation of all secrets
- **Secrets Manager**: AWS Secrets Manager or HashiCorp Vault
- **Access Logs**: All secret access logged

### Monitoring & Incident Response

#### Security Monitoring
- **Intrusion Detection**: Real-time threat monitoring
- **Anomaly Detection**: ML-based behavior analysis
- **Log Analysis**: Centralized logging (ELK/Splunk)
- **Alerts**: Automated alerting for security events

#### Incident Response Plan
1. **Detection**: Automated + manual monitoring
2. **Containment**: Isolate affected systems
3. **Investigation**: Root cause analysis
4. **Remediation**: Fix vulnerabilities
5. **Notification**: User notification within 72 hours (GDPR)
6. **Review**: Post-incident review and improvements

#### Backup & Recovery
- **Database Backups**: Daily full + hourly incremental
- **Backup Encryption**: AES-256 encrypted
- **Backup Testing**: Monthly restore tests
- **Disaster Recovery**: RPO: 1 hour, RTO: 4 hours
- **Geographic Redundancy**: Multi-region backups

### Privacy Features

#### User Controls
- **Data Dashboard**: View all collected data
- **Privacy Settings**: Granular control over sharing
- **Analytics Opt-out**: Disable usage analytics
- **Data Export**: One-click export to JSON/PDF
- **Account Deletion**: Self-service with 30-day recovery

#### Anonymization
- **Research Data**: All PII removed for analytics
- **Aggregated Reports**: Minimum 10 users for any metric
- **De-identification**: HIPAA Safe Harbor method
- **Third Parties**: No PII shared without explicit consent

#### Transparency
- **Privacy Policy**: Plain language, updated quarterly
- **Data Map**: Visual representation of data flows
- **Third-Party List**: All service providers disclosed
- **Breach History**: Public disclosure of past incidents
- **Audit Reports**: Annual transparency reports

---

## Technical Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
├──────────────┬────────────────┬─────────────────────────────┤
│   Web App    │   iOS App      │    Android App              │
│   (React)    │   (Swift)      │    (Kotlin)                 │
└──────────────┴────────────────┴─────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway                             │
│   - Rate Limiting   - Authentication   - Request Routing    │
└─────────────────────────────────────────────────────────────┘
                         ▼
┌───────────────────────┬─────────────────────────────────────┐
│   Application Layer   │     Background Services             │
├───────────────────────┼─────────────────────────────────────┤
│ • REST API            │ • AI Chatbot Service                │
│ • WebSocket Server    │ • Video Conferencing Service        │
│ • GraphQL (optional)  │ • Notification Service              │
│                       │ • Analytics Pipeline                │
│                       │ • Backup Service                    │
└───────────────────────┴─────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
├──────────────┬────────────────┬─────────────────────────────┤
│  PostgreSQL  │  Redis Cache   │   S3 Storage                │
│  (Supabase)  │  (Sessions)    │   (Videos/Images)           │
└──────────────┴────────────────┴─────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  External Services                           │
├──────────────┬────────────────┬─────────────────────────────┤
│  OpenAI API  │  Twilio        │   Stripe                    │
│  (Chatbot)   │  (SMS/Video)   │   (Payments)                │
└──────────────┴────────────────┴─────────────────────────────┘
```

### Technology Stack

#### Frontend
- **Web**: React 18 + TypeScript + Vite
- **Mobile iOS**: SwiftUI + Swift
- **Mobile Android**: Jetpack Compose + Kotlin
- **State Management**: Zustand / Redux Toolkit
- **Styling**: Tailwind CSS
- **Charts**: Recharts / D3.js
- **Video**: WebRTC + Twilio Video SDK

#### Backend
- **API Framework**: Node.js + Express / Fastify
- **Language**: TypeScript
- **WebSockets**: Socket.io
- **Authentication**: Supabase Auth (JWT)
- **File Upload**: Multer + S3
- **Background Jobs**: BullMQ + Redis

#### Database
- **Primary**: PostgreSQL (Supabase)
- **Caching**: Redis
- **Search**: PostgreSQL Full-Text Search
- **File Storage**: S3-compatible (Supabase Storage)

#### AI & ML
- **Chatbot**: OpenAI GPT-4 Turbo
- **Emotion Detection**: Custom fine-tuned model
- **Recommendations**: Python + scikit-learn
- **Analytics**: Python + Pandas

#### Infrastructure
- **Hosting**: Supabase (database) + Vercel/Netlify (frontend)
- **CDN**: CloudFlare
- **Monitoring**: Sentry + DataDog
- **Logging**: Winston + CloudWatch
- **CI/CD**: GitHub Actions

#### Third-Party Services
- **Video Conferencing**: Twilio Video / Daily.co
- **SMS/Phone**: Twilio
- **Email**: SendGrid
- **Payments**: Stripe
- **Analytics**: Mixpanel + Google Analytics
- **Push Notifications**: Firebase Cloud Messaging

### Scalability Considerations

#### Horizontal Scaling
- **API Servers**: Auto-scaling groups (min: 2, max: 20)
- **WebSocket Servers**: Sticky sessions with Redis adapter
- **Background Workers**: Queue-based with multiple workers
- **Database**: Read replicas for analytics queries

#### Performance Optimization
- **Caching Strategy**:
  - API responses: 5-minute TTL
  - User profiles: 15-minute TTL
  - Exercise videos: CDN caching
  - Therapist availability: 1-minute TTL

- **Database Optimization**:
  - Indexed columns: user_id, created_at, scheduled_at
  - Partitioning: mood_entries by month
  - Connection pooling: PgBouncer

#### Load Management
- **Rate Limiting**: Redis-based sliding window
- **Circuit Breakers**: Fail fast on service degradation
- **Graceful Degradation**: Offline mode for essential features
- **CDN**: Static assets and video content

---

## Integration Points

### AI Chatbot Integration (OpenAI)

**Purpose**: Provide empathetic, context-aware responses

**Implementation**:
```typescript
// Simplified example
async function getChatbotResponse(
  conversationHistory: Message[],
  currentMood: number,
  userContext: UserContext
) {
  const systemPrompt = `You are Bhishma AI, an empathetic mental health
  support chatbot. Current user mood: ${currentMood}/10.
  Use CBT techniques and validate emotions.
  NEVER provide medical advice.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  // Crisis detection
  const crisisKeywords = detectCrisisKeywords(response);
  if (crisisKeywords.length > 0) {
    await triggerCrisisProtocol(userId, crisisKeywords);
  }

  return response;
}
```

**Safety Measures**:
- Prompt engineering to prevent harmful advice
- Output filtering for crisis keywords
- Automatic escalation to human support
- Regular prompt auditing

### Video Conferencing (Twilio)

**Purpose**: HIPAA-compliant video sessions

**Implementation**:
```typescript
// Create video room
async function createSessionRoom(bookingId: string) {
  const room = await twilioClient.video.rooms.create({
    uniqueName: `session-${bookingId}`,
    type: 'group',
    recordParticipantsOnConnect: false, // requires consent
    maxParticipants: 2,
    statusCallback: `${API_URL}/webhooks/twilio/room-status`,
  });

  // Generate access tokens
  const patientToken = generateTwilioToken(patientId, room.sid);
  const therapistToken = generateTwilioToken(therapistId, room.sid);

  return { roomSid: room.sid, patientToken, therapistToken };
}
```

**Features**:
- End-to-end encryption
- Recording only with consent
- Screen sharing capability
- Connection quality monitoring

### Payment Processing (Stripe)

**Purpose**: Secure payment for counseling sessions

**Implementation**:
```typescript
// Create payment intent
async function createBookingPayment(
  bookingId: string,
  amount: number,
  therapistId: string
) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // cents
    currency: 'usd',
    metadata: {
      booking_id: bookingId,
      therapist_id: therapistId,
    },
    transfer_data: {
      destination: therapist.stripe_account_id,
      amount: amount * 0.85 * 100, // 85% to therapist
    },
  });

  return paymentIntent.client_secret;
}
```

**Features**:
- Split payments (platform fee + therapist payment)
- Refund handling (24-hour cancellation)
- Subscription management (premium tier)
- Payment method storage

### Notification Service (Twilio + SendGrid + FCM)

**Purpose**: Multi-channel user notifications

**Notification Types**:
1. **Reminder**: Session reminders (24h, 1h before)
2. **Booking**: Confirmation, rescheduling, cancellation
3. **Milestone**: Streak achievements, progress updates
4. **System**: App updates, security alerts
5. **Crisis**: Emergency resource prompts

**Channels**:
- Push: Firebase Cloud Messaging
- Email: SendGrid templates
- SMS: Twilio (critical only)

### Analytics Integration (Mixpanel)

**Purpose**: User behavior insights and product analytics

**Tracked Events**:
- User signup/login
- Mood entry creation
- Chat session started/ended
- Exercise started/completed
- Booking created/completed
- Subscription changes

**Privacy**:
- No PII in event properties
- Anonymized user IDs
- Opt-out respected
- GDPR compliant

---

## Success Metrics

### User Engagement Metrics

#### Daily Active Users (DAU)
- **Target**: 60% of registered users
- **Measurement**: Unique users with any activity per day

#### Weekly Active Users (WAU)
- **Target**: 80% of registered users
- **Measurement**: Unique users with any activity per week

#### Feature Adoption
- **Mood Tracking**: 70% daily completion rate
- **AI Chatbot**: 50% weekly usage
- **Exercise Modules**: 40% weekly completion
- **Counseling**: 20% monthly booking rate

#### Retention Rates
- **Day 1**: > 70%
- **Day 7**: > 40%
- **Day 30**: > 25%
- **Month 6**: > 15%

### Health Outcome Metrics

#### Mood Improvement
- **Target**: 30% average mood score increase over 8 weeks
- **Measurement**: Compare first 2 weeks vs last 2 weeks of 8-week period

#### Anxiety Reduction
- **Target**: 25% reduction in self-reported anxiety symptoms
- **Measurement**: GAD-7 questionnaire at weeks 0, 4, 8

#### Depression Screening
- **Target**: 20% reduction in PHQ-9 scores
- **Measurement**: PHQ-9 questionnaire at weeks 0, 4, 8, 12

#### Crisis Event Reduction
- **Target**: 50% reduction in crisis events after first intervention
- **Measurement**: Compare crisis frequency before/after first crisis support

### Business Metrics

#### Conversion Rates
- **Free to Premium**: 5% monthly conversion
- **First Session Booking**: 25% of users within first month
- **Session Rebooking**: 60% book second session

#### Revenue Metrics
- **Monthly Recurring Revenue (MRR)**: Growth target 20% MoM
- **Average Revenue Per User (ARPU)**: $15/month
- **Customer Lifetime Value (LTV)**: $180
- **Customer Acquisition Cost (CAC)**: $60
- **LTV:CAC Ratio**: 3:1

#### Therapist Metrics
- **Therapist Retention**: > 80% year-over-year
- **Session Fill Rate**: > 70% of available slots
- **Therapist Rating**: > 4.5 average
- **Response Time**: < 24 hours for booking requests

### Operational Metrics

#### System Performance
- **API Response Time**: p95 < 500ms
- **Chatbot Response Time**: p95 < 2s
- **Video Call Quality**: < 5% drop rate
- **App Crash Rate**: < 0.1%
- **Uptime**: 99.9%

#### Support Metrics
- **First Response Time**: < 2 hours
- **Resolution Time**: < 24 hours
- **Customer Satisfaction (CSAT)**: > 4.5/5
- **Net Promoter Score (NPS)**: > 50

#### Safety Metrics
- **Crisis Response Time**: < 5 minutes
- **False Positive Crisis Detection**: < 5%
- **User Reports of Harmful AI**: 0 tolerance
- **Data Breaches**: 0 tolerance

### User Satisfaction

#### Net Promoter Score (NPS)
- **Target**: > 50 (considered excellent)
- **Survey**: Quarterly "How likely to recommend?"

#### Customer Satisfaction (CSAT)
- **Target**: > 4.5/5
- **Survey**: Post-session and feature-specific

#### App Store Ratings
- **Target**: > 4.7/5 on iOS and Android
- **Reviews**: Monitored for feedback themes

---

## Launch Plan

### Phase 1: MVP (Months 1-3)
- Core authentication and user profiles
- Basic AI chatbot with crisis detection
- Daily mood tracking
- 20 yoga/exercise videos
- Therapist directory (view only, external booking)

### Phase 2: Beta (Months 4-6)
- Integrated booking system
- Video conferencing for sessions
- Enhanced chatbot with CBT techniques
- 100+ exercise videos
- Progress analytics dashboard
- iOS and Android apps

### Phase 3: Public Launch (Months 7-9)
- Premium subscription tier
- Insurance integration
- Safety planning tool
- Group therapy sessions
- Therapist mobile app
- Marketing campaign

### Phase 4: Growth (Months 10-12)
- Multi-language support
- Corporate wellness partnerships
- Advanced analytics and insights
- Wearable device integration
- Referral program

---

## Conclusion

Bhishma AI represents a comprehensive approach to mental health care, combining the accessibility of AI-powered support with the effectiveness of professional counseling and the holistic benefits of physical wellness. By prioritizing user privacy, clinical safety, and evidence-based approaches, Bhishma AI aims to make mental health care accessible, affordable, and effective for everyone.

The platform's success will be measured not just by user engagement and revenue metrics, but by meaningful improvements in user mental health outcomes and satisfaction with their care journey.

---

**Document Version**: 1.0
**Last Updated**: January 2025
**Author**: Product Team
**Status**: Draft for Review
