import { createContext, useContext, useRef } from "react";
import { socket } from "../sockets/sockets";
import { getAuth } from "firebase/auth";

const SOSContext = createContext(null);

export const SOSProvider = ({ children }) => {
  const watchIdRef = useRef(null);

  const startSOS = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const token = await user.getIdToken();

    socket.connect(); // Ensure socket is connected
    socket.emit("register-user", { token });

    if (watchIdRef.current !== null) return;

    if ("geolocation" in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(position.coords);

          socket.emit("send-location", {
            latitude,
            longitude,
          });
        },
        (error) => {
          console.error(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }
  };

  const stopSOS = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      console.log(`location stopped`);
      socket.disconnect();
    }
  };

  return (
    <SOSContext.Provider value={{ startSOS, stopSOS }}>
      {children}
    </SOSContext.Provider>
  );
};

export const useSOS = () => {
  const context = useContext(SOSContext);
  if (!context) {
    throw new Error("useSOS must be used inside SOSProvider");
  }
  return context;
};
