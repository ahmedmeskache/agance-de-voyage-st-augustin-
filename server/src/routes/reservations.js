import { Router } from 'express';
import db from '../db.js';
import { authRequired, contentRequired } from '../middleware/auth.js';

const router = Router();

// Client creates a reservation (must be logged in)
router.post('/', authRequired, (req, res) => {
  const { offer_id, offer_name, type, travel_date, people, message, contact_name, contact_email, contact_phone } = req.body || {};
  if (!offer_name) return res.status(400).json({ error: 'Veuillez préciser l\'offre souhaitée.' });

  const u = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  const info = db.prepare(
    `INSERT INTO reservations
       (user_id, offer_id, offer_name, type, contact_name, contact_email, contact_phone, travel_date, people, message, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`
  ).run(
    req.user.id,
    offer_id || null,
    offer_name,
    type || 'circuit',
    contact_name || (u && u.name) || null,
    contact_email || (u && u.email) || null,
    contact_phone || (u && u.phone) || null,
    travel_date || null,
    people || null,
    message || null
  );
  return res.status(201).json({ ok: true, id: info.lastInsertRowid });
});

// Client: list own reservations
router.get('/mine', authRequired, (req, res) => {
  const rows = db.prepare('SELECT * FROM reservations WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  return res.json(rows);
});

// Admin: all reservations (with optional status filter)
router.get('/', contentRequired, (req, res) => {
  const { status } = req.query;
  const rows = status
    ? db.prepare('SELECT * FROM reservations WHERE status = ? ORDER BY created_at DESC').all(status)
    : db.prepare('SELECT * FROM reservations ORDER BY created_at DESC').all();
  return res.json(rows);
});

// Admin: update reservation status
router.patch('/:id', contentRequired, (req, res) => {
  const { status } = req.body || {};
  if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Statut invalide.' });
  }
  const info = db.prepare('UPDATE reservations SET status = ? WHERE id = ?').run(status, req.params.id);
  if (!info.changes) return res.status(404).json({ error: 'Réservation introuvable.' });
  return res.json(db.prepare('SELECT * FROM reservations WHERE id = ?').get(req.params.id));
});

// Admin: delete reservation
router.delete('/:id', contentRequired, (req, res) => {
  db.prepare('DELETE FROM reservations WHERE id = ?').run(req.params.id);
  return res.json({ ok: true });
});

export default router;