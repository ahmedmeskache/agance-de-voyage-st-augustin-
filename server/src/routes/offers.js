import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import db from '../db.js';
import { contentRequired, authRequired } from '../middleware/auth.js';
import { translateFields } from '../translate.js';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// active arrives as number OR string ("0"/"1"/"true"/"false") via multipart forms.
function parseActive(v) {
  if (v === undefined || v === null) return 1;
  if (typeof v === 'number') return v ? 1 : 0;
  if (typeof v === 'string') return (v === '0' || v === 'false' || v === 'no') ? 0 : (v === 'true' || v === '1' || v === 'on' || v === 'yes') ? 1 : Number(v) ? 1 : 0;
  return v ? 1 : 0;
}
const uploadsDir = process.env.DATA_DIR
  ? path.join(process.env.DATA_DIR, 'uploads')
  : path.join(__dirname, '../../../uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});
// Allow up to 3 images: image (FR), image_en, image_ar
const upload = multer({ storage, limits: { fileSize: 8 * 1024 * 1024 } }).fields([
  { name: 'image', maxCount: 1 },
  { name: 'image_en', maxCount: 1 },
  { name: 'image_ar', maxCount: 1 },
]);

function imgField(req, name, urlVal) {
  if (req.files && req.files[name] && req.files[name][0]) return `/uploads/${req.files[name][0].filename}`;
  if (urlVal) return urlVal;
  return undefined; // no change / absent
}

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

// Auto-translate French text -> EN and AR, return an object with the
// *_en / *_ar values to store. Falls back to null if translation not needed.
async function buildTranslations(fr) {
  const fields = [];
  if (fr.name) fields.push({ key: 'name', value: fr.name });
  if (fr.details) fields.push({ key: 'details', value: fr.details });
  if (fr.program) fields.push({ key: 'program', value: fr.program });
  if (!fields.length) return {};
  const map = await translateFields(fields);
  const out = {};
  for (const [key, val] of Object.entries(map)) {
    out[`${key}_en`] = val.en;
    out[`${key}_ar`] = val.ar;
  }
  return out;
}

// POST /api/offers (admin) â€” optional image file(s) or image_url(s)
router.post('/', contentRequired, upload, async (req, res) => {
  const { type, page, name, category, details, program, price, duration, tags, image_url, image_en_url, image_ar_url, active } = req.body || {};
  if (!type || !name) return res.status(400).json({ error: 'Type et nom requis.' });
  const image = imgField(req, 'image', image_url);
  const image_en = imgField(req, 'image_en', image_en_url);
  const image_ar = imgField(req, 'image_ar', image_ar_url);
  // Auto-translate name/details/program from French into EN and AR.
  const tr = await buildTranslations({ name, details, program });
  const info = db.prepare(
    `INSERT INTO offers (type, page, name, category, details, program, price, duration, tags, image, image_en, image_ar, name_en, name_ar, details_en, details_ar, program_en, program_ar, active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    type, page || null, name, category || null, details || null, program || null,
    price || null, duration || null, tags || null, image, image_en, image_ar,
    tr.name_en || null, tr.name_ar || null,
    tr.details_en || null, tr.details_ar || null,
    tr.program_en || null, tr.program_ar || null,
    parseActive(active)
  );
  return res.status(201).json(db.prepare('SELECT * FROM offers WHERE id = ?').get(info.lastInsertRowid));
});

// PUT /api/offers/:id (admin) â€” mix of fields; image(s) optional
router.put('/:id', contentRequired, upload, async (req, res) => {
  const offer = db.prepare('SELECT * FROM offers WHERE id = ?').get(req.params.id);
  if (!offer) return res.status(404).json({ error: 'Offre introuvable.' });
  const b = req.body || {};
  const image = imgField(req, 'image', b.image_url);
  const image_en = imgField(req, 'image_en', b.image_en_url);
  const image_ar = imgField(req, 'image_ar', b.image_ar_url);
  const name = b.name !== undefined ? b.name : offer.name;
  const details = b.details !== undefined ? b.details : offer.details;
  const program = b.program !== undefined ? b.program : offer.program;
  // Re-translate from the (French/base) source fields whenever they change.
  const tr = await buildTranslations({ name, details, program });
  db.prepare(
    `UPDATE offers SET type=?, page=?, name=?, category=?, details=?, program=?, price=?, duration=?, tags=?, image=?, image_en=?, image_ar=?, name_en=?, name_ar=?, details_en=?, details_ar=?, program_en=?, program_ar=?, active=? WHERE id=?`
  ).run(
    b.type || offer.type,
    b.page !== undefined ? b.page : offer.page,
    name,
    b.category !== undefined ? b.category : offer.category,
    details,
    program,
    b.price !== undefined ? b.price : offer.price,
    b.duration !== undefined ? b.duration : offer.duration,
    b.tags !== undefined ? b.tags : offer.tags,
    image !== undefined ? image : offer.image,
    image_en !== undefined ? image_en : offer.image_en,
    image_ar !== undefined ? image_ar : offer.image_ar,
    tr.name_en || offer.name_en || null,
    tr.name_ar || offer.name_ar || null,
    tr.details_en || offer.details_en || null,
    tr.details_ar || offer.details_ar || null,
    tr.program_en || offer.program_en || null,
    tr.program_ar || offer.program_ar || null,
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