import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import Home from './pages/Home.jsx';
import Setup from './pages/Setup.jsx';
import Game from './pages/Game.jsx';
import Daily from './pages/Daily.jsx';
import Results from './pages/Results.jsx';
import Statistics from './pages/Statistics.jsx';
import Settings from './pages/Settings.jsx';
import { Storage } from './utils/storage.js';

export default function App() {
  const [settings, setSettings] = useState(() => Storage.getSettings());

  // Apply dark mode class to root HTML tag
  useEffect(() => {
    const root = document.documentElement;
    if (settings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.darkMode]);

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 antialiased selection:bg-brand-500 selection:text-white">
        
        {/* Navigation Bar */}
        <Navbar settings={settings} setSettings={setSettings} />

        {/* Main Content View */}
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home settings={settings} />} />
            <Route path="/setup" element={<Setup settings={settings} />} />
            <Route path="/game" element={<Game settings={settings} />} />
            <Route path="/daily" element={<Daily settings={settings} />} />
            <Route path="/results" element={<Results settings={settings} />} />
            <Route path="/statistics" element={<Statistics settings={settings} />} />
            <Route path="/settings" element={<Settings settings={settings} setSettings={setSettings} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />

      </div>
    </HashRouter>
  );
}
