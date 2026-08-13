import db from './db.js';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const email = process.env.ADMIN_EMAIL || 'admin@satv.dz';
const password = process.env.ADMIN_PASSWORD || 'admin123456';
const name = process.env.ADMIN_NAME || 'Administrateur';

const existing = db.prepare('SELECT id FROM users WHERE role = ?').get('admin');
if (!existing) {
  const hash = bcrypt.hashSync(password, 10);
  db.prepare(
    'INSERT INTO users (name, email, password_hash, provider, role) VALUES (?, ?, ?, ?, ?)'
  ).run(name, email, hash, 'email', 'admin');
  console.log(`[seed] Admin seeded -> ${email} / ${password}`);
} else {
  console.log('[seed] Admin already exists, nothing to do.');
}

db.close();