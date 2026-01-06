import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { socket } from "../sockets/sockets";
import { getAuth } from "firebase/auth";

// Fix for default Leaflet marker icon not showing
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const defaultCenter = [20.2961, 85.8245];

export default function FriendMap() {
    const [friendsLocation, setFriendsLocation] = useState({});
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const register = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) return;

            setCurrentUser(user);

            const token = await user.getIdToken();
            // Backend expects { token: "..." }
            socket.emit("register-user", { token });
        };

        register();

        const handleFriendLocation = (data) => {
            // Backend emits: { userId, latitude, longitude }
            console.log("Friend location received:", data);
            const { userId, latitude, longitude } = data;

            setFriendsLocation((prev) => ({
                ...prev,
                [userId]: { lat: latitude, lng: longitude },
            }));
        };

        socket.on("friend-live-location", handleFriendLocation);

        // Send my location
        let watchId;
        if ("geolocation" in navigator) {
            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    socket.emit("send-location", { latitude, longitude });
                },
                (error) => console.error("Error getting location:", error),
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        }

        return () => {
            socket.off("friend-live-location", handleFriendLocation);
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    return (
        <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
            <MapContainer
                center={defaultCenter}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {Object.entries(friendsLocation).map(([uid, loc]) => (
                    <Marker key={uid} position={[loc.lat, loc.lng]}>
                        <Popup>
                            User: {uid}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
