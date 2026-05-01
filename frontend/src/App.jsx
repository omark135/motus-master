import React from "react";
import { useEffect, useMemo, useState } from "react";
import { apiFetch, getUser, login, logout, register } from "./services/api";

const difficulties = {
  easy: "Facile",
  medium: "Moyen",
  hard: "Difficile",
};

function AuthForm({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const user =
        mode === "login"
          ? await login(pseudo, password)
          : await register(pseudo, password);

      onAuth(user);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="card auth-card">
      <h2>{mode === "login" ? "Connexion" : "Créer un compte"}</h2>
      <p>Connecte-toi pour jouer à Motus Master.</p>

      <form onSubmit={handleSubmit}>
        <label>
          Pseudo
          <input
            value={pseudo}
            onChange={(event) => setPseudo(event.target.value)}
            placeholder="ex : demo"
          />
        </label>

        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="ex : demo1234"
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit">
          {mode === "login" ? "Se connecter" : "Créer mon compte"}
        </button>
      </form>

      <button
        className="link-button"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        {mode === "login" ? "Je veux créer un compte" : "J’ai déjà un compte"}
      </button>
    </section>
  );
}

function Grid({ game, guesses }) {
  const emptyRowsCount = Math.max(0, game.maxAttempts - guesses.length);
  const emptyRows = Array.from({ length: emptyRowsCount });

  return (
    <div className="grid">
      {guesses.map((guess, rowIndex) => (
        <div className="grid-row" key={`guess-${rowIndex}`}>
          {guess.result.map((cell, index) => (
            <div className={`cell ${cell.status}`} key={`${cell.letter}-${index}`}>
              {cell.letter}
            </div>
          ))}
        </div>
      ))}

      {emptyRows.map((_, rowIndex) => (
        <div className="grid-row" key={`empty-${rowIndex}`}>
          {Array.from({ length: game.wordLength }).map((__, index) => (
            <div className="cell empty" key={index}>
              {guesses.length === 0 && rowIndex === 0 && index === 0
                ? game.firstLetter
                : ""}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function Leaderboard({ refreshKey }) {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    apiFetch("/api/scores/leaderboard")
      .then(setScores)
      .catch(() => setScores([]));
  }, [refreshKey]);

  return (
    <section className="card">
      <h2>Classement général</h2>
      <p className="small-text">
        Ce classement affiche les meilleurs scores de tous les joueurs.
      </p>

      {scores.length === 0 ? (
        <p>Aucun score pour le moment.</p>
      ) : (
        <ol className="leaderboard">
          {scores.map((score, index) => (
            <li key={`${score.pseudo}-${index}`}>
              <span>{score.pseudo}</span>
              <strong>{score.bestScore} pts</strong>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function Game({ user, onLogout }) {
  const [difficulty, setDifficulty] = useState("easy");
  const [game, setGame] = useState(null);
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [message, setMessage] = useState("");
  const [refreshScores, setRefreshScores] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);

  const canGuess = useMemo(() => game && game.status === "playing", [game]);

  async function startGame(selectedDifficulty = difficulty) {
    setMessage("");
    setGuesses([]);
    setGuess("");
    setCurrentScore(0);

    try {
      const data = await apiFetch("/api/game/start", {
        method: "POST",
        body: JSON.stringify({ difficulty: selectedDifficulty }),
      });

      setGame({ ...data, status: "playing" });
      setGuess(data.firstLetter);
      setMessage(
        `Nouveau mot : ${data.wordLength} lettres. Première lettre : ${data.firstLetter.toUpperCase()}`
      );
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function submitGuess(event) {
    event.preventDefault();

    if (!game) return;

    try {
      const data = await apiFetch("/api/game/guess", {
        method: "POST",
        body: JSON.stringify({ gameId: game.gameId, guess }),
      });

      setGuesses((previous) => [
        ...previous,
        {
          guess,
          result: data.result,
        },
      ]);

      setGame((previous) => ({
        ...previous,
        status: data.status,
        attemptsUsed: data.attemptsUsed,
      }));

      setMessage(data.score ? `${data.message} Score : ${data.score}` : data.message);

      if (data.score) {
        setCurrentScore(data.score);
      }

      setGuess(game.firstLetter);

      if (data.status !== "playing") {
        setRefreshScores((value) => value + 1);
      }
    } catch (err) {
      setMessage(err.message);
    }
  }

  function handleDifficultyChange(event) {
    const nextDifficulty = event.target.value;
    setDifficulty(nextDifficulty);
    startGame(nextDifficulty);
  }

  return (
    <main className="layout">
      <section className="hero">
        <div>
          <h1>Mo mo mo MOTUS !</h1>
          <p>Bienvenue {user.pseudo}. Trouve le mot en 6 essais.</p>
          <p>Score actuel de {user.pseudo} : {currentScore} pts</p>
        </div>

        <button
          className="secondary"
          onClick={() => {
            logout();
            onLogout();
          }}
        >
          Déconnexion
        </button>
      </section>

      <div className="columns">
        <section className="card game-card">
          <div className="game-header">
            <div>
              <h2>Partie</h2>
              <p>Choisis une difficulté puis propose un mot.</p>
            </div>

            <select value={difficulty} onChange={handleDifficultyChange}>
              {Object.entries(difficulties).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {!game ? (
            <button onClick={() => startGame()}>Commencer</button>
          ) : (
            <>
              <Grid game={game} guesses={guesses} />

              <form className="guess-form" onSubmit={submitGuess}>
                <input
                  value={guess}
                  disabled={!canGuess}
                  maxLength={game.wordLength}
                  onChange={(event) => setGuess(event.target.value.toLowerCase())}
                />
                <button disabled={!canGuess} type="submit">
                  Valider
                </button>
              </form>

              <div className="legend">
                <span>
                  <b className="legend-box correct"></b> Bien placé
                </span>
                <span>
                  <b className="legend-box present"></b> Mal placé
                </span>
                <span>
                  <b className="legend-box absent"></b> Absent
                </span>
              </div>

              <button className="secondary" onClick={() => startGame()}>
                Recommencer
              </button>
            </>
          )}

          {message && <p className="message">{message}</p>}
        </section>

        <Leaderboard refreshKey={refreshScores} />
      </div>
    </main>
  );
}

export default function App() {
  const [user, setUser] = useState(getUser());

  return user ? (
    <Game user={user} onLogout={() => setUser(null)} />
  ) : (
    <main className="layout centered">
      <section className="hero simple">
        <h1>Motus Master</h1>
        <p>Jeu complet avec compte, score et classement.</p>
      </section>
      <AuthForm onAuth={setUser} />
    </main>
  );
}