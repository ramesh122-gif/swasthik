import { useState, useEffect } from 'react';
import { BookOpen, Plus, Calendar, Search, Edit, Trash2, X, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import BiometricGuard from './BiometricGuard';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood_tag: string | null;
  entry_date: string;
  created_at: string;
  updated_at: string;
}

function JournalContent() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood_tag: '',
    entry_date: new Date().toISOString().split('T')[0],
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const moodTags = ['Happy', 'Grateful', 'Peaceful', 'Anxious', 'Sad', 'Angry', 'Hopeful', 'Tired', 'Energetic'];

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEntries(entries);
    } else {
      const filtered = entries.filter(
        (entry) =>
          entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEntries(filtered);
    }
  }, [searchQuery, entries]);

  const loadEntries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_archived', false)
        .order('entry_date', { ascending: false });

      if (error) throw error;

      setEntries(data || []);
      setFilteredEntries(data || []);
    } catch (error) {
      console.error('Error loading journal entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewEntry = () => {
    setEditingEntry(null);
    setFormData({
      title: '',
      content: '',
      mood_tag: '',
      entry_date: new Date().toISOString().split('T')[0],
    });
    setShowEditor(true);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setFormData({
      title: entry.title,
      content: entry.content,
      mood_tag: entry.mood_tag || '',
      entry_date: entry.entry_date,
    });
    setShowEditor(true);
  };

  const handleSaveEntry = async () => {
    if (!formData.content.trim()) {
      alert('Please write something in your journal');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (editingEntry) {
        const { error } = await supabase
          .from('journal_entries')
          .update({
            title: formData.title,
            content: formData.content,
            mood_tag: formData.mood_tag || null,
            entry_date: formData.entry_date,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingEntry.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('journal_entries').insert({
          user_id: user.id,
          title: formData.title,
          content: formData.content,
          mood_tag: formData.mood_tag || null,
          entry_date: formData.entry_date,
        });

        if (error) throw error;
      }

      await loadEntries();
      setShowEditor(false);
      setEditingEntry(null);
    } catch (error) {
      console.error('Error saving journal entry:', error);
      alert('Failed to save entry. Please try again.');
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;

      await loadEntries();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      alert('Failed to delete entry. Please try again.');
    }
  };

  const getMoodColor = (mood: string | null) => {
    if (!mood) return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
    const colors: Record<string, string> = {
      Happy: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      Grateful: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      Peaceful: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      Anxious: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
      Sad: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
      Angry: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
      Hopeful: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300',
      Tired: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
      Energetic: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    };
    return colors[mood] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (showEditor) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {editingEntry ? 'Edit Entry' : 'New Journal Entry'}
          </h1>
          <button
            onClick={() => setShowEditor(false)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.entry_date}
              onChange={(e) => setFormData({ ...formData, entry_date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Title (optional)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Give your entry a title..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              How are you feeling?
            </label>
            <div className="flex flex-wrap gap-2">
              {moodTags.map((mood) => (
                <button
                  key={mood}
                  onClick={() => setFormData({ ...formData, mood_tag: formData.mood_tag === mood ? '' : mood })}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    formData.mood_tag === mood
                      ? getMoodColor(mood)
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              What's on your mind?
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your thoughts here..."
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {formData.content.length} characters • {formData.content.split(/\s+/).filter(Boolean).length} words
            </p>
          </div>

          <button
            onClick={handleSaveEntry}
            className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            Save Entry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Personal Journal</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Your private space for reflection</p>
        </div>
        <button
          onClick={handleNewEntry}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Entry
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your journal..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
          />
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2"></div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Loading entries...</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {searchQuery ? 'No entries found' : 'Start Your Journey'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {searchQuery
                ? 'Try a different search term'
                : 'Begin documenting your thoughts, feelings, and experiences'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleNewEntry}
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Write First Entry
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-teal-500 dark:hover:border-teal-400 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(entry.entry_date)}</span>
                      {entry.mood_tag && (
                        <span className={`text-xs px-2 py-1 rounded-full ${getMoodColor(entry.mood_tag)}`}>
                          {entry.mood_tag}
                        </span>
                      )}
                    </div>
                    {entry.title && (
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">{entry.title}</h3>
                    )}
                    <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">{entry.content}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEditEntry(entry)}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(entry.id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Delete Entry?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This action cannot be undone. Your journal entry will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteEntry(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Journal() {
  return (
    <BiometricGuard>
      <JournalContent />
    </BiometricGuard>
  );
}
