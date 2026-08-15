import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';

import authRoutes from './routes/auth.js';
import offerRoutes from './routes/offers.js';
import reservationRoutes from './routes/reservations.js';
import blogRoutes from './routes/blog.js';
import adminRoutes from './routes/admin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '../..');           // project root (static site)
const ADMIN_PUBLIC = path.join(__dirname, '../public/admin'); // admin SPA
const UPLOADS = process.env.DATA_DIR
  ? path.join(process.env.DATA_DIR, 'uploads')
  : path.join(ROOT, 'uploads');

const app = express();
app.disable('x-powered-by');
app.use(cors());
app.use(express.json({ limit: '2mb' }));

import db from './db.js';
import bcrypt from 'bcryptjs';
import { translateFields } from './translate.js';

// Seed (or update) the admin account so env variables always take effect.
function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@satv.dz';
  const password = process.env.ADMIN_PASSWORD || 'admin123456';
  const name = process.env.ADMIN_NAME || 'Administrateur';
  const existing = db.prepare('SELECT id FROM users WHERE role = ?').get('admin');
  if (!existing) {
    db.prepare('INSERT INTO users (name, email, password_hash, provider, role) VALUES (?, ?, ?, ?, ?)')
      .run(name, email, bcrypt.hashSync(password, 10), 'email', 'admin');
    console.log(`[seed] Admin -> ${email}`);
  } else {
    // Keep the existing admin in sync with the env variables so a redeploy
    // with new ADMIN_EMAIL / ADMIN_PASSWORD actually applies them.
    db.prepare('UPDATE users SET email = ?, name = ? WHERE id = ?').run(email, name, existing.id);
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(bcrypt.hashSync(password, 10), existing.id);
    console.log(`[seed] Admin mis à jour -> ${email}`);
  }
}
seedAdmin();

// Seed sample offers ONLY once (on the very first boot). A settings flag
// records that seeding happened, so it is never re-run — even if the user
// deletes every offer — otherwise their deletions would reappear on redeploy.
function seedOffers() {
  const already = db.prepare('SELECT value FROM settings WHERE key = ?').get('seeded_offers');
  if (already) return;
  const insert = db.prepare(
    `INSERT INTO offers (type, name, category, details, program, price, duration, image, active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`
  );
  const samples = [
    {
      type: 'circuit', name: 'Circuit Annaba – Hippone & Basilique Saint Augustin',
      category: 'Spirituel', price: 'Dès 7 500 DA', duration: '1 jour',
      details: 'Visite guidée de la Basilique Saint Augustin, du théâtre antique de Guelma et du vieux port.',
      program: 'Matin : Basilique Saint Augustin & promenade sur la Corniche.\nAprès-midi : Théâtre romain de Guelma et retour.',
    },
    {
      type: 'circuit', name: 'Omra Ramadan 2026 – La Mecque & Médine',
      category: 'Omra', price: 'Sur demande', duration: '12 jours / 11 nuits',
      details: 'Un accompagnement spirituel complet pour vivre l\'Omra en toute sérénité.',
      program: 'Départ d\'Annaba vers Istanbul, puis Jeddah.\nHôtels proches du Haram et du Masjid Nabawi.\nAccompagnement et encadrement par notre équipe.',
    },
    {
      type: 'excursion', name: 'Excursion Constantine – Cirta',
      category: 'Culturel', price: 'Dès 4 500 DA', duration: '1 jour',
      details: 'Découverte des ponts suspendus, de la ville palmaire et du musée Cirta.',
      program: 'Pont Sidi M\'Cid, Pont suspendu, palais Ahmed Bey.\nDéjeuner typique et temps libre au centre-ville.',
    },
    {
      type: 'excursion', name: 'Excursion plage – Djenane El Bey',
      category: 'Nature', price: 'Dès 3 000 DA', duration: '1 jour',
      details: 'Une journée détente au bord de la Méditerranée, transat et déjeuner inclus.',
      program: 'Transfert aller-retour depuis Annaba.\nAccès plage privée, boissons et déjeuner inclus.',
    },
  ];
  for (const s of samples) {
    insert.run(s.type, s.name, s.category, s.details, s.program, s.price, s.duration, s.image || null);
  }
  db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('seeded_offers', '1');
  console.log(`[seed] Offres -> ${samples.length} exemples créés`);
}
seedOffers();

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/admin', adminRoutes);

// Probe route
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// Public settings (safe, display-only fields set in the admin "Extra" section).
// Only these whitelisted keys are exposed to the public website.
app.get('/api/settings', (req, res) => {
  const allow = ['hero_quote', 'agence_phones', 'agence_email', 'agence_address', 'instagram_url', 'facebook_url'];
  const rows = db.prepare('SELECT key, value FROM settings').all();
  const obj = {};
  rows.forEach((r) => { if (allow.includes(r.key)) obj[r.key] = r.value; });
  return res.json(obj);
});

// Uploaded images (public)
app.use('/uploads', express.static(UPLOADS, { maxAge: '7d' }));

// Admin panel (own login gate is client-side via JWT)
app.use('/admin', express.static(ADMIN_PUBLIC));
app.get('/admin', (req, res) => res.sendFile(path.join(ADMIN_PUBLIC, 'index.html')));

// The existing static website (block access to source/sensitive dirs)
const blocked = ['/server', '/node_modules', '/.git', '/uploads', '/package.json', '/package-lock.json', '/uploads/.gitkeep'];
app.use((req, res, next) => {
  const p = req.path.toLowerCase();
  if (blocked.some(b => p.startsWith(b.toLowerCase()))) {
    return res.status(403).send('Forbidden');
  }
  next();
});
app.use(express.static(ROOT));

// A saved row only needs (re)translation when the EN/AR value is missing or
// looks truncated by the old 500-character cap (stored far shorter than the
// French source). Runs in the background at boot so existing articles/offers
// created before auto-translation get their title/excerpt/content filled.
function needsTranslation(base, translated) {
  if (!base || !String(base).trim()) return false;
  const s = String(base).trim();
  const t = String(translated || '').trim();
  if (!t) return true;
  return s.length > 500 && t.length < s.length * 0.6;
}

async function backfillTranslations() {
  try {
    const posts = db.prepare('SELECT * FROM posts').all();
    for (const p of posts) {
      const fields = [];
      if (needsTranslation(p.title, p.title_en)) fields.push({ key: 'title', value: p.title });
      if (needsTranslation(p.excerpt, p.excerpt_en)) fields.push({ key: 'excerpt', value: p.excerpt });
      if (needsTranslation(p.content, p.content_en)) fields.push({ key: 'content', value: p.content });
      if (!fields.length) continue;
      const map = await translateFields(fields);
      const sets = [];
      const vals = [];
      for (const [key, r] of Object.entries(map)) {
        sets.push(`${key}_en = ?`, `${key}_ar = ?`);
        vals.push(r.en || null, r.ar || null);
      }
      vals.push(p.id);
      db.prepare(`UPDATE posts SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
      console.log(`[backfill] Article #${p.id} traduit : ${fields.map((f) => f.key).join(', ')}`);
    }
    const offers = db.prepare('SELECT * FROM offers').all();
    for (const o of offers) {
      const fields = [];
      if (needsTranslation(o.name, o.name_en)) fields.push({ key: 'name', value: o.name });
      if (needsTranslation(o.details, o.details_en)) fields.push({ key: 'details', value: o.details });
      if (needsTranslation(o.program, o.program_en)) fields.push({ key: 'program', value: o.program });
      if (!fields.length) continue;
      const map = await translateFields(fields);
      const sets = [];
      const vals = [];
      for (const [key, r] of Object.entries(map)) {
        sets.push(`${key}_en = ?`, `${key}_ar = ?`);
        vals.push(r.en || null, r.ar || null);
      }
      vals.push(o.id);
      db.prepare(`UPDATE offers SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
      console.log(`[backfill] Offre #${o.id} traduite : ${fields.map((f) => f.key).join(', ')}`);
    }
  } catch (err) {
    console.error('[backfill] Échec de la traduction automatique :', err.message);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\nSaint Augustin tourisme backend démarré`);
  console.log(`  Site         : http://localhost:${PORT}`);
  console.log(`  Admin panel  : http://localhost:${PORT}/admin`);
  console.log(`  API health   : http://localhost:${PORT}/api/health\n`);
  console.log(`[note] Connecteurs Google/Facebook: renseignez les clés dans server/.env (voir .env.example)`);
});
// Translate existing content in the background so it doesn't slow down boot.
backfillTranslations();