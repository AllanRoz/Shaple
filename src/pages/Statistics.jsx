import React, { useState } from 'react';
import { BarChart3, Globe2, MapPin, Flame, Award, Trophy, CheckCircle2, RotateCcw, ShieldAlert, Sparkles, Compass } from 'lucide-react';
import { Storage } from '../utils/storage.js';
import { Sound } from '../utils/sound.js';
import { WORLD_COUNTRIES } from '../data/countries.js';
import { USA_STATES } from '../data/states.js';

export default function Statistics({ settings }) {
  const [activeTab, setActiveTab] = useState('overall'); // 'overall' | 'world' | 'usa'
  const [stats, setStats] = useState(Storage.getStats());
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedPlaceModal, setSelectedPlaceModal] = useState(null);

  const handleReset = () => {
    Storage.resetStats();
    setStats(Storage.getStats());
    setShowResetModal(false);
    if (settings.soundEffects) Sound.playClick();
  };

  const worldStats = stats.world;
  const usaStats = stats.usa;
  const overall = stats.overall;

  // Calculate metrics for current tab
  const getTabMetrics = () => {
    if (activeTab === 'world') {
      const solved = worldStats.correctAnswers + worldStats.spellingCorrections;
      const acc = worldStats.questionsAnswered > 0 ? Math.round((solved / worldStats.questionsAnswered) * 100) : 0;
      const avg = worldStats.questionsAnswered > 0 ? (worldStats.totalAttempts / worldStats.questionsAnswered).toFixed(1) : 0;
      return {
        games: worldStats.gamesPlayed,
        questions: worldStats.questionsAnswered,
        correct: worldStats.correctAnswers,
        spelling: worldStats.spellingCorrections,
        incorrect: worldStats.incorrectAnswers,
        accuracy: acc,
        avgAttempts: avg,
        bestStreak: worldStats.bestStreak,
        perfectGames: worldStats.perfectGames,
        recognizedCount: worldStats.recognizedIds.length,
        totalInCat: WORLD_COUNTRIES.length,
        recognizedIds: worldStats.recognizedIds,
        dataset: WORLD_COUNTRIES
      };
    } else if (activeTab === 'usa') {
      const solved = usaStats.correctAnswers + usaStats.spellingCorrections;
      const acc = usaStats.questionsAnswered > 0 ? Math.round((solved / usaStats.questionsAnswered) * 100) : 0;
      const avg = usaStats.questionsAnswered > 0 ? (usaStats.totalAttempts / usaStats.questionsAnswered).toFixed(1) : 0;
      return {
        games: usaStats.gamesPlayed,
        questions: usaStats.questionsAnswered,
        correct: usaStats.correctAnswers,
        spelling: usaStats.spellingCorrections,
        incorrect: usaStats.incorrectAnswers,
        accuracy: acc,
        avgAttempts: avg,
        bestStreak: usaStats.bestStreak,
        perfectGames: usaStats.perfectGames,
        recognizedCount: usaStats.recognizedIds.length,
        totalInCat: USA_STATES.length,
        recognizedIds: usaStats.recognizedIds,
        dataset: USA_STATES
      };
    } else {
      const totalSolved = overall.totalCorrect + overall.totalSpelling;
      const acc = overall.totalQuestions > 0 ? Math.round((totalSolved / overall.totalQuestions) * 100) : 0;
      const totalRecognized = (worldStats.recognizedIds?.length || 0) + (usaStats.recognizedIds?.length || 0);
      const totalAll = WORLD_COUNTRIES.length + USA_STATES.length;
      return {
        games: overall.totalGames,
        questions: overall.totalQuestions,
        correct: overall.totalCorrect,
        spelling: overall.totalSpelling,
        incorrect: overall.totalIncorrect,
        accuracy: acc,
        avgAttempts: '—',
        bestStreak: overall.longestStreak,
        perfectGames: worldStats.perfectGames + usaStats.perfectGames,
        recognizedCount: totalRecognized,
        totalInCat: totalAll,
        recognizedIds: [],
        dataset: []
      };
    }
  };

  const metrics = getTabMetrics();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>PLAYER ANALYTICS</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Game Statistics
          </h1>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          {[
            { id: 'overall', label: 'Overall', icon: Trophy },
            { id: 'world', label: 'World', icon: Globe2 },
            { id: 'usa', label: 'USA States', icon: MapPin },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  if (settings.soundEffects) Sound.playClick();
                }}
                className={`py-2 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Games Played
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            {metrics.games}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {metrics.questions} questions
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Accuracy
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {metrics.accuracy}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {metrics.correct + metrics.spelling} correct
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Longest Streak
          </div>
          <div className="text-3xl font-black text-amber-500 mt-1 flex items-center gap-1">
            <Flame className="w-6 h-6 fill-amber-500" />
            <span>{metrics.bestStreak}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {metrics.perfectGames} perfect rounds
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Shapes Unlocked
          </div>
          <div className="text-3xl font-black text-sky-500 mt-1">
            {metrics.recognizedCount} / {metrics.totalInCat}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {Math.round((metrics.recognizedCount / metrics.totalInCat) * 100)}% discovered
          </div>
        </div>

      </div>

      {/* Shapes Collection Gallery for World or USA mode */}
      {activeTab !== 'overall' && (
        <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {activeTab === 'world' ? '🌎 World Shape Collection' : '🇺🇸 US States Shape Collection'}
              </h2>
              <p className="text-xs text-slate-400">
                Click an unlocked place to view its geographic profile and trivia.
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">
              {metrics.recognizedCount} of {metrics.totalInCat} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-[480px] overflow-y-auto pr-1">
            {metrics.dataset.map(place => {
              const isUnlocked = metrics.recognizedIds.includes(place.id);

              return (
                <div
                  key={place.id}
                  onClick={() => {
                    if (isUnlocked) {
                      setSelectedPlaceModal(place);
                      if (settings.soundEffects) Sound.playClick();
                    }
                  }}
                  className={`relative p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-between gap-1.5 ${
                    isUnlocked
                      ? 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:scale-105 cursor-pointer'
                      : 'bg-slate-100/40 dark:bg-slate-900/20 border-dashed border-slate-200 dark:border-slate-800 opacity-40 select-none'
                  }`}
                >
                  <div className="w-14 h-14 flex items-center justify-center p-1">
                    <svg viewBox={place.viewBox || "0 0 500 500"} className="w-full h-full max-h-12">
                      <path
                        d={place.svgPath}
                        className={isUnlocked ? 'fill-slate-800 dark:fill-slate-200' : 'fill-slate-400 dark:fill-slate-600'}
                        strokeWidth="2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        fillRule="evenodd"
                      />
                    </svg>
                  </div>

                  <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate max-w-full">
                    {isUnlocked ? (
                      <span className="flex items-center gap-1">
                        <span>{place.flagEmoji || '📍'}</span>
                        <span className="truncate">{place.name}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">???</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Place Details Modal on Click */}
      {selectedPlaceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-slate-200 dark:border-slate-700 text-center space-y-4 animate-scale-in">
            <div className="w-24 h-24 mx-auto p-2 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
              <svg viewBox={selectedPlaceModal.viewBox || "0 0 500 500"} className="w-full h-full">
                <path
                  d={selectedPlaceModal.svgPath}
                  className="fill-brand-500 stroke-brand-600"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  fillRule="evenodd"
                />
              </svg>
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
                <span>{selectedPlaceModal.flagEmoji || '📍'}</span>
                <span>{selectedPlaceModal.name}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Capital: <strong className="text-slate-700 dark:text-slate-300">{selectedPlaceModal.capital}</strong> • {selectedPlaceModal.continent || selectedPlaceModal.region}
              </p>
            </div>

            {selectedPlaceModal.funFact && (
              <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 text-left leading-relaxed">
                💡 {selectedPlaceModal.funFact}
              </p>
            )}

            <button
              type="button"
              onClick={() => setSelectedPlaceModal(null)}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Reset Stats Action */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowResetModal(true)}
          className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1.5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Statistics</span>
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-slate-200 dark:border-slate-700 text-center space-y-4 animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 mx-auto flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Reset All Statistics?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This will clear your accuracy, games played, and unlocked silhouette collection. This action cannot be undone.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition shadow-md shadow-rose-600/20"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
