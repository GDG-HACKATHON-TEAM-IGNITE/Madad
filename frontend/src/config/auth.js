import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase-config";

export const googleLogin = async () => {
  await signInWithPopup(auth, googleProvider);
};
