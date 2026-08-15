import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import db from '../db.js';
import { contentRequired, authRequired } from '../middleware/auth.js';

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
const upload = multer({ storage, limits: { fileSize: 8 * 1024 * 1024 } });

// Public list (active posts)
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM posts WHERE active = 1 ORDER BY created_at DESC').all();
  return res.json(rows);
});

// Public single
router.get('/admin/all', contentRequired, (req, res) => {
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
router.post('/', contentRequired, upload.single('image'), (req, res) => {
  const { title, category, excerpt, content, image_url, tags, active } = req.body || {};
  if (!title) return res.status(400).json({ error: 'Le titre est requis.' });
  const image = req.file ? `/uploads/${req.file.filename}` : (image_url || null);
  const info = db.prepare(
    'INSERT INTO posts (title, category, excerpt, content, image, tags, active) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(title, category || null, excerpt || null, content || null, image, tags || null, parseActive(active));
  return res.status(201).json(db.prepare('SELECT * FROM posts WHERE id = ?').get(info.lastInsertRowid));
});

// Admin update
router.put('/:id', contentRequired, upload.single('image'), (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Article introuvable.' });
  const b = req.body || {};
  const image = req.file ? `/uploads/${req.file.filename}` : (b.image_url !== undefined ? b.image_url : post.image);
  db.prepare(
    'UPDATE posts SET title=?, category=?, excerpt=?, content=?, image=?, tags=?, active=? WHERE id=?'
  ).run(
    b.title !== undefined ? b.title : post.title,
    b.category !== undefined ? b.category : post.category,
    b.excerpt !== undefined ? b.excerpt : post.excerpt,
    b.content !== undefined ? b.content : post.content,
    image,
    b.tags !== undefined ? b.tags : post.tags,
    b.active !== undefined ? parseActive(b.active) : post.active,
    post.id
  );
  return res.json(db.prepare('SELECT * FROM posts WHERE id = ?').get(post.id));
});

// Admin delete
router.delete('/:id', contentRequired, (req, res) => {
  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
  return res.json({ ok: true });
});

export default router;