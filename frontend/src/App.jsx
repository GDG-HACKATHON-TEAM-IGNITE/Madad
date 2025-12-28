import "./App.css";
import { useEffect, useState } from "react";
import UserDetails from "./components/Userdetails";

// Firebase v9 imports
import { auth, googleProvider } from "./config/firebase-config";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { messaging } from "./config/firebase-config";
import { getToken } from "firebase/messaging";

function App() {
  async function requestPermission() {
    console.log(Notification.permission);

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      // Generate Token
      const token = await getToken(messaging, {
        vapidKey:
          "BFy93njkIu_dB4ocbim87cYBhvbyEHz_LLXtCRL0S5Oua92tTuhzka9S-6dy0Pdxbz2Kl6igP0tnoXkOT8X2zf0",
      });
      console.log("Token Gen", token);
      // Send this token  to server ( db)
    } else if (permission === "denied") {
      alert("You denied for the notification");
    }
  }

  useEffect(() => {
    // Req user for notification permission
    requestPermission();
  }, []);

  //authentication
  const [isAuth, setIsAuth] = useState(
    window.localStorage.getItem("auth") === "true"
  );

  const [token, setToken] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuth(true);
        window.localStorage.setItem("auth", "true");
        const token = await user.getIdToken();
        setToken(token);
      } else {
        setIsAuth(false);
        window.localStorage.removeItem("auth");
        setToken("");
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        setIsAuth(true);
        window.localStorage.setItem("auth", "true");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="App">
      {isAuth ? (
        <UserDetails token={token} />
      ) : (
        <button onClick={loginWithGoogle}>Login with Google</button>
      )}
    </div>
  );
}

export default App;
