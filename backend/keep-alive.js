const https = require('https');

const RENDER_URL = 'https://evoltsoft-backend.onrender.com/health'; // Replace with your actual Render URL

function pingServer() {
  https.get(RENDER_URL, (res) => {
    console.log(`Ping sent at ${new Date().toISOString()}, Status: ${res.statusCode}`);
  }).on('error', (err) => {
    console.error('Error pinging server:', err.message);
  });
}

// Ping every 14 minutes
setInterval(pingServer, 14 * 60 * 1000);

// Initial ping
pingServer(); 