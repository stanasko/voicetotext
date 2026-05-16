export interface RateLimits {
  limit: number;
  remaining: number;
  reset: string;
  tpmLimit?: number;
  tpmRemaining?: number;
  tpmReset?: string;
}

export interface Transcript {
  id: string;
  text: string;
  originalAudio?: Blob;
  timestamp: number;
  duration: number;
  language: string;
  edited: boolean;
  audioFile?: string;
}

export interface TranscriptionResult {
  text: string;
  language?: string;
  duration?: number;
}

export interface GroqError {
  message: string;
  status?: number;
  retryAfter?: number;
}

export interface AppState {
  apiKey: string;
  isDark: boolean;
  isRecording: boolean;
  isTranscribing: boolean;
}
