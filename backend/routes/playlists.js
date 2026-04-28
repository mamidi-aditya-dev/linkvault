const express = require('express');
const { run, get, all, lastId } = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();
router.use(auth);

router.get('/', (req, res) => {
  const playlists = all(`SELECT p.*,COUNT(l.id) as link_count FROM playlists p LEFT JOIN links l ON l.playlist_id=p.id WHERE p.user_id=? GROUP BY p.id ORDER BY p.created_at ASC`, [req.user.id]);
  res.json({ playlists });
});

router.get('/:id/links', (req, res) => {
  const playlist = get('SELECT * FROM playlists WHERE id=? AND user_id=?', [req.params.id, req.user.id]);
  if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
  const links = all('SELECT * FROM links WHERE playlist_id=? AND user_id=? ORDER BY created_at DESC', [req.params.id, req.user.id]);
  res.json({ playlist, links });
});

router.post('/', (req, res) => {
  const { name, description, emoji, color } = req.body;
  if (!name) return res.status(400).json({ error: 'Playlist name is required' });
  run('INSERT INTO playlists (user_id,name,description,emoji,color) VALUES (?,?,?,?,?)',
    [req.user.id, name.trim(), description||null, emoji||'🎵', color||'#7c6af7']);
  const id = lastId();
  const playlist = get('SELECT p.*,0 as link_count FROM playlists p WHERE id=?', [id]);
  res.status(201).json({ playlist });
});

router.put('/:id', (req, res) => {
  const existing = get('SELECT * FROM playlists WHERE id=? AND user_id=?', [req.params.id, req.user.id]);
  if (!existing) return res.status(404).json({ error: 'Playlist not found' });
  const { name, description, emoji, color } = req.body;
  run('UPDATE playlists SET name=?,description=?,emoji=?,color=? WHERE id=? AND user_id=?',
    [name||existing.name, description??existing.description, emoji||existing.emoji, color||existing.color, req.params.id, req.user.id]);
  const playlist = get('SELECT p.*,COUNT(l.id) as link_count FROM playlists p LEFT JOIN links l ON l.playlist_id=p.id WHERE p.id=? GROUP BY p.id', [req.params.id]);
  res.json({ playlist });
});

router.delete('/:id', (req, res) => {
  const existing = get('SELECT id FROM playlists WHERE id=? AND user_id=?', [req.params.id, req.user.id]);
  if (!existing) return res.status(404).json({ error: 'Playlist not found' });
  run('UPDATE links SET playlist_id=NULL WHERE playlist_id=? AND user_id=?', [req.params.id, req.user.id]);
  run('DELETE FROM playlists WHERE id=? AND user_id=?', [req.params.id, req.user.id]);
  res.json({ success: true });
});

module.exports = router;
