// Lightweight API client for the admin panel.
const API = {
  base: '/api',
  tokenKey: 'satv_admin_token',

  get token() { return localStorage.getItem(this.tokenKey); },
  set token(v) { v ? localStorage.setItem(this.tokenKey, v) : localStorage.removeItem(this.tokenKey); },

  async request(method, path, body) {
    const headers = { 'Content-Type': 'application/json' };
    if (this.token) headers['Authorization'] = 'Bearer ' + this.token;
    const res = await fetch(this.base + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error || 'Erreur serveur');
      err.status = res.status;
      throw err;
    }
    return data;
  },

  get(p)  { return this.request('GET', p); },
  post(p, b) { return this.request('POST', p, b); },
  put(p, b)  { return this.request('PUT', p, b); },
  patch(p, b){ return this.request('PATCH', p, b); },
  del(p)     { return this.request('DELETE', p); },

  // multipart upload helper (image files)
  async upload(method, path, formData) {
    const headers = {};
    if (this.token) headers['Authorization'] = 'Bearer ' + this.token;
    const res = await fetch(this.base + path, { method, headers, body: formData });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Erreur serveur');
    return data;
  },

  // Google / Facebook login are server-side redirects:
  google() { window.location.href = '/api/auth/google/login'; },
  facebook() { window.location.href = '/api/auth/facebook/login'; },
};

// Small DOM helpers
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

function esc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return isNaN(d) ? '' : d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}