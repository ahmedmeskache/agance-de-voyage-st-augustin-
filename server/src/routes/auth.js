import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import { signToken, authRequired, JWT_SECRET } from '../middleware/auth.js';
import rateLimit from '../rateLimit.js';
import 'dotenv/config';

const router = Router();

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email, role: u.role, phone: u.phone };
}

function findOrCreate(profile, provider) {
  const user = db.prepare('SELECT * FROM users WHERE provider = ? AND provider_id = ?').get(provider, profile.id)
    || db.prepare('SELECT * FROM users WHERE email = ?').get(profile.email);
  if (user) {
    if (!user.provider_id && profile.id) {
      db.prepare('UPDATE users SET provider = ?, provider_id = ? WHERE id = ?').run(provider, profile.id, user.id);
    }
    return publicUser(user);
  }
  const info = db.prepare(
    'INSERT INTO users (name, email, provider, provider_id, role) VALUES (?, ?, ?, ?, ?)'
  ).run(profile.name || 'Utilisateur', profile.email || null, provider, profile.id || null, 'user');
  return publicUser(db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid));
}

// ---------- Email ----------
router.post('/register', loginLimiter, (req, res) => {
  const { name, email, password, phone } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nom, email et mot de passe requis.' });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ error: 'Le mot de passe doit faire au moins 6 caractères.' });
  }
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ error: 'Un compte existe déjà avec cet email.' });

  const hash = bcrypt.hashSync(password, 10);
  const info = db.prepare(
    'INSERT INTO users (name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?)'
  ).run(name, email, hash, phone || null, 'user');
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
  return res.json({ token: signToken({ id: user.id, role: user.role }), user: publicUser(user) });
});

router.post('/login', loginLimiter, (req, res) => {
  const { email, password } = req.body || {};
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !user.password_hash || !bcrypt.compareSync(password || '', user.password_hash)) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
  }
  return res.json({ token: signToken({ id: user.id, role: user.role }), user: publicUser(user) });
});

router.get('/me', (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Non connecté.' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(payload.id);
    if (!user) return res.status(401).json({ error: 'Utilisateur introuvable.' });
    const { password_hash, ...rest } = user;
    return res.json({ user: rest });
  } catch {
    return res.status(401).json({ error: 'Session invalide.' });
  }
});

// ---------- Social (server-side redirect flow, secrets stay safe) ----------
router.get('/google/login', (req, res) => {
  const { GOOGLE_CLIENT_ID } = process.env;
  const redirect_uri = `${process.env.PUBLIC_URL || ''}/api/auth/google/callback`;
  if (!GOOGLE_CLIENT_ID) {
    return res.redirect(`/#login=social&error=google-not-configured`);
  }
  const url = 'https://accounts.google.com/o/oauth2/v2/auth'
    + `?client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}`
    + `&redirect_uri=${encodeURIComponent(redirect_uri)}`
    + '&response_type=code&scope=openid%20email%20profile&access_type=online';
  return res.redirect(url);
});

router.get('/google/callback', async (req, res) => {
  const { code, error } = req.query;
  const redirect_uri = `${process.env.PUBLIC_URL || ''}/api/auth/google/callback`;
  if (error || !code) return res.redirect(`/#login=social&error=google-denied`);
  try {
    const tokRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code, client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri, grant_type: 'authorization_code',
      }),
    });
    const tokens = await tokRes.json();
    const profRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = await profRes.json();
    const user = findOrCreate({ id: profile.sub, email: profile.email, name: profile.name }, 'google');
    const token = signToken({ id: user.id, role: user.role });
    return res.redirect(`/#login=social&token=${token}&name=${encodeURIComponent(user.name)}`);
  } catch (err) {
    return res.redirect(`/#login=social&error=google-failed`);
  }
});

router.get('/facebook/login', (req, res) => {
  const { FACEBOOK_APP_ID } = process.env;
  const redirect_uri = `${process.env.PUBLIC_URL || ''}/api/auth/facebook/callback`;
  if (!FACEBOOK_APP_ID) return res.redirect(`/#login=social&error=facebook-not-configured`);
  const url = 'https://www.facebook.com/v19.0/dialog/oauth'
    + `?client_id=${encodeURIComponent(FACEBOOK_APP_ID)}`
    + `&redirect_uri=${encodeURIComponent(redirect_uri)}`
    + '&scope=email,public_profile';
  return res.redirect(url);
});

router.get('/facebook/callback', async (req, res) => {
  const { code, error } = req.query;
  const redirect_uri = `${process.env.PUBLIC_URL || ''}/api/auth/facebook/callback`;
  if (error || !code) return res.redirect(`/#login=social&error=facebook-denied`);
  try {
    const qs = new URLSearchParams({
      client_id: process.env.FACEBOOK_APP_ID,
      client_secret: process.env.FACEBOOK_APP_SECRET,
      redirect_uri, code,
    }).toString();
    const tokRes = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?${qs}`).catch(() => ({ json: () => ({}) }));
    const tokens = await tokRes.json();
    const profRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${tokens.access_token}`);
    const profile = await profRes.json();
    const user = findOrCreate({ id: profile.id, email: profile.email, name: profile.name }, 'facebook');
    const token = signToken({ id: user.id, role: user.role });
    return res.redirect(`/#login=social&token=${token}&name=${encodeURIComponent(user.name)}`);
  } catch {
    return res.redirect(`/#login=social&error=facebook-failed`);
  }
});

// ---------- Admin ----------
router.post('/admin/login', loginLimiter, (req, res) => {
  const { email, password } = req.body || {};
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !user.password_hash || !bcrypt.compareSync(password || '', user.password_hash)) {
    return res.status(401).json({ error: 'Identifiants admin incorrects.' });
  }
  // Only admins and managers may access the admin panel.
  if (user.role !== 'admin' && user.role !== 'manager') {
    return res.status(403).json({ error: 'Votre compte n\'a pas les droits administrateur.' });
  }
  return res.json({ token: signToken({ id: user.id, role: user.role }), user: publicUser(user) });
});

// Change the current admin's password
router.post('/change-password', authRequired, (req, res) => {
  const { current_password, new_password } = req.body || {};
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!user || !user.password_hash || !bcrypt.compareSync(current_password || '', user.password_hash)) {
    return res.status(401).json({ error: 'Mot de passe actuel incorrect.' });
  }
  if (typeof new_password !== 'string' || new_password.length < 6) {
    return res.status(400).json({ error: 'Le nouveau mot de passe doit faire au moins 6 caractères.' });
  }
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(bcrypt.hashSync(new_password, 10), user.id);
  return res.json({ ok: true });
});

// Update the current user's own name / email (self-serve)
router.put('/me', authRequired, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });
  const { name, email, phone } = req.body || {};
  const newEmail = email !== undefined ? String(email).trim() : user.email;
  if (newEmail && newEmail !== user.email) {
    const clash = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(newEmail, user.id);
    if (clash) return res.status(409).json({ error: 'Un autre compte utilise déjà cet email.' });
  }
  db.prepare('UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), phone = ? WHERE id = ?')
    .run(
      name !== undefined ? String(name).trim() || null : null,
      newEmail || null,
      phone !== undefined ? String(phone).trim() || null : user.phone,
      user.id
    );
  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
  const { password_hash, ...rest } = updated;
  return res.json({ user: rest });
});

export default router;