import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import db from '../db.js';
import { adminRequired } from '../middleware/auth.js';
import { translateFields } from '../translate.js';
import { retranslatePost } from '../retranslate.js';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '../../../uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

// active arrives as number OR string ("0"/"1"/"true"/"false") via multipart forms.
function parseActive(v) {
  if (v === undefined || v === null) return 1;
  if (typeof v === 'number') return v ? 1 : 0;
  if (typeof v === 'string') return (v === '0' || v === 'false' || v === 'no') ? 0 : (v === 'true' || v === '1' || v === 'on' || v === 'yes') ? 1 : Number(v) ? 1 : 0;
  return v ? 1 : 0;
}

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname) || '.jpg'}`),
});
// Only image uploads (never HTML/JS that could be hosted as malicious pages).
function imageFilter(req, file, cb) {
  if (/^image\/(jpe?g|png|webp|gif)$/i.test(file.mimetype)) return cb(null, true);
  return cb(new Error('Seules les images (jpg, png, webp, gif) sont autorisées.'));
}
const upload = multer({ storage, limits: { fileSize: 8 * 1024 * 1024 }, fileFilter: imageFilter });

// Auto-translate title/excerpt/content to EN/AR, but never override a
// translation the admin typed manually (those are used verbatim).
async function buildTranslations(fr, overrides = {}) {
  const fields = [];
  if (fr.title) fields.push({ key: 'title', value: fr.title });
  if (fr.category) fields.push({ key: 'category', value: fr.category });
  if (fr.excerpt) fields.push({ key: 'excerpt', value: fr.excerpt });
  if (fr.content) fields.push({ key: 'content', value: fr.content });
  if (!fields.length) return {};
  const map = await translateFields(fields);
  const out = {};
  for (const [key, val] of Object.entries(map)) {
    const en = overrides[`${key}_en`];
    const ar = overrides[`${key}_ar`];
    out[`${key}_en`] = (en && String(en).trim()) ? String(en).trim() : val.en;
    out[`${key}_ar`] = (ar && String(ar).trim()) ? String(ar).trim() : val.ar;
  }
  return out;
}

// Public list (active posts)
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM posts WHERE active = 1 ORDER BY created_at DESC').all();
  return res.json(rows);
});

// Public single
router.get('/admin/all', adminRequired, (req, res) => {
  const rows = db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
  return res.json(rows);
});

// Public single
router.get('/:id', (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Article introuvable.' });
  return res.json(post);
});

// Admin list (all, incl inactive)

// Admin create
router.post('/', adminRequired, upload.single('image'), async (req, res) => {
  const { title, category, excerpt, content, image_url, tags, active, title_en, title_ar, excerpt_en, excerpt_ar, content_en, content_ar, category_en, category_ar } = req.body || {};
  if (!title) return res.status(400).json({ error: 'Le titre est requis.' });
  const image = req.file ? `/uploads/${req.file.filename}` : (image_url || null);
  const tr = await buildTranslations({ title, category, excerpt, content }, req.body);
  const info = db.prepare(
    `INSERT INTO posts (title, category, excerpt, content, image, tags, active, category_en, category_ar, title_en, title_ar, excerpt_en, excerpt_ar, content_en, content_ar)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    title, category || null, excerpt || null, content || null, image, tags || null, parseActive(active),
    tr.category_en || category_en || null, tr.category_ar || category_ar || null,
    tr.title_en || null, tr.title_ar || null,
    tr.excerpt_en || null, tr.excerpt_ar || null,
    tr.content_en || null, tr.content_ar || null
  );
  return res.status(201).json(db.prepare('SELECT * FROM posts WHERE id = ?').get(info.lastInsertRowid));
});

// Admin update
router.put('/:id', adminRequired, upload.single('image'), async (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Article introuvable.' });
  const b = req.body || {};
  const image = req.file ? `/uploads/${req.file.filename}` : (b.image_url !== undefined ? b.image_url : post.image);
  const title = b.title !== undefined ? b.title : post.title;
  const excerpt = b.excerpt !== undefined ? b.excerpt : post.excerpt;
  const content = b.content !== undefined ? b.content : post.content;
  const category = b.category !== undefined ? b.category : post.category;
  const tr = await buildTranslations({ title, category, excerpt, content }, b);
  db.prepare(
    `UPDATE posts SET title=?, category=?, excerpt=?, content=?, image=?, tags=?, active=?,
       category_en=?, category_ar=?, title_en=?, title_ar=?, excerpt_en=?, excerpt_ar=?, content_en=?, content_ar=? WHERE id=?`
  ).run(
    title,
    category,
    excerpt,
    content,
    image,
    b.tags !== undefined ? b.tags : post.tags,
    b.active !== undefined ? parseActive(b.active) : post.active,
    tr.category_en || post.category_en || null,
    tr.category_ar || post.category_ar || null,
    tr.title_en || post.title_en || null,
    tr.title_ar || post.title_ar || null,
    tr.excerpt_en || post.excerpt_en || null,
    tr.excerpt_ar || post.excerpt_ar || null,
    tr.content_en || post.content_en || null,
    tr.content_ar || post.content_ar || null,
    post.id
  );
  return res.json(db.prepare('SELECT * FROM posts WHERE id = ?').get(post.id));
});

// Admin re-translate (fills missing/failed EN/AR text; force = overwrite all)
router.post('/:id/retranslate', adminRequired, async (req, res) => {
  try {
    const force = !!(req.body && req.body.force);
    const r = await retranslatePost(req.params.id, force);
    if (!r) return res.status(404).json({ error: 'Article introuvable.' });
    return res.json({
      ok: true,
      translated: r.translated,
      post: db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id),
    });
  } catch (err) {
    return res.status(502).json({ error: 'Service de traduction indisponible. Réessayez plus tard.' });
  }
});

// Admin delete
router.delete('/:id', adminRequired, (req, res) => {
  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
  return res.json({ ok: true });
});

export default router;