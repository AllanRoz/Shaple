import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Globe2, MapPin, Play, Sparkles, Sliders, CheckSquare, Square, Layers, HelpCircle, ArrowRight } from 'lucide-react';
import { Storage } from '../utils/storage.js';
import { Sound } from '../utils/sound.js';

const ALL_CONTINENTS = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'];
const ALL_USA_REGIONS = ['Northeast', 'Midwest', 'South', 'West'];

export default function Setup({ settings }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlMode = searchParams.get('mode');

  const initialSettings = Storage.getSettings();
  const lastSetup = initialSettings.lastSetup || {};

  const [mode, setMode] = useState(urlMode === 'usa' ? 'usa' : (urlMode === 'world' ? 'world' : (lastSetup.mode || 'world')));
  const [difficulty, setDifficulty] = useState(lastSetup.difficulty || 'normal');
  const [answerStyle, setAnswerStyle] = useState(lastSetup.answerStyle || 'mixed');
  const [length, setLength] = useState(lastSetup.length || 10);
  const [worldContinents, setWorldContinents] = useState(lastSetup.worldContinents || [...ALL_CONTINENTS]);
  const [usaRegions, setUsaRegions] = useState(lastSetup.usaRegions || [...ALL_USA_REGIONS]);

  useEffect(() => {
    if (urlMode === 'usa' || urlMode === 'world') {
      setMode(urlMode);
    }
  }, [urlMode]);

  const handleToggleContinent = (cont) => {
    if (worldContinents.includes(cont)) {
      if (worldContinents.length > 1) {
        setWorldContinents(worldContinents.filter(c => c !== cont));
      }
    } else {
      setWorldContinents([...worldContinents, cont]);
    }
  };

  const handleToggleAllContinents = () => {
    if (worldContinents.length === ALL_CONTINENTS.length) {
      setWorldContinents(['Europe']); // Leave at least one
    } else {
      setWorldContinents([...ALL_CONTINENTS]);
    }
  };

  const handleToggleRegion = (reg) => {
    if (usaRegions.includes(reg)) {
      if (usaRegions.length > 1) {
        setUsaRegions(usaRegions.filter(r => r !== reg));
      }
    } else {
      setUsaRegions([...usaRegions, reg]);
    }
  };

  const handleToggleAllRegions = () => {
    if (usaRegions.length === ALL_USA_REGIONS.length) {
      setUsaRegions(['South']);
    } else {
      setUsaRegions([...ALL_USA_REGIONS]);
    }
  };

  const handleStartGame = () => {
    if (settings.soundEffects) Sound.playClick();

    const currentSetup = {
      mode,
      difficulty,
      answerStyle,
      length,
      worldContinents,
      usaRegions
    };

    // Save in LocalStorage
    const currentSettings = Storage.getSettings();
    Storage.saveSettings({
      ...currentSettings,
      lastSetup: currentSetup
    });

    // Navigate to game with state
    navigate('/game', { state: { config: currentSetup } });
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 animate-fade-in">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 text-xs font-bold border border-brand-200 dark:border-brand-800">
          <Sliders className="w-3.5 h-3.5" />
          <span>GAME CUSTOMIZATION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Game Setup
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Configure your shapes, difficulty, regions, and question style.
        </p>
      </div>

      <div className="rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 p-6 sm:p-8 shadow-xl space-y-8">
        
        {/* Section 1: Location Mode */}
        <div className="space-y-3">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            1. Geographic Location
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setMode('world');
                if (settings.soundEffects) Sound.playClick();
              }}
              className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-3 font-bold text-sm sm:text-base transition-all ${
                mode === 'world'
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 shadow-md shadow-brand-500/10'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Globe2 className="w-5 h-5 text-sky-500" />
              <span>🌎 World Countries</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('usa');
                if (settings.soundEffects) Sound.playClick();
              }}
              className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-3 font-bold text-sm sm:text-base transition-all ${
                mode === 'usa'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 shadow-md shadow-emerald-500/10'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'
              }`}
            >
              <MapPin className="w-5 h-5 text-emerald-500" />
              <span>🇺🇸 USA States</span>
            </button>
          </div>
        </div>

        {/* Section 2: Difficulty */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              2. Difficulty Level
            </label>
            <span className="text-xs text-slate-400">
              {difficulty === 'easy' && 'Prominent, easily recognized silhouettes'}
              {difficulty === 'normal' && 'Balanced mix across all shapes'}
              {difficulty === 'hard' && 'Less distinctive & compact outlines'}
              {difficulty === 'expert' && 'Randomized pool with subtle rotation'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'easy', label: 'Easy', emoji: '🟢' },
              { id: 'normal', label: 'Normal', emoji: '🟡' },
              { id: 'hard', label: 'Hard', emoji: '🟠' },
              { id: 'expert', label: 'Expert', emoji: '🔴' },
            ].map(diff => (
              <button
                key={diff.id}
                type="button"
                onClick={() => {
                  setDifficulty(diff.id);
                  if (settings.soundEffects) Sound.playClick();
                }}
                className={`py-3 px-3 rounded-2xl border-2 font-bold text-sm flex items-center justify-center gap-1.5 transition-all ${
                  difficulty === diff.id
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 shadow-md'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <span>{diff.emoji}</span>
                <span>{diff.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Answer Style */}
        <div className="space-y-3">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            3. Answer Format
          </label>

          <div className="grid grid-cols-3 gap-2.5">
            {[
              { id: 'type', label: 'Type Answer', desc: 'Type name with spell-check' },
              { id: 'choice', label: 'Multiple Choice', desc: '4 options' },
              { id: 'mixed', label: 'Mixed', desc: 'Alternating' },
            ].map(style => (
              <button
                key={style.id}
                type="button"
                onClick={() => {
                  setAnswerStyle(style.id);
                  if (settings.soundEffects) Sound.playClick();
                }}
                className={`py-3 px-2 rounded-2xl border-2 font-bold text-sm text-center transition-all ${
                  answerStyle === style.id
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 shadow-md'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div>{style.label}</div>
                <div className="text-[10px] font-normal text-slate-400 mt-0.5">{style.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Section 4: Game Length */}
        <div className="space-y-3">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            4. Number of Questions
          </label>

          <div className="grid grid-cols-4 gap-2.5">
            {[
              { id: 5, label: '5 Shapes' },
              { id: 10, label: '10 Shapes' },
              { id: 20, label: '20 Shapes' },
              { id: 'endless', label: 'Endless' },
            ].map(len => (
              <button
                key={len.id}
                type="button"
                onClick={() => {
                  setLength(len.id);
                  if (settings.soundEffects) Sound.playClick();
                }}
                className={`py-3 px-3 rounded-2xl border-2 font-bold text-sm text-center transition-all ${
                  length === len.id
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 shadow-md'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <span>{len.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 5: Region Filtering */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              5. Filter Regions / Continents
            </label>
            <button
              type="button"
              onClick={mode === 'world' ? handleToggleAllContinents : handleToggleAllRegions}
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              {mode === 'world'
                ? (worldContinents.length === ALL_CONTINENTS.length ? 'Deselect All' : 'Select All')
                : (usaRegions.length === ALL_USA_REGIONS.length ? 'Deselect All' : 'Select All')}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {mode === 'world' ? (
              ALL_CONTINENTS.map(cont => {
                const selected = worldContinents.includes(cont);
                return (
                  <button
                    key={cont}
                    type="button"
                    onClick={() => handleToggleContinent(cont)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition ${
                      selected
                        ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-400 text-brand-600 dark:text-brand-300 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 opacity-60'
                    }`}
                  >
                    {selected ? <CheckSquare className="w-3.5 h-3.5 text-brand-500" /> : <Square className="w-3.5 h-3.5" />}
                    <span>{cont}</span>
                  </button>
                );
              })
            ) : (
              ALL_USA_REGIONS.map(reg => {
                const selected = usaRegions.includes(reg);
                return (
                  <button
                    key={reg}
                    type="button"
                    onClick={() => handleToggleRegion(reg)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition ${
                      selected
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-600 dark:text-emerald-300 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 opacity-60'
                    }`}
                  >
                    {selected ? <CheckSquare className="w-3.5 h-3.5 text-emerald-500" /> : <Square className="w-3.5 h-3.5" />}
                    <span>{reg}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Start Game Action */}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleStartGame}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 active:scale-98 text-white font-extrabold text-lg flex items-center justify-center gap-3 shadow-xl shadow-brand-500/30 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500"
          >
            <span>Start Game</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>

      </div>

    </div>
  );
}
