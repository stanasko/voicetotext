import type { Transcript } from '../types';
import { Trash2, Eye } from 'lucide-react';
import { useState } from 'react';

interface HistoryListProps {
  transcripts: Transcript[];
  onSelect: (transcript: Transcript) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const truncateText = (text: string, maxLength: number = 60) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const HistoryList = ({
  transcripts,
  onSelect,
  onDelete,
  isLoading,
}: HistoryListProps) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSelectAll = () => {
    if (selectedIds.size === transcripts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(transcripts.map((t) => t.id)));
    }
  };

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedIds.size} transcript(s)?`)) {
      selectedIds.forEach((id) => onDelete(id));
      setSelectedIds(new Set());
    }
  };

  if (transcripts.length === 0) {
    return (
      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-8 text-center">
        <p className="text-slate-500 dark:text-slate-400">No transcripts yet. Record or upload audio to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Bulk Actions */}
      {transcripts.length > 0 && (
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
          <input
            type="checkbox"
            checked={selectedIds.size === transcripts.length}
            onChange={handleSelectAll}
            className="w-4 h-4"
          />
          <span className="flex-1 text-sm text-slate-600 dark:text-slate-400">
            {selectedIds.size > 0 ? `${selectedIds.size} selected` : 'Select all'}
          </span>
          {selectedIds.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
            >
              Delete Selected
            </button>
          )}
        </div>
      )}

      {/* Transcript List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {transcripts.map((transcript) => (
          <div
            key={transcript.id}
            className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedIds.has(transcript.id)}
              onChange={() => handleToggleSelect(transcript.id)}
              className="w-4 h-4"
            />

            <button
              onClick={() => onSelect(transcript)}
              disabled={isLoading}
              className="flex-1 text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:opacity-50"
            >
              <p className="font-semibold text-slate-900 dark:text-white text-sm">
                {truncateText(transcript.text)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {formatDate(transcript.timestamp)} • {transcript.language || 'Unknown'} • {Math.ceil(transcript.duration / 60)}m
              </p>
            </button>

            <button
              onClick={() => onSelect(transcript)}
              disabled={isLoading}
              className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (confirm('Delete this transcript?')) {
                  onDelete(transcript.id);
                }
              }}
              disabled={isLoading}
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
