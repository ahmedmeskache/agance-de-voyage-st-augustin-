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

// Migration: add `page` and per-language image columns if they don't exist.
const offersCols = db.prepare(`PRAGMA table_info(offers)`).all().map(c => c.name);
if (!offersCols.includes('page')) {
  db.exec(`ALTER TABLE offers ADD COLUMN page TEXT;`);
}
if (!offersCols.includes('image_en')) {
  db.exec(`ALTER TABLE offers ADD COLUMN image_en TEXT;`);
}
if (!offersCols.includes('image_ar')) {
  db.exec(`ALTER TABLE offers ADD COLUMN image_ar TEXT;`);
}
// Per-language text columns (auto-translated from French at save time)
if (!offersCols.includes('name_en')) {
  db.exec(`ALTER TABLE offers ADD COLUMN name_en TEXT;`);
}
if (!offersCols.includes('name_ar')) {
  db.exec(`ALTER TABLE offers ADD COLUMN name_ar TEXT;`);
}
if (!offersCols.includes('details_en')) {
  db.exec(`ALTER TABLE offers ADD COLUMN details_en TEXT;`);
}
if (!offersCols.includes('details_ar')) {
  db.exec(`ALTER TABLE offers ADD COLUMN details_ar TEXT;`);
}
if (!offersCols.includes('program_en')) {
  db.exec(`ALTER TABLE offers ADD COLUMN program_en TEXT;`);
}
if (!offersCols.includes('program_ar')) {
  db.exec(`ALTER TABLE offers ADD COLUMN program_ar TEXT;`);
}

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
  page        TEXT,                        -- where it appears: 'local'|'international'|'omra'|'etranger'|'excursions'
  name        TEXT    NOT NULL,
  category    TEXT,                        -- e.g. Spirituel, Culturel, Nature...
  details     TEXT,                        -- short description
  program     TEXT,                        -- full program (multi-line)
  price       TEXT,
  duration    TEXT,
  image       TEXT,                        -- default / French image
  image_en    TEXT,                        -- English image
  image_ar    TEXT,                        -- Arabic image
  name_en     TEXT,                        -- auto-translated name (EN)
  name_ar     TEXT,                        -- auto-translated name (AR)
  details_en  TEXT,                        -- auto-translated details (EN)
  details_ar  TEXT,                        -- auto-translated details (AR)
  program_en  TEXT,                        -- auto-translated program (EN)
  program_ar  TEXT,                        -- auto-translated program (AR)
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