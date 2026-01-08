import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase-config";
import { getToken } from "firebase/messaging";
import { messaging } from "../config/firebase-config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [fcmToken, setFcmToken] = useState(null);

  async function requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: "BFy93njkIu_dB4ocbim87cYBhvbyEHz_LLXtCRL0S5Oua92tTuhzka9S-6dy0Pdxbz2Kl6igP0tnoXkOT8X2zf0",
        });
        console.log("Token Gen", token);
        setFcmToken(token);
      } else if (permission === "denied") {
        console.warn("Notification permission denied");
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  }

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuth(true);
        const token = await user.getIdToken();
        setAuthToken(token);

        // Sync with backend
        try {
          const payload = {
            phone: user.phoneNumber || undefined,
            fcmToken: fcmToken || undefined
          };

          const res = await fetch("http://localhost:5000/api/user/user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            const data = await res.json();
            if (data.userdetails && data.userdetails.uid) {
              localStorage.setItem("mongo_id", data.userdetails.uid);
              console.log("Synced with backend. Mongo ID:", data.userdetails.uid);
            }
          }
        } catch (error) {
          console.error("Backend sync failed:", error);
        }

      } else {
        setIsAuth(false);
        setAuthToken("");
        localStorage.removeItem("mongo_id");
      }
    });

    return unsubscribe;
  }, [fcmToken]); // Re-run if FCM token key loads late (assuming user stays logged in)

  return (
    <AuthContext.Provider value={{ isAuth, authToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


