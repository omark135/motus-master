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

    if (!response.ok) return null;

    const data = await response.json();
    const first = Array.isArray(data) ? data[0] : null;
    const rawWord = first && (first.name || first.word || first.mot);
    const word = rawWord ? normalizeWord(rawWord) : '';

    if (word.length === length) return word;
    return null;
  } catch (error) {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function getOrCreateWord(difficulty) {
  const targetLength = getDifficultyLength(difficulty);

  let row = await get(
    'SELECT * FROM words WHERE difficulty = ? AND length = ? ORDER BY RANDOM() LIMIT 1',
    [difficulty, targetLength]
  );

  if (row) return row;

  const apiWord = await fetchWordFromOpenApi(targetLength);

  if (apiWord) {
    const finalDifficulty = difficultyFromLength(apiWord.length);
    const insert = await run(
      'INSERT OR IGNORE INTO words (word, length, difficulty) VALUES (?, ?, ?)',
      [apiWord, apiWord.length, finalDifficulty]
    );

    row = await get('SELECT * FROM words WHERE word = ?', [apiWord]);
    if (row) return row;
  }

  row = await get(
    'SELECT * FROM words WHERE difficulty = ? ORDER BY RANDOM() LIMIT 1',
    [difficulty]
  );

  return row;
}

module.exports = {
  getOrCreateWord
};
