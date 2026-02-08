import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/Auth-context.jsx'
import { SOSProvider } from './context/SosContext.jsx'
import 'leaflet/dist/leaflet.css';

// Register Service Worker for background notifications
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((err) => {
      console.error('Service Worker registration failed:', err);
    });
}


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <SOSProvider><App /></SOSProvider></AuthProvider>
  </BrowserRouter>,
)
