// API + fichiers statiques servis par notre propre server.js (Express)
// Lancement : node server.js   (ou npm start)  -> http://localhost:10000
export const API_BASE =
    (window.location.hostname === 'localhost' ||
     window.location.hostname === '127.0.0.1')
        ? 'http://localhost:10000'
        : 'https://ton-backend.onrender.com';