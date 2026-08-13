import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-to-a-long-random-string';
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

// Content editors: admin, manager AND regular users can add/edit content.
export function contentRequired(req, res, next) {
  authRequired(req, res, () => {
    const role = req.user.role;
    if (role !== 'admin' && role !== 'manager' && role !== 'user') {
      return res.status(403).json({ error: 'Accès refusé.' });
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