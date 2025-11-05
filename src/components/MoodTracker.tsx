import { useState } from 'react';
import { Calendar as CalendarIcon, TrendingUp, Activity } from 'lucide-react';
import EmotionDetectorWidget from './EmotionDetectorWidget';

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [showAIDetection, setShowAIDetection] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);

  const moods = [
    { value: 10, emoji: '😊', label: 'Great', color: 'bg-green-500' },
    { value: 8, emoji: '😌', label: 'Good', color: 'bg-green-400' },
    { value: 6, emoji: '😐', label: 'Okay', color: 'bg-yellow-400' },
    { value: 4, emoji: '😔', label: 'Low', color: 'bg-orange-400' },
    { value: 2, emoji: '😰', label: 'Anxious', color: 'bg-red-400' },
  ];

  const emotions = [
    'Happy', 'Sad', 'Anxious', 'Angry', 'Calm', 'Stressed',
    'Tired', 'Energetic', 'Lonely', 'Hopeful', 'Frustrated', 'Content'
  ];

  const triggers = [
    'Work', 'Relationships', 'Health', 'Finances', 'Family',
    'Sleep', 'Exercise', 'Social', 'Weather', 'Other'
  ];

  const moodHistory = [
    { date: '2024-01-15', mood: 8, note: 'Had a great workout' },
    { date: '2024-01-14', mood: 6, note: 'Busy day at work' },
    { date: '2024-01-13', mood: 9, note: 'Spent time with friends' },
    { date: '2024-01-12', mood: 5, note: 'Feeling tired' },
    { date: '2024-01-11', mood: 7, note: 'Productive day' },
  ];

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleSubmit = () => {
    console.log({ mood: selectedMood, emotions: selectedEmotions, note });
    setSelectedMood(null);
    setSelectedEmotions([]);
    setNote('');
    setDetectedEmotion(null);
  };

  const handleEmotionDetected = (emotion: string) => {
    setDetectedEmotion(emotion);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Mood Tracker</h1>
        <p className="text-gray-600 mt-1">Track your emotional wellbeing</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">How are you feeling today?</h2>
          <button
            onClick={() => setShowAIDetection(!showAIDetection)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors font-semibold"
          >
            <Activity className="w-4 h-4" />
            {showAIDetection ? 'Manual Entry' : 'AI Analysis'}
          </button>
        </div>

        {showAIDetection ? (
          <div className="space-y-6">
            <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
              <p className="text-teal-800 text-sm mb-2">
                <span className="font-semibold">AI Mood Analysis:</span> We'll analyze your facial expression for 30 seconds
              </p>
            </div>

            <EmotionDetectorWidget
              autoLog={true}
              autoStart={true}
              analysisDuration={30}
              context="mood_tracker"
              onEmotionDetected={handleEmotionDetected}
            />

            {detectedEmotion && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-green-900 font-semibold">Analysis Complete!</p>
                <p className="text-green-800 text-sm mt-1">
                  Detected emotion: <span className="font-bold">{detectedEmotion}</span>
                </p>
                <p className="text-green-700 text-xs mt-2">
                  Your mood has been automatically saved to your mood history.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">Select your mood</label>
              <div className="flex justify-between gap-3">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      selectedMood === mood.value
                        ? `${mood.color} border-transparent text-white scale-105`
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <span className="text-4xl">{mood.emoji}</span>
                    <span className="text-sm font-semibold">{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {selectedMood && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    What emotions are you feeling?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {emotions.map((emotion) => (
                      <button
                        key={emotion}
                        onClick={() => toggleEmotion(emotion)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          selectedEmotions.includes(emotion)
                            ? 'bg-teal-600 text-white border-teal-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-teal-500'
                        }`}
                      >
                        {emotion}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    What triggered this mood?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {triggers.map((trigger) => (
                      <button
                        key={trigger}
                        className="px-4 py-2 rounded-lg border bg-white text-gray-700 border-gray-300 hover:border-teal-500 transition-colors"
                      >
                        {trigger}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Add a note (optional)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    rows={4}
                  ></textarea>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors font-semibold text-lg"
                >
                  Save Mood Entry
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Recent Entries</h3>
            <CalendarIcon className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {moodHistory.map((entry, idx) => {
              const moodInfo = moods.find(m => m.value === entry.mood);
              return (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{moodInfo?.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{entry.note}</p>
                    <p className="text-xs text-gray-600">{entry.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-800">{entry.mood}/10</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Insights</h3>
            <TrendingUp className="w-5 h-5 text-teal-600" />
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
              <p className="text-sm font-semibold text-teal-900 mb-1">Weekly Average</p>
              <p className="text-3xl font-bold text-teal-700">7.4/10</p>
              <p className="text-xs text-teal-600 mt-1">↑ 1.2 from last week</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-semibold text-blue-900 mb-1">Most Common Emotion</p>
              <p className="text-2xl font-bold text-blue-700">Content</p>
              <p className="text-xs text-blue-600 mt-1">Appeared in 45% of entries</p>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm font-semibold text-amber-900 mb-1">Top Trigger</p>
              <p className="text-2xl font-bold text-amber-700">Work</p>
              <p className="text-xs text-amber-600 mt-1">Consider stress management</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
