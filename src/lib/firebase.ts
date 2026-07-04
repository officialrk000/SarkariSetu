import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBr2dg_VbWz69RO0_2TYtF425G6gTMlHs0",
  authDomain: "gen-lang-client-0566182257.firebaseapp.com",
  projectId: "gen-lang-client-0566182257",
  storageBucket: "gen-lang-client-0566182257.firebasestorage.app",
  messagingSenderId: "354411776543",
  appId: "1:354411776543:web:39c32420250db39f42232a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
