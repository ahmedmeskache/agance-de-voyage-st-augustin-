import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { adminRequired, superAdminRequired } from '../middleware/auth.js';

const router = Router();

function publicUser(u) {
  if (!u) return null;
  return { id: u.id, name: u.name, email: u.email, role: u.role, phone: u.phone, provider: u.provider, created_at: u.created_at };
}

// Dashboard stats
router.get('/stats', adminRequired, (req, res) => {
  const one = {
    users: db.prepare('SELECT COUNT(*) c FROM users').get().c,
    offers: db.prepare('SELECT COUNT(*) c FROM offers').get().c,
    circuits: db.prepare('SELECT COUNT(*) c FROM offers WHERE type = ?').get('circuit').c,
    excursions: db.prepare('SELECT COUNT(*) c FROM offers WHERE type = ?').get('excursion').c,
    posts: db.prepare('SELECT COUNT(*) c FROM posts').get().c,
    reservationsTotal: db.prepare('SELECT COUNT(*) c FROM reservations').get().c,
    reservationsPending: db.prepare('SELECT COUNT(*) c FROM reservations WHERE status = ?').get('pending').c,
    reservationsConfirmed: db.prepare('SELECT COUNT(*) c FROM reservations WHERE status = ?').get('confirmed').c,
  };
  const recentReservations = db.prepare(
    'SELECT r.*, u.name AS user_name, u.email AS user_email FROM reservations r LEFT JOIN users u ON u.id = r.user_id ORDER BY r.created_at DESC LIMIT 8'
  ).all();
  const recentUsers = db.prepare('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT 8').all();
  return res.json({ ...one, recentReservations, recentUsers });
});

// ---------- Users (accounts & admin management) ----------
router.get('/users', superAdminRequired, (req, res) => {
  const rows = db.prepare(
    "SELECT id, name, email, role, phone, provider, created_at, (SELECT COUNT(*) FROM reservations r WHERE r.user_id = u.id) AS reservations_count FROM users u ORDER BY created_at DESC"
  ).all();
  return res.json(rows.map(publicUser).map(u => {
    const full = rows.find(r => r.id === u.id);
    return { ...u, reservations_count: full ? full.reservations_count : 0 };
  }));
});

router.post('/users', superAdminRequired, (req, res) => {
  const { name, email, password, phone, role } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nom, email et mot de passe requis.' });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ error: 'Le mot de passe doit faire au moins 6 caractères.' });
  }
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
if (existing) return res.status(409).json({ error: 'Un compte existe déjà avec cet email.' });

  const allowed = ['admin', 'manager', 'user'];
  const finalRole = allowed.includes(role) ? role : 'user';
  const info = db.prepare(
    "INSERT INTO users (name, email, password_hash, phone, role, provider) VALUES (?, ?, ?, ?, ?, 'email')"
  ).run(name, email, bcrypt.hashSync(password, 10), phone || null, finalRole);
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
  return res.status(201).json(publicUser(user));
});

router.put('/users/:id', superAdminRequired, (req, res) => {
  const id = Number(req.params.id);
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });
  const { name, email, phone, role } = req.body || {};
  const allowed = ['admin', 'manager', 'user'];
  const newRole = role !== undefined ? (allowed.includes(role) ? role : user.role) : user.role;
  // Prevent self-demotion
  if (id === req.user.id && newRole !== 'admin') {
    return res.status(400).json({ error: 'Vous ne pouvez pas rétrograder votre propre compte.' });
  }
  const newEmail = email !== undefined ? email : user.email;
  if (newEmail !== user.email) {
    const clash = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(newEmail, id);
if (clash) return res.status(409).json({ error: 'Un autre compte utilise déjà cet email.' });
  }
  db.prepare("UPDATE users SET name = COALESCE(?, name), email = ?, phone = ?, role = COALESCE(?, role) WHERE id = ?")
    .run(name || null, newEmail, phone !== undefined ? phone : user.phone, newRole, id);
  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  return res.json(publicUser(updated));
});

// Reset a user's password (admin-side)
router.put('/users/:id/password', superAdminRequired, (req, res) => {
  const id = Number(req.params.id);
  const { password } = req.body || {};
  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Le mot de passe doit faire au moins 6 caractères.' });
  }
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(bcrypt.hashSync(password, 10), id);
  return res.json({ ok: true });
});

router.delete('/users/:id', superAdminRequired, (req, res) => {
  const id = Number(req.params.id);
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });
  // Prevent deleting yourself
  if (id === req.user.id) return res.status(400).json({ error: 'Vous ne pouvez pas supprimer votre propre compte.' });
  db.prepare('DELETE FROM users WHERE id = ?').run(id);
  return res.json({ ok: true });
});

// ---------- Settings ("Extra" content) ----------
router.get('/settings', superAdminRequired, (req, res) => {
  const rows = db.prepare('SELECT key, value FROM settings').all();
  const obj = {};
  rows.forEach((r) => { obj[r.key] = r.value; });
  return res.json(obj);
});

router.put('/settings', superAdminRequired, (req, res) => {
  const body = req.body || {};
  const upsert = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value');
  for (const [k, v] of Object.entries(body)) {
    upsert.run(k, v === null ? '' : String(v));
  }
  const rows = db.prepare('SELECT key, value FROM settings').all();
  const obj = {};
  rows.forEach((r) => { obj[r.key] = r.value; });
  return res.json(obj);
});

export default router;
