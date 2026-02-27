import { generateRoomCode, generateNumber } from "./utils.js";
import { db, doc, setDoc, updateDoc, getDoc, onSnapshot } from "./firebase.js";

const creatorNames = ["Salwa", "Tengil", "Raja"];
const joinNames = ["Iblis", "Setan", "Hantu"];

const playBtn = document.getElementById("playBtn");
const joinBtn = document.getElementById("joinBtn");

playBtn.onclick = () => showDifficultyModal();
joinBtn.onclick = () => showJoinModal();


// ===============================
// CREATE ROOM
// ===============================

async function createRoom(difficulty) {
  const code = generateRoomCode();
  const name = creatorNames[Math.floor(Math.random()*3)];

  await setDoc(doc(db, "rooms", code), {
    difficulty,
    round: 1,
    status: "waiting",
    target: null,
    players: {
      creator: { name, score: 0, ready: false },
      join: null
    }
  });

  localStorage.setItem("room", code);
  localStorage.setItem("role", "creator");

  showWaitingRoom(code);
}


// ===============================
// JOIN ROOM
// ===============================

async function joinRoom(code) {
  try {
    const roomRef = doc(db, "rooms", code);
    const snap = await getDoc(roomRef);

    if (!snap.exists()) {
      alert("Room tidak ditemukan");
      return;
    }

    const data = snap.data();

    if (data.players.join) {
      alert("Room sudah penuh");
      return;
    }

    if (data.status !== "waiting") {
      alert("Game sudah dimulai");
      return;
    }

    const name = joinNames[Math.floor(Math.random()*3)];

    await updateDoc(roomRef, {
      "players.join": { name, score: 0, ready: false },
      status: "playing",
      target: generateNumber()   // target dibuat saat 2 player siap
    });

    localStorage.setItem("room", code);
    localStorage.setItem("role", "join");

    window.location.href = "play.html";

  } catch (err) {
    console.error("Join error:", err);
  }
}


// ===============================
// WAITING ROOM
// ===============================

function showWaitingRoom(code) {
  const modal = createModal(`
    <h3>Room Code</h3>
    <h2 style="letter-spacing:3px">${code}</h2>
    <p>Waiting for player...</p>
  `);

  const roomRef = doc(db, "rooms", code);

  onSnapshot(roomRef, (snap) => {
    const data = snap.data();

    if (data.status === "playing") {
      modal.remove();
      window.location.href = "play.html";
    }
  });
}


// ===============================
// MODALS
// ===============================

function showDifficultyModal() {
  const modal = createModal(`
    <h3>Select Difficulty</h3>
    <button class="diff" data-level="easy">Easy</button>
    <button class="diff" data-level="normal">Normal</button>
    <button class="diff" data-level="hard">Hard</button>
  `);

  modal.querySelectorAll(".diff").forEach(btn => {
    btn.addEventListener("click", () => {
      createRoom(btn.dataset.level);
      modal.remove();
    });
  });
}

function showJoinModal() {
  const modal = createModal(`
    <h3>Enter Room Code</h3>
    <input id="roomInput" placeholder="CODE"/>
    <button id="joinConfirm">Join</button>
  `);

  modal.querySelector("#joinConfirm")
    .addEventListener("click", () => {
      const code = modal.querySelector("#roomInput").value.trim();
      joinRoom(code);
      modal.remove();
    });
}

function createModal(content) {
  const modal = document.createElement("div");
  modal.className = "modal";

  modal.innerHTML = `
    <div class="modal-content">
      ${content}
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });

  return modal;
}
