/**
 * Scoring system parameters:
 * - 1st attempt: 100 points
 * - 2nd attempt: 75 points
 * - 3rd attempt: 50 points
 * - 4th+ attempt: 35 points
 * - Spelling correction confirmed: 50 points
 * - Hint penalty: -15 points per hint revealed (min score 10 points)
 * - Revealed / Give up: 0 points
 */

export function calculateScore({ attemptCount, isSpellingCorrection, hintsUsedCount, isRevealed }) {
  if (isRevealed) {
    return 0;
  }

  let basePoints = 100;
  if (isSpellingCorrection) {
    basePoints = 50;
  } else if (attemptCount === 1) {
    basePoints = 100;
  } else if (attemptCount === 2) {
    basePoints = 75;
  } else if (attemptCount === 3) {
    basePoints = 50;
  } else {
    basePoints = 35;
  }

  const hintPenalty = (hintsUsedCount || 0) * 15;
  const finalScore = Math.max(10, basePoints - hintPenalty);

  return finalScore;
}
