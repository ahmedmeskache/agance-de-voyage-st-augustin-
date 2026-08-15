// On-demand re-translation for posts and offers (used by the admin
// "Re-traduire" buttons). Only fills fields whose EN/AR value is missing,
// equals the French source (a failed fallback), or was truncated by the old
// 500-character limit. Manually typed translations are preserved.

import db from './db.js';
import { translateFields } from './translate.js';

function needsTranslation(base, translated) {
  if (!base || !String(base).trim()) return false;
  const s = String(base).trim();
  const t = String(translated || '').trim();
  if (!t) return true;
  if (t === s) return true;
  return s.length > 500 && t.length < s.length * 0.6;
}

async function retranslateRow(table, fields, id, force = false) {
  const row = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
  if (!row) return null;
  // force = re-translate every field (overwrites even manual overrides);
  // otherwise only fields whose EN/AR value looks missing or broken.
  const todo = force
    ? fields.filter((f) => row[f.name] && String(row[f.name]).trim())
    : fields.filter((f) => needsTranslation(row[f.name], row[`${f.name}_en`]));
  if (!todo.length) return { translated: [] };
  const map = await translateFields(todo.map((f) => ({ key: f.name, value: row[f.name] })));
  const sets = [];
  const vals = [];
  for (const f of todo) {
    const r = map[f.name];
    if (!r || !r.en) continue; // translation failed -> keep existing value
    sets.push(`${f.name}_en = ?`, `${f.name}_ar = ?`);
    vals.push(r.en || null, r.ar || null);
  }
  if (!sets.length) return { translated: [] };
  vals.push(id);
  db.prepare(`UPDATE ${table} SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
  return { translated: todo.map((f) => f.name) };
}

const POST_FIELDS = [
  { name: 'title' },
  { name: 'excerpt' },
  { name: 'content' },
];

const OFFER_FIELDS = [
  { name: 'name' },
  { name: 'details' },
  { name: 'program' },
];

export function retranslatePost(id, force = false) {
  return retranslateRow('posts', POST_FIELDS, id, force);
}

export function retranslateOffer(id, force = false) {
  return retranslateRow('offers', OFFER_FIELDS, id, force);
}
