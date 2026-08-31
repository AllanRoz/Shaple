import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe2, MapPin, Calendar, BarChart3, Settings as SettingsIcon, Volume2, VolumeX, Moon, Sun, Menu, X, Flame } from 'lucide-react';
import { Storage } from '../../utils/storage.js';
import { Sound } from '../../utils/sound.js';

export default function Navbar({ settings, setSettings }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    const newDark = !settings.darkMode;
    const updated = { ...settings, darkMode: newDark };
    setSettings(updated);
    Storage.saveSettings(updated);
    if (updated.soundEffects) Sound.playClick();
  };

  const toggleSound = () => {
    const newSound = !settings.soundEffects;
    const updated = { ...settings, soundEffects: newSound };
    setSettings(updated);
    Storage.saveSettings(updated);
    if (newSound) Sound.playClick();
  };

  const stats = Storage.getStats();
  const currentStreak = stats.overall?.currentStreak || 0;

  const navLinks = [
    { to: '/setup?mode=world', label: 'World', icon: Globe2, color: 'text-sky-500' },
    { to: '/setup?mode=usa', label: 'USA States', icon: MapPin, color: 'text-emerald-500' },
    { to: '/daily', label: 'Daily', icon: Calendar, color: 'text-amber-500' },
    { to: '/statistics', label: 'Stats', icon: BarChart3, color: 'text-indigo-500' },
    { to: '/settings', label: 'Settings', icon: SettingsIcon, color: 'text-slate-400' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link 
          to="/" 
          onClick={() => settings.soundEffects && Sound.playClick()}
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg p-1"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
            <Globe2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-brand-600 via-sky-500 to-indigo-600 dark:from-brand-400 dark:via-sky-300 dark:to-indigo-300 bg-clip-text text-transparent">
                Shaple
              </span>
            </div>
            <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400 hidden sm:block">
              Geography Shape Game
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to.split('?')[0] && 
              (!link.to.includes('?') || location.search === link.to.substring(link.to.indexOf('?')));

            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => settings.soundEffects && Sound.playClick()}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${link.color}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & Streak Indicator */}
        <div className="flex items-center gap-2">
          {currentStreak > 0 && (
            <Link
              to="/statistics"
              title={`Current Streak: ${currentStreak}`}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/50 text-amber-600 dark:text-amber-400 text-xs font-bold animate-pulse-glow"
            >
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{currentStreak}</span>
            </Link>
          )}

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={settings.soundEffects ? "Mute sounds" : "Enable sounds"}
            title={settings.soundEffects ? "Sound: ON" : "Sound: OFF"}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {settings.soundEffects ? <Volume2 className="w-5 h-5 text-emerald-500" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={settings.darkMode ? "Switch to light theme" : "Switch to dark theme"}
            title={settings.darkMode ? "Light Mode" : "Dark Mode"}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {settings.darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-500" />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-4 pt-3 pb-5 space-y-1 animate-slide-up shadow-xl">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (settings.soundEffects) Sound.playClick();
                }}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Icon className={`w-5 h-5 ${link.color}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
