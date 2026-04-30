require('dotenv').config({ path: '../.env' });

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const { initDatabase } = require('./db/database');
const swaggerDocument = require('./swagger');

const authRoutes = require('./routes/auth.routes');
const gameRoutes = require('./routes/game.routes');
const scoreRoutes = require('./routes/score.routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Motus Master opérationnelle.' });
});

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/scores', scoreRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route introuvable.' });
});

initDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend lancé sur http://localhost:${port}`);
      console.log(`Swagger disponible sur http://localhost:${port}/swagger`);
    });
  })
  .catch(error => {
    console.error('Erreur initialisation base de données :', error);
    process.exit(1);
  });
