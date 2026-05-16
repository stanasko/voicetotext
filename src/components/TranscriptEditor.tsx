import { useState, useEffect } from 'react';
import { Copy, Download, Trash2, CheckCircle } from 'lucide-react';

interface TranscriptEditorProps {
  text: string;
  isLoading: boolean;
  onSave: (text: string) => void;
  onDelete: () => void;
  onExport: () => void;
}

export const TranscriptEditor = ({
  text,
  isLoading,
  onSave,
  onDelete,
  onExport,
}: TranscriptEditorProps) => {
  const [editedText, setEditedText] = useState(text);
  const [isCopied, setIsCopied] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setEditedText(text);
    setHasChanges(false);
  }, [text]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setEditedText(newText);
    setHasChanges(newText !== text);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleSave = () => {
    onSave(editedText);
    setHasChanges(false);
  };

  const characterCount = editedText.length;
  const wordCount = editedText
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  return (
    <div className="space-y-4">
      {/* Transcript Editor */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <textarea
          value={editedText}
          onChange={handleTextChange}
          disabled={isLoading}
          placeholder="Your transcription will appear here..."
          className="w-full h-64 p-4 text-slate-900 dark:text-white bg-white dark:bg-slate-800 border-0 focus:ring-2 focus:ring-blue-500 rounded-lg resize-none disabled:opacity-50"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">Characters</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{characterCount}</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">Words</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{wordCount}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        {hasChanges && (
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 min-w-[120px]"
          >
            <CheckCircle className="w-4 h-4" />
            Save Changes
          </button>
        )}

        <button
          onClick={handleCopy}
          disabled={isLoading || !editedText}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 min-w-[120px]"
        >
          <Copy className="w-4 h-4" />
          {isCopied ? 'Copied!' : 'Copy'}
        </button>

        <button
          onClick={onExport}
          disabled={isLoading || !editedText}
          className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 min-w-[120px]"
        >
          <Download className="w-4 h-4" />
          Export
        </button>

        <button
          onClick={onDelete}
          disabled={isLoading}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 min-w-[120px]"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
};
