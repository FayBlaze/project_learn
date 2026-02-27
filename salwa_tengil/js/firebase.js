import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  runTransaction,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCmBPtvp8tnPzgSrtXTUZdd_0KWiRfP0GQ",
  authDomain: "salwa-tengil-ca090.firebaseapp.com",
  projectId: "salwa-tengil-ca090",
  storageBucket: "salwa-tengil-ca090.firebasestorage.app",
  messagingSenderId: "184039466489",
  appId: "1:184039466489:web:e4c18ceaae667db2888928",
  measurementId: "G-BN4MB3NGS2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export { doc, setDoc, getDoc, updateDoc, onSnapshot, runTransaction };
