import { useState, useEffect } from 'react';
import { X, Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export const SettingsModal = ({
  isOpen,
  onClose,
  apiKey,
  onApiKeyChange,
}: SettingsModalProps) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState<'idle' | 'valid' | 'invalid' | null>(null);

  useEffect(() => {
    setInputKey(apiKey);
  }, [apiKey]);

  const handleSaveKey = () => {
    if (inputKey.trim()) {
      onApiKeyChange(inputKey.trim());
      setKeyStatus('idle');
      onClose();
    }
  };

  const handleClearKey = () => {
    if (confirm('Are you sure you want to delete the saved API key? You will need to enter it again next time.')) {
      setInputKey('');
      onApiKeyChange('');
      setKeyStatus(null);
    }
  };

  const handleTestKey = async () => {
    if (!inputKey.trim()) {
      setKeyStatus('invalid');
      return;
    }

    setIsTestingKey(true);
    try {
      // We'll test by making a simple API call - we can't actually test without an audio file,
      // but we can check if the key format is valid and accessible
      const response = await fetch('https://api.groq.com/openai/v1/models', {
        headers: {
          'Authorization': `Bearer ${inputKey.trim()}`,
        },
      });

      if (response.ok) {
        setKeyStatus('valid');
      } else if (response.status === 401) {
        setKeyStatus('invalid');
      } else {
        setKeyStatus('invalid');
      }
    } catch (error) {
      setKeyStatus('invalid');
    } finally {
      setIsTestingKey(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Security Warning */}
          <div className="flex gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-100 text-sm">Security Notice</p>
              <p className="text-xs text-amber-800 dark:text-amber-200 mt-1">
                Your API key is stored locally in your browser only. It is never sent to any server except Groq's API. Keep it private.
              </p>
            </div>
          </div>

          {/* API Key Input */}
          <div className="space-y-3">
            <label className="block font-semibold text-slate-900 dark:text-white text-sm">
              Groq API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={inputKey}
                onChange={(e) => {
                  setInputKey(e.target.value);
                  setKeyStatus(null);
                }}
                placeholder="gsk_..."
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                {showKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Status Indicator */}
            {keyStatus === 'valid' && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                <CheckCircle className="w-4 h-4" />
                API key is valid
              </div>
            )}
            {keyStatus === 'invalid' && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                <AlertTriangle className="w-4 h-4" />
                API key is invalid or expired
              </div>
            )}

            {/* Help Text */}
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Get your free API key at{' '}
              <a
                href="https://console.groq.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                console.groq.com
              </a>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 flex flex-col">
            <button
              onClick={handleTestKey}
              disabled={!inputKey.trim() || isTestingKey}
              className="w-full px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {isTestingKey ? 'Testing...' : 'Test Connection'}
            </button>

            <button
              onClick={handleSaveKey}
              disabled={!inputKey.trim()}
              className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              Save API Key
            </button>

            {apiKey && (
              <button
                onClick={handleClearKey}
                className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
              >
                Delete Saved Key
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-semibold rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
