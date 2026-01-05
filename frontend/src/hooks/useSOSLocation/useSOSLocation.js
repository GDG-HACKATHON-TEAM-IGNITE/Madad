import { useRef } from "react";
import { socket } from "../../sockets/sockets.jsx";

export const useSOSLocation = () => {
  const watchIdRef = useRef(null);
//userid=mongoose id fix now its uid
const startSOS = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return;

  const token = await user.getIdToken();

  socket.emit("register-user", { token });

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(position.coords)

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
  };

  const stopSOS = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      console.log(`location stopped`)
      socket.disconnect();
    }
  };

  return { startSOS, stopSOS };
};
