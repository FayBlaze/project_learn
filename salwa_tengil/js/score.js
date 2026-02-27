import { db, doc, getDoc } from "./firebase.js";

const punishments = [
  "Push up 20x","Nyanyi lagu random","Teriak aku cupu",
  "Dance 30 detik","Minum air","Selfie aneh",
  "Chat crush","Upload story","Plank 1 menit",
  "Baca puisi","Imitate hewan","Teriak nama sendiri"
];

const roomCode = localStorage.getItem("room");
const role = localStorage.getItem("role");
const container = document.getElementById("scoreContainer");

async function loadScore() {
  const snap = await getDoc(doc(db,"rooms",roomCode));
  const data = snap.data();

  if (!data || !data.players) {
    container.innerHTML = "<h2>Room tidak ditemukan</h2>";
    return;
  }

  const players = data.players;

  const creatorScore = players.creator?.score ?? 0;
  const joinScore = players.join?.score ?? 0;

  const winner = creatorScore > joinScore ? "creator" : "join";
  const loser = winner === "creator" ? "join" : "creator";

  const shuffled = [...punishments].sort(() => 0.5 - Math.random());
  const options = shuffled.slice(0,2);

  container.innerHTML = `
    <h2>Final Score</h2>
    <p>Creator: ${creatorScore}</p>
    <p>Join: ${joinScore}</p>
    <h3>Punishment</h3>
    ${options.map(p =>
      `<button ${role !== winner ? "disabled" : ""}>${p}</button>`
    ).join("")}
    <br><br>
    <button onclick="location.href='index.html'">Home</button>
  `;
}


loadScore();
