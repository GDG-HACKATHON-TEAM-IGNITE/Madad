import { useEffect, useState, useRef } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { socket } from "../sockets/sockets";
import { getAuth } from "firebase/auth";

// Leaflet icon fix
import icon from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: shadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// 🔴 Red Icon for Friends
const RedIcon = L.icon({
    iconUrl: icon,
    shadowUrl: shadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    className: "red-filter-marker"
});

const defaultCenter = [20.2961, 85.8245];

// Auto-center on self (ONLY ONCE)
const Recenter = ({ lat, lng }) => {
    const map = useMap();
    const isCentered = useRef(false);

    useEffect(() => {
        if (!isCentered.current && lat && lng) {
            map.setView([lat, lng], 15);
            isCentered.current = true;
        }
    }, [lat, lng, map]);
    return null;
};

export default function FriendMap() {
    const [myLocation, setMyLocation] = useState(null);
    const [friends, setFriends] = useState({});

    // 🔐 REGISTER
    useEffect(() => {
        const register = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                console.log("Socket Registering User:", user.uid);
                const token = await user.getIdToken();
                if (!socket.connected) socket.connect();
                socket.emit("register-user", { token });
            }
        };
        register();
    }, []);

    // 📍 OWN LOCATION (view only)
    useEffect(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                setMyLocation({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                });
            },
            (err) => console.error("Geo error:", err),
            { enableHighAccuracy: true }
        );
    }, []);

    // 👥 FRIEND LOCATIONS
    useEffect(() => {
        const handleFriendLocation = ({ userId, latitude, longitude, name }) => {
            setFriends((prev) => ({
                ...prev,
                [userId]: { latitude, longitude, name },
            }));
        };

        const handleOffline = ({ userId }) => {
            setFriends(prev => {
                const newFriends = { ...prev };
                delete newFriends[userId];
                return newFriends;
            });
        };

        socket.on("friend-live-location", handleFriendLocation);
        socket.on("user-offline", handleOffline);

        return () => {
            socket.off("friend-live-location", handleFriendLocation);
            socket.off("user-offline", handleOffline);
        };
    }, []);

    return (
        <div className="w-full h-screen flex justify-center">
            <MapContainer
                center={defaultCenter}
                zoom={6}
                className="w-[80%] h-[70vh] mt-10"
            >
                <TileLayer
                    attribution="© OpenStreetMap"
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {/* 🔴 You */}
                {myLocation && (
                    <>
                        <Marker position={[myLocation.latitude, myLocation.longitude]}>
                            <Popup>You are here</Popup>
                        </Marker>
                        <Recenter
                            lat={myLocation.latitude}
                            lng={myLocation.longitude}
                        />
                    </>
                )}

                {/* 👥 Friends */}
                {Object.entries(friends).map(([id, loc]) => (
                    <Marker
                        key={id}
                        position={[loc.latitude, loc.longitude]}
                        icon={RedIcon}
                    >
                        <Popup>
                            <strong>Name:</strong> {loc.name || "Friend"} <br />
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            <style>
                {`
                    .red-filter-marker {
                        filter: hue-rotate(150deg);
                    }
                `}
            </style>
        </div>
    );
}