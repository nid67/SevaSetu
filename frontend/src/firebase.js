import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Replace these with actual Firebase config values when deploying
const firebaseConfig = {
  apiKey: "AIzaSyCYi9DRiL92GEVtvXrxKDpGY7c_ds67NO4",
  authDomain: "sevasetu-4.firebaseapp.com",
  projectId: "sevasetu-4",
  storageBucket: "sevasetu-4.firebasestorage.app",
  messagingSenderId: "194176208762",
  appId: "1:194176208762:web:785d637bc14c20bf08d0c3",
  measurementId: "G-P1MFRGSN19"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Optional: Connect to local Firestore emulator
if (window.location.hostname === "localhost" && import.meta.env.VITE_USE_EMULATORS === 'true') {
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
}

export { db };
