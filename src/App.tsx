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
import { Key } from 'lucide-react';

function App() {
  const [apiKey, setApiKey] = useLocalStorage<string>('groq_api_key', '');
  const [isDark, setIsDark] = useLocalStorage<boolean>('theme_dark', false);
  const [showSettings, setShowSettings] = useState(!apiKey);
  const [selectedTranscript, setSelectedTranscript] = useState<Transcript | null>(null);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const { transcribe, isLoading, error, rateLimits } = useGroqAPI(apiKey || null);

  useEffect(() => {
    loadTranscripts();
  }, []);

  useKeyboardShortcuts({
    onCopy: () => selectedTranscript && navigator.clipboard.writeText(selectedTranscript.text),
    onExport: () => selectedTranscript && handleExportTranscript(),
    onDelete: () => selectedTranscript && handleDeleteTranscript(selectedTranscript.id),
    onSettings: () => setShowSettings(true),
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
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
        duration: 0,
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
    if (selectedTranscript?.id === id) setSelectedTranscript(null);
    await loadTranscripts();
  };

  const handleExportTranscript = () => {
    if (!selectedTranscript) return;
    const content = `Transcript\nDate: ${new Date(selectedTranscript.timestamp).toLocaleString()}\nLanguage: ${selectedTranscript.language}\n\n---\n\n${selectedTranscript.text}`;
    const el = document.createElement('a');
    el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    el.setAttribute('download', `transcript-${selectedTranscript.id.slice(0, 8)}.txt`);
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  };

  const filteredTranscripts = useMemo(() => {
    if (!searchQuery) return transcripts;
    return transcripts.filter((t) =>
      t.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transcripts, searchQuery]);

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200">
        <Header
          isDark={isDark}
          onThemeToggle={() => setIsDark(!isDark)}
          onSettingsClick={() => setShowSettings(true)}
        />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          {/* No API key prompt */}
          {!apiKey && (
            <button
              onClick={() => setShowSettings(true)}
              className="w-full mb-5 flex items-center gap-3 px-4 py-3.5 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 rounded-2xl text-left hover:bg-violet-100 dark:hover:bg-violet-500/15 transition-colors group"
            >
              <div className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-violet-200 dark:group-hover:bg-violet-500/30 transition-colors">
                <Key className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-violet-800 dark:text-violet-200">
                  Add your Groq API key to start transcribing
                </p>
                <p className="text-xs text-violet-500 dark:text-violet-400 mt-0.5">
                  Free · stored locally · never shared
                </p>
              </div>
            </button>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left column: recorder + editor */}
            <div className="lg:col-span-2 space-y-4">
              {/* Recorder card */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-white/5 rounded-2xl p-6 shadow-sm">
                <AudioRecorder
                  onAudioReady={handleAudioReady}
                  isLoading={isLoading}
                  disabled={!apiKey}
                />
              </div>

              {/* Error */}
              {error && (
                <div className="px-4 py-3.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl">
                  <p className="text-sm text-red-600 dark:text-red-400">{error.message}</p>
                </div>
              )}

              {/* Transcript editor */}
              {selectedTranscript && (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-white/5 rounded-2xl p-6 shadow-sm">
                  <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4">
                    Transcript
                  </p>
                  <TranscriptEditor
                    text={selectedTranscript.text}
                    isLoading={isLoading}
                    onSave={handleSaveTranscript}
                    onDelete={() => handleDeleteTranscript(selectedTranscript.id)}
                    onExport={handleExportTranscript}
                  />
                </div>
              )}
            </div>

            {/* Right column: rate limit + history */}
            <div className="lg:col-span-1 space-y-4">
              {/* Rate limit */}
              {rateLimits && (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-white/5 rounded-2xl px-5 py-4 shadow-sm">
                  <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">
                    API Usage
                  </p>
                  <RateLimitDisplay rateLimits={rateLimits} />
                </div>
              )}

              {/* History card */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-white/5 rounded-2xl p-5 shadow-sm lg:sticky lg:top-20">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                    History
                  </p>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 tabular-nums">
                    {filteredTranscripts.length}
                  </span>
                </div>

                {/* Search */}
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Search transcripts…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400/50 transition-all"
                  />
                </div>

                <HistoryList
                  transcripts={filteredTranscripts}
                  onSelect={setSelectedTranscript}
                  onDelete={handleDeleteTranscript}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </main>

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
