import { normalizeString, stripPrefixes } from './answerMatching.js';

/**
 * Compute Damerau-Levenshtein distance between two strings
 * Handles insertions, deletions, substitutions, and adjacent transpositions (e.g. "Frnace" -> "France")
 */
export function damerauLevenshteinDistance(source, target) {
  if (!source) return target ? target.length : 0;
  if (!target) return source.length;

  const m = source.length;
  const n = target.length;
  const d = [];

  for (let i = 0; i <= m; i++) {
    d[i] = [i];
  }
  for (let j = 0; j <= n; j++) {
    d[0][j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = source[i - 1] === target[j - 1] ? 0 : 1;

      d[i][j] = Math.min(
        d[i - 1][j] + 1, // deletion
        d[i][j - 1] + 1, // insertion
        d[i - 1][j - 1] + cost // substitution
      );

      // Transposition
      if (
        i > 1 &&
        j > 1 &&
        source[i - 1] === target[j - 2] &&
        source[i - 2] === target[j - 1]
      ) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }

  return d[m][n];
}

/**
 * Check if a guess is a likely misspelling of the target place
 * @param {string} userGuess - The raw input from user
 * @param {object} targetPlace - The current target place object
 * @returns {{ isFuzzy: boolean, suggestedName: string, distance: number } | null}
 */
export function checkFuzzyMatch(userGuess, targetPlace) {
  if (!userGuess || !targetPlace) return null;

  const cleanGuess = normalizeString(userGuess);
  const cleanGuessNoPrefix = stripPrefixes(userGuess);

  if (cleanGuess.length < 3) return null; // Avoid trivial false positives for 1-2 letter acronyms

  const candidates = [
    targetPlace.name,
    ...(Array.isArray(targetPlace.aliases) ? targetPlace.aliases : [])
  ];

  let bestMatch = null;
  let minDistance = Infinity;

  for (const candidate of candidates) {
    if (!candidate || candidate.length < 3) continue;

    const cleanCandidate = normalizeString(candidate);
    const cleanCandNoPrefix = stripPrefixes(candidate);

    // Don't flag exact matches here
    if (cleanGuess === cleanCandidate || cleanGuessNoPrefix === cleanCandNoPrefix) {
      return null;
    }

    const dist1 = damerauLevenshteinDistance(cleanGuess, cleanCandidate);
    const dist2 = damerauLevenshteinDistance(cleanGuessNoPrefix, cleanCandNoPrefix);
    const dist = Math.min(dist1, dist2);

    const maxLen = Math.max(cleanGuess.length, cleanCandidate.length);

    // Allow threshold based on word length:
    // Length 3: distance <= 1
    // Length 4-7: distance <= 2
    // Length >= 8: distance <= 3 (or similarity >= 0.72)
    let isAllowed = false;
    if (maxLen <= 4 && dist === 1) {
      isAllowed = true;
    } else if (maxLen <= 7 && dist <= 2) {
      isAllowed = true;
    } else if (maxLen >= 8 && (dist <= 3 || (1 - dist / maxLen) >= 0.72)) {
      isAllowed = true;
    }

    if (isAllowed && dist < minDistance) {
      minDistance = dist;
      bestMatch = targetPlace.name;
    }
  }

  if (bestMatch && minDistance <= 3) {
    return {
      isFuzzy: true,
      suggestedName: bestMatch,
      distance: minDistance
    };
  }

  return null;
}
