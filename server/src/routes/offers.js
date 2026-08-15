import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import db from '../db.js';
import { contentRequired, authRequired } from '../middleware/auth.js';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// active arrives as number OR string ("0"/"1"/"true"/"false") via multipart forms.
function parseActive(v) {
  if (v === undefined || v === null) return 1;
  if (typeof v === 'number') return v ? 1 : 0;
  if (typeof v === 'string') return (v === '0' || v === 'false' || v === 'no') ? 0 : (v === 'true' || v === '1' || v === 'on' || v === 'yes') ? 1 : Number(v) ? 1 : 0;
  return v ? 1 : 0;
}
const uploadsDir = path.join(__dirname, '../../../uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 8 * 1024 * 1024 } });

// GET /api/offers?type=circuit|excursion&page=local|international|omra|etranger|excursions&all=1
// (public: active only unless admin all)
router.get('/', (req, res) => {
  const { type, page, all } = req.query;
  const conds = [];
  const args = [];
  if (type) { conds.push('type = ?'); args.push(type); }
  if (page) { conds.push('page = ?'); args.push(page); }
  if (all !== '1') conds.push('active = 1');
  const where = conds.length ? 'WHERE ' + conds.join(' AND ') : '';
  const rows = db.prepare(`SELECT * FROM offers ${where} ORDER BY created_at DESC`).all(...args);
  return res.json(rows);
});

// GET /api/offers/:id
router.get('/:id', (req, res) => {
  const offer = db.prepare('SELECT * FROM offers WHERE id = ?').get(req.params.id);
  if (!offer) return res.status(404).json({ error: 'Offre introuvable.' });
  return res.json(offer);
});

// POST /api/offers (admin) â€” optional image file or image_url
router.post('/', contentRequired, upload.single('image'), (req, res) => {
  const { type, page, name, category, details, program, price, duration, image_url, active } = req.body || {};
  if (!type || !name) return res.status(400).json({ error: 'Type et nom requis.' });
  const image = req.file ? `/uploads/${req.file.filename}` : (image_url || null);
  const info = db.prepare(
    `INSERT INTO offers (type, page, name, category, details, program, price, duration, image, active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(type, page || null, name, category || null, details || null, program || null, price || null, duration || null, image, parseActive(active));
  return res.status(201).json(db.prepare('SELECT * FROM offers WHERE id = ?').get(info.lastInsertRowid));
});

// PUT /api/offers/:id (admin) â€” mix of fields; image optional
router.put('/:id', contentRequired, upload.single('image'), (req, res) => {
  const offer = db.prepare('SELECT * FROM offers WHERE id = ?').get(req.params.id);
  if (!offer) return res.status(404).json({ error: 'Offre introuvable.' });
  const b = req.body || {};
  const image = req.file ? `/uploads/${req.file.filename}` : (b.image_url !== undefined ? b.image_url : offer.image);
  db.prepare(
    `UPDATE offers SET type=?, page=?, name=?, category=?, details=?, program=?, price=?, duration=?, image=?, active=? WHERE id=?`
  ).run(
    b.type || offer.type,
    b.page !== undefined ? b.page : offer.page,
    b.name !== undefined ? b.name : offer.name,
    b.category !== undefined ? b.category : offer.category,
    b.details !== undefined ? b.details : offer.details,
    b.program !== undefined ? b.program : offer.program,
    b.price !== undefined ? b.price : offer.price,
    b.duration !== undefined ? b.duration : offer.duration,
    image,
    b.active !== undefined ? parseActive(b.active) : offer.active,
    offer.id
  );
  return res.json(db.prepare('SELECT * FROM offers WHERE id = ?').get(offer.id));
});

// DELETE /api/offers/:id (admin)
router.delete('/:id', contentRequired, (req, res) => {
  const info = db.prepare('DELETE FROM offers WHERE id = ?').run(req.params.id);
  if (!info.changes) return res.status(404).json({ error: 'Offre introuvable.' });
  return res.json({ ok: true });
});

export default router;