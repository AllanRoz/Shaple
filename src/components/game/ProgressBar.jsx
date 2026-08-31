import React from 'react';
import { Flag, Infinity as InfinityIcon } from 'lucide-react';

export default function ProgressBar({ currentIndex = 0, totalQuestions = 10, isEndless = false }) {
  const currentNum = currentIndex + 1;
  const progressPercent = isEndless ? 100 : Math.min(100, Math.round(((currentIndex) / totalQuestions) * 100));

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <Flag className="w-3.5 h-3.5 text-brand-500" />
          {isEndless ? (
            <span className="flex items-center gap-1">
              <span>Question {currentNum}</span>
              <InfinityIcon className="w-3.5 h-3.5 text-slate-400" />
            </span>
          ) : (
            <span>Question {currentNum} of {totalQuestions}</span>
          )}
        </span>
        {!isEndless && <span>{progressPercent}%</span>}
      </div>

      {!isEndless && (
        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-600 via-sky-500 to-emerald-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
}
