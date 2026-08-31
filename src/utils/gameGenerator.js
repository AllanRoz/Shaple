import { WORLD_COUNTRIES } from '../data/countries.js';
import { USA_STATES } from '../data/states.js';

// Simple fast deterministic string hashing (DJB2)
export function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Calculate Day number relative to epoch date (Jan 1, 2026)
export function getDayNumber(dateObj = new Date()) {
  const epoch = new Date('2026-01-01T00:00:00Z');
  const target = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()));
  const diffTime = Math.abs(target - epoch);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}

// Format date as YYYY-MM-DD
export function getTodayDateString(dateObj = new Date()) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get the deterministic daily place for today
 * @param {'world' | 'usa'} mode
 * @param {string} dateStr - 'YYYY-MM-DD'
 */
export function getDailyPlace(mode, dateStr) {
  const list = mode === 'usa' ? USA_STATES : WORLD_COUNTRIES;
  const hash = hashString(`${mode}_${dateStr}`);
  const index = hash % list.length;
  return list[index];
}

/**
 * Shuffle an array immutably (Fisher-Yates)
 */
export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generate 3 smart distractors for Multiple Choice
 */
export function generateDistractors(correctPlace, allPlacesList) {
  // Try to find distractors in same continent / region first
  const sameRegion = allPlacesList.filter(
    p => p.id !== correctPlace.id && (
      (p.continent && p.continent === correctPlace.continent) ||
      (p.region && p.region === correctPlace.region)
    )
  );

  const others = allPlacesList.filter(
    p => p.id !== correctPlace.id && !sameRegion.some(sr => sr.id === p.id)
  );

  let pool = [];
  if (sameRegion.length >= 3) {
    pool = shuffle(sameRegion).slice(0, 3);
  } else {
    pool = [...sameRegion, ...shuffle(others)].slice(0, 3);
  }

  const options = shuffle([
    { id: correctPlace.id, name: correctPlace.name, isCorrect: true },
    ...pool.map(p => ({ id: p.id, name: p.name, isCorrect: false }))
  ]);

  return options;
}

/**
 * Generate game questions based on configuration
 */
export function generateGameQuestions({
  mode = 'world',
  difficulty = 'normal',
  answerStyle = 'mixed',
  length = 10,
  worldContinents = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'],
  usaRegions = ['Northeast', 'Midwest', 'South', 'West']
}) {
  const sourceList = mode === 'usa' ? USA_STATES : WORLD_COUNTRIES;

  // Filter by region / continent
  let filtered = sourceList.filter(place => {
    if (mode === 'usa') {
      return !usaRegions || usaRegions.length === 0 || usaRegions.includes(place.region);
    } else {
      return !worldContinents || worldContinents.length === 0 || worldContinents.includes(place.continent);
    }
  });

  // Filter by difficulty
  if (difficulty === 'easy') {
    const easyList = filtered.filter(p => p.difficulty === 'easy');
    if (easyList.length >= (length === 'endless' ? 10 : length)) {
      filtered = easyList;
    }
  } else if (difficulty === 'hard') {
    const hardList = filtered.filter(p => p.difficulty === 'hard' || p.difficulty === 'normal');
    if (hardList.length >= (length === 'endless' ? 10 : length)) {
      filtered = hardList;
    }
  }

  if (filtered.length === 0) {
    filtered = sourceList; // Fallback
  }

  const shuffledPool = shuffle(filtered);
  const count = length === 'endless' ? shuffledPool.length : Math.min(Number(length) || 10, shuffledPool.length);
  const selectedPlaces = shuffledPool.slice(0, count);

  return selectedPlaces.map((place, idx) => {
    let questionType = 'type'; // 'type' | 'choice'

    if (answerStyle === 'choice') {
      questionType = 'choice';
    } else if (answerStyle === 'type') {
      questionType = 'type';
    } else if (answerStyle === 'mixed') {
      // Alternate or randomize 50/50
      questionType = idx % 2 === 0 ? 'type' : 'choice';
    }

    const options = questionType === 'choice' ? generateDistractors(place, sourceList) : null;

    return {
      place,
      questionType,
      options,
      attempts: 0,
      guesses: [],
      hintsUsed: 0, // 0, 1, 2, 3
      isCorrect: false,
      isSpellingCorrection: false,
      isRevealed: false,
      scoreEarned: 0
    };
  });
}
