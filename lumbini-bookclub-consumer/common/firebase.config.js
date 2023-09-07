import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";

const firebaseApp = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "lumbini-book-club.firebaseapp.com",
  projectId: "lumbini-book-club",
  storageBucket: "lumbini-book-club.appspot.com",
  appId: "1:886093863087:web:73a92678409cf41bbfdc5a",
});

export const firestore = getFirestore(firebaseApp);
