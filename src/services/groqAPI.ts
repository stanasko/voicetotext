import axios from 'axios';
import type { TranscriptionResult, RateLimits, GroqError } from '../types';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';

export class GroqAPIClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async transcribeAudio(audioFile: Blob | File): Promise<{
    result: TranscriptionResult;
    rateLimits: RateLimits;
  }> {
    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('model', 'whisper-large-v3-turbo');

    try {
      const response = await axios.post(GROQ_API_URL, formData, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      const rateLimits = this.parseRateLimitHeaders(response.headers);

      return {
        result: {
          text: response.data.text,
          language: response.data.language,
        },
        rateLimits,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private parseRateLimitHeaders(headers: Record<string, any>): RateLimits {
    const limit = parseInt(headers['x-ratelimit-limit-requests'] || '2000', 10);
    const remaining = parseInt(headers['x-ratelimit-remaining-requests'] || '0', 10);
    const reset = headers['x-ratelimit-reset-requests'] || 'Unknown';
    const tpmLimit = parseInt(headers['x-ratelimit-limit-tokens'] || '0', 10);
    const tpmRemaining = parseInt(headers['x-ratelimit-remaining-tokens'] || '0', 10);
    const tpmReset = headers['x-ratelimit-reset-tokens'] || '';

    return {
      limit,
      remaining,
      reset,
      tpmLimit,
      tpmRemaining,
      tpmReset,
    };
  }

  private handleError(error: any): GroqError {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.error?.message || error.message;
      const retryAfter = error.response?.headers?.['retry-after'];

      if (status === 401) {
        return {
          message: 'Invalid API key. Please check your Groq API key.',
          status,
        };
      }

      if (status === 429) {
        return {
          message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
          status,
          retryAfter: parseInt(retryAfter, 10),
        };
      }

      return {
        message: `Error: ${message}`,
        status,
      };
    }

    return {
      message: 'An unknown error occurred during transcription.',
    };
  }
}

export const createGroqClient = (apiKey: string) => new GroqAPIClient(apiKey);
