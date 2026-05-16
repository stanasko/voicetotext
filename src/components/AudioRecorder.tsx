import { useState, useRef } from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { Mic, Square, Upload, X, AlertCircle } from 'lucide-react';

interface AudioRecorderProps {
  onAudioReady: (audio: Blob) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const AudioRecorder = ({ onAudioReady, isLoading, disabled }: AudioRecorderProps) => {
  const { isRecording, duration, startRecording, stopRecording, cancelRecording } = useAudioRecorder();
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartRecording = async () => {
    try {
      setUploadError(null);
      await startRecording();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Microphone access denied');
    }
  };

  const handleStopRecording = async () => {
    try {
      const audioBlob = await stopRecording();
      onAudioReady(audioBlob);
    } catch {
      setUploadError('Failed to process recording');
    }
  };

  const handleFileSelect = (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith('audio/')) {
      setUploadError('Invalid file type. Supported: MP3, WAV, WebM, M4A, OGG, FLAC');
      return;
    }
    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadError(`File too large. Max 25MB (yours: ${(file.size / 1024 / 1024).toFixed(1)}MB)`);
      return;
    }
    onAudioReady(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
  };

  return (
    <div className="space-y-5">
      {/* Hero mic button area */}
      <div className="flex flex-col items-center py-6">
        <div className="relative flex items-center justify-center mb-5">
          {/* Animated rings when recording */}
          {isRecording && (
            <>
              <div className="absolute w-32 h-32 rounded-full bg-red-500/20 animate-pulse-ring" />
              <div className="absolute w-32 h-32 rounded-full bg-red-500/20 animate-pulse-ring-delay" />
            </>
          )}

          {isLoading ? (
            <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !isRecording ? (
            <button
              onClick={handleStartRecording}
              disabled={isLoading || disabled}
              className="relative w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500 shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 transition-all duration-200 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none group"
            >
              <Mic className="w-9 h-9 text-white group-hover:scale-110 transition-transform duration-200" />
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="relative w-24 h-24 rounded-full bg-red-500 hover:bg-red-400 shadow-xl shadow-red-500/35 hover:scale-105 transition-all duration-200 flex items-center justify-center"
            >
              <Square className="w-8 h-8 text-white fill-white" />
            </button>
          )}
        </div>

        {/* Status text */}
        {isRecording ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-medium text-red-500 dark:text-red-400">Recording</span>
              <span className="text-sm font-mono font-medium text-zinc-600 dark:text-zinc-300">
                {formatDuration(duration)}
              </span>
            </div>
            <button
              onClick={cancelRecording}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            >
              <X className="w-3 h-3" />
              Cancel
            </button>
          </div>
        ) : isLoading ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Transcribing audio…</p>
        ) : (
          <div className="text-center">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {disabled ? 'Add an API key to start' : 'Tap to record'}
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">
              or drop a file below · Spacebar shortcut
            </p>
          </div>
        )}
      </div>

      {/* File upload drop zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isLoading && !disabled && fileInputRef.current?.click()}
        className={`relative border rounded-xl p-4 text-center transition-all duration-200 ${
          disabled || isLoading
            ? 'opacity-40 cursor-not-allowed pointer-events-none'
            : 'cursor-pointer'
        } ${
          dragActive
            ? 'border-violet-400 bg-violet-50 dark:bg-violet-500/10 dark:border-violet-500'
            : 'border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileInput}
          className="hidden"
        />
        <div className="flex items-center justify-center gap-2.5 text-zinc-400 dark:text-zinc-500">
          <Upload className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">
            Drop audio or{' '}
            <span className="text-violet-500 dark:text-violet-400 font-medium">browse</span>
          </span>
          <span className="hidden sm:block text-xs text-zinc-300 dark:text-zinc-600">
            MP3 WAV M4A WebM · max 25MB
          </span>
        </div>
      </div>

      {/* Error */}
      {uploadError && (
        <div className="flex items-center gap-2.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-3.5">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
        </div>
      )}
    </div>
  );
};
