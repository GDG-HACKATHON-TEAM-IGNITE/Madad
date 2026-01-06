// Track who is online
// Track last known location

import User from "../models/user.model.js";
import PoliceStation from "../models/policeStation.model.js";
import FcmToken from "../models/fcmToken.model.js";

import sendFCMNotification from "../notification/notificationFcm.js";
import admin from "../config/firebase-config.js";
// wherever you initialize firebase-admin

//runtime hashmaps......
const onlineUsers = new Map(); // userId/uid -> socket
const onlinePolice = new Map(); // policeStationId -> socket
const userLastLocation = new Map(); // userId -> { lat, lng, time }

const initSockets = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    /* 
     REGISTER
 */

    //socket.on("register-user", ({ userId }) => {
    socket.on("register-user", async (payload) => {
      try {
        console.log("RAW payload:", payload);

        if (!payload || typeof payload !== "object") return;

        const { token } = payload;
        if (!token) return;

        // 🔐 VERIFY FIREBASE TOKEN
        const decoded = await admin.auth().verifyIdToken(token);
        const uid = decoded.uid; //

        // 🔁 Handle duplicate connections
        const existingSocket = onlineUsers.get(uid);
        if (existingSocket && existingSocket.id !== socket.id) {
          existingSocket.disconnect(true);
        }

        socket.userId = uid;
        onlineUsers.set(uid, socket);

        console.log("USER REGISTERED:", uid);
        console.log("ONLINE USERS:", [...onlineUsers.keys()]);
        console.log("ONLINE POLICE:", [...onlinePolice.keys()]);
      } catch (err) {
        console.error("Invalid Firebase token", err.message);
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
        console.error("Invalid latitude/longitude:", payload);
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
      const user = await User.findOne({ uid: userId }).select("friends");
      if (!user) return;
      const nearestFriends = await User.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [longitude, latitude] },
            distanceField: "distance",
            spherical: true,
            query: { _id: { $in: user.friends } },
          },
        },
        { $project: { uid: 1, _id: 1 } },

        { $limit: 5 },
      ]); /////////////////////////////////////////////////////////////////////////////////////////////////

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
        const s = onlineUsers.get(friend.uid); //all user including friends are connected using uid
        if (s) {
          s.emit("friend-live-location", {
            userId,
            latitude,
            longitude,
          });
        }
      });

      nearestStations.forEach((station) => {
        const s = onlinePolice.get(station.policeStationId); //it is police id

        if (s) {
          s.emit("user-live-location", {
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

        const user = await User.findOne({ uid: userId }).select("friends");
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
        //   { $limit: 20 },//20 is more than enough
        // ]);
        const nearestFriends = await User.aggregate([
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
          { $project: { policeStationId: 1, _id: 1 } },

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
                userId: String(userId),
                latitude: String(latitude),
                longitude: String(longitude),
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
                userId: String(userId),
                latitude: String(latitude),
                longitude: String(longitude),
              },
            });
          }
        }
        userLastLocation.delete(userId);
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
// - DB lookup  → uid
// - Relations  → Mo _id

// Police:
// - Socket ID  → policeId
// - DB lookup  → policeId
// - FCM owner  → Mo _id
//police connection check and on using station id
//police fcm mongooseid
