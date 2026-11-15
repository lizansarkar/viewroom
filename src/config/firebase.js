import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";

// ViewRoom Web App Firebase Configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDqsT4eThZzgtynek8g1m-1OUMCPGWcEyA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "viewroom-360.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "viewroom-360",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "viewroom-360.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "551486949581",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:551486949581:web:81b1e5a228d5df7b030184",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-CTD2564N8Z",
};

// Singleton Firebase App instance
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Firebase Authentication instance
export const auth = getAuth(app);

// Google OAuth Provider instance
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

/**
 * Sign in / Sign up with Google OAuth Popup
 * Returns Firebase User + ID Token for backend verification
 */
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();
  return {
    firebaseUser: result.user,
    idToken,
    email: result.user.email,
    displayName: result.user.displayName,
    photoURL: result.user.photoURL,
    uid: result.user.uid,
  };
}

/**
 * Sign in with Email and Password via Firebase
 */
export async function signInWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await result.user.getIdToken();
  return {
    firebaseUser: result.user,
    idToken,
    email: result.user.email,
    displayName: result.user.displayName,
    photoURL: result.user.photoURL,
    uid: result.user.uid,
  };
}

/**
 * Register with Email, Password, and Name via Firebase
 */
export async function signUpWithEmail(email, password, name) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  if (name) {
    await updateProfile(result.user, { displayName: name });
  }
  const idToken = await result.user.getIdToken();
  return {
    firebaseUser: result.user,
    idToken,
    email: result.user.email,
    displayName: name || result.user.displayName,
    photoURL: result.user.photoURL,
    uid: result.user.uid,
  };
}

/**
 * Sign out from Firebase
 */
export async function signOutFirebase() {
  await signOut(auth);
}
