const express = require('express');
const { all } = require('../db/database');

const router = express.Router();

router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await all(
      `SELECT users.pseudo,
              MAX(scores.score) AS bestScore,
              COUNT(scores.id) AS victories
       FROM scores
       JOIN users ON users.id = scores.user_id
       GROUP BY users.id
       ORDER BY bestScore DESC, victories DESC
       LIMIT 10`
    );

    return res.json(leaderboard);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router;
