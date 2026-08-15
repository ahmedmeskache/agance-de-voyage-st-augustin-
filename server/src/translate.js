// Lightweight auto-translation helper using the free MyMemory API
// (no API key required). Falls back to the original text on any failure
// so offers/articles are always saved even if translation is temporarily
// unavailable. Long texts are split into chunks (MyMemory caps each request
// at ~500 characters) and translated block by block, preserving the
// paragraph / heading structure used by the site.

const CHUNK_MAX = 480; // safe margin under MyMemory's per-request limit

async function translateChunk(text, to) {
  try {
    const q = encodeURIComponent(text);
    const url = `https://api.mymemory.translated.net/get?q=${q}&langpair=fr|${to}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    const out = data && data.responseData && data.responseData.translatedText;
    if (!out || out.toLowerCase() === 'invalid request' || /QUERY LENGTH/.test(out)) return null;
    return out;
  } catch (_) {
    return null;
  }
}

// Split a piece of body text (no blank lines inside) into chunks no longer
// than CHUNK_MAX, breaking at line breaks first, then at word boundaries.
function splitChunks(body) {
  const chunks = [];
  let current = '';
  for (const line of body.split('\n')) {
    const parts = [];
    if (line.length > CHUNK_MAX) {
      let rest = line;
      while (rest.length > CHUNK_MAX) {
        const cut = rest.lastIndexOf(' ', CHUNK_MAX);
        if (cut < 1) break;
        parts.push(rest.slice(0, cut));
        rest = rest.slice(cut + 1);
      }
      if (rest) parts.push(rest);
    } else {
      parts.push(line);
    }
    for (const part of parts) {
      const candidate = current ? current + '\n' + part : part;
      if (candidate.length <= CHUNK_MAX) {
        current = candidate;
      } else {
        if (current) chunks.push(current);
        current = part;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

// Translate a block of text (may contain single line breaks, no blank
// lines) while keeping its structure.
async function translateBody(body, to) {
  if (!body) return body || '';
  if (body.length <= CHUNK_MAX) {
    const out = await translateChunk(body, to);
    return out || body;
  }
  const chunks = splitChunks(body);
  const out = [];
  for (const c of chunks) {
    out.push((await translateChunk(c, to)) || c);
  }
  return out.join('\n');
}

// Translate a full field preserving blank-line (paragraph/heading) structure.
async function translate(text, to) {
  if (!text || !String(text).trim()) return text || '';
  const s = String(text);
  const blocks = s.split(/(\n\s*\n)/); // keep blank-line separators intact
  const parts = [];
  for (const b of blocks) {
    if (/^\s*\n\s*$/.test(b)) { parts.push(b); continue; }
    const trimmed = b.trim();
    if (!trimmed) continue;
    const m = trimmed.match(/^(#{1,3}\s)([\s\S]+)$/);
    if (m) {
      parts.push(m[1] + await translateBody(m[2], to));
    } else {
      parts.push(await translateBody(trimmed, to));
    }
  }
  return parts.join('');
}

// Translate a field into both English and Arabic.
async function translateField(frValue) {
  if (!frValue || !String(frValue).trim()) {
    return { en: null, ar: null };
  }
  const [en, ar] = await Promise.all([
    translate(frValue, 'en'),
    translate(frValue, 'ar'),
  ]);
  return { en, ar };
}

// Translate several French fields at once into EN/AR.
// fields: array of { key, value }. Returns map key -> {en, ar}.
async function translateFields(fields) {
  const out = {};
  const results = await Promise.all(fields.map((f) => translateField(f.value).then((r) => ({ key: f.key, ...r }))));
  results.forEach((r) => { out[r.key] = r; });
  return out;
}

export { translate, translateField, translateFields };
