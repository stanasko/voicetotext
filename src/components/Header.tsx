import { Moon, Sun, Settings, Mic } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  onThemeToggle: () => void;
  onSettingsClick: () => void;
}

export const Header = ({ isDark, onThemeToggle, onSettingsClick }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200/60 dark:border-white/5">
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
  );
};
