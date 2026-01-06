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

const sendFCM = async ({ token, title, body, data }) => {
  try {
    const message = {
      token,
      notification: {
        title,
        body,
      },
      data: {
        ...data,
        click_action: "OPEN_MAP", // used by service worker
      },
    };

    const response = await admin.messaging().send(message);
    console.log("FCM Sent:", response);
  } catch (err) {
    console.error("FCM Error:", err);
  }
};
export default sendFCM;
