import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Helper to get environment variables across different build tools
const getEnv = (key: string) => {
  const meta = import.meta as any;
  if (meta && meta.env && meta.env[`VITE_${key}`]) {
    return meta.env[`VITE_${key}`];
  }
  if (typeof process !== 'undefined' && process.env && process.env[`REACT_APP_${key}`]) {
    return process.env[`REACT_APP_${key}`];
  }
  return undefined;
};

// --- إعدادات فايربيس ---
// هام: استبل القيم أدناه بمعلومات مشروعك الخاص من Firebase Console
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Demo/fallback config (used only if no env vars provided)
const demoConfig = {
  apiKey: "AIzaSyAeGOG474WdFmZtTbsdtBnRqMCCaYId-u0",
  authDomain: "card-629c7.firebaseapp.com",
  projectId: "card-629c7",
  storageBucket: "card-629c7.firebasestorage.app",
  messagingSenderId: "584727584722",
  appId: "1:584727584722:web:1250b9dd13c7125012f20b",
  measurementId: "G-0M4Z9DBPCV"
};

// Build config from environment variables when available.
// Supports Vite (`import.meta.env.VITE_*`) and CRA-style (`process.env.REACT_APP_*`).
const firebaseConfig = {
  apiKey: getEnv('FIREBASE_API_KEY') || getEnv('API_KEY') || demoConfig.apiKey,
  authDomain: getEnv('FIREBASE_AUTH_DOMAIN') || demoConfig.authDomain,
  projectId: getEnv('FIREBASE_PROJECT_ID') || demoConfig.projectId,
  storageBucket: getEnv('FIREBASE_STORAGE_BUCKET') || demoConfig.storageBucket,
  messagingSenderId: getEnv('FIREBASE_MESSAGING_SENDER_ID') || demoConfig.messagingSenderId,
  appId: getEnv('FIREBASE_APP_ID') || demoConfig.appId,
  measurementId: getEnv('FIREBASE_MEASUREMENT_ID') || demoConfig.measurementId,
};

const isConfigured = typeof firebaseConfig.apiKey === 'string' && firebaseConfig.apiKey.length > 10;

// Initialize Firebase services
let db: any = null;
let storage: any = null;
let auth: any = null;

try {
  if (isConfigured || firebaseConfig.apiKey) {
      // Use the provided config (or the demo backup if strictly necessary for view-only)
      // For production, ensure the strings above are your REAL keys.
      const app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      storage = getStorage(app);
      auth = getAuth(app);
      console.log(isConfigured ? "Firebase initialized with YOUR config." : "Firebase running in DEMO mode.");
  } else {
    console.warn("Firebase Keys missing.");
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export { db, storage, auth };
