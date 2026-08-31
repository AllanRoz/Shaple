import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe2, MapPin, Calendar, Sparkles, ArrowRight, Flame, Trophy, Compass, CheckCircle2, ShieldCheck } from 'lucide-react';
import { WORLD_COUNTRIES } from '../data/countries.js';
import { USA_STATES } from '../data/states.js';
import { Storage } from '../utils/storage.js';
import { Sound } from '../utils/sound.js';
import { getTodayDateString, getDayNumber } from '../utils/gameGenerator.js';

export default function Home({ settings }) {
  const navigate = useNavigate();
  const [featuredIdx, setFeaturedIdx] = useState(0);

  // Showcase rotating silhouettes on hero
  const showcaseList = [
    WORLD_COUNTRIES.find(c => c.name === 'Italy') || WORLD_COUNTRIES[0],
    USA_STATES.find(s => s.name === 'Texas') || USA_STATES[0],
    WORLD_COUNTRIES.find(c => c.name === 'Japan') || WORLD_COUNTRIES[1],
    USA_STATES.find(s => s.name === 'Florida') || USA_STATES[1],
    WORLD_COUNTRIES.find(c => c.name === 'Chile') || WORLD_COUNTRIES[2],
    USA_STATES.find(s => s.name === 'California') || USA_STATES[2],
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setFeaturedIdx(prev => (prev + 1) % showcaseList.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [showcaseList.length]);

  const featured = showcaseList[featuredIdx];

  const todayStr = getTodayDateString();
  const dayNum = getDayNumber();
  const dailyData = Storage.getDailyData(todayStr) || {};
  const worldDailyDone = !!dailyData.world?.completed;
  const usaDailyDone = !!dailyData.usa?.completed;

  const stats = Storage.getStats();
  const totalRecognized = (stats.world?.recognizedIds?.length || 0) + (stats.usa?.recognizedIds?.length || 0);

  const handleCardClick = (path) => {
    if (settings.soundEffects) Sound.playClick();
    navigate(path);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12 animate-fade-in">
      
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-900 via-slate-900 to-slate-950 text-white p-6 sm:p-10 lg:p-12 shadow-2xl border border-slate-800/80">
        
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Title & Intro */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>THE ULTIMATE GEOGRAPHY SILHOUETTE GAME</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
              Shaple
            </h1>

            <p className="text-xl sm:text-2xl font-semibold text-slate-200">
              Can you recognize the shape?
            </p>

            <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto lg:mx-0 leading-relaxed font-normal">
              Test your geographic eye. Guess countries and U.S. states purely from their authentic outline silhouettes — no flags, no labels, no boundaries.
            </p>

            {/* Quick CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => handleCardClick('/setup?mode=world')}
                className="px-6 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-400 active:scale-95 text-white font-extrabold text-base flex items-center gap-2 shadow-lg shadow-brand-500/30 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Globe2 className="w-5 h-5" />
                <span>Play World</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleCardClick('/setup?mode=usa')}
                className="px-6 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 active:scale-95 text-white font-extrabold text-base flex items-center gap-2 border border-slate-700 shadow-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span>Play USA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Right Column: Dynamic Silhouette Showcase Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-xs aspect-square rounded-3xl bg-slate-800/60 border border-slate-700/70 p-6 flex flex-col items-center justify-between shadow-2xl backdrop-blur-md group hover:border-brand-500/50 transition duration-300">
              
              <div className="w-full flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span className="flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-brand-400" />
                  <span>Mystery Silhouette</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-300 text-[10px] uppercase font-bold">
                  {featured.type === 'state' ? 'US State' : 'Country'}
                </span>
              </div>

              {/* Animated SVG Path */}
              <div className="w-full h-44 flex items-center justify-center p-2">
                <svg
                  viewBox={featured.viewBox || "0 0 500 500"}
                  className="w-full h-full max-h-36 drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] animate-scale-in"
                  key={featured.id}
                >
                  <path
                    d={featured.svgPath}
                    className="fill-slate-100 stroke-brand-300 transition-all duration-300"
                    strokeWidth="3"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fillRule="evenodd"
                  />
                </svg>
              </div>

              <div className="text-center">
                <span className="text-xs text-slate-400 font-medium italic">
                  "Which place is this?"
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Main Game Modes Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <span>Choose Your Game Mode</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: 🌎 World */}
          <div 
            onClick={() => handleCardClick('/setup?mode=world')}
            className="group relative rounded-3xl p-7 bg-white dark:bg-slate-800/90 border-2 border-slate-200 dark:border-slate-700/80 hover:border-brand-500 dark:hover:border-brand-400 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:scale-[1.01] transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-md shadow-sky-500/10 group-hover:scale-110 transition-transform">
                <Globe2 className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  🌎 World Countries
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                  Guess countries by their shape. From the Italian boot to the archipelago of Japan, test your world geography.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/70">180+ Countries</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/70">All 6 Continents</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/70">4 Difficulties</span>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between text-brand-600 dark:text-brand-400 font-extrabold text-sm">
              <span>Play World Mode</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: 🇺🇸 USA States */}
          <div 
            onClick={() => handleCardClick('/setup?mode=usa')}
            className="group relative rounded-3xl p-7 bg-white dark:bg-slate-800/90 border-2 border-slate-200 dark:border-slate-700/80 hover:border-emerald-500 dark:hover:border-emerald-400 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:scale-[1.01] transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-md shadow-emerald-500/10 group-hover:scale-110 transition-transform">
                <MapPin className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  🇺🇸 USA States
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                  Guess America's states by their shape. Can you tell Colorado from Wyoming, or recognize Florida and Texas in a flash?
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/70">All 50 US States</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/70">4 Regions</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/70">Authentic Cartography</span>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
              <span>Play States Mode</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </div>

      {/* Daily Shaple Special Banner */}
      <div 
        onClick={() => handleCardClick('/daily')}
        className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-indigo-500/10 dark:from-amber-950/40 dark:via-brand-950/40 dark:to-indigo-950/40 border-2 border-amber-300/80 dark:border-amber-700/60 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 cursor-pointer group hover:border-amber-400 transition-all"
      >
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center shadow-lg shadow-amber-500/25 shrink-0 group-hover:scale-105 transition-transform">
            <Calendar className="w-8 h-8" />
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold">
              <span>Daily Puzzle #{dayNum}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Daily Shaple Challenge
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              One deterministic daily shape for everyone worldwide. Solve and share your spoiler-free grid!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex flex-col items-end text-xs font-bold">
            <span className={worldDailyDone ? 'text-emerald-500' : 'text-slate-400'}>
              {worldDailyDone ? '✓ World Solved' : '○ World Available'}
            </span>
            <span className={usaDailyDone ? 'text-emerald-500' : 'text-slate-400'}>
              {usaDailyDone ? '✓ USA Solved' : '○ USA Available'}
            </span>
          </div>

          <div className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/30 transition">
            <span>Play Daily</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Feature Highlights Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <div className="text-2xl mb-1">🗺️</div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">Real Geography</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Authentic TopoJSON boundaries</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <div className="text-2xl mb-1">✏️</div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">Smart Spelling</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Did-you-mean match verification</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <div className="text-2xl mb-1">🔥</div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">Streak & Stats</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Saved locally in browser</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <div className="text-2xl mb-1">🏆</div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">Shapes Gallery</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{totalRecognized} places unlocked</p>
        </div>

      </div>

    </div>
  );
}
