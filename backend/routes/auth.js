const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { run, get, lastId } = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'All fields are required' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
  try {
    const existing = get('SELECT id FROM users WHERE email=? OR username=?', [email.toLowerCase(), username]);
    if (existing) return res.status(409).json({ error: 'Username or email already exists' });
    const hashed = bcrypt.hashSync(password, 10);
    run('INSERT INTO users (username,email,password) VALUES (?,?,?)', [username.trim(), email.trim().toLowerCase(), hashed]);
    const userId = lastId();
    run('INSERT INTO playlists (user_id,name,description,emoji,color) VALUES (?,?,?,?,?)', [userId,'Job Hunt','Career resources and job boards','💼','#6ab8f7']);
    run('INSERT INTO playlists (user_id,name,description,emoji,color) VALUES (?,?,?,?,?)', [userId,'Music & Vibes','Playlists and music discovery','🎵','#f76a8c']);
    run('INSERT INTO playlists (user_id,name,description,emoji,color) VALUES (?,?,?,?,?)', [userId,'Learning','Tutorials, courses, articles','📚','#6af7c8']);
    const user = { id: userId, username: username.trim(), email: email.toLowerCase() };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
  const user = get('SELECT * FROM users WHERE email=?', [email.trim().toLowerCase()]);
  if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Invalid email or password' });
  const payload = { id: user.id, username: user.username, email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: payload });
});

router.get('/me', auth, (req, res) => {
  const user = get('SELECT id,username,email,created_at FROM users WHERE id=?', [req.user.id]);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

module.exports = router;
