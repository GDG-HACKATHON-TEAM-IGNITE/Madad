//map
import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import socket from "../socket"; // your socket instance
import { getAuth } from "firebase/auth";


const defaultCenter = [20.2961, 85.8245]; // fallback

export default function HelpMate({ userId }) {
  const [friendsLocation, setFriendsLocation] = useState({});
  const mapRef = useRef(null);

//uid backend...

useEffect(() => {
  const register = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const token = await user.getIdToken();

    socket.emit("register-user", { token });
  };

  register();

  return () => {
    socket.off("friend-live-location");
  };
}, []);

useEffect(()=>{   for (const userId in users) {
  const { latitude, longitude } = users[userId];
  console.log(userId, latitude, longitude);}},[userId])
  return (
 <>
 </>
  );
}
