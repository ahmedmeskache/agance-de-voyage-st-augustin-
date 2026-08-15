// Lightweight auto-translation helper using the free MyMemory API
// (no API key required). Falls back to the original text on any failure
// so offers are always saved even if translation is temporarily unavailable.

async function translate(text, to) {
  if (!text || !String(text).trim()) return text || '';
  const s = String(text);
  try {
    const q = encodeURIComponent(s.slice(0, 500));
    const url = `https://api.mymemory.translated.net/get?q=${q}&langpair=fr|${to}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return s;
    const data = await res.json();
    const out = data && data.responseData && data.responseData.translatedText;
    if (!out || out.toLowerCase() === 'invalid request' || /QUERY LENGTH/.test(out)) return s;
    return out;
  } catch (_) {
    return s;
  }
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
