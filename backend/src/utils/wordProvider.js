const { get, run, normalizeWord } = require('../db/database');
const { getDifficultyLength } = require('./motus');

function difficultyFromLength(length) {
  if (length <= 5) return 'easy';
  if (length <= 7) return 'medium';
  return 'hard';
}

async function fetchWordFromOpenApi(length) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(`https://trouve-mot.fr/api/size/${length}`, {
      signal: controller.signal
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * data.length);
    const selectedWord = data[randomIndex];

    const rawWord = selectedWord && (
      selectedWord.name ||
      selectedWord.word ||
      selectedWord.mot
    );

    const word = rawWord ? normalizeWord(rawWord) : '';

    if (word.length !== length) {
      return null;
    }

    return word;
  } catch (error) {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function getOrCreateWord(difficulty) {
  const targetLength = getDifficultyLength(difficulty);

  const apiWord = await fetchWordFromOpenApi(targetLength);

  if (apiWord) {
    const finalDifficulty = difficultyFromLength(apiWord.length);

    await run(
      'INSERT OR IGNORE INTO words (word, length, difficulty) VALUES (?, ?, ?)',
      [apiWord, apiWord.length, finalDifficulty]
    );

    const row = await get('SELECT * FROM words WHERE word = ?', [apiWord]);

    if (row) {
      return row;
    }
  }

  const fallbackWord = await get(
    'SELECT * FROM words WHERE difficulty = ? AND length = ? ORDER BY RANDOM() LIMIT 1',
    [difficulty, targetLength]
  );

  if (fallbackWord) {
    return fallbackWord;
  }

  return get(
    'SELECT * FROM words WHERE difficulty = ? ORDER BY RANDOM() LIMIT 1',
    [difficulty]
  );
}

module.exports = {
  getOrCreateWord
};