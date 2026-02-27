export function generateRoomCode() {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

export function generateNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

export function calculateScore(difficulty, guess, target) {
  const diff = Math.abs(guess - target);

  if (difficulty === "easy") {
    if (diff === 0) return 2;
    if (diff <= 10) return 1;
    return 0;
  }

  if (difficulty === "normal") {
    if (diff === 0) return 2;
    if (diff <= 10) return 1;
    return -1;
  }

  if (difficulty === "hard") {
    if (diff === 0) return 1;
    return -2;
  }

  return 0;
}
