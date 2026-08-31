import React, { useState } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Volume2, VolumeX, Sparkles, ShieldAlert, RotateCcw, Trash2, Check, Globe2 } from 'lucide-react';
import { Storage } from '../utils/storage.js';
import { Sound } from '../utils/sound.js';

export default function Settings({ settings, setSettings }) {
  const [showResetAllModal, setShowResetAllModal] = useState(false);
  const [showResetStatsModal, setShowResetStatsModal] = useState(false);
  const [notice, setNotice] = useState(null);

  const updateSetting = (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    Storage.saveSettings(updated);
    if (updated.soundEffects && key !== 'soundEffects') {
      Sound.playClick();
    }
  };

  const handleResetStats = () => {
    Storage.resetStats();
    setShowResetStatsModal(false);
    showNoticeMessage('Statistics have been successfully reset.');
    if (settings.soundEffects) Sound.playClick();
  };

  const handleResetAll = () => {
    Storage.resetAll();
    const defaults = Storage.getSettings();
    setSettings(defaults);
    setShowResetAllModal(false);
    showNoticeMessage('All application data and settings have been reset to defaults.');
    if (settings.soundEffects) Sound.playClick();
  };

  const showNoticeMessage = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="text-center sm:text-left space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700">
          <SettingsIcon className="w-3.5 h-3.5" />
          <span>PREFERENCES</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Customize your audio, visual theme, and gameplay experience.
        </p>
      </div>

      {notice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-slide-up">
          <Check className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Settings Options Group */}
      <div className="rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700/60 shadow-xl overflow-hidden">
        
        {/* Dark Mode */}
        <div className="p-5 sm:p-6 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              {settings.darkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>Theme Appearance</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {settings.darkMode ? 'Dark theme active' : 'Light theme active'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => updateSetting('darkMode', !settings.darkMode)}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
              settings.darkMode ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                settings.darkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Sound Effects */}
        <div className="p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                {settings.soundEffects ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                <span>Sound Effects</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Procedural audio chimes for correct guesses and hints
              </p>
            </div>

            <button
              type="button"
              onClick={() => updateSetting('soundEffects', !settings.soundEffects)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                settings.soundEffects ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  settings.soundEffects ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Audio Test Bar */}
          {settings.soundEffects && (
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="text-[11px] font-semibold text-slate-400 self-center mr-1">Preview:</span>
              <button
                type="button"
                onClick={() => Sound.playCorrect()}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-100 transition text-[11px]"
              >
                Correct Chime
              </button>
              <button
                type="button"
                onClick={() => Sound.playIncorrect()}
                className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-bold hover:bg-rose-100 transition text-[11px]"
              >
                Wrong Buzz
              </button>
              <button
                type="button"
                onClick={() => Sound.playHint()}
                className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 font-bold hover:bg-amber-100 transition text-[11px]"
              >
                Hint Sparkle
              </button>
              <button
                type="button"
                onClick={() => Sound.playWin()}
                className="px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold hover:bg-brand-100 transition text-[11px]"
              >
                Win Fanfare
              </button>
            </div>
          )}
        </div>

        {/* Animations */}
        <div className="p-5 sm:p-6 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-500" />
              <span>Animations & Confetti</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Smooth shape transitions and victory particle effects
            </p>
          </div>

          <button
            type="button"
            onClick={() => updateSetting('animations', !settings.animations)}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
              settings.animations ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                settings.animations ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Confirm Leave */}
        <div className="p-5 sm:p-6 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Confirm Before Leaving Active Game
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ask for confirmation before leaving an uncompleted game
            </p>
          </div>

          <button
            type="button"
            onClick={() => updateSetting('confirmLeave', !settings.confirmLeave)}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
              settings.confirmLeave ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                settings.confirmLeave ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

      </div>

      {/* Danger Zone: Data Management */}
      <div className="rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 p-6 sm:p-7 shadow-xl space-y-4">
        <h2 className="text-sm font-black uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4" />
          <span>Data & Storage</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setShowResetStatsModal(true)}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 hover:border-rose-300 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Reset Statistics Only</span>
          </button>

          <button
            type="button"
            onClick={() => setShowResetAllModal(true)}
            className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 hover:bg-rose-100 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset All Application Data</span>
          </button>
        </div>
      </div>

      {/* Cartographic Dataset Attribution Notice */}
      <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Globe2 className="w-4 h-4 text-brand-500" />
          <span>Authentic Cartographic Datasets</span>
        </div>
        <p className="leading-relaxed">
          Geographic shapes are extracted from Natural Earth World Atlas (110m & 50m) and the United States Census Bureau TopoJSON dataset, pre-projected and rendered directly via client-side SVG.
        </p>
      </div>

      {/* Reset Stats Modal */}
      {showResetStatsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-slate-200 dark:border-slate-700 text-center space-y-4 animate-scale-in">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Reset Statistics?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This will reset your game counts, streaks, and unlocked silhouette collection.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetStatsModal(false)}
                className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetStats}
                className="py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition shadow-md shadow-rose-600/20"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset All Modal */}
      {showResetAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-slate-200 dark:border-slate-700 text-center space-y-4 animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 mx-auto flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Reset Everything?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This will wipe all statistics, Daily challenge records, and custom settings.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetAllModal(false)}
                className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetAll}
                className="py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition shadow-md shadow-rose-600/20"
              >
                Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
