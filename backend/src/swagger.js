const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Motus Master API',
    version: '1.0.0',
    description: 'API REST du jeu Motus Master'
  },
  servers: [
    {
      url: 'http://localhost:3000'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Créer un compte',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                pseudo: 'demo',
                password: 'demo1234'
              }
            }
          }
        },
        responses: {
          201: { description: 'Compte créé' },
          400: { description: 'Données invalides' }
        }
      }
    },
    '/api/auth/login': {
      post: {
        summary: 'Se connecter',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                pseudo: 'demo',
                password: 'demo1234'
              }
            }
          }
        },
        responses: {
          200: { description: 'Connexion réussie' },
          401: { description: 'Identifiants incorrects' }
        }
      }
    },
    '/api/game/start': {
      post: {
        summary: 'Commencer une partie',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                difficulty: 'easy'
              }
            }
          }
        },
        responses: {
          201: { description: 'Partie créée' },
          401: { description: 'Non connecté' }
        }
      }
    },
    '/api/game/guess': {
      post: {
        summary: 'Proposer un mot',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                gameId: 1,
                guess: 'table'
              }
            }
          }
        },
        responses: {
          200: { description: 'Résultat de la proposition' },
          400: { description: 'Erreur de validation' },
          401: { description: 'Non connecté' }
        }
      }
    },
    '/api/scores/leaderboard': {
      get: {
        summary: 'Classement des joueurs',
        responses: {
          200: { description: 'Classement' }
        }
      }
    }
  }
};

module.exports = swaggerDocument;
