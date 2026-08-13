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
const UPLOADS = path.join(ROOT, 'uploads');

const app = express();
app.disable('x-powered-by');
app.use(cors());
app.use(express.json({ limit: '2mb' }));

import db from './db.js';
import bcrypt from 'bcryptjs';

// Seed the admin account on first boot (does not close the shared connection)
function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@satv.dz';
  const password = process.env.ADMIN_PASSWORD || 'admin123456';
  const name = process.env.ADMIN_NAME || 'Administrateur';
  const existing = db.prepare('SELECT id FROM users WHERE role = ?').get('admin');
  if (!existing) {
    db.prepare('INSERT INTO users (name, email, password_hash, provider, role) VALUES (?, ?, ?, ?, ?)')
      .run(name, email, bcrypt.hashSync(password, 10), 'email', 'admin');
    console.log(`[seed] Admin -> ${email}`);
  }
}
seedAdmin();

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/admin', adminRoutes);

// Probe route
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\nSaint Augustin tourisme backend démarré`);
  console.log(`  Site         : http://localhost:${PORT}`);
  console.log(`  Admin panel  : http://localhost:${PORT}/admin`);
  console.log(`  API health   : http://localhost:${PORT}/api/health\n`);
  console.log(`[note] Connecteurs Google/Facebook: renseignez les clés dans server/.env (voir .env.example)`);
});