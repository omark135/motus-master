const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { get, run } = require('../db/database');

const router = express.Router();

function createToken(user) {
  return jwt.sign(
    { id: user.id, pseudo: user.pseudo },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '2h' }
  );
}

router.post('/register', async (req, res) => {
  try {
    const { pseudo, password } = req.body;

    if (!pseudo || !password) {
      return res.status(400).json({ message: 'Pseudo et mot de passe obligatoires.' });
    }

    if (pseudo.length < 3) {
      return res.status(400).json({ message: 'Le pseudo doit contenir au moins 3 caractères.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères.' });
    }

    const existingUser = await get('SELECT id FROM users WHERE pseudo = ?', [pseudo]);
    if (existingUser) {
      return res.status(409).json({ message: 'Ce pseudo existe déjà.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await run('INSERT INTO users (pseudo, password_hash) VALUES (?, ?)', [pseudo, passwordHash]);

    const user = { id: result.lastID, pseudo };
    return res.status(201).json({ token: createToken(user), user });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { pseudo, password } = req.body;

    if (!pseudo || !password) {
      return res.status(400).json({ message: 'Pseudo et mot de passe obligatoires.' });
    }

    const user = await get('SELECT * FROM users WHERE pseudo = ?', [pseudo]);
    if (!user) {
      return res.status(401).json({ message: 'Identifiants incorrects.' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Identifiants incorrects.' });
    }

    return res.json({
      token: createToken(user),
      user: {
        id: user.id,
        pseudo: user.pseudo
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router;
