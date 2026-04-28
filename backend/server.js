require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use('/api/auth',      require('./routes/auth'));
app.use('/api/links',     require('./routes/links'));
app.use('/api/playlists', require('./routes/playlists'));
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ error: 'Internal server error' }); });

initDb().then(() => {
  app.listen(PORT, () => console.log(`🚀 LinkVault API → http://localhost:${PORT}`));
}).catch(err => { console.error('DB init failed:', err); process.exit(1); });
