// Lightweight auto-translation helper using the free MyMemory API
// (no API key required). Returns null on any failure so the caller stores
// nothing for the EN/AR field — the site then shows the French original and
// the boot-time backfill retries the field later. Long texts are split into
// chunks (MyMemory caps each request at ~500 characters) and translated
// block by block, preserving the paragraph / heading structure used by the site.

const CHUNK_MAX = 480; // safe margin under MyMemory's per-request limit

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// A MyMemory response that means "translation failed" (rate limit, quota
// exhausted, malformed request...) rather than a real translation.
const FAIL_MARKERS = [
  'invalid request',
  'query length',
  'free translations for today',
  'too many requests',
  'rate limit',
  'all available',
  'usage limits',
];

function isFailure(out) {
  const low = String(out).toLowerCase();
  return FAIL_MARKERS.some((m) => low.includes(m));
}

// An optional email registered at mymemory.translated.net raises the free
// daily quota dramatically (set MYMEMORY_EMAIL in server/.env).
const MYMEMORY_EMAIL = process.env.MYMEMORY_EMAIL ? `&de=${encodeURIComponent(process.env.MYMEMORY_EMAIL)}` : '';

async function translateChunk(text, to) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const q = encodeURIComponent(text);
      const url = `https://api.mymemory.translated.net/get?q=${q}&langpair=fr|${to}${MYMEMORY_EMAIL}`;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 7000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      if (res.status === 429) {
        await sleep(800 * (attempt + 1));
        continue;
      }
      if (!res.ok) return null;
      const data = await res.json();
      const out = data && data.responseData && data.responseData.translatedText;
      if (!out || isFailure(out)) return null;
      return out;
    } catch (_) {
      // transient network/abort error -> retry
    }
  }
  return null;
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
// lines) while keeping its structure. Returns null if any chunk fails, so
// the whole field is treated as untranslated and retried later.
async function translateBody(body, to) {
  if (!body) return null;
  if (body.length <= CHUNK_MAX) return translateChunk(body, to);
  const chunks = splitChunks(body);
  const out = [];
  for (const c of chunks) {
    const r = await translateChunk(c, to);
    if (!r) return null;
    out.push(r);
  }
  return out.join('\n');
}

// Translate a full field preserving blank-line (paragraph/heading) structure.
// Returns null if anything fails (so nothing wrong is stored).
async function translate(text, to) {
  if (!text || !String(text).trim()) return null;
  const s = String(text);
  const blocks = s.split(/(\n\s*\n)/); // keep blank-line separators intact
  const parts = [];
  for (const b of blocks) {
    if (/^\s*\n\s*$/.test(b)) { parts.push(b); continue; }
    const trimmed = b.trim();
    if (!trimmed) continue;
    const m = trimmed.match(/^(#{1,3}\s)([\s\S]+)$/);
    const r = m ? await translateBody(m[2], to) : await translateBody(trimmed, to);
    if (r == null) return null; // any block failure -> field untranslated
    parts.push(m ? m[1] + r : r);
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
