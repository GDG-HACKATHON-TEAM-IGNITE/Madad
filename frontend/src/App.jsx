import "./App.css";
import { useEffect, useState } from "react";
import UserDetails from "./components/Userdetails";

// Firebase v9 imports
import { auth, googleProvider } from "./config/firebase-config";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { messaging } from "./config/firebase-config";
import { getToken } from "firebase/messaging";
// import Policemap from "./pages/Policemap";
import SOSButton from "./components/SosButton";
import PoliceLiveDashboard from "./pages/Policemap";
import HelpMate from "./pages/helpMate";

function App() {
  if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/firebase-messaging-sw.js");

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
       return;
    }
  }

  useEffect(() => {
    // Req user for notification permission
    requestPermission();
  }, []);
//////////////////////////////////////////////////////////////////////////

  //authentication
  const [isAuth, setIsAuth] = useState(
    window.localStorage.getItem("auth") === "true"
  );

  const [authToken, setAuthToken] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuth(true);
        window.localStorage.setItem("auth", "true");
        const token = await user.getIdToken();
        setAuthToken(token);
      } else {
        setIsAuth(false);
        window.localStorage.removeItem("auth");
        setAuthToken("");
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

}
  return (
    <div className="App">
      {isAuth ? (
        <UserDetails token={authToken} />
      ) : (
        <>
          <button onClick={loginWithGoogle}>Login with Google</button>
          <SOSButton />
          <PoliceLiveDashboard/>
          <HelpMate/>
        </>
      )}
    </div>
  );
}

export default App;
//fixed same token name bug....