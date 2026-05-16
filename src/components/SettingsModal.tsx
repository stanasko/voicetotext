import { useState, useEffect } from 'react';
import { X, Eye, EyeOff, ShieldCheck, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export const SettingsModal = ({ isOpen, onClose, apiKey, onApiKeyChange }: SettingsModalProps) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState<'valid' | 'invalid' | null>(null);

  useEffect(() => {
    setInputKey(apiKey);
  }, [apiKey]);

  const handleSaveKey = () => {
    if (inputKey.trim()) {
      onApiKeyChange(inputKey.trim());
      onClose();
    }
  };

  const handleClearKey = () => {
    if (confirm("Delete saved API key? You'll need to re-enter it to use the app.")) {
      setInputKey('');
      onApiKeyChange('');
      setKeyStatus(null);
    }
  };

  const handleTestKey = async () => {
    if (!inputKey.trim()) { setKeyStatus('invalid'); return; }
    setIsTestingKey(true);
    try {
      const response = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { Authorization: `Bearer ${inputKey.trim()}` },
      });
      setKeyStatus(response.ok ? 'valid' : 'invalid');
    } catch {
      setKeyStatus('invalid');
    } finally {
      setIsTestingKey(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-white/8 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md overflow-hidden">
        {/* Mobile drag handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-8 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-zinc-100 dark:border-white/5">
          <div>
            <h2 className="text-[15px] font-semibold text-zinc-900 dark:text-white">Settings</h2>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Groq API configuration</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Security notice */}
          <div className="flex gap-3 items-start p-3.5 bg-emerald-50 dark:bg-emerald-500/8 border border-emerald-100 dark:border-emerald-500/15 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
              Your key is stored <strong>only in this browser</strong> and sent directly to Groq.
              It never passes through any server.
            </p>
          </div>

          {/* API Key field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Groq API Key
              </label>
              <a
                href="https://console.groq.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 hover:underline"
              >
                Get free key
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={inputKey}
                onChange={(e) => { setInputKey(e.target.value); setKeyStatus(null); }}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveKey()}
                placeholder="gsk_…"
                className="w-full px-4 py-2.5 pr-10 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400/50 font-mono transition-all"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {keyStatus === 'valid' && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" />
                Connection successful
              </div>
            )}
            {keyStatus === 'invalid' && (
              <div className="flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                Invalid or expired API key
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-2 pb-1">
            <button
              onClick={handleSaveKey}
              disabled={!inputKey.trim()}
              className="w-full py-2.5 bg-violet-500 hover:bg-violet-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Save & Continue
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleTestKey}
                disabled={!inputKey.trim() || isTestingKey}
                className="flex-1 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 disabled:opacity-40 text-zinc-700 dark:text-zinc-300 text-sm font-medium rounded-xl transition-colors"
              >
                {isTestingKey ? 'Testing…' : 'Test Key'}
              </button>
              {apiKey && (
                <button
                  onClick={handleClearKey}
                  className="flex-1 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 text-sm font-medium rounded-xl transition-colors"
                >
                  Clear Key
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
