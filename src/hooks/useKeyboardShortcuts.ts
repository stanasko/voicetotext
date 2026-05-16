import { useEffect } from 'react';

interface KeyboardShortcuts {
  onCopy?: () => void;
  onExport?: () => void;
  onDelete?: () => void;
  onRecord?: () => void;
  onSettings?: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if we're in an input/textarea (except for spacebar which should still work)
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      // Ctrl/Cmd + C: Copy
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && !isInput && shortcuts.onCopy) {
        e.preventDefault();
        shortcuts.onCopy();
        return;
      }

      // Ctrl/Cmd + E: Export
      if ((e.ctrlKey || e.metaKey) && e.key === 'e' && !isInput && shortcuts.onExport) {
        e.preventDefault();
        shortcuts.onExport();
        return;
      }

      // Ctrl/Cmd + D: Delete
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && !isInput && shortcuts.onDelete) {
        e.preventDefault();
        shortcuts.onDelete();
        return;
      }

      // Ctrl/Cmd + Shift + S: Settings
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 's' && shortcuts.onSettings) {
        e.preventDefault();
        shortcuts.onSettings();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};
