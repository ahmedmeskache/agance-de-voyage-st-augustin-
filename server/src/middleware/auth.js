import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

// If JWT_SECRET is not configured, generate a strong random one at boot so
// the publicly-known default can never be used to forge tokens. Consequence:
// without JWT_SECRET, sessions are invalidated on every restart.
export const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(48).toString('hex');
if (!process.env.JWT_SECRET) {
  console.warn('[security] JWT_SECRET non défini — secret aléatoire généré (les sessions expirent à chaque redémarrage). Définissez JWT_SECRET dans Railway.');
}
export const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || '7d';

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Authentification requise.' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: 'Session invalide ou expirée.' });
  }
}

export function adminRequired(req, res, next) {
  authRequired(req, res, () => {
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs.' });
    }
    return next();
  });
}

// Only full admins (not managers)
export function superAdminRequired(req, res, next) {
  authRequired(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Action réservée aux administrateurs.' });
    }
    return next();
  });
}