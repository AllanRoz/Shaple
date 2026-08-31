import React from 'react';
import { Link } from 'react-router-dom';
import { Globe2, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 py-8 px-4 sm:px-6 transition-colors duration-200 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-brand-600 flex items-center justify-center text-white">
            <Globe2 className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">Shaple</span>
          <span className="hidden sm:inline text-slate-400">•</span>
          <span className="italic">Can you recognize the shape?</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <Link to="/setup?mode=world" className="hover:text-brand-500 transition-colors">World Countries</Link>
          <Link to="/setup?mode=usa" className="hover:text-brand-500 transition-colors">USA States</Link>
          <Link to="/daily" className="hover:text-brand-500 transition-colors">Daily Shaple</Link>
          <Link to="/statistics" className="hover:text-brand-500 transition-colors">Statistics</Link>
          <Link to="/settings" className="hover:text-brand-500 transition-colors">Settings</Link>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" /> 100% Client-Side
          </span>
          <span>© {new Date().getFullYear()} Shaple</span>
        </div>

      </div>
    </footer>
  );
}
