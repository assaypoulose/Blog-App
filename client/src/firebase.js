// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-90600.firebaseapp.com",
  projectId: "mern-blog-90600",
  storageBucket: "mern-blog-90600.appspot.com",
  messagingSenderId: "13730642610",
  appId: "1:13730642610:web:e21af4c7bfcb769937e7ab"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);