import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Replace the following with your own Firebase project configuration
// You can find this in your Firebase Console: Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: "AIzaSyCQF-fKEeyb16sB0_PhUD_U5DInA2uL5Q4",
  authDomain: "vibe-login-e5386.firebaseapp.com",
  databaseURL: "https://vibe-login-e5386-default-rtdb.firebaseio.com",
  projectId: "vibe-login-e5386",
  storageBucket: "vibe-login-e5386.firebasestorage.app",
  messagingSenderId: "488033838213",
  appId: "1:488033838213:web:7e5d983ee978138d43b5ec"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
setPersistence(auth, browserSessionPersistence);

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
export const rtdb = getDatabase(app);
export const storage = getStorage(app);

export default app;
