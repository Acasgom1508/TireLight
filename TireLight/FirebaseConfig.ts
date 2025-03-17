// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBf660Oheeu-cXTKTTJuLF4e0f_q0o3CqA",
  authDomain: "tirelight-38698.firebaseapp.com",
  projectId: "tirelight-38698",
  storageBucket: "tirelight-38698.firebasestorage.app",
  messagingSenderId: "592122183758",
  appId: "1:592122183758:web:0f8f4ff540727815a4c31f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app);
const db = getFirestore(app);