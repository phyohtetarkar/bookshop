import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";
import { getStorage } from "firebase/storage";

const firebaseApp = initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "lumbini-book-club.firebaseapp.com",
  projectId: "lumbini-book-club",
  storageBucket: "lumbini-book-club.appspot.com",
  appId: "1:886093863087:web:73a92678409cf41bbfdc5a",
});

export const firestore = getFirestore(firebaseApp);
export const firebaseAuth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);
