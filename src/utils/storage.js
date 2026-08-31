// LocalStorage management for Settings, Stats, Daily game tracking, and Unlocked Shapes

const SETTINGS_KEY = 'shaple_settings';
const STATS_KEY = 'shaple_statistics';
const DAILY_KEY = 'shaple_daily';

const DEFAULT_SETTINGS = {
  darkMode: true,
  soundEffects: true,
  animations: true,
  confirmLeave: true,
  lastSetup: {
    mode: 'world',
    difficulty: 'normal',
    answerStyle: 'mixed',
    length: 10,
    worldContinents: ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'],
    usaRegions: ['Northeast', 'Midwest', 'South', 'West']
  }
};

const DEFAULT_CATEGORY_STATS = {
  gamesPlayed: 0,
  questionsAnswered: 0,
  correctAnswers: 0,
  spellingCorrections: 0,
  incorrectAnswers: 0,
  totalAttempts: 0,
  bestStreak: 0,
  currentStreak: 0,
  perfectGames: 0,
  recognizedIds: []
};

const DEFAULT_STATS = {
  world: { ...DEFAULT_CATEGORY_STATS },
  usa: { ...DEFAULT_CATEGORY_STATS },
  overall: {
    totalGames: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    totalIncorrect: 0,
    totalSpelling: 0,
    longestStreak: 0,
    currentStreak: 0
  }
};

export const Storage = {
  getSettings() {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (!data) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(newSettings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (e) {}
  },

  getStats() {
    try {
      const data = localStorage.getItem(STATS_KEY);
      if (!data) return DEFAULT_STATS;
      const parsed = JSON.parse(data);
      return {
        world: { ...DEFAULT_CATEGORY_STATS, ...(parsed.world || {}) },
        usa: { ...DEFAULT_CATEGORY_STATS, ...(parsed.usa || {}) },
        overall: { ...DEFAULT_STATS.overall, ...(parsed.overall || {}) }
      };
    } catch (e) {
      return DEFAULT_STATS;
    }
  },

  saveStats(newStats) {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
    } catch (e) {}
  },

  recordGameResults({ mode, questions, totalScore }) {
    const stats = this.getStats();
    const cat = mode === 'usa' ? 'usa' : 'world';

    const catStats = stats[cat];
    const overallStats = stats.overall;

    catStats.gamesPlayed += 1;
    overallStats.totalGames += 1;

    let allCorrect = true;

    questions.forEach(q => {
      catStats.questionsAnswered += 1;
      overallStats.totalQuestions += 1;
      catStats.totalAttempts += q.attempts || 1;

      if (q.isCorrect) {
        if (q.isSpellingCorrection) {
          catStats.spellingCorrections += 1;
          overallStats.totalSpelling += 1;
        } else {
          catStats.correctAnswers += 1;
          overallStats.totalCorrect += 1;
        }

        // Streak
        catStats.currentStreak += 1;
        overallStats.currentStreak += 1;
        if (catStats.currentStreak > catStats.bestStreak) {
          catStats.bestStreak = catStats.currentStreak;
        }
        if (overallStats.currentStreak > overallStats.longestStreak) {
          overallStats.longestStreak = overallStats.currentStreak;
        }

        // Add to recognized list if not present
        if (q.place && q.place.id && !catStats.recognizedIds.includes(q.place.id)) {
          catStats.recognizedIds.push(q.place.id);
        }
      } else {
        allCorrect = false;
        catStats.incorrectAnswers += 1;
        overallStats.totalIncorrect += 1;
        catStats.currentStreak = 0;
        overallStats.currentStreak = 0;
      }
    });

    if (allCorrect && questions.length > 0) {
      catStats.perfectGames += 1;
    }

    stats[cat] = catStats;
    stats.overall = overallStats;
    this.saveStats(stats);
    return stats;
  },

  getDailyData(dateStr) {
    try {
      const allDaily = JSON.parse(localStorage.getItem(DAILY_KEY) || '{}');
      return allDaily[dateStr] || null;
    } catch (e) {
      return null;
    }
  },

  saveDailyData(dateStr, mode, resultData) {
    try {
      const allDaily = JSON.parse(localStorage.getItem(DAILY_KEY) || '{}');
      if (!allDaily[dateStr]) {
        allDaily[dateStr] = {};
      }
      allDaily[dateStr][mode] = resultData;
      localStorage.setItem(DAILY_KEY, JSON.stringify(allDaily));
    } catch (e) {}
  },

  resetStats() {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(DEFAULT_STATS));
    } catch (e) {}
  },

  resetAll() {
    try {
      localStorage.removeItem(SETTINGS_KEY);
      localStorage.removeItem(STATS_KEY);
      localStorage.removeItem(DAILY_KEY);
    } catch (e) {}
  }
};
