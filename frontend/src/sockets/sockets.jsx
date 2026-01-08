import { io } from "socket.io-client";

console.log("BACKEND URL:", import.meta.env.VITE_BACKEND_URL);
export const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ["websocket"],
});
socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});
