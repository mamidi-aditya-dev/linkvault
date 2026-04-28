const express = require('express');
const { run, get, all, lastId } = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();
router.use(auth);

router.get('/', (req, res) => {
  const { source, type, playlist, search } = req.query;
  let q = `SELECT l.*,p.name as playlist_name,p.emoji as playlist_emoji FROM links l LEFT JOIN playlists p ON l.playlist_id=p.id WHERE l.user_id=?`;
  const params = [req.user.id];
  if (source) { q += ' AND l.source=?'; params.push(source); }
  if (type) { q += ' AND l.type=?'; params.push(type); }
  if (playlist) { q += ' AND l.playlist_id=?'; params.push(playlist); }
  if (search) { q += ' AND (l.title LIKE ? OR l.url LIKE ? OR l.type LIKE ?)'; params.push(`%${search}%`,`%${search}%`,`%${search}%`); }
  q += ' ORDER BY l.created_at DESC';
  res.json({ links: all(q, params) });
});

router.get('/stats', (req, res) => {
  const uid = req.user.id;
  const totalLinks = get('SELECT COUNT(*) as count FROM links WHERE user_id=?', [uid]).count;
  const totalPlaylists = get('SELECT COUNT(*) as count FROM playlists WHERE user_id=?', [uid]).count;
  const sources = all('SELECT source,COUNT(*) as count FROM links WHERE user_id=? AND source IS NOT NULL GROUP BY source', [uid]);
  const types = all('SELECT type,COUNT(*) as count FROM links WHERE user_id=? AND type IS NOT NULL GROUP BY type', [uid]);
  res.json({ totalLinks, totalPlaylists, sources, types });
});

router.post('/', (req, res) => {
  const { title, url, source, type, notes, playlist_id } = req.body;
  if (!title || !url) return res.status(400).json({ error: 'Title and URL are required' });
  run('INSERT INTO links (user_id,title,url,source,type,notes,playlist_id) VALUES (?,?,?,?,?,?,?)',
    [req.user.id, title.trim(), url.trim(), source||null, type||null, notes||null, playlist_id||null]);
  const id = lastId();
  const link = get('SELECT l.*,p.name as playlist_name,p.emoji as playlist_emoji FROM links l LEFT JOIN playlists p ON l.playlist_id=p.id WHERE l.id=?', [id]);
  res.status(201).json({ link });
});

router.put('/:id', (req, res) => {
  const existing = get('SELECT * FROM links WHERE id=? AND user_id=?', [req.params.id, req.user.id]);
  if (!existing) return res.status(404).json({ error: 'Link not found' });
  const { title, url, source, type, notes, playlist_id } = req.body;
  run('UPDATE links SET title=?,url=?,source=?,type=?,notes=?,playlist_id=? WHERE id=? AND user_id=?',
    [title||existing.title, url||existing.url, source??existing.source, type??existing.type, notes??existing.notes, playlist_id??existing.playlist_id, req.params.id, req.user.id]);
  const link = get('SELECT l.*,p.name as playlist_name,p.emoji as playlist_emoji FROM links l LEFT JOIN playlists p ON l.playlist_id=p.id WHERE l.id=?', [req.params.id]);
  res.json({ link });
});

router.delete('/:id', (req, res) => {
  const existing = get('SELECT id FROM links WHERE id=? AND user_id=?', [req.params.id, req.user.id]);
  if (!existing) return res.status(404).json({ error: 'Link not found' });
  run('DELETE FROM links WHERE id=? AND user_id=?', [req.params.id, req.user.id]);
  res.json({ success: true });
});

module.exports = router;
