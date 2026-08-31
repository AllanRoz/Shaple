import React, { useEffect } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function MultipleChoice({
  options = [],
  onSelect,
  disabled = false,
  selectedOption = null,
  isRevealed = false
}) {
  // Support keyboard 1, 2, 3, 4
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (disabled) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= options.length) {
        onSelect(options[num - 1].name);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [options, disabled, onSelect]);

  return (
    <div className="w-full max-w-lg mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map((opt, idx) => {
        let btnStyle = "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-950/30 hover:scale-[1.01]";
        let icon = null;

        if (isRevealed) {
          if (opt.isCorrect) {
            btnStyle = "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 dark:border-emerald-400 text-emerald-700 dark:text-emerald-300 font-bold shadow-md shadow-emerald-500/10";
            icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
          } else if (selectedOption === opt.name) {
            btnStyle = "bg-rose-50 dark:bg-rose-950/60 border-rose-500 dark:border-rose-400 text-rose-700 dark:text-rose-300 font-medium";
            icon = <XCircle className="w-5 h-5 text-rose-500 shrink-0" />;
          } else {
            btnStyle = "opacity-40 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900";
          }
        }

        return (
          <button
            key={opt.id || opt.name}
            type="button"
            onClick={() => onSelect(opt.name)}
            disabled={disabled}
            className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between gap-3 shadow-md shadow-slate-200/50 dark:shadow-none transition-all duration-150 active:scale-95 disabled:pointer-events-none text-left font-semibold text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${btnStyle}`}
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700/80 text-slate-500 dark:text-slate-300 flex items-center justify-center text-xs font-bold shrink-0">
                {idx + 1}
              </span>
              <span className="truncate">{opt.name}</span>
            </div>
            {icon}
          </button>
        );
      })}
    </div>
  );
}
