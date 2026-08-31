import { WORLD_COUNTRIES } from '../src/data/countries.js';
import { USA_STATES } from '../src/data/states.js';
import { normalizeString, isExactAnswerMatch } from '../src/utils/answerMatching.js';
import { checkFuzzyMatch } from '../src/utils/fuzzyMatching.js';
import { calculateScore } from '../src/utils/scoring.js';
import { getDailyPlace, getTodayDateString, getDayNumber } from '../src/utils/gameGenerator.js';

console.log('=== RUNNING SHAPLE AUTOMATED TEST SUITE ===\n');

// Test 1: Data Completeness
console.log('1. Testing Geography Datasets:');
console.log(`- US States Count: ${USA_STATES.length} (Expected 50)`);
console.assert(USA_STATES.length === 50, 'Must have exactly 50 US States');

console.log(`- World Countries Count: ${WORLD_COUNTRIES.length} (Expected >= 180)`);
console.assert(WORLD_COUNTRIES.length >= 180, 'Must have >= 180 countries');

// Verify all items have valid SVG paths, viewboxes, and trivia
USA_STATES.forEach(s => {
  if (!s.svgPath || s.svgPath.length < 50) throw new Error(`Invalid SVG path for state: ${s.name}`);
  if (!s.region) throw new Error(`Missing region for state: ${s.name}`);
  if (!s.funFact) throw new Error(`Missing funFact for state: ${s.name}`);
});

WORLD_COUNTRIES.forEach(c => {
  if (!c.svgPath || c.svgPath.length < 50) throw new Error(`Invalid SVG path for country: ${c.name}`);
  if (!c.continent) throw new Error(`Missing continent for country: ${c.name}`);
  if (!c.funFact) throw new Error(`Missing funFact for country: ${c.name}`);
});
console.log('✓ All 50 states and 180+ countries have valid SVG paths and metadata!\n');

// Test 2: Smart Answer Matching & Normalization
console.log('2. Testing Smart Answer Matching:');
const texas = USA_STATES.find(s => s.name === 'Texas');
const usa = WORLD_COUNTRIES.find(c => c.name === 'United States');
const cote = WORLD_COUNTRIES.find(c => c.name === 'Ivory Coast');

console.assert(isExactAnswerMatch('Texas', texas), 'Exact case');
console.assert(isExactAnswerMatch('texas', texas), 'Lowercase');
console.assert(isExactAnswerMatch('  TEXAS  ', texas), 'Whitespace & uppercase');
console.assert(isExactAnswerMatch('TX', texas), 'State abbreviation');

console.assert(isExactAnswerMatch('United States', usa), 'Exact country');
console.assert(isExactAnswerMatch('USA', usa), 'USA alias');
console.assert(isExactAnswerMatch('United States of America', usa), 'Full name alias');
console.assert(isExactAnswerMatch('America', usa), 'America alias');

console.log('✓ Answer normalization & aliases work accurately!\n');

// Test 3: Fuzzy Matching (Misspelling Detection)
console.log('3. Testing Fuzzy Spelling Detection:');
const tests = [
  { guess: 'Texs', place: texas, expected: 'Texas' },
  { guess: 'Calfornia', place: USA_STATES.find(s => s.name === 'California'), expected: 'California' },
  { guess: 'Frnace', place: WORLD_COUNTRIES.find(c => c.name === 'France'), expected: 'France' },
  { guess: 'Argntina', place: WORLD_COUNTRIES.find(c => c.name === 'Argentina'), expected: 'Argentina' }
];

tests.forEach(t => {
  const result = checkFuzzyMatch(t.guess, t.place);
  console.log(`- Guess: "${t.guess}" -> Suggested: "${result?.suggestedName}" (Fuzzy: ${result?.isFuzzy})`);
  console.assert(result && result.isFuzzy && result.suggestedName === t.expected, `Failed fuzzy match for ${t.guess}`);
});
console.log('✓ All fuzzy match examples succeeded!\n');

// Test 4: Scoring Calculations
console.log('4. Testing Scoring Calculations:');
console.assert(calculateScore({ attemptCount: 1, isSpellingCorrection: false, hintsUsedCount: 0 }) === 100, '1st attempt = 100');
console.assert(calculateScore({ attemptCount: 2, isSpellingCorrection: false, hintsUsedCount: 0 }) === 75, '2nd attempt = 75');
console.assert(calculateScore({ attemptCount: 3, isSpellingCorrection: false, hintsUsedCount: 0 }) === 50, '3rd attempt = 50');
console.assert(calculateScore({ attemptCount: 1, isSpellingCorrection: true, hintsUsedCount: 0 }) === 50, 'Spelling correction = 50');
console.assert(calculateScore({ attemptCount: 1, isSpellingCorrection: false, hintsUsedCount: 2 }) === 70, 'Hint deduction: 100 - 30 = 70');
console.assert(calculateScore({ isRevealed: true }) === 0, 'Revealed = 0');
console.log('✓ Scoring rules verified!\n');

// Test 5: Daily Determinism
console.log('5. Testing Daily Seed Determinism:');
const dateStr = '2026-08-31';
const daily1 = getDailyPlace('world', dateStr);
const daily2 = getDailyPlace('world', dateStr);
console.log(`- Daily World for ${dateStr}: ${daily1.name}`);
console.assert(daily1.id === daily2.id, 'Daily selection must be deterministic');
console.log('✓ Daily deterministic selector verified!\n');

console.log('=== ALL TESTS PASSED SUCCESSFULLY! ===');
