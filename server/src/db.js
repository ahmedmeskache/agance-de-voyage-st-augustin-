import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, 'data');
fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'satv.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT    NOT NULL,
  email         TEXT    UNIQUE,
  password_hash TEXT,
  provider      TEXT    DEFAULT 'email',
  provider_id   TEXT,
  phone         TEXT,
  role          TEXT    NOT NULL DEFAULT 'user',
  created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS offers (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  type        TEXT    NOT NULL,            -- 'circuit' | 'excursion'
  name        TEXT    NOT NULL,
  category    TEXT,                        -- e.g. Spirituel, Culturel, Nature...
  details     TEXT,                        -- short description
  program     TEXT,                        -- full program (multi-line)
  price       TEXT,
  duration    TEXT,
  image       TEXT,
  active      INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS posts (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT    NOT NULL,
  category    TEXT,
  excerpt     TEXT,
  content     TEXT,
  image       TEXT,
  active      INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS reservations (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER,
  offer_id    INTEGER,
  offer_name  TEXT,
  type        TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  travel_date TEXT,
  people      INTEGER,
  message     TEXT,
  status      TEXT    NOT NULL DEFAULT 'pending',   -- pending | confirmed | cancelled
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE SET NULL,
  FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT
);
`);

export default db;