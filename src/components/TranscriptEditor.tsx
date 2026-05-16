import { useState, useEffect } from 'react';
import { Copy, Download, Trash2, Check, Save } from 'lucide-react';

interface TranscriptEditorProps {
  text: string;
  isLoading: boolean;
  onSave: (text: string) => void;
  onDelete: () => void;
  onExport: () => void;
}

export const TranscriptEditor = ({ text, isLoading, onSave, onDelete, onExport }: TranscriptEditorProps) => {
  const [editedText, setEditedText] = useState(text);
  const [isCopied, setIsCopied] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setEditedText(text);
    setHasChanges(false);
  }, [text]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedText(e.target.value);
    setHasChanges(e.target.value !== text);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const wordCount = editedText.trim().split(/\s+/).filter((w) => w.length > 0).length;
  const charCount = editedText.length;

  return (
    <div className="space-y-3">
      {/* Textarea */}
      <div className="relative">
        <textarea
          value={editedText}
          onChange={handleTextChange}
          disabled={isLoading}
          placeholder="Your transcript will appear here…"
          className="w-full h-52 px-4 py-3.5 text-sm leading-relaxed font-mono text-zinc-800 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400/50 placeholder-zinc-400 dark:placeholder-zinc-600 disabled:opacity-50 transition-all"
        />
        <div className="absolute bottom-3 right-3 text-[11px] text-zinc-400 dark:text-zinc-600 font-medium pointer-events-none select-none">
          {wordCount}w · {charCount}c
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {hasChanges && (
          <button
            onClick={() => { onSave(editedText); setHasChanges(false); }}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-500 hover:bg-violet-600 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            Save
          </button>
        )}

        <button
          onClick={handleCopy}
          disabled={isLoading || !editedText}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {isCopied ? (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          {isCopied ? 'Copied!' : 'Copy'}
        </button>

        <button
          onClick={onExport}
          disabled={isLoading || !editedText}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          Export .txt
        </button>

        <div className="flex-1" />

        <button
          onClick={onDelete}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
};
