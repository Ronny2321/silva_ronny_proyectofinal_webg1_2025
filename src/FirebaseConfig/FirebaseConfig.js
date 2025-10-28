// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_HmZwpkpHHg-pQ2tTQ-Fpv2V0k4oFaa0",
  authDomain: "wilmerweb1-2025-ii-7c263.firebaseapp.com",
  projectId: "wilmerweb1-2025-ii-7c263",
  storageBucket: "wilmerweb1-2025-ii-7c263.firebasestorage.app",
  messagingSenderId: "468934444781",
  appId: "1:468934444781:web:aab7dea7885b6bcf31eee4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;