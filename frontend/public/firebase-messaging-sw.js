importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyDAiOhBkMxaGAB-5cChQnD9b9Er_3hoWck",
  authDomain: "mitra-1-43879.firebaseapp.com",
  projectId: "mitra-1-43879",
  storageBucket: "mitra-1-43879.firebasestorage.app",
  messagingSenderId: "938355710016",
  appId: "1:938355710016:web:9b108e19f885a7c564e7a5"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});