import { useState, useCallback } from 'react';
import { createGroqClient } from '../services/groqAPI';
import type { TranscriptionResult, RateLimits, GroqError } from '../types';

export const useGroqAPI = (apiKey: string | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<GroqError | null>(null);
  const [rateLimits, setRateLimits] = useState<RateLimits | null>(null);

  const transcribe = useCallback(
    async (audioFile: Blob | File): Promise<TranscriptionResult | null> => {
      if (!apiKey) {
        setError({ message: 'API key is not set. Please configure it in settings.' });
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const client = createGroqClient(apiKey);
        const { result, rateLimits: limits } = await client.transcribeAudio(audioFile);
        setRateLimits(limits);
        return result;
      } catch (err) {
        const groqError = err instanceof Error
          ? { message: err.message }
          : err as GroqError;
        setError(groqError);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [apiKey]
  );

  return {
    transcribe,
    isLoading,
    error,
    rateLimits,
  };
};
