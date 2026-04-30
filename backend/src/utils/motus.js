function evaluateGuess(secret, guess) {
  const result = [];
  const secretLetters = secret.split('');
  const guessLetters = guess.split('');
  const usedSecret = Array(secret.length).fill(false);

  for (let i = 0; i < guessLetters.length; i += 1) {
    if (guessLetters[i] === secretLetters[i]) {
      result[i] = {
        letter: guessLetters[i],
        status: 'correct'
      };
      usedSecret[i] = true;
    }
  }

  for (let i = 0; i < guessLetters.length; i += 1) {
    if (result[i]) continue;

    const foundIndex = secretLetters.findIndex((letter, index) => {
      return !usedSecret[index] && letter === guessLetters[i];
    });

    if (foundIndex !== -1) {
      result[i] = {
        letter: guessLetters[i],
        status: 'present'
      };
      usedSecret[foundIndex] = true;
    } else {
      result[i] = {
        letter: guessLetters[i],
        status: 'absent'
      };
    }
  }

  return result;
}

function calculateScore(wordLength, attemptsUsed, difficulty) {
  const bonuses = {
    easy: 0,
    medium: 50,
    hard: 100
  };

  return Math.max(10, wordLength * 100 - attemptsUsed * 10 + (bonuses[difficulty] || 0));
}

function getDifficultyLength(difficulty) {
  if (difficulty === 'easy') return 5;
  if (difficulty === 'medium') return 7;
  if (difficulty === 'hard') return 9;
  return 5;
}

module.exports = {
  evaluateGuess,
  calculateScore,
  getDifficultyLength
};
