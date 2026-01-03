//map
import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import socket from "../socket"; // your socket instance

const defaultCenter = [20.2961, 85.8245]; // fallback

export default function HelpMate({ userId }) {
  const [friendsLocation, setFriendsLocation] = useState({});
  const mapRef = useRef(null);

//uid backend...
  useEffect(() => {
    socket.emit("register-user", { userId });

    return () => {
      socket.off("friend-live-location");
    };
  }, [userId]);

  /* ===============================
     RECEIVE LIVE LOCATION
  =============================== */
  useEffect(() => {
    socket.on("friend-live-location", ({ userId, latitude, longitude }) => {
      setFriendsLocation((prev) => ({
        ...prev,
        [userId]: { latitude, longitude },
      }));
    });
 
  }, []);
useEffect(()=>{   for (const userId in users) {
  const { latitude, longitude } = users[userId];
  console.log(userId, latitude, longitude);}},[userId])
  return (
 <>
 </>
  );
}
