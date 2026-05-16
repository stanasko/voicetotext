import type { RateLimits } from '../types';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface RateLimitDisplayProps {
  rateLimits: RateLimits | null;
}

export const RateLimitDisplay = ({ rateLimits }: RateLimitDisplayProps) => {
  if (!rateLimits) {
    return (
      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">No rate limit info available</p>
      </div>
    );
  }

  const used = rateLimits.limit - rateLimits.remaining;
  const percentage = (used / rateLimits.limit) * 100;
  const isLow = rateLimits.remaining < 500;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 rounded-lg p-4 border border-blue-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isLow ? (
            <AlertCircle className="w-5 h-5 text-amber-500" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
          <span className="font-semibold text-slate-900 dark:text-white">Daily Request Limit</span>
        </div>
        <span className={`text-sm font-mono ${isLow ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'}`}>
          {used} / {rateLimits.limit}
        </span>
      </div>

      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden mb-2">
        <div
          className={`h-full transition-all duration-300 ${
            isLow
              ? 'bg-gradient-to-r from-amber-500 to-orange-500'
              : 'bg-gradient-to-r from-blue-500 to-purple-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      <div className="text-xs text-slate-600 dark:text-slate-400">
        <p className="mb-1">Requests remaining: <span className="font-semibold">{rateLimits.remaining}</span></p>
        <p>Resets in: <span className="font-semibold text-slate-700 dark:text-slate-300">{rateLimits.reset}</span></p>
        {rateLimits.tpmRemaining && (
          <p className="mt-1 text-slate-500">Tokens/min: {rateLimits.tpmRemaining} / {rateLimits.tpmLimit}</p>
        )}
      </div>
    </div>
  );
};
