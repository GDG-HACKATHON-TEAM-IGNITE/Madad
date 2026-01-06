import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getMessaging } from "firebase/messaging";


const firebaseConfig = {
  apiKey: "AIzaSyDAiOhBkMxaGAB-5cChQnD9b9Er_3hoWck",
  authDomain: "mitra-1-43879.firebaseapp.com",
  projectId: "mitra-1-43879",
  storageBucket: "mitra-1-43879.firebasestorage.app",
  messagingSenderId: "938355710016",
  appId: "1:938355710016:web:9b108e19f885a7c564e7a5"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const messaging = getMessaging(app);
