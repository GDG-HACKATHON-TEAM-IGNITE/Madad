// Track who is online
// Track last known location

import User from "../models/user.model.js";
import PoliceStation from "../models/policeStation.model.js";
import FcmToken from "../models/fcmToken.model.js";
import admin from "../config/firebase-config.js";
import sendFCMNotification from "../notification/notificationFcm.js";
//runtime hashmaps......
const onlineUsers = new Map(); // userId -> socket
const onlinePolice = new Map(); // policeStationId -> socket
const userLastLocation = new Map(); // userId -> { lat, lng, time }

const initSockets = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
    /*  REGISTER */
    //socket.on("register-user", ({ token}) => {

    socket.on("register-user", async (payload) => {
      try {
        // 🔹 Handle string payload (Postman / manual emits)
        if (typeof payload === "string") {
          try {
            payload = JSON.parse(payload);
          } catch {
            return;
          }
        }
        // 🔹 Validate payload structure
        if (!payload || typeof payload !== "object" || !payload.token) {
          console.error("Invalid payload format");
          socket.disconnect(true);
          return;
        }

        const { token } = payload;

        // 🔹 Verify Firebase token
        const decoded = await admin.auth().verifyIdToken(token);
        const uid = decoded.uid;

        // 🔹 Find user using Firebase UID
        const user = await User.findOne({ uid }).select("_id");
        if (!user) {
          socket.disconnect(true);
          return;
        }

        const mongoUserId = user._id.toString();

        // 🔹 Handle duplicate login
        const existingSocket = onlineUsers.get(mongoUserId);
        if (existingSocket && existingSocket.id !== socket.id) {
          existingSocket.disconnect(true);
        }

        // 🔹 Register socket
        socket.userId = mongoUserId;
        onlineUsers.set(mongoUserId, socket);

        console.log("USER REGISTERED:", mongoUserId);
      } catch (err) {
        console.error("Firebase token verification failed:", err.message);
        socket.disconnect(true);
      }
    });

    // socket.on("register-police", ({ policeStationId }) => {
    socket.on("register-police", (payload) => {
      console.log("RAW POLICE PAYLOAD:", payload);

      // Handle Postman / string JSON
      if (typeof payload === "string") {
        try {
          payload = JSON.parse(payload);
        } catch (err) {
          console.error(" Invalid JSON string for register-police");
          return;
        }
      }

      // Validate payload
      if (!payload || typeof payload !== "object") {
        console.error(" register-police payload is not an object");
        return;
      }
      const policeStationId = payload.policeStationId;
      console.log("EXTRACTED policeStationId:", policeStationId);

      if (!policeStationId) {
        console.error(" register-police called without policeStationId");
        return;
      }
      //
      const oldSocket = onlinePolice.get(policeStationId);
      if (oldSocket && oldSocket.id !== socket.id) {
        oldSocket.disconnect(true);
      }
      socket.policeStationId = policeStationId;
      onlinePolice.set(policeStationId, socket);
      console.log(policeStationId);
      console.log("ONLINE USERS:", [...onlineUsers.keys()]);
      console.log("ONLINE POLICE:", [...onlinePolice.keys()]);
    });

    /*
     LIVE LOCATION (ONLINE MODE)
     NO FCM HERE
 */

    //  socket.on("send-location", async ({ latitude, longitude }) => {
    socket.on("send-location", async (payload) => {
      console.log("RAW LOCATION PAYLOAD:", payload);

      // Handle string JSON (Postman case)
      if (typeof payload === "string") {
        try {
          payload = JSON.parse(payload);
        } catch {
          console.error(" Invalid JSON string in send-location");
          return;
        }
      }

      // Validate payload object
      if (!payload || typeof payload !== "object") {
        console.error(" send-location payload is not an object");
        return;
      }

      const { latitude, longitude } = payload;

      // Validate values
      if (typeof latitude !== "number" || typeof longitude !== "number") {
        console.error(" Invalid latitude/longitude:", payload);
        return;
      }
      //
      const userId = socket.userId;
      if (!userId) return;

      // save last location
      userLastLocation.set(userId, {
        latitude,
        longitude,
        time: Date.now(),
      });

      // 🔹 find nearest friends
      const user = await User.findById(userId).select("friends name");

      const nearestFriends = await User.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            distanceField: "distance",
            spherical: true,
            query: { _id: { $in: user.friends } },
          },
        },
        { $limit: 5 },
      ]);

      // 🔹 find nearest police stations
      const nearestStations = await PoliceStation.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [longitude, latitude] },
            distanceField: "distance",
            spherical: true,
          },
        },
        { $project: { policeStationId: 1, _id: 1 } },

        { $limit: 5 },
      ]);
      // emit live location (ONLINE ONLY)

      nearestFriends.forEach((friend) => {
        const s = onlineUsers.get(friend._id.toString());
        if (s) {
          s.emit("friend-live-location", {
            name: user.name,
            userId,
            latitude,
            longitude,
          });
        }
      });
      nearestStations.forEach((station) => {
        const s = onlinePolice.get(station.policeStationId);

        if (s) {
          s.emit("user-live-location", {
            name: user.name,
            userId,
            latitude,
            longitude,
          });
        }
      });
    });

    /*
     DISCONNECT (OFFLINE MODE)
     SOCKET + FCM
 */

    socket.on("disconnect", async () => {
      console.log("Socket disconnected:", socket.id);

      const userId = socket.userId;
      const policeId = socket.policeStationId;

      /* USER DISCONNECT */
      if (userId) {
        onlineUsers.delete(userId);

        console.log("USER OFFLINE:", userId);
        console.log("ONLINE USERS:", [...onlineUsers.keys()]);
        console.log("ONLINE POLICE:", [...onlinePolice.keys()]);

        const lastLocation = userLastLocation.get(userId);
        if (!lastLocation) return;

        const { latitude, longitude } = lastLocation;

        /* 🔹 1. REMOVE MARKERS (ONLINE CLIENTS) */

        // friends
        onlineUsers.forEach((s) => {
          s.emit("user-offline", { userId });
        });

        // police
        onlinePolice.forEach((s) => {
          s.emit("user-offline", { userId });
        });

        /*  FIND NEAREST (ONCE) FOR FCM */
        //even if once device disconnct must fire notification logic so ....

        const user = await User.findById(userId).select("friends name");
        if (!user) return;
        // const nearestFriends = await User.aggregate([
        //   {
        //     $geoNear: {
        //       near: {
        //         type: "Point",
        //         coordinates: [longitude, latitude],
        //       },
        //       distanceField: "distance",
        //       spherical: true,
        //       query: { _id: { $in: user.friends } },
        //     },
        //   },
        //   { $limit: 5 },
        // ]);

        const nearestFriends = await User.aggregate([
          //all friends
          {
            $match: {
              _id: { $in: user.friends },
            },
          },
        ]);

        const nearestStations = await PoliceStation.aggregate([
          {
            $geoNear: {
              near: { type: "Point", coordinates: [longitude, latitude] },
              distanceField: "distance",
              spherical: true,
            },
          },
          {
            $project: { _id: 1, policeStationId: 1 },
          },
          { $limit: 5 },
        ]);

        /* SEND FCM (OFFLINE / SAFETY ALERT) */
        //friend Fcm
        for (const friend of nearestFriends) {
          const tokens = await FcmToken.find({
            ownerType: "User",
            owner: friend._id,
            isActive: true,
          });

          for (const fcm of tokens) {
            await sendFCMNotification({
              token: fcm.token,
              title: "Friend went offline",
              body: "Tap to view last known location",
              data: {
                name: String(user.name),
                userId: String(userId),
                latitude: String(latitude),
                longitude: String(longitude),
                url: `https://www.google.com/maps?q=${latitude},${longitude}`
              },
            });
          }
        }
        // police FCM
        for (const station of nearestStations) {
          const tokens = await FcmToken.find({
            ownerType: "PoliceStation",
            owner: station._id,
            isActive: true,
          });

          for (const fcm of tokens) {
            await sendFCMNotification({
              token: fcm.token,
              title: "User went offline",
              body: "Last known location available",
              data: {
                name: String(user.name),
                userId: String(userId),
                latitude: String(latitude),
                longitude: String(longitude),
                url: `https://www.google.com/maps?q=${latitude},${longitude}`
              },
            });
          }
        }
        userLastLocation.delete(userId); //delete from ram as all notification sent data is no more needed to clear ram and optimize
      }

      /* POLICE DISCONNECT*/
      if (socket.policeStationId) {
        const policeId = socket.policeStationId;

        if (onlinePolice.get(policeId) === socket) {
          onlinePolice.delete(policeId);
          console.log("POLICE OFFLINE:", policeId);
          console.log("ONLINE USERS:", [...onlineUsers.keys()]);
          console.log("ONLINE POLICE:", [...onlinePolice.keys()]);
        }
      }
    });
  });
};

export default initSockets;
// User:
// - Socket ID  → uid
// - Uid    ->  Mo_id
// - DB lookup  → Mo_id
// - Relations  → Mo _id

// Police:
// - Socket ID  → policeId
// - DB lookup  → policeId
// - FCM owner  → Mo _id
//police connection check and on using station id
//police fcm mongooseid
