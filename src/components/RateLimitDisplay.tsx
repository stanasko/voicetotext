import type { RateLimits } from '../types';

interface RateLimitDisplayProps {
  rateLimits: RateLimits | null;
}

export const RateLimitDisplay = ({ rateLimits }: RateLimitDisplayProps) => {
  if (!rateLimits) return null;

  const used = rateLimits.limit - rateLimits.remaining;
  const percentage = Math.min((used / rateLimits.limit) * 100, 100);
  const isLow = rateLimits.remaining < 200;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className={`font-medium ${isLow ? 'text-amber-500' : 'text-zinc-500 dark:text-zinc-400'}`}>
          {isLow ? `Low — ${rateLimits.remaining} remaining` : `${rateLimits.remaining} of ${rateLimits.limit} remaining`}
        </span>
        <span className="text-zinc-400 dark:text-zinc-500 tabular-nums">
          {used}/{rateLimits.limit}
        </span>
      </div>

      <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700/60 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isLow
              ? 'bg-amber-500'
              : 'bg-gradient-to-r from-violet-500 to-indigo-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
        Resets {rateLimits.reset}
        {rateLimits.tpmRemaining != null && (
          <span className="ml-2 text-zinc-300 dark:text-zinc-600">
            · {rateLimits.tpmRemaining}/{rateLimits.tpmLimit} tok/min
          </span>
        )}
      </p>
    </div>
  );
};
