import React from 'react';
import { HelpCircle, Check, X, SpellCheck } from 'lucide-react';

export default function FuzzyMatchModal({
  suggestedName,
  originalGuess,
  onConfirm,
  onReject
}) {
  if (!suggestedName) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-800 p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-700 text-center animate-scale-in">
        
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-lg shadow-amber-500/15">
          <SpellCheck className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5 flex items-center justify-center gap-1.5">
          <span>Spelling Check</span>
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          We didn't recognize <span className="font-semibold text-rose-500 underline decoration-wavy decoration-rose-400">"{originalGuess}"</span>.
          <br />
          Did you mean <strong className="text-brand-600 dark:text-brand-400 text-base">{suggestedName}</strong>?
        </p>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <Check className="w-4 h-4" />
            <span>Yes, that's what I meant</span>
          </button>

          <button
            type="button"
            onClick={onReject}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 text-slate-700 dark:text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <X className="w-4 h-4" />
            <span>No, try again</span>
          </button>
        </div>

        <p className="mt-3.5 text-[11px] text-slate-400 dark:text-slate-500">
          ✏️ Counts as correct with spelling mistake (+50 pts)
        </p>

      </div>
    </div>
  );
}
