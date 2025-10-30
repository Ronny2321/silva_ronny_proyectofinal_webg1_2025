import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBOuLxqomYt5BSOkFyc6ijbHclKYfIeB9o",
  authDomain: "proyectofinal-webg1-silvaronny.firebaseapp.com",
  projectId: "proyectofinal-webg1-silvaronny",
  storageBucket: "proyectofinal-webg1-silvaronny.firebasestorage.app",
  messagingSenderId: "187983008141",
  appId: "1:187983008141:web:f10ca1868b628181172dc4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage };
export default db;