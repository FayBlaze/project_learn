import { db, doc, getDoc, updateDoc, onSnapshot, runTransaction } from "./firebase.js";
import { generateNumber, calculateScore } from "./utils.js";

const roomCode = localStorage.getItem("room");
const role = localStorage.getItem("role");

let target = null;
let timerInterval;
let timeLeft;

let attempts = 0;
const maxAttempts = 5;

let currentRound = 0;
let isWaiting = false;

const attemptEl = document.getElementById("attemptText");
const hintEl = document.getElementById("hintText");
const timerEl = document.getElementById("timer");
const roundText = document.getElementById("roundText");
const submitBtn = document.getElementById("submitGuess");

const guessInput = document.getElementById("guess");

const roomRef = doc(db, "rooms", roomCode);

disableInput(true);

listenRoom();


// ===============================
// REALTIME LISTENER
// ===============================
function removeWaitingOverlay() {
  const overlay = document.querySelector(".round-overlay");
  if (overlay) overlay.remove();
}

function listenRoom() {
  onSnapshot(roomRef, (snap) => {
    const data = snap.data();
    if (!data) return;

    if (data.status === "finished") {
      window.location.href = "score.html";
      return;
    }

    const serverRound = data.round;
    const meReady = data.players[role]?.ready;

    // =========================
    // 1️⃣ ROUND BARU
    // =========================
    if (serverRound !== currentRound) {

      currentRound = serverRound;
      isWaiting = false;

      removeWaitingOverlay();
      target = data.target;
      startRound(serverRound);

      return;
    }

    // =========================
    // 2️⃣ SAYA SUDAH SELESAI
    // =========================
    if (meReady && !isWaiting) {
      isWaiting = true;
      showWaitingOverlay();
    }

  });
}

// ===============================
// START ROUND
// ===============================

function startRound(round) {
  clearInterval(timerInterval);

  attempts = 0;
  updateAttemptUI();
  hintEl.innerText = "";
  guessInput.value = "";

  roundText.innerText = `Round ${round}/6`;

  disableInput(true);
  countdown(3);
}


// ===============================
// COUNTDOWN
// ===============================

function countdown(n) {
  timerEl.innerText = n;

  if (n > 0) {
    setTimeout(() => countdown(n - 1), 1000);
  } else {
    disableInput(false);
    startTimer();
  }
}


// ===============================
// TIMER
// ===============================

async function startTimer() {
  const snap = await getDoc(roomRef);
  const difficulty = snap.data().difficulty;

  timeLeft =
    difficulty === "easy" ? 30 :
    difficulty === "normal" ? 15 :
    10;

  timerInterval = setInterval(() => {
    timerEl.innerText = timeLeft;
    timeLeft--;

    if (timeLeft < 0) {
      endRound(0);
    }
  }, 1000);
}


// ===============================
// SUBMIT GUESS
// ===============================

submitBtn.onclick = async () => {
  const guess = Number(guessInput.value);
  if (!guess) return;

  attempts++;
  updateAttemptUI();

  if (guess > target) {
    hintEl.innerText = "Terlalu besar!";
  } else if (guess < target) {
    hintEl.innerText = "Terlalu kecil!";
  } else {
    hintEl.innerText = "Benar!";
    endRound(guess);
    return;
  }

  if (attempts >= maxAttempts) {
    hintEl.innerText = `Kesempatan habis! Angkanya ${target}`;
    endRound(0);
  }
};


// ===============================
// END ROUND
// ===============================

async function endRound(guess = 0) {
  clearInterval(timerInterval);
  disableInput(true);

  const snap = await getDoc(roomRef);
  const data = snap.data();

  const difficulty = data.difficulty;
  const player = data.players[role];

  const points = calculateScore(difficulty, guess, target);
  const newScore = player.score + points;

  await updateDoc(roomRef, {
    [`players.${role}.score`]: newScore,
    [`players.${role}.ready`]: true
  });

  checkBothReady();
}


// ===============================
// CHECK READY
// ===============================

async function checkBothReady() {

  await runTransaction(db, async (transaction) => {

    const snap = await transaction.get(roomRef);
    if (!snap.exists()) return;

    const data = snap.data();

    const creatorReady = data.players.creator?.ready;
    const joinReady = data.players.join?.ready;

    // Kalau belum dua-duanya ready, jangan apa-apa
    if (!(creatorReady && joinReady)) return;

    // Kalau sudah selesai 6 ronde
    if (data.round >= 6) {
      transaction.update(roomRef, {
        status: "finished"
      });
      return;
    }

    // Naikkan ronde secara atomic
    transaction.update(roomRef, {
      round: data.round + 1,
      target: generateNumber(),
      "players.creator.ready": false,
      "players.join.ready": false
    });

  });
}


// ===============================
// UI HELPERS
// ===============================

function disableInput(state) {
  guessInput.disabled = state;
  submitBtn.disabled = state;
}

function updateAttemptUI() {
  attemptEl.innerText = `Attempt ${attempts}/${maxAttempts}`;
}

function showWaitingOverlay() {
  const existing = document.querySelector(".round-overlay");
  if (existing) return;

  const overlay = document.createElement("div");
  overlay.className = "round-overlay";
  overlay.innerHTML = `<h2>Menunggu pemain lain...</h2>`;
  document.body.appendChild(overlay);
}