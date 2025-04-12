// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDaOsTic-4y8L4-rvCU8OcObVIlFu3J-vU",
  authDomain: "lewiscal-7a010.firebaseapp.com",
  projectId: "lewiscal-7a010",
  storageBucket: "lewiscal-7a010.firebasestorage.app",
  messagingSenderId: "824609512964",
  appId: "1:824609512964:web:f2dea3586464e7efb29f51",
  measurementId: "G-W8RVW12B02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// exports Firebase services
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
