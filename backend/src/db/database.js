const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../../data/motus.sqlite');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function callback(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function normalizeWord(word) {
  return word
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '');
}

const seedWords = [
  ['table', 'easy'],
  ['livre', 'easy'],
  ['avion', 'easy'],
  ['route', 'easy'],
  ['fleur', 'easy'],
  ['jardin', 'medium'],
  ['maison', 'medium'],
  ['orange', 'medium'],
  ['planete', 'medium'],
  ['musique', 'medium'],
  ['metropole', 'hard'],
  ['ordinateur', 'hard'],
  ['formation', 'hard'],
  ['strategie', 'hard'],
  ['plateforme', 'hard']
];

async function initDatabase() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

  await new Promise((resolve, reject) => {
    db.exec(schema, err => {
      if (err) reject(err);
      else resolve();
    });
  });

  for (const [word, difficulty] of seedWords) {
    const normalized = normalizeWord(word);
    await run(
      'INSERT OR IGNORE INTO words (word, length, difficulty) VALUES (?, ?, ?)',
      [normalized, normalized.length, difficulty]
    );
  }

  const demo = await get('SELECT id FROM users WHERE pseudo = ?', ['demo']);
  if (!demo) {
    const passwordHash = await bcrypt.hash('demo1234', 10);
    await run('INSERT INTO users (pseudo, password_hash) VALUES (?, ?)', ['demo', passwordHash]);
  }
}

module.exports = {
  db,
  run,
  get,
  all,
  initDatabase,
  normalizeWord
};
