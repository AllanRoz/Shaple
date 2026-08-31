import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Trophy, Award, CheckCircle2, AlertTriangle, XCircle, RotateCcw, Sliders, Home as HomeIcon, Flame, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Sound } from '../utils/sound.js';

export default function Results({ settings }) {
  const location = useLocation();
  const navigate = useNavigate();

  const resultsData = location.state || null;

  useEffect(() => {
    if (resultsData && settings.animations) {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 }
      });
      if (settings.soundEffects) {
        Sound.playWin();
      }
    }
  }, [resultsData]);

  if (!resultsData) {
    return (
      <div className="w-full max-w-md mx-auto py-20 text-center space-y-4">
        <Trophy className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">No active game results found</h2>
        <Link to="/" className="inline-block px-5 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-bold">
          Go to Home
        </Link>
      </div>
    );
  }

  const { config, questions = [], totalScore = 0, bestStreak = 0 } = resultsData;

  const totalQuestions = questions.length;
  const correctCount = questions.filter(q => q.isCorrect && !q.isSpellingCorrection).length;
  const spellingCount = questions.filter(q => q.isSpellingCorrection).length;
  const incorrectCount = questions.filter(q => !q.isCorrect).length;

  const totalSolved = correctCount + spellingCount;
  const accuracyPercent = totalQuestions > 0 ? Math.round((totalSolved / totalQuestions) * 100) : 0;

  const totalAttempts = questions.reduce((sum, q) => sum + (q.attempts || 1), 0);
  const avgAttempts = totalQuestions > 0 ? (totalAttempts / totalQuestions).toFixed(1) : 0;

  const handlePlayAgain = () => {
    if (settings.soundEffects) Sound.playClick();
    navigate('/game', { state: { config } });
  };

  const handleChangeSettings = () => {
    if (settings.soundEffects) Sound.playClick();
    navigate(`/setup?mode=${config.mode || 'world'}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      
      {/* Trophy & Completion Header */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-xl shadow-amber-500/25 animate-bounce-short">
          <Trophy className="w-10 h-10" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Game Complete! 🎉
        </h1>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-extrabold text-sm border border-brand-200 dark:border-brand-800">
          <Award className="w-4 h-4" />
          <span>{totalScore} Total Points</span>
        </div>
      </div>

      {/* Main Score Metrics Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 p-6 sm:p-7 shadow-xl space-y-6">
        
        {/* Big numbers summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {totalSolved} / {totalQuestions}
            </div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
              Shapes Solved
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {accuracyPercent}%
            </div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
              Accuracy
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 flex flex-col justify-center">
            <div className="text-2xl sm:text-3xl font-black text-amber-500 flex items-center justify-center gap-1">
              <Flame className="w-6 h-6 fill-amber-500" />
              <span>{bestStreak}</span>
            </div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
              Best Streak
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-bold">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
            <span>🟩 Correct</span>
            <span>{correctCount}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 flex items-center justify-between">
            <span>✏️ Spelling</span>
            <span>{spellingCount}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 flex items-center justify-between">
            <span>🟥 Incorrect</span>
            <span>{incorrectCount}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>🎯 Avg Guesses</span>
            <span>{avgAttempts}</span>
          </div>
        </div>

        {/* Question-by-Question Review List */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Round Question Review
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-700/60 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {questions.map((q, idx) => {
              const place = q.place;
              return (
                <div key={idx} className="p-3 sm:p-3.5 bg-white dark:bg-slate-800 flex items-center justify-between gap-3 text-sm">
                  
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-400 w-5">
                      #{idx + 1}
                    </span>
                    <span className="text-xl">{place.flagEmoji || '📍'}</span>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{place.name}</span>
                      <span className="text-xs text-slate-400 block">
                        {place.continent || place.region}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
                      {q.attempts} {q.attempts === 1 ? 'attempt' : 'attempts'}
                    </span>

                    {q.isCorrect && !q.isSpellingCorrection && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>+{q.scoreEarned}</span>
                      </span>
                    )}

                    {q.isSpellingCorrection && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-xs font-bold">
                        <span>✏️</span>
                        <span>+{q.scoreEarned}</span>
                      </span>
                    )}

                    {!q.isCorrect && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>0</span>
                      </span>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            type="button"
            onClick={handlePlayAgain}
            className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 active:scale-95 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>

          <button
            type="button"
            onClick={handleChangeSettings}
            className="py-3.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition"
          >
            <Sliders className="w-4 h-4" />
            <span>Change Setup</span>
          </button>

          <Link
            to="/"
            className="py-3.5 px-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center justify-center gap-2 transition"
          >
            <HomeIcon className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
