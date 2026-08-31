import React, { useEffect } from 'react';
import { ArrowRight, CheckCircle2, XCircle, Sparkles, Award, Info } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AnswerFeedback({
  place,
  isCorrect,
  isSpellingCorrection,
  isRevealed,
  attempts = 1,
  scoreEarned = 0,
  onNext,
  isLastQuestion = false,
  enableAnimations = true
}) {
  useEffect(() => {
    if (isCorrect && enableAnimations) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#2b8aff', '#10b981', '#f59e0b', '#6366f1']
        });
      } catch (e) {}
    }
  }, [isCorrect, enableAnimations]);

  if (!place) return null;

  return (
    <div className="w-full max-w-md mx-auto rounded-3xl bg-white dark:bg-slate-800 p-5 sm:p-6 border-2 border-slate-200 dark:border-slate-700 shadow-xl space-y-4 animate-scale-in text-center">
      
      {/* Status Header */}
      {isCorrect ? (
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSpellingCorrection ? 'Correct (Spelling Mistake)' : '🎉 Correct!'}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2 mt-1">
            <span>{place.flagEmoji || '📍'}</span>
            <span>{place.name}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {place.type === 'state' ? `🇺🇸 ${place.region} United States` : `🌍 ${place.continent}`}
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-xs font-extrabold border border-amber-200 dark:border-amber-800">
            <XCircle className="w-4 h-4" />
            <span>The answer was:</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2 mt-1">
            <span>{place.flagEmoji || '📍'}</span>
            <span>{place.name}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {place.type === 'state' ? `🇺🇸 ${place.region} United States` : `🌍 ${place.continent}`}
          </p>
        </div>
      )}

      {/* Attempts & Points Badge */}
      <div className="flex items-center justify-center gap-4 py-2 border-y border-slate-100 dark:border-slate-700/60 text-xs font-semibold">
        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
          <span>Attempts:</span>
          <span className="font-bold text-slate-900 dark:text-white">{attempts}</span>
        </div>
        <div className="h-3 w-px bg-slate-200 dark:bg-slate-700" />
        <div className="flex items-center gap-1 text-brand-600 dark:text-brand-400">
          <Award className="w-3.5 h-3.5" />
          <span>+{scoreEarned} pts</span>
        </div>
      </div>

      {/* Trivia / Fun fact */}
      {place.funFact && (
        <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 text-left text-xs text-slate-600 dark:text-slate-300">
          <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{place.funFact}</p>
        </div>
      )}

      {/* Next Shape Button */}
      <button
        type="button"
        onClick={onNext}
        autoFocus
        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 active:scale-98 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500"
      >
        <span>{isLastQuestion ? 'View Results' : 'Next Shape'}</span>
        <ArrowRight className="w-5 h-5" />
      </button>

    </div>
  );
}
