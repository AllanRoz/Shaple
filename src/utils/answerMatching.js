/**
 * Normalize an input string for geography answer matching:
 * - lowercase
 * - remove diacritics/accents (e.g. Côte d'Ivoire -> cote d ivoire)
 * - remove punctuation and special characters
 * - normalize whitespace
 */
export function normalizeString(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accent marks
    .replace(/['’`\-.,/\\()[\]{}!?:;_]/g, ' ') // convert punctuation to spaces
    .replace(/\s+/g, ' ') // collapse multiple spaces
    .trim();
}

/**
 * Strips common prefixes like "the " (e.g. "The Bahamas" -> "bahamas")
 */
export function stripPrefixes(str) {
  const norm = normalizeString(str);
  return norm.replace(/^the\s+/, '');
}

/**
 * Check if the user guess matches the target place name or any of its aliases.
 * @param {string} userGuess - The raw input from the user
 * @param {object} targetPlace - The country or state object
 * @returns {boolean}
 */
export function isExactAnswerMatch(userGuess, targetPlace) {
  if (!userGuess || !targetPlace) return false;

  const cleanGuess = normalizeString(userGuess);
  const cleanGuessNoPrefix = stripPrefixes(userGuess);

  if (!cleanGuess) return false;

  // 1. Check primary name
  const cleanName = normalizeString(targetPlace.name);
  const cleanNameNoPrefix = stripPrefixes(targetPlace.name);

  if (cleanGuess === cleanName || cleanGuessNoPrefix === cleanNameNoPrefix) {
    return true;
  }

  // 2. Check abbreviation / ISO code
  if (targetPlace.abbreviation && cleanGuess === normalizeString(targetPlace.abbreviation)) {
    return true;
  }
  if (targetPlace.code && cleanGuess === normalizeString(targetPlace.code)) {
    return true;
  }

  // 3. Check aliases
  if (Array.isArray(targetPlace.aliases)) {
    for (const alias of targetPlace.aliases) {
      const cleanAlias = normalizeString(alias);
      const cleanAliasNoPrefix = stripPrefixes(alias);
      if (cleanGuess === cleanAlias || cleanGuessNoPrefix === cleanAliasNoPrefix) {
        return true;
      }
    }
  }

  return false;
}
