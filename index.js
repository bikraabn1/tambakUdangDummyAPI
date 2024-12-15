const express = require('express');
const cors = require('cors');
const http = require('http');
const { WebSocketServer } = require('ws');
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Web Server is running');
})

// Fungsi untuk menghasilkan data acak
function generateRandomData(id) {
  const tds = Math.floor(Math.random() * 100); // Nilai acak untuk tds antara 0-99
  const ph = (Math.random() * 14).toFixed(2); // Nilai acak untuk ph antara 0.00-14.00
  const color = Math.floor(Math.random() * 16777215).toString(16).toUpperCase(); // Warna acak dalam format hex
  const time = new Date().toISOString(); // Waktu saat ini dalam format ISO

  return { id, tds, ph, color, time };
}

// Event WebSocket untuk koneksi klien
wss.on('connection', (ws) => {
  console.log('New Client Connected');

  // Kirim pesan awal ke klien
  ws.send('Welcome to WebSocket server!');

  // Terima pesan dari klien
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);

    // Kirim respons ke klien
    ws.send(`Server received: ${message}`);
  });

  // Event saat koneksi klien terputus
  ws.on('close', () => {
    console.log('Client disconnected');
  });

  // Kirim data acak setiap detik
  let idCounter = 1; // Counter untuk ID
  setInterval(() => {
    const randomData = generateRandomData(idCounter++);
    ws.send(JSON.stringify(randomData));
  }, 1000);
});

// Menjalankan server HTTP dan WebSocket
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});