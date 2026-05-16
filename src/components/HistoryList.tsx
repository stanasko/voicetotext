import type { Transcript } from '../types';
import { Trash2, FileText } from 'lucide-react';
import { useState } from 'react';

interface HistoryListProps {
  transcripts: Transcript[];
  onSelect: (transcript: Transcript) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const HistoryList = ({ transcripts, onSelect, onDelete, isLoading }: HistoryListProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (transcripts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <FileText className="w-7 h-7 text-zinc-300 dark:text-zinc-700 mb-2.5" />
        <p className="text-sm text-zinc-400 dark:text-zinc-500">No transcripts yet</p>
        <p className="text-xs text-zinc-300 dark:text-zinc-600 mt-1">Record or upload audio to begin</p>
      </div>
    );
  }

  return (
    <div className="space-y-0.5 max-h-[420px] overflow-y-auto -mx-1 px-1">
      {transcripts.map((transcript) => (
        <div
          key={transcript.id}
          className="group relative flex items-start gap-2.5 px-3 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
          onMouseEnter={() => setHoveredId(transcript.id)}
          onMouseLeave={() => setHoveredId(null)}
          onClick={() => !isLoading && onSelect(transcript)}
        >
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-zinc-800 dark:text-zinc-200 truncate leading-snug">
              {transcript.text.slice(0, 90)}
              {transcript.text.length > 90 ? '…' : ''}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500 tabular-nums">
                {formatDate(transcript.timestamp)}
              </span>
              {transcript.language && transcript.language !== 'unknown' && (
                <>
                  <span className="text-zinc-300 dark:text-zinc-700">·</span>
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-500 uppercase">
                    {transcript.language}
                  </span>
                </>
              )}
              {transcript.edited && (
                <>
                  <span className="text-zinc-300 dark:text-zinc-700">·</span>
                  <span className="text-[11px] text-violet-500 dark:text-violet-400">edited</span>
                </>
              )}
            </div>
          </div>

          {hoveredId === transcript.id && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Delete this transcript?')) onDelete(transcript.id);
              }}
              disabled={isLoading}
              className="flex-shrink-0 p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
