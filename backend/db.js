const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const DB_PATH = path.resolve(process.env.DB_PATH || './linkvault.db');
let _db = null;
let _lastId = null;

function persist() {
  fs.writeFileSync(DB_PATH, Buffer.from(_db.export()));
}

function run(sql, params = []) {
  _db.run(sql, params);
  // Capture rowid BEFORE persist (persist does export only, shouldn't affect rowid)
  const s = _db.prepare('SELECT last_insert_rowid() as id');
  s.step(); _lastId = s.getAsObject().id; s.free();
  persist();
}

function get(sql, params = []) {
  const s = _db.prepare(sql); s.bind(params);
  const row = s.step() ? s.getAsObject() : null; s.free(); return row;
}

function all(sql, params = []) {
  const s = _db.prepare(sql); s.bind(params);
  const rows = []; while (s.step()) rows.push(s.getAsObject()); s.free(); return rows;
}

function lastId() { return _lastId; }

async function initDb() {
  if (_db) return;
  const SQL = await initSqlJs();
  _db = fs.existsSync(DB_PATH) ? new SQL.Database(fs.readFileSync(DB_PATH)) : new SQL.Database();
  _db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL, email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL, created_at DATETIME DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS playlists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL, name TEXT NOT NULL, description TEXT,
      emoji TEXT DEFAULT '🎵', color TEXT DEFAULT '#7c6af7',
      created_at DATETIME DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL, playlist_id INTEGER, title TEXT NOT NULL,
      url TEXT NOT NULL, source TEXT, type TEXT, notes TEXT,
      created_at DATETIME DEFAULT (datetime('now'))
    );
  `);
  persist();
}

module.exports = { initDb, run, get, all, lastId };
