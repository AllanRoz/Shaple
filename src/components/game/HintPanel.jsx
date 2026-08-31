import React from 'react';
import { Lightbulb, Globe, Type, Hash, Sparkles } from 'lucide-react';
import { Sound } from '../../utils/sound.js';

export default function HintPanel({
  place,
  hintsUsed = 0,
  onUseHint,
  disabled = false,
  soundEffects = true
}) {
  if (!place) return null;

  const totalHintsAvailable = 3;
  const nextHintIndex = hintsUsed + 1;

  const handleHintClick = () => {
    if (disabled || hintsUsed >= totalHintsAvailable) return;
    if (soundEffects) Sound.playHint();
    onUseHint();
  };

  const getHint1Text = () => {
    if (place.type === 'state') {
      return `🇺🇸 Region: ${place.region} United States`;
    }
    return `🌍 Continent: ${place.continent}`;
  };

  const getHint2Text = () => {
    return `First letter: ${place.name.charAt(0).toUpperCase()}`;
  };

  const getHint3Text = () => {
    const lettersCount = place.name.replace(/[^a-zA-Z]/g, '').length;
    // Create pattern like "_ _ _ _ _"
    const pattern = place.name
      .split('')
      .map(char => (/[a-zA-Z]/.test(char) ? '_' : char))
      .join(' ');

    return `${lettersCount} letters: ${pattern}`;
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-2.5">
      
      {/* Hint trigger bar */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleHintClick}
          disabled={disabled || hintsUsed >= totalHintsAvailable}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-900/50 active:scale-95 transition disabled:opacity-40 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>
            {hintsUsed >= totalHintsAvailable
              ? 'All Hints Revealed'
              : `💡 Hint ${nextHintIndex}/3 (-15 pts)`}
          </span>
        </button>

        <span className="text-[11px] text-slate-400 dark:text-slate-500">
          {hintsUsed > 0 ? `${hintsUsed} of 3 used` : 'Need a clue?'}
        </span>
      </div>

      {/* Revealed hints cards */}
      {hintsUsed > 0 && (
        <div className="space-y-1.5 animate-slide-up">
          {/* Hint 1 */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200">
            <Globe className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span>{getHint1Text()}</span>
          </div>

          {/* Hint 2 */}
          {hintsUsed >= 2 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 animate-slide-up">
              <Type className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>{getHint2Text()}</span>
            </div>
          )}

          {/* Hint 3 */}
          {hintsUsed >= 3 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 animate-slide-up">
              <Hash className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="font-mono">{getHint3Text()}</span>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
