//map
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import socket from "../socket";

const defaultCenter = [20.2961, 85.8245];

export default function PoliceLiveDashboard({ policeStationId }) {
  const [users, setUsers] = useState({});

//policeStation id backend...
  useEffect(() => {
    socket.emit("register-police", { policeStationId });

    return () => {
      socket.off("user-live-location");
    };
  }, [policeStationId]);

  /* ===============================
     RECEIVE USER LOCATION
  =============================== */
  useEffect(() => {
    socket.on("user-live-location", ({ userId, latitude, longitude }) => {
      setUsers((prev) => ({
        ...prev,
        [userId]: { latitude, longitude },
      }));
    });

  }, []);
  useEffect(()=>{
        for (const userId in users) {
  const { latitude, longitude } = users[userId];
  console.log(userId, latitude, longitude);}
  },[users])

  return (
    <MapContainer>
  
    </MapContainer>
  );
}
