const express = require('express');
const authRequired = require('../middleware/auth');
const { get, run, all, normalizeWord } = require('../db/database');
const { evaluateGuess, calculateScore } = require('../utils/motus');
const { getOrCreateWord } = require('../utils/wordProvider');

const router = express.Router();
const MAX_ATTEMPTS = 6;

router.post('/start', authRequired, async (req, res) => {
  try {
    const difficulty = req.body.difficulty || 'easy';

    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return res.status(400).json({ message: 'Difficulté invalide.' });
    }

    const word = await getOrCreateWord(difficulty);

    if (!word) {
      return res.status(500).json({ message: 'Impossible de générer un mot.' });
    }

    const result = await run(
      'INSERT INTO games (user_id, word_id, difficulty) VALUES (?, ?, ?)',
      [req.user.id, word.id, difficulty]
    );

    return res.status(201).json({
      gameId: result.lastID,
      difficulty,
      wordLength: word.length,
      firstLetter: word.word[0],
      maxAttempts: MAX_ATTEMPTS
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
});

router.get('/:id', authRequired, async (req, res) => {
  try {
    const game = await get(
      `SELECT games.*, words.word, words.length
       FROM games
       JOIN words ON words.id = games.word_id
       WHERE games.id = ? AND games.user_id = ?`,
      [req.params.id, req.user.id]
    );

    if (!game) {
      return res.status(404).json({ message: 'Partie introuvable.' });
    }

    const guesses = await all(
      'SELECT guess, result_json, attempt_number FROM guesses WHERE game_id = ? ORDER BY attempt_number ASC',
      [game.id]
    );

    return res.json({
      id: game.id,
      status: game.status,
      difficulty: game.difficulty,
      wordLength: game.length,
      firstLetter: game.word[0],
      attemptsUsed: game.attempts_used,
      maxAttempts: MAX_ATTEMPTS,
      guesses: guesses.map(item => ({
        guess: item.guess,
        attemptNumber: item.attempt_number,
        result: JSON.parse(item.result_json)
      }))
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
});

router.post('/guess', authRequired, async (req, res) => {
  try {
    const { gameId, guess } = req.body;
    const normalizedGuess = normalizeWord(guess || '');

    const game = await get(
      `SELECT games.*, words.word, words.length
       FROM games
       JOIN words ON words.id = games.word_id
       WHERE games.id = ? AND games.user_id = ?`,
      [gameId, req.user.id]
    );

    if (!game) {
      return res.status(404).json({ message: 'Partie introuvable.' });
    }

    if (game.status !== 'playing') {
      return res.status(400).json({ message: 'Cette partie est déjà terminée.' });
    }

    if (normalizedGuess.length !== game.length) {
      return res.status(400).json({
        message: `Le mot doit contenir ${game.length} lettres.`
      });
    }

    if (normalizedGuess[0] !== game.word[0]) {
      return res.status(400).json({
        message: `Le mot doit commencer par la lettre ${game.word[0].toUpperCase()}.`
      });
    }

    const attemptNumber = game.attempts_used + 1;
    const result = evaluateGuess(game.word, normalizedGuess);
    const won = normalizedGuess === game.word;
    const lost = !won && attemptNumber >= MAX_ATTEMPTS;
    const status = won ? 'won' : lost ? 'lost' : 'playing';

    await run(
      'INSERT INTO guesses (game_id, guess, result_json, attempt_number) VALUES (?, ?, ?, ?)',
      [game.id, normalizedGuess, JSON.stringify(result), attemptNumber]
    );

    await run(
      'UPDATE games SET status = ?, attempts_used = ?, finished_at = CASE WHEN ? != "playing" THEN CURRENT_TIMESTAMP ELSE finished_at END WHERE id = ?',
      [status, attemptNumber, status, game.id]
    );

    let score = null;

    if (won) {
      score = calculateScore(game.length, attemptNumber, game.difficulty);
      await run(
        'INSERT INTO scores (user_id, game_id, score) VALUES (?, ?, ?)',
        [req.user.id, game.id, score]
      );
    }

    return res.json({
      result,
      status,
      attemptsUsed: attemptNumber,
      maxAttempts: MAX_ATTEMPTS,
      score,
      secretWord: status === 'lost' ? game.word : undefined,
      message: won
        ? 'Bravo, vous avez gagné !'
        : lost
          ? `Perdu ! Le mot était ${game.word.toUpperCase()}.`
          : 'Continuez.'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router;
