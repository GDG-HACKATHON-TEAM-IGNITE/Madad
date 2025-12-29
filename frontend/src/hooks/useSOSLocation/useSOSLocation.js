import { useRef } from "react";
import { socket } from "../../sockets/sockets.jsx";

export const useSOSLocation = () => {
  const watchIdRef = useRef(null);

  const startSOS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

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
    }
  };

  return { startSOS, stopSOS };
};
