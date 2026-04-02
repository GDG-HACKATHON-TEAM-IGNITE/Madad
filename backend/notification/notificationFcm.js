//import FCM from "fcm-node";//i will use manual method completely
// import serverKey from "./privatekey.json" with { type: "json" };

// const fcm = new FCM(serverKey);

// export const sendFCM = ({ token, title, body, data }) => {
//   const message = {
//     to: token,
//     notification: {
//       title,
//       body,
//     },
//      data: {
//       ...data,
//       click_action: "OPEN_MAP", // frontend listens to this
//     },
//   };

//   fcm.send(message, (err, response) => {
//     if (err) {
//       console.log("FCM Error:", err);
//     } else {
//       console.log("FCM Sent:", response);
//     }
//   });
// };

//solved doubleinitialization of firebase one manully
//completely removing use of depriciated node -fcm
import admin from "../config/firebase-config.js";
import FcmToken from "../models/fcmToken.model.js";

const sendFCM = async ({ token, title, body, data }) => {
  try {
    if (!token || typeof token !== "string" || token.length < 50) {
      console.error("Invalid FCM token:", token);
      return;
    }

    const message = {
      token,
      notification: { title, body },
      data: { ...data, click_action: "OPEN_MAP" },
    };

    const response = await admin.messaging().send(message);
    console.log("FCM Sent:", response);
  } catch (err) {
    const code = err?.errorInfo?.code;

    // Token is no longer valid — deactivate it so it's never retried
    if (
      code === "messaging/registration-token-not-registered" ||
      code === "messaging/invalid-registration-token"
    ) {
      console.warn("Stale FCM token, deactivating:", token);
      await FcmToken.findOneAndUpdate(
        { token },
        { isActive: false }
      ).catch(() => {}); // silent — don't crash if token doc is already gone
    } else {
      console.error("FCM Error:", err);
    }
  }
};

export default sendFCM;
