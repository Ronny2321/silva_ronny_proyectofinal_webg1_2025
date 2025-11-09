import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBOuLxqomYt5BSOkFyc6ijbHclKYfIeB9o",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "proyectofinal-webg1-silvaronny.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "proyectofinal-webg1-silvaronny",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "proyectofinal-webg1-silvaronny.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "187983008141",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:187983008141:web:f10ca1868b628181172dc4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage };
export default db;