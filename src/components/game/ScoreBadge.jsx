import React from 'react';
import { Award, Flame } from 'lucide-react';

export default function ScoreBadge({ score = 0, streak = 0 }) {
  return (
    <div className="flex items-center gap-2 text-xs font-bold">
      {/* Points */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 shadow-sm">
        <Award className="w-4 h-4 text-brand-500" />
        <span>{score} pts</span>
      </div>

      {/* Streak */}
      {streak > 0 && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 shadow-sm animate-pulse-glow">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>{streak} Streak</span>
        </div>
      )}
    </div>
  );
}
