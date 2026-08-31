import React, { useState, useEffect } from 'react';
import { Calendar, Globe2, MapPin, Share2, Check, Sparkles, CheckCircle2, XCircle, ArrowRight, Lock } from 'lucide-react';
import ShapeDisplay from '../components/game/ShapeDisplay.jsx';
import AnswerInput from '../components/game/AnswerInput.jsx';
import HintPanel from '../components/game/HintPanel.jsx';
import FuzzyMatchModal from '../components/game/FuzzyMatchModal.jsx';
import { WORLD_COUNTRIES } from '../data/countries.js';
import { USA_STATES } from '../data/states.js';
import { isExactAnswerMatch } from '../utils/answerMatching.js';
import { checkFuzzyMatch } from '../utils/fuzzyMatching.js';
import { calculateScore } from '../utils/scoring.js';
import { Sound } from '../utils/sound.js';
import { Storage } from '../utils/storage.js';
import { getTodayDateString, getDayNumber, getDailyPlace } from '../utils/gameGenerator.js';
import confetti from 'canvas-confetti';

export default function Daily({ settings }) {
  const [mode, setMode] = useState('world');
  const [copied, setCopied] = useState(false);

  const todayStr = getTodayDateString();
  const dayNum = getDayNumber();
  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Daily place deterministically selected for today
  const dailyWorldPlace = getDailyPlace('world', todayStr);
  const dailyUsaPlace = getDailyPlace('usa', todayStr);

  const currentPlace = mode === 'usa' ? dailyUsaPlace : dailyWorldPlace;
  const allPlaces = mode === 'usa' ? USA_STATES : WORLD_COUNTRIES;

  // Local storage completion check
  const savedDaily = Storage.getDailyData(todayStr) || {};
  const currentResult = savedDaily[mode] || null;
  const isCompleted = !!currentResult?.completed;

  // Local gameplay state
  const [attempts, setAttempts] = useState(currentResult?.attempts || 0);
  const [guesses, setGuesses] = useState(currentResult?.guesses || []);
  const [hintsUsed, setHintsUsed] = useState(currentResult?.hintsUsed || 0);
  const [shake, setShake] = useState(false);
  const [fuzzyCheck, setFuzzyCheck] = useState(null);

  // Sync state if mode changes
  useEffect(() => {
    const res = savedDaily[mode] || null;
    setAttempts(res?.attempts || 0);
    setGuesses(res?.guesses || []);
    setHintsUsed(res?.hintsUsed || 0);
  }, [mode]);

  const handleTypedAnswer = (rawGuess) => {
    if (isCompleted || !currentPlace) return;

    const trimmed = rawGuess.trim();
    if (!trimmed) return;

    const newAttempts = attempts + 1;
    const newGuesses = [...guesses, trimmed];
    setAttempts(newAttempts);
    setGuesses(newGuesses);

    // 1. Check exact match
    if (isExactAnswerMatch(trimmed, currentPlace)) {
      handleComplete({
        correct: true,
        spelling: false,
        attemptsCount: newAttempts,
        guessList: newGuesses
      });
      return;
    }

    // 2. Check fuzzy match
    const fuzzyResult = checkFuzzyMatch(trimmed, currentPlace);
    if (fuzzyResult && fuzzyResult.isFuzzy) {
      setFuzzyCheck({
        suggestedName: fuzzyResult.suggestedName,
        originalGuess: trimmed,
        attemptsCount: newAttempts,
        guessList: newGuesses
      });
      return;
    }

    // 3. Wrong attempt
    if (settings.soundEffects) Sound.playIncorrect();
    setShake(true);
    setTimeout(() => setShake(false), 500);

    // Daily limit: max 6 attempts
    if (newAttempts >= 6) {
      handleComplete({
        correct: false,
        spelling: false,
        attemptsCount: newAttempts,
        guessList: newGuesses
      });
    }
  };

  const handleComplete = ({ correct, spelling, attemptsCount, guessList }) => {
    if (correct) {
      if (settings.soundEffects) Sound.playCorrect();
      if (settings.animations) {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      }
    } else {
      if (settings.soundEffects) Sound.playGiveUp();
    }

    const score = calculateScore({
      attemptCount: attemptsCount,
      isSpellingCorrection: spelling,
      hintsUsedCount: hintsUsed,
      isRevealed: !correct
    });

    const resultData = {
      completed: true,
      correct,
      spelling,
      attempts: attemptsCount,
      hintsUsed,
      guesses: guessList,
      score,
      placeId: currentPlace.id
    };

    Storage.saveDailyData(todayStr, mode, resultData);

    // Also record into general statistics
    Storage.recordGameResults({
      mode,
      questions: [{
        place: currentPlace,
        attempts: attemptsCount,
        isCorrect: correct,
        isSpellingCorrection: spelling,
        isRevealed: !correct,
        scoreEarned: score
      }],
      totalScore: score
    });
  };

  const handleConfirmFuzzy = () => {
    const attemptsCount = fuzzyCheck?.attemptsCount || attempts;
    const guessList = fuzzyCheck?.guessList || guesses;
    setFuzzyCheck(null);
    handleComplete({
      correct: true,
      spelling: true,
      attemptsCount,
      guessList
    });
  };

  const handleRejectFuzzy = () => {
    setFuzzyCheck(null);
    if (settings.soundEffects) Sound.playIncorrect();
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  // Generate spoiler-free emoji share text
  const generateShareText = () => {
    const emojiMode = mode === 'usa' ? '🇺🇸' : '🌎';
    const numAttempts = currentResult?.attempts || attempts || 1;
    const isSuccess = currentResult?.correct;
    
    let emojiBlocks = '';
    for (let i = 1; i <= numAttempts; i++) {
      if (i === numAttempts) {
        emojiBlocks += isSuccess ? (currentResult?.spelling ? '🟨' : '🟩') : '🟥';
      } else {
        emojiBlocks += '🟥';
      }
    }

    return `Shaple ${emojiMode} #${dayNum}\n${emojiBlocks}\n${isSuccess ? `${numAttempts}/6 attempts` : 'Failed'}\n\nCan you recognize the shape?\nhttps://allanroz.github.io/Shaple/`;
  };

  const handleCopyResult = () => {
    const text = generateShareText();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      if (settings.soundEffects) Sound.playClick();
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-800">
          <Calendar className="w-3.5 h-3.5" />
          <span>DAILY SHAPLE #{dayNum}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {formattedDate}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          One daily puzzle for everyone across the globe. Can you identify it?
        </p>
      </div>

      {/* Mode Tabs: World vs USA */}
      <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={() => {
            setMode('world');
            if (settings.soundEffects) Sound.playClick();
          }}
          className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
            mode === 'world'
              ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Globe2 className="w-4 h-4 text-sky-500" />
          <span>World Daily</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMode('usa');
            if (settings.soundEffects) Sound.playClick();
          }}
          className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
            mode === 'usa'
              ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <MapPin className="w-4 h-4 text-emerald-500" />
          <span>USA Daily</span>
        </button>
      </div>

      {/* Silhouette Display */}
      <div className="space-y-3">
        <ShapeDisplay
          place={currentPlace}
          isRevealed={isCompleted}
          isCorrect={isCompleted && currentResult?.correct}
          allowRotation={false}
          enableAnimations={settings.animations}
        />

        <div className="flex items-center justify-between text-xs text-slate-400 max-w-md mx-auto px-1">
          <span>{mode === 'usa' ? '🇺🇸 U.S. State' : '🌎 Country'}</span>
          <span>Attempt {isCompleted ? (currentResult?.attempts || attempts) : `${attempts}/6`}</span>
        </div>
      </div>

      {/* Solved / Locked Banner */}
      {isCompleted ? (
        <div className="w-full max-w-md mx-auto rounded-3xl bg-white dark:bg-slate-800 p-6 border-2 border-slate-200 dark:border-slate-700 shadow-xl text-center space-y-4 animate-scale-in">
          
          <div className="space-y-1">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${
              currentResult?.correct
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-700'
            }`}>
              {currentResult?.correct ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              <span>{currentResult?.correct ? 'Puzzle Completed!' : 'Better luck tomorrow!'}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2 pt-1">
              <span>{currentPlace.flagEmoji || '📍'}</span>
              <span>{currentPlace.name}</span>
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {currentPlace.type === 'state' ? `🇺🇸 ${currentPlace.region} United States` : `🌍 ${currentPlace.continent}`}
            </p>
          </div>

          {currentPlace.funFact && (
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 text-left">
              <p className="leading-relaxed">💡 {currentPlace.funFact}</p>
            </div>
          )}

          {/* Share Button */}
          <button
            type="button"
            onClick={handleCopyResult}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:scale-98 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
            <span>{copied ? 'Copied Result to Clipboard!' : 'Share Result (Spoiler-Free)'}</span>
          </button>

          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Next Daily Shaple unlocks at midnight.
          </p>

        </div>
      ) : (
        <div className="space-y-4">
          <AnswerInput
            onSubmit={handleTypedAnswer}
            disabled={isCompleted}
            allPlaces={allPlaces}
            placeholder={mode === 'usa' ? "Type state name or abbreviation..." : "Type country name..."}
            shake={shake}
            mode={mode}
          />

          <HintPanel
            place={currentPlace}
            hintsUsed={hintsUsed}
            onUseHint={() => setHintsUsed(prev => Math.min(3, prev + 1))}
            disabled={isCompleted}
            soundEffects={settings.soundEffects}
          />
        </div>
      )}

      {/* Fuzzy Match Modal */}
      {fuzzyCheck && (
        <FuzzyMatchModal
          suggestedName={fuzzyCheck.suggestedName}
          originalGuess={fuzzyCheck.originalGuess}
          onConfirm={handleConfirmFuzzy}
          onReject={handleRejectFuzzy}
        />
      )}

    </div>
  );
}
