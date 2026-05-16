import { useState, useRef } from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { Mic, Square, Upload, AlertCircle } from 'lucide-react';

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
      setUploadError(error instanceof Error ? error.message : 'Failed to start recording');
    }
  };

  const handleStopRecording = async () => {
    try {
      const audioBlob = await stopRecording();
      onAudioReady(audioBlob);
    } catch (error) {
      setUploadError('Failed to stop recording');
    }
  };

  const handleFileSelect = (file: File) => {
    setUploadError(null);

    // Validate file type
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/webm', 'audio/m4a', 'audio/mp4'];
    if (!validTypes.some((type) => file.type.includes(type.split('/')[1]))) {
      setUploadError('Invalid audio format. Supported: MP3, WAV, WebM, M4A');
      return;
    }

    // Validate file size (25MB limit)
    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadError(`File too large. Maximum size: 25MB (yours: ${(file.size / 1024 / 1024).toFixed(1)}MB)`);
      return;
    }

    onAudioReady(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Recording Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-lg p-6 border-2 border-blue-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Microphone Recording</h3>
          {isRecording && (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <div className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full animate-pulse" />
              <span className="text-sm font-mono">{formatDuration(duration)}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              disabled={isLoading || disabled}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Mic className="w-5 h-5" />
              Start Recording
            </button>
          ) : (
            <>
              <button
                onClick={handleStopRecording}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Square className="w-5 h-5" />
                Stop & Transcribe
              </button>
              <button
                onClick={cancelRecording}
                disabled={isLoading}
                className="bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        <span className="text-sm text-slate-500 dark:text-slate-400">OR</span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
      </div>

      {/* Upload Section */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          <Upload className="w-8 h-8 text-slate-400 dark:text-slate-500" />
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">Drag & drop your audio file</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">or click to browse (Max 25MB)</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || disabled}
            className="mt-2 px-6 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            Browse Files
          </button>
        </div>
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-300">{uploadError}</p>
        </div>
      )}
    </div>
  );
};
