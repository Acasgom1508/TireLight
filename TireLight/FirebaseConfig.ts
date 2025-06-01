import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBf660Oheeu-cXTKTTJuLF4e0f_q0o3CqA",
  authDomain: "tirelight-38698.firebaseapp.com",
  projectId: "tirelight-38698",
  storageBucket: "tirelight-38698.firebasestorage.app",
  messagingSenderId: "592122183758",
  appId: "1:592122183758:web:0f8f4ff540727815a4c31f"
};

// Inicializar Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);
export const auth = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const FIREBASE_DB = getFirestore(FIREBASE_APP);

const FIREBASE_AUTH = auth;

export { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB };
