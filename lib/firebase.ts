import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA7bnwC47PHHXdUDbNwVKZxosswcA8eEnU",
  authDomain: "digital-marketplace-6fe83.firebaseapp.com",
  projectId: "digital-marketplace-6fe83",
  storageBucket: "digital-marketplace-6fe83.firebasestorage.app",
  messagingSenderId: "992103558490",
  appId: "1:992103558490:web:543a0a9ba37e4a3dc81763",
  measurementId: "G-RB1DS62GQB"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

export const authClient = auth;
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const db = getFirestore(app);
export const storage = getStorage(app);
export { app };