import { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useGroqAPI } from './hooks/useGroqAPI';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { dbService } from './services/dbService';
import type { Transcript } from './types';
import { Header } from './components/Header';
import { AudioRecorder } from './components/AudioRecorder';
import { TranscriptEditor } from './components/TranscriptEditor';
import { RateLimitDisplay } from './components/RateLimitDisplay';
import { HistoryList } from './components/HistoryList';
import { SettingsModal } from './components/SettingsModal';

function App() {
  // State Management
  const [apiKey, setApiKey] = useLocalStorage<string>('groq_api_key', '');
  const [isDark, setIsDark] = useLocalStorage<boolean>('theme_dark', false);
  const [showSettings, setShowSettings] = useState(!apiKey);
  const [selectedTranscript, setSelectedTranscript] = useState<Transcript | null>(null);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Groq API
  const { transcribe, isLoading, error, rateLimits } = useGroqAPI(apiKey || null);

  // Load transcripts on mount
  useEffect(() => {
    loadTranscripts();
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onCopy: () => selectedTranscript && navigator.clipboard.writeText(selectedTranscript.text),
    onExport: () => selectedTranscript && handleExportTranscript(),
    onDelete: () => selectedTranscript && handleDeleteTranscript(selectedTranscript.id),
    onSettings: () => setShowSettings(true),
  });

  // Apply dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const loadTranscripts = async () => {
    const all = await dbService.getAllTranscripts();
    setTranscripts(all);
  };

  const handleAudioReady = async (audioFile: Blob | File) => {
    if (!apiKey) {
      setShowSettings(true);
      return;
    }

    const result = await transcribe(audioFile);
    if (result?.text) {
      const transcript: Transcript = {
        id: crypto.randomUUID(),
        text: result.text,
        originalAudio: audioFile instanceof Blob ? audioFile : undefined,
        timestamp: Date.now(),
        duration: 0, // We don't have duration from Groq response
        language: result.language || 'unknown',
        edited: false,
      };

      await dbService.addTranscript(transcript);
      setSelectedTranscript(transcript);
      await loadTranscripts();
    }
  };

  const handleSaveTranscript = async (text: string) => {
    if (!selectedTranscript) return;

    const updated = { ...selectedTranscript, text, edited: true };
    await dbService.updateTranscript(selectedTranscript.id, updated);
    setSelectedTranscript(updated);
    await loadTranscripts();
  };

  const handleDeleteTranscript = async (id: string) => {
    await dbService.deleteTranscript(id);
    if (selectedTranscript?.id === id) {
      setSelectedTranscript(null);
    }
    await loadTranscripts();
  };

  const handleExportTranscript = () => {
    if (!selectedTranscript) return;

    const content = `Transcript
Date: ${new Date(selectedTranscript.timestamp).toLocaleString()}
Language: ${selectedTranscript.language}
Duration: ${Math.ceil(selectedTranscript.duration / 60)}m
Edited: ${selectedTranscript.edited ? 'Yes' : 'No'}

---

${selectedTranscript.text}
`;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `transcript-${selectedTranscript.id.slice(0, 8)}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const filteredTranscripts = useMemo(() => {
    if (!searchQuery) return transcripts;
    return transcripts.filter((t) =>
      t.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transcripts, searchQuery]);

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
        {/* Header */}
        <Header
          isDark={isDark}
          onThemeToggle={() => setIsDark(!isDark)}
          onSettingsClick={() => setShowSettings(true)}
        />

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          {!apiKey && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                📌 No API key configured. Click the settings icon to add your Groq API key.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Recording & Editor */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recording Section */}
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                <h2 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Record or Upload</h2>
                <AudioRecorder
                  onAudioReady={handleAudioReady}
                  isLoading={isLoading}
                  disabled={!apiKey}
                />
              </div>

              {/* Rate Limit Display */}
              {rateLimits && (
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h2 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">API Usage</h2>
                  <RateLimitDisplay rateLimits={rateLimits} />
                </div>
              )}

              {/* Transcript Editor */}
              {selectedTranscript && (
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h2 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Transcript Editor</h2>
                  <TranscriptEditor
                    text={selectedTranscript.text}
                    isLoading={isLoading}
                    onSave={handleSaveTranscript}
                    onDelete={() => handleDeleteTranscript(selectedTranscript.id)}
                    onExport={handleExportTranscript}
                  />
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    <strong>Error:</strong> {error.message}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column - History */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 shadow-sm sticky top-20">
                <h2 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">History</h2>

                {/* Search */}
                <input
                  type="text"
                  placeholder="Search transcripts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                />

                {/* Transcript List */}
                <HistoryList
                  transcripts={filteredTranscripts}
                  onSelect={setSelectedTranscript}
                  onDelete={handleDeleteTranscript}
                  isLoading={isLoading}
                />

                {/* Count */}
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4">
                  {filteredTranscripts.length} transcript{filteredTranscripts.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Settings Modal */}
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
        />
      </div>
    </div>
  );
}

export default App;
