import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBN2QfJfrWCelPzb_sFpzokhetxThDWzVs",
  authDomain: "pinnacle-acaedemia.firebaseapp.com",
  projectId: "pinnacle-acaedemia",
  storageBucket: "pinnacle-acaedemia.firebasestorage.app",
  messagingSenderId: "168280347570",
  appId: "1:168280347570:web:481df87e263f9f910b4aab",
  measurementId: "G-PNCF91FDDT"
};

const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();