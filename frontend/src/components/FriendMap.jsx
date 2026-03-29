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

import icon from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";

// Fix default icon
L.Marker.prototype.options.icon = L.icon({
    iconUrl: icon,
    shadowUrl: shadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Factory so each marker gets its own icon instance (prevents overlap glitch)
const makeRedIcon = () =>
    L.icon({
        iconUrl: icon,
        shadowUrl: shadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        className: "red-filter-marker",
    });

const defaultCenter = [20.2961, 85.8245];

// Centers map on self — only once
const Recenter = ({ lat, lng }) => {
    const map = useMap();
    const centered = useRef(false);
    useEffect(() => {
        if (!centered.current && lat && lng) {
            map.setView([lat, lng], 15);
            centered.current = true;
        }
    }, [lat, lng, map]);
    return null;
};

export default function FriendMap() {
    const [myLocation, setMyLocation] = useState(null);
    const [friends, setFriends] = useState({});
    const watchIdRef = useRef(null);
    const registeredRef = useRef(false);

    // Register once — guard against re-mount double-register
    useEffect(() => {
        if (registeredRef.current) return;

        const register = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) return;

            const token = await user.getIdToken();
            if (!socket.connected) socket.connect();
            socket.emit("register-user", { token });
            registeredRef.current = true;
        };

        register();
    }, []);

    // Watch own location and continuously emit to backend
    useEffect(() => {
        if (!navigator.geolocation) return;

        const onSuccess = ({ coords }) => {
            const { latitude, longitude } = coords;
            setMyLocation({ latitude, longitude });
            // Broadcast to server so friends receive updates
            socket.emit("send-location", { latitude, longitude });
        };

        const onError = (err) => console.error("Geo error:", err);

        watchIdRef.current = navigator.geolocation.watchPosition(
            onSuccess,
            onError,
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
        );

        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
            }
        };
    }, []);

    // Listen for friend location updates and offline events
    useEffect(() => {
        const handleFriendLocation = ({ userId, latitude, longitude, name }) => {
            setFriends((prev) => ({
                ...prev,
                [userId]: { latitude, longitude, name },
            }));
        };

        const handleOffline = ({ userId }) => {
            setFriends((prev) => {
                const next = { ...prev };
                delete next[userId];
                return next;
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

                {myLocation && (
                    <>
                        <Marker position={[myLocation.latitude, myLocation.longitude]}>
                            <Popup>You are here</Popup>
                        </Marker>
                        <Recenter lat={myLocation.latitude} lng={myLocation.longitude} />
                    </>
                )}

                {Object.entries(friends).map(([id, loc]) => (
                    <Marker
                        key={id}
                        position={[loc.latitude, loc.longitude]}
                        icon={makeRedIcon()}
                    >
                        <Popup>
                            <strong>{loc.name || "Friend"}</strong>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            <style>{`
                .red-filter-marker { filter: hue-rotate(150deg); }
            `}</style>
        </div>
    );
}
