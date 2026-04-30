const jwt = require('jsonwebtoken');

function authRequired(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Vous devez être connecté.' });
  }

  const token = header.split(' ')[1];

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Session invalide ou expirée.' });
  }
}

module.exports = authRequired;
