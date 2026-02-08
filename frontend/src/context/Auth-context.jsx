import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase-config";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../config/firebase-config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [authToken, setAuthToken] = useState("");

  async function requestPermission(retry = 3) {
    try {
      console.log(`Requesting notification permission... (Retries left: ${retry})`);

      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        // Generate Token
        let token;
        try {
          if ('serviceWorker' in navigator) {
            // Wait for Service Worker to be ready
            let registration = await navigator.serviceWorker.getRegistration();

            if (!registration) {
              console.log("No SW found, registering...");
              registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
            }

            // Ensure it's active
            if (!registration.active && registration.installing) {
              await new Promise(resolve => {
                const worker = registration.installing;
                worker.addEventListener('statechange', () => {
                  if (worker.state === 'activated') resolve();
                });
              });
            }

            token = await getToken(messaging, {
              vapidKey: "BFy93njkIu_dB4ocbim87cYBhvbyEHz_LLXtCRL0S5Oua92tTuhzka9S-6dy0Pdxbz2Kl6igP0tnoXkOT8X2zf0",
              serviceWorkerRegistration: registration
            });
          } else {
            // Fallback
            token = await getToken(messaging, {
              vapidKey: "BFy93njkIu_dB4ocbim87cYBhvbyEHz_LLXtCRL0S5Oua92tTuhzka9S-6dy0Pdxbz2Kl6igP0tnoXkOT8X2zf0",
            });
          }

          if (token) {
            console.log("Token Generated Successfully:", token);
            return token;
          } else {
            console.warn("Token obtained was null or undefined");
            throw new Error("Token is null");
          }

        } catch (tokenError) {
          console.error("Token generation failed:", tokenError);
          // Retry logic
          if (retry > 0) {
            console.log("Retrying token generation in 2 seconds...");
            await new Promise(res => setTimeout(res, 2000));
            return requestPermission(retry - 1);
          }
          return null;
        }
      } else if (permission === "denied") {
        console.warn("Notification permission denied");
        // alert("You denied for the notification"); // User requested no alerts
        return null;
      }
    } catch (error) {
      console.error("Error requesting permission or getting token:", error);
      if (retry > 0) {
        console.log("Retrying permission request in 2 seconds...");
        await new Promise(res => setTimeout(res, 2000));
        return requestPermission(retry - 1);
      }
      return null;
    }
  }

  useEffect(() => {
    // Req user for notification permission
    requestPermission();

    // Listen for foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Foreground Message received: ", payload);
      // Optional: Show a toast or in-app notification here
      // alert(`New Notification: ${payload.notification?.title}`);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuth(true);
        const token = await user.getIdToken();
        setAuthToken(token);

        try {
          // Get FCM Token before syncing
          const fcmToken = await requestPermission();


          // ----------------------------------------------------
          // THIS IS THE PART RESPONSIBLE FOR SENDING FCM TOKEN TO BACKEND
          // ----------------------------------------------------
          // Sync with backend to get Mongoose ID
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/user/user`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            // Include fcmToken in the body
            body: JSON.stringify({ fcmToken }),
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
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, authToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


