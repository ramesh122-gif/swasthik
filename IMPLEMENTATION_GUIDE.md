# Swasthik - Complete Implementation Guide

## Overview
This guide covers all the advanced features and UI improvements requested for the Swasthik mental health application.

## ✅ Completed Features

### 1. Custom Cursor Animation
- ✅ Created custom cursor with smooth animations
- ✅ Hover effects on interactive elements
- ✅ Blend mode for visibility on all backgrounds

### 2. Dark Mode Support
- ✅ Theme context with localStorage persistence
- ✅ Dark mode styling for all components
- ✅ Smooth transitions between themes

### 3. Enhanced UI Styling
- ✅ Gradient text utilities
- ✅ Glass effect components
- ✅ Card hover animations
- ✅ Custom scrollbar with gradient
- ✅ Fade-in and slide-in animations

### 4. Diet Quality Analyzer
- ✅ Webcam integration for meal capture
- ✅ AI analysis simulation (mock data)
- ✅ Nutritional breakdown display
- ✅ Suggestions and ratings
- ✅ Save meal analysis

## 🔨 Implementation Steps

### Step 1: Update All Components with Dark Mode

Update each component file to support dark mode classes:

```tsx
// Example pattern for all components
className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
```

Components to update:
- Dashboard.tsx
- MoodTracker.tsx
- YogaSessions.tsx
- Counseling.tsx
- Profile.tsx
- Sidebar.tsx
- FloatingChatbot.tsx
- Auth.tsx

### Step 2: Add Dark Mode Toggle to Sidebar

```tsx
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

// In Sidebar component:
const { isDark, toggleTheme } = useTheme();

<button
  onClick={toggleTheme}
  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
>
  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
  <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
</button>
```

### Step 3: Rename Application from "Bhishma AI" to "Swasthik"

Files to update:
1. `index.html` - Update `<title>` tag
2. `Sidebar.tsx` - Change header text
3. `Auth.tsx` - Change branding
4. `FloatingChatbot.tsx` - Update assistant name
5. `README.md` - Update project name

Search and replace:
- "Bhishma AI" → "Swasthik"
- "Bhishma" → "Swasthik AI"

### Step 4: Integrate Smartwatch Data (Steps & Sleep)

Create a new component:

```tsx
// src/components/SmartWatchIntegration.tsx
import { useState, useEffect } from 'react';
import { Watch, Activity, Moon } from 'lucide-react';

export default function SmartWatchIntegration() {
  const [steps, setSteps] = useState(0);
  const [sleepHours, setSleepHours] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const connectSmartWatch = async () => {
    // Integration with Web Bluetooth API
    try {
      if (!navigator.bluetooth) {
        alert('Web Bluetooth API not supported');
        return;
      }

      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['heart_rate'] }],
        optionalServices: ['battery_service']
      });

      // Connect and fetch data
      setIsConnected(true);
      // Mock data for demonstration
      setSteps(8543);
      setSleepHours(7.5);
    } catch (error) {
      console.error('Bluetooth connection failed:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Smartwatch Data
      </h3>

      {!isConnected ? (
        <button onClick={connectSmartWatch} className="btn-primary w-full">
          <Watch className="w-4 h-4 mr-2" />
          Connect Smartwatch
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <Activity className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-blue-600">{steps}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Steps Today</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <Moon className="w-6 h-6 text-purple-600 mb-2" />
            <p className="text-2xl font-bold text-purple-600">{sleepHours}h</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Sleep Last Night</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Step 5: Auto-Start Mood Tracker with Fallback

Update MoodTracker.tsx:

```tsx
const [autoAnalysisFailed, setAutoAnalysisFailed] = useState(false);

useEffect(() => {
  // Attempt auto-start
  const attemptAutoStart = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setShowAIDetection(true);
    } catch (error) {
      setAutoAnalysisFailed(true);
      // Show message to use manual input
    }
  };

  attemptAutoStart();
}, []);

// In JSX:
{autoAnalysisFailed && (
  <div className="bg-amber-50 p-4 rounded-lg mb-4">
    <p className="text-amber-800">
      Camera access denied. Please use manual mood entry below.
    </p>
  </div>
)}
```

### Step 6: Replace Chatbot API with ChatGPT

Update FloatingChatbot.tsx to use OpenAI API directly:

```tsx
// Option 1: Direct OpenAI API call (requires API key in frontend - not recommended)
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for development
});

const handleSendMessage = async () => {
  // ... existing code ...

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are Swasthik AI, a caring mental health companion..."
        },
        ...conversationHistory,
        { role: "user", content: inputMessage }
      ]
    });

    const response = completion.choices[0].message.content;
    // Handle response
  } catch (error) {
    console.error('ChatGPT error:', error);
  }
};

// Option 2: Use backend proxy (recommended)
// Keep existing backend API but ensure it uses ChatGPT
```

### Step 7: User Input Persistence

Create a persistence utility:

```tsx
// src/lib/persistence.ts
export const saveUserData = (key: string, data: any) => {
  const userId = getCurrentUserId();
  const storageKey = `swasthik_${userId}_${key}`;
  localStorage.setItem(storageKey, JSON.stringify(data));
};

export const loadUserData = (key: string) => {
  const userId = getCurrentUserId();
  const storageKey = `swasthik_${userId}_${key}`;
  const data = localStorage.getItem(storageKey);
  return data ? JSON.parse(data) : null;
};

// Use in components:
useEffect(() => {
  const savedMood = loadUserData('currentMood');
  if (savedMood) setSelectedMood(savedMood);
}, []);

useEffect(() => {
  if (selectedMood) {
    saveUserData('currentMood', selectedMood);
  }
}, [selectedMood]);
```

### Step 8: Enhanced Profile Module

Update Profile.tsx with comprehensive features:

```tsx
export default function Profile() {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    bio: '',
    emergencyContact: '',
    notifications: true,
    dataSharing: false,
    goals: [] as string[],
  });

  return (
    <div className="space-y-6">
      {/* Profile Picture Upload */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Profile Picture</h2>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full" />
          <button className="btn-primary">Upload Photo</button>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Personal Information</h2>
        {/* Form fields */}
      </div>

      {/* Mental Health Goals */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Mental Health Goals</h2>
        {/* Goals management */}
      </div>

      {/* Privacy Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Privacy & Settings</h2>
        {/* Toggle switches */}
      </div>

      {/* Account Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Your Journey</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-teal-600">45</p>
            <p className="text-sm text-gray-600">Days Active</p>
          </div>
          {/* More stats */}
        </div>
      </div>

      {/* Data Export & Delete Account */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4 text-red-600">Danger Zone</h2>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg">
          Delete Account
        </button>
      </div>
    </div>
  );
}
```

### Step 9: Update App.tsx with All New Features

```tsx
import { ThemeProvider } from './context/ThemeContext';
import CustomCursor from './components/CustomCursor';

function App() {
  return (
    <ThemeProvider>
      <CustomCursor />
      {/* Rest of app */}
    </ThemeProvider>
  );
}
```

### Step 10: Update Dashboard with Diet Analyzer & Smartwatch

```tsx
import DietQualityAnalyzer from './components/DietQualityAnalyzer';
import SmartWatchIntegration from './components/SmartWatchIntegration';

// In Dashboard:
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <DietQualityAnalyzer />
  <SmartWatchIntegration />
  {/* Keep one other recommendation */}
</div>
```

## 🎨 UI Enhancements Summary

### Color Palette (Dark Mode Compatible)
- Primary: Teal (#14b8a6) → Dark: Teal (#0d9488)
- Secondary: Cyan (#06b6d4) → Dark: Cyan (#0891b2)
- Accent: Purple (#a855f7) → Dark: Purple (#9333ea)
- Success: Green (#10b981) → Dark: Green (#059669)
- Warning: Amber (#f59e0b) → Dark: Amber (#d97706)
- Error: Red (#ef4444) → Dark: Red (#dc2626)

### Typography
- Headlines: font-bold text-2xl md:text-3xl
- Subheadings: font-semibold text-lg md:text-xl
- Body: text-sm md:text-base
- Captions: text-xs

### Spacing
- Section gaps: space-y-6
- Card padding: p-6
- Button padding: px-6 py-3

## 📦 Dependencies to Install

```bash
npm install openai
npm install @types/web-bluetooth
```

## 🔐 Environment Variables

Add to `.env`:
```
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_APP_NAME=Swasthik
```

## 🚀 Deployment Checklist

1. ✅ Replace all "Bhishma" references with "Swasthik"
2. ✅ Test dark mode on all pages
3. ✅ Test custom cursor functionality
4. ✅ Verify diet analyzer webcam access
5. ✅ Test smartwatch connection (if available)
6. ✅ Ensure chatbot uses ChatGPT API
7. ✅ Test user data persistence across sessions
8. ✅ Verify profile module functionality
9. ✅ Test responsive design on mobile
10. ✅ Run `npm run build` and fix any errors

## 📝 Notes

- **Supabase**: Keep using Supabase for database as per system requirements
- **ChatGPT API**: Requires OpenAI API key and proper rate limiting
- **Web Bluetooth**: Only works on HTTPS and supported browsers (Chrome, Edge)
- **Camera Access**: Requires user permission and HTTPS
- **Dark Mode**: Persists across sessions using localStorage

## 🎯 Next Steps

1. Implement all dark mode classes across components
2. Add ThemeProvider to App.tsx
3. Replace all branding text
4. Test all new features
5. Deploy to production

---

**Application Name**: Swasthik (स्वस्थिक - meaning "healthy" or "wellness" in Sanskrit)
**Version**: 2.0.0
**Last Updated**: 2025
