import { useState } from 'react';
import { Moon, Sun, Settings, Mic, Download, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  isDark: boolean;
  onThemeToggle: () => void;
  onSettingsClick: () => void;
}

export const Header = ({ isDark, onThemeToggle, onSettingsClick }: HeaderProps) => {
  const { install, canInstall, isIOS } = usePWAInstall();
  const [showIOSHint, setShowIOSHint] = useState(false);

  const handleInstallClick = () => {
    if (isIOS) {
      setShowIOSHint(true);
    } else {
      install();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#08080e]/80 backdrop-blur-xl border-b border-zinc-200/60 dark:border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/30">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[15px] font-semibold text-zinc-900 dark:text-white tracking-tight">
                VoiceToText
              </span>
              <span className="hidden sm:block text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
                Groq Whisper
              </span>
            </div>
          </div>

          <div className="flex items-center gap-0.5">
            {canInstall && (
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-xs font-semibold text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 border border-violet-200 dark:border-violet-500/25 transition-all mr-1.5"
                aria-label="Install app"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:block">Install</span>
              </button>
            )}
            <button
              onClick={onThemeToggle}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={onSettingsClick}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* iOS install instructions popover */}
      {showIOSHint && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowIOSHint(false)} />
          <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/8 rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <button
              onClick={() => setShowIOSHint(false)}
              className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-zinc-900 dark:text-white text-sm">Install VoiceToText</p>
                <p className="text-xs text-zinc-400">Add to your home screen</p>
              </div>
            </div>
            <ol className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <span>Open this page in <strong>Safari</strong> (not Chrome or Firefox)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <span>Tap the <strong>Share</strong> button (square with arrow up) at the bottom</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                <span>Tap <strong>"Add to Home Screen"</strong></span>
              </li>
            </ol>
          </div>
        </div>
      )}
    </>
  );
};
