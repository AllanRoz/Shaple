import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, Flag, Sparkles, AlertCircle, X, HelpCircle, ArrowRight } from 'lucide-react';
import ShapeDisplay from '../components/game/ShapeDisplay.jsx';
import AnswerInput from '../components/game/AnswerInput.jsx';
import MultipleChoice from '../components/game/MultipleChoice.jsx';
import HintPanel from '../components/game/HintPanel.jsx';
import FuzzyMatchModal from '../components/game/FuzzyMatchModal.jsx';
import ScoreBadge from '../components/game/ScoreBadge.jsx';
import ProgressBar from '../components/game/ProgressBar.jsx';
import AnswerFeedback from '../components/game/AnswerFeedback.jsx';
import { WORLD_COUNTRIES } from '../data/countries.js';
import { USA_STATES } from '../data/states.js';
import { isExactAnswerMatch } from '../utils/answerMatching.js';
import { checkFuzzyMatch } from '../utils/fuzzyMatching.js';
import { calculateScore } from '../utils/scoring.js';
import { Sound } from '../utils/sound.js';
import { Storage } from '../utils/storage.js';
import { generateGameQuestions } from '../utils/gameGenerator.js';

export default function Game({ settings }) {
  const location = useLocation();
  const navigate = useNavigate();

  const config = location.state?.config || Storage.getSettings().lastSetup || {
    mode: 'world',
    difficulty: 'normal',
    answerStyle: 'mixed',
    length: 10,
    worldContinents: ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'],
    usaRegions: ['Northeast', 'Midwest', 'South', 'West']
  };

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Active question state
  const [attemptCount, setAttemptCount] = useState(0);
  const [guesses, setGuesses] = useState([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSpellingCorrection, setIsSpellingCorrection] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scoreEarned, setScoreEarned] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  // Error shake & feedback
  const [shake, setShake] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // Fuzzy match modal state
  const [fuzzyCheck, setFuzzyCheck] = useState(null); // { suggestedName, originalGuess }

  // Confirmation modal on leave
  const [showExitModal, setShowExitModal] = useState(false);

  // Initialize questions on mount
  useEffect(() => {
    const generated = generateGameQuestions(config);
    setQuestions(generated);
    setCurrentIndex(0);
    setTotalScore(0);
    setCurrentStreak(0);
  }, []);

  const currentQ = questions[currentIndex];
  const allPlaces = config.mode === 'usa' ? USA_STATES : WORLD_COUNTRIES;
  const isEndless = config.length === 'endless';
  const isLastQuestion = !isEndless && currentIndex === questions.length - 1;

  // Handle Typed Answer Submission
  const handleTypedAnswer = (rawGuess) => {
    if (isAnswered || !currentQ) return;

    const trimmed = rawGuess.trim();
    if (!trimmed) return;

    const place = currentQ.place;
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    setGuesses(prev => [...prev, trimmed]);

    // 1. Check exact match
    if (isExactAnswerMatch(trimmed, place)) {
      handleSuccess({
        isSpelling: false,
        attempts: newAttemptCount
      });
      return;
    }

    // 2. Check intelligent fuzzy misspelling
    const fuzzyResult = checkFuzzyMatch(trimmed, place);
    if (fuzzyResult && fuzzyResult.isFuzzy) {
      setFuzzyCheck({
        suggestedName: fuzzyResult.suggestedName,
        originalGuess: trimmed,
        attempts: newAttemptCount
      });
      return;
    }

    // 3. Incorrect Guess
    handleWrongAttempt();
  };

  // Handle Multiple Choice Selection
  const handleChoiceSelect = (selectedName) => {
    if (isAnswered || !currentQ) return;

    setSelectedOption(selectedName);
    const place = currentQ.place;
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    setGuesses(prev => [...prev, selectedName]);

    if (selectedName === place.name) {
      handleSuccess({
        isSpelling: false,
        attempts: newAttemptCount
      });
    } else {
      handleWrongAttempt();
    }
  };

  // Wrong attempt helper
  const handleWrongAttempt = () => {
    if (settings.soundEffects) Sound.playIncorrect();
    setShake(true);
    setTimeout(() => setShake(false), 500);
    setFeedbackMessage('❌ Not quite! Try again.');
  };

  // Success handler
  const handleSuccess = ({ isSpelling, attempts }) => {
    if (settings.soundEffects) Sound.playCorrect();

    const points = calculateScore({
      attemptCount: attempts,
      isSpellingCorrection: isSpelling,
      hintsUsedCount: hintsUsed,
      isRevealed: false
    });

    const newScore = totalScore + points;
    const newStreak = currentStreak + 1;

    setTotalScore(newScore);
    setCurrentStreak(newStreak);
    if (newStreak > bestStreak) setBestStreak(newStreak);

    setIsAnswered(true);
    setIsCorrect(true);
    setIsSpellingCorrection(isSpelling);
    setScoreEarned(points);
    setFeedbackMessage(null);

    // Update question record
    setQuestions(prev => {
      const updated = [...prev];
      if (updated[currentIndex]) {
        updated[currentIndex] = {
          ...updated[currentIndex],
          attempts,
          hintsUsed,
          isCorrect: true,
          isSpellingCorrection: isSpelling,
          isRevealed: false,
          scoreEarned: points
        };
      }
      return updated;
    });
  };

  // Fuzzy confirmation callbacks
  const handleConfirmFuzzy = () => {
    const attempts = fuzzyCheck?.attempts || attemptCount;
    setFuzzyCheck(null);
    handleSuccess({
      isSpelling: true,
      attempts
    });
  };

  const handleRejectFuzzy = () => {
    setFuzzyCheck(null);
    handleWrongAttempt();
  };

  // Give Up / Reveal Answer
  const handleGiveUp = () => {
    if (isAnswered || !currentQ) return;
    if (settings.soundEffects) Sound.playGiveUp();

    setIsAnswered(true);
    setIsCorrect(false);
    setIsRevealed(true);
    setScoreEarned(0);
    setCurrentStreak(0);
    setFeedbackMessage(null);

    setQuestions(prev => {
      const updated = [...prev];
      if (updated[currentIndex]) {
        updated[currentIndex] = {
          ...updated[currentIndex],
          attempts: attemptCount,
          hintsUsed,
          isCorrect: false,
          isSpellingCorrection: false,
          isRevealed: true,
          scoreEarned: 0
        };
      }
      return updated;
    });
  };

  // Next Question or Finish
  const handleNextQuestion = () => {
    if (settings.soundEffects) Sound.playClick();

    if (isLastQuestion) {
      finishGame();
      return;
    }

    const nextIdx = currentIndex + 1;

    // In Endless mode, dynamically append new question if we reached end of current pool
    if (isEndless && nextIdx >= questions.length) {
      const more = generateGameQuestions({ ...config, length: 10 });
      setQuestions(prev => [...prev, ...more]);
    }

    setCurrentIndex(nextIdx);
    setAttemptCount(0);
    setGuesses([]);
    setHintsUsed(0);
    setIsAnswered(false);
    setIsCorrect(false);
    setIsSpellingCorrection(false);
    setIsRevealed(false);
    setScoreEarned(0);
    setSelectedOption(null);
    setFeedbackMessage(null);
    setFuzzyCheck(null);
  };

  // Finish Game & Record Stats
  const finishGame = () => {
    // Record into LocalStorage
    Storage.recordGameResults({
      mode: config.mode,
      questions,
      totalScore
    });

    navigate('/results', {
      state: {
        config,
        questions,
        totalScore,
        bestStreak
      }
    });
  };

  const handleUseHint = () => {
    setHintsUsed(prev => Math.min(3, prev + 1));
  };

  if (!currentQ) {
    return (
      <div className="w-full max-w-lg mx-auto py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-500">Preparing geographic shapes...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-fade-in">
      
      {/* Header bar with Progress, Score, and Exit */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-xs">
          <ProgressBar
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            isEndless={isEndless}
          />
        </div>

        <div className="flex items-center gap-3">
          <ScoreBadge score={totalScore} streak={currentStreak} />

          {isEndless ? (
            <button
              type="button"
              onClick={finishGame}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 dark:hover:text-rose-400 text-slate-600 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-700 transition"
            >
              End Run
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (settings.confirmLeave) {
                  setShowExitModal(true);
                } else {
                  navigate('/');
                }
              }}
              title="Leave Game"
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Geographic Shape Silhouette Display */}
      <div className="space-y-3">
        <ShapeDisplay
          place={currentQ.place}
          isRevealed={isRevealed}
          isCorrect={isCorrect}
          allowRotation={config.difficulty === 'expert' || config.difficulty === 'hard'}
          enableAnimations={settings.animations}
        />

        <div className="text-center">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
            {config.mode === 'usa' ? 'What U.S. state is this?' : 'What country is this?'}
          </p>
        </div>
      </div>

      {/* Feedback Message Bar (Wrong answer notice) */}
      {feedbackMessage && !isAnswered && (
        <div className="w-full max-w-md mx-auto p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/80 text-rose-600 dark:text-rose-300 text-xs font-bold text-center flex items-center justify-center gap-2 animate-shake">
          <AlertCircle className="w-4 h-4" />
          <span>{feedbackMessage} (Attempt {attemptCount})</span>
        </div>
      )}

      {/* Interactive Controls / Input or Result Card */}
      {isAnswered ? (
        <AnswerFeedback
          place={currentQ.place}
          isCorrect={isCorrect}
          isSpellingCorrection={isSpellingCorrection}
          isRevealed={isRevealed}
          attempts={attemptCount}
          scoreEarned={scoreEarned}
          onNext={handleNextQuestion}
          isLastQuestion={isLastQuestion}
          enableAnimations={settings.animations}
        />
      ) : (
        <div className="space-y-4">
          
          {/* Answer Input or Multiple Choice */}
          {currentQ.questionType === 'choice' && currentQ.options ? (
            <MultipleChoice
              options={currentQ.options}
              onSelect={handleChoiceSelect}
              disabled={isAnswered}
              selectedOption={selectedOption}
              isRevealed={isAnswered}
            />
          ) : (
            <AnswerInput
              onSubmit={handleTypedAnswer}
              disabled={isAnswered}
              allPlaces={allPlaces}
              placeholder={config.mode === 'usa' ? "Type state name or abbreviation (e.g. Texas, TX)..." : "Type country name (e.g. France, Japan)..."}
              shake={shake}
              mode={config.mode}
            />
          )}

          {/* Hint and Give Up Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            
            <HintPanel
              place={currentQ.place}
              hintsUsed={hintsUsed}
              onUseHint={handleUseHint}
              disabled={isAnswered}
              soundEffects={settings.soundEffects}
            />

            <button
              type="button"
              onClick={handleGiveUp}
              disabled={isAnswered}
              className="text-xs font-semibold text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition underline underline-offset-2 disabled:opacity-30 disabled:pointer-events-none self-center sm:self-start pt-1"
            >
              Reveal Answer (0 pts)
            </button>

          </div>

        </div>
      )}

      {/* Fuzzy Match Misspelling Modal */}
      {fuzzyCheck && (
        <FuzzyMatchModal
          suggestedName={fuzzyCheck.suggestedName}
          originalGuess={fuzzyCheck.originalGuess}
          onConfirm={handleConfirmFuzzy}
          onReject={handleRejectFuzzy}
        />
      )}

      {/* Leave Game Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-slate-200 dark:border-slate-700 text-center space-y-4 animate-scale-in">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Leave Current Game?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your progress in this round will not be saved.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 transition"
              >
                Stay
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition shadow-md shadow-rose-600/20"
              >
                Leave Game
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
