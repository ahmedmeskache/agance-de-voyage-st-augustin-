// Shared client script: social-login callback, account menu, reservation modal.
// Include on any page: <script src="assets/app.js"></script>
(function () {
  const API = {
    base: '/api',
    token() { return localStorage.getItem('satv_token'); },
    setToken(v) { v ? localStorage.setItem('satv_token', v) : localStorage.removeItem('satv_token'); },
    async req(method, path, body) {
      const headers = { 'Content-Type': 'application/json' };
      const t = this.token();
      if (t) headers['Authorization'] = 'Bearer ' + t;
      const res = await fetch(this.base + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Erreur');
      return data;
    },
  };

  let userName = localStorage.getItem('satv_name');
  function isAuthed() { return !!API.token(); }

  // ---- handle OAuth callback: server redirected to /#login=social&token=... ----
  function handleCallback() {
    const h = window.location.hash;
    if (!h || h.indexOf('login=social') === -1) return;
    const params = new URLSearchParams(h.replace(/^#/, ''));
    if (params.get('error')) {
      alert('Connexion : ' + params.get('error'));
      window.location.hash = '';
      return;
    }
    const token = params.get('token');
    const name = params.get('name') || 'Utilisateur';
    if (token) {
      API.setToken(token);
      localStorage.setItem('satv_name', name);
      window.location.hash = '';
      const r = localStorage.getItem('satv_redirect');
      localStorage.removeItem('satv_redirect');
      if (r) window.location.href = r;
    }
  }

  // ---- build account UI (login link / account menu) ----
  function buildAccountUI() {
    const btn = document.createElement('div');
    btn.id = 'satvAccount';
    btn.style.cssText = 'position:fixed;bottom:90px;right:20px;z-index:60;font-family:Montserrat,sans-serif;';
    const render = () => {
      if (isAuthed()) {
        btn.innerHTML = `<div style="background:#122a4d;color:#fff;border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,.25);overflow:hidden;min-width:180px">
          <div style="padding:12px 16px;font-weight:700;border-bottom:1px solid rgba(255,255,255,.15)">${esc(userName || 'Mon compte')}</div>
          <div style="display:flex;flex-direction:column">
            <a href="javascript:void(0)" onclick="openAccountSettings()" style="padding:10px 16px;color:#fff;text-decoration:none;font-size:13px">Mon compte / Modifier</a>
            <a href="login.html" onclick="event.preventDefault();logoutClient();" style="padding:10px 16px;color:#fff;text-decoration:none;font-size:13px">Se déconnecter</a>
            <a href="index.html" style="padding:10px 16px;color:#fff;text-decoration:none;font-size:13px">Retour à l'accueil</a>
          </div></div>`;
      } else {
        btn.innerHTML = `<a href="login.html" style="display:inline-block;background:#b8912f;color:#fff;text-decoration:none;padding:10px 18px;border-radius:30px;font-weight:700;box-shadow:0 8px 24px rgba(0,0,0,.25)">Se connecter / S'inscrire</a>`;
      }
    };
    render();
    document.body.appendChild(btn);
  }

  window.logoutClient = function () {
    API.setToken(null);
    localStorage.removeItem('satv_name');
    userName = null;
    location.reload();
  };

  // ---- account settings (change email / password) ----
  function openAccountSettings() {
    if (!isAuthed()) { window.location.href = 'login.html'; return; }
    const old = document.getElementById('acctSettingsModal');
    if (old) old.remove();
    const m = document.createElement('div');
    m.id = 'acctSettingsModal';
    m.style.cssText = 'position:fixed;inset:0;background:rgba(10,18,30,.6);display:flex;align-items:center;justify-content:center;z-index:600;padding:20px;font-family:Montserrat,sans-serif;';
    m.innerHTML = `<div style="background:#fff;border-radius:16px;width:460px;max-width:100%;max-height:92vh;overflow:auto;padding:26px;box-shadow:0 30px 80px rgba(0,0,0,.4)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <h3 style="margin:0;color:#122a4d;font-family:'Playfair Display',serif">Mon compte</h3>
        <button class="acct-close" style="border:none;background:none;font-size:26px;cursor:pointer;color:#666">×</button>
      </div>
      <div id="acctMsg" style="color:#c0392b;background:#fdecea;padding:10px;border-radius:8px;display:none;margin-bottom:12px;font-size:13px"></div>

      <div style="font-weight:700;font-size:13px;color:#122a4d;margin:14px 0 8px;border-top:1px solid #eee;padding-top:14px">Modifier mon profil</div>
      <div class="acct-field"><label style="font-size:13px;font-weight:600">Nom</label><input id="acct_name" style="width:100%;padding:11px;border:1px solid #e3dccb;border-radius:8px;font-size:14px;margin-top:4px"></div>
      <div class="acct-field"><label style="font-size:13px;font-weight:600">Email</label><input id="acct_email" type="email" style="width:100%;padding:11px;border:1px solid #e3dccb;border-radius:8px;font-size:14px;margin-top:4px"></div>
      <div class="acct-field"><label style="font-size:13px;font-weight:600">Téléphone</label><input id="acct_phone" style="width:100%;padding:11px;border:1px solid #e3dccb;border-radius:8px;font-size:14px;margin-top:4px"></div>
      <button id="acctSaveProfile" style="background:#122a4d;color:#fff;border:none;padding:11px;border-radius:8px;font-weight:700;font-size:14px;cursor:pointer;width:100%;margin-top:10px">Enregistrer</button>

      <div style="font-weight:700;font-size:13px;color:#122a4d;margin:18px 0 8px;border-top:1px solid #eee;padding-top:14px">Changer le mot de passe</div>
      <div class="acct-field"><label style="font-size:13px;font-weight:600">Mot de passe actuel</label><input id="acct_pw_current" type="password" style="width:100%;padding:11px;border:1px solid #e3dccb;border-radius:8px;font-size:14px;margin-top:4px"></div>
      <div class="acct-field"><label style="font-size:13px;font-weight:600">Nouveau mot de passe</label><input id="acct_pw_new" type="password" style="width:100%;padding:11px;border:1px solid #e3dccb;border-radius:8px;font-size:14px;margin-top:4px"></div>
      <button id="acctSavePw" style="background:#b8912f;color:#fff;border:none;padding:11px;border-radius:8px;font-weight:700;font-size:14px;cursor:pointer;width:100%;margin-top:10px">Changer le mot de passe</button>
    </div>`;
    document.body.appendChild(m);
    m.querySelector('.acct-close').addEventListener('click', () => m.remove());
    m.addEventListener('click', (e) => { if (e.target === m) m.remove(); });

    // prefill
    const msg = m.querySelector('#acctMsg');
    function flash(txt, ok) {
      msg.style.display = 'block';
      msg.style.color = ok ? '#1e7d32' : '#c0392b';
      msg.style.background = ok ? '#e8f5e9' : '#fdecea';
      msg.textContent = txt;
    }
    API.req('GET', '/auth/me').then((d) => {
      const u = d.user || d;
      m.querySelector('#acct_name').value = u.name || '';
      m.querySelector('#acct_email').value = u.email || '';
      m.querySelector('#acct_phone').value = u.phone || '';
    }).catch(() => {});

    m.querySelector('#acctSaveProfile').addEventListener('click', async () => {
      const payload = {
        name: m.querySelector('#acct_name').value.trim(),
        email: m.querySelector('#acct_email').value.trim(),
        phone: m.querySelector('#acct_phone').value.trim(),
      };
      try {
        const d = await API.req('PUT', '/auth/me', payload);
        localStorage.setItem('satv_name', (d.user || d).name || '');
        flash('Profil mis à jour ✓', true);
      } catch (e) { flash(e.message, false); }
    });

    m.querySelector('#acctSavePw').addEventListener('click', async () => {
      const cur = m.querySelector('#acct_pw_current').value;
      const nw = m.querySelector('#acct_pw_new').value;
      if (!cur || !nw) { flash('Renseignez les deux champs.', false); return; }
      try {
        await API.req('POST', '/auth/change-password', { current_password: cur, new_password: nw });
        m.querySelector('#acct_pw_current').value = '';
        m.querySelector('#acct_pw_new').value = '';
        flash('Mot de passe modifié ✓', true);
      } catch (e) { flash(e.message, false); }
    });
  }

  window.openAccountSettings = openAccountSettings;

  // ---- reservation -------------------------------------------------
  function openReserve(offerName) {
    if (!isAuthed()) {
      localStorage.setItem('satv_redirect', window.location.href);
      window.location.href = 'login.html';
      return;
    }
    if (document.getElementById('resModal')) return;
    const m = document.createElement('div');
    m.id = 'resModal';
    m.style.cssText = 'position:fixed;inset:0;background:rgba(10,18,30,.6);display:flex;align-items:center;justify-content:center;z-index:500;padding:20px;font-family:Montserrat,sans-serif;';
    m.innerHTML = `<div style="background:#fff;border-radius:16px;width:440px;max-width:100%;max-height:92vh;overflow:auto;padding:24px;box-shadow:0 30px 80px rgba(0,0,0,.4)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <h3 style="margin:0;color:#122a4d;font-family:'Playfair Display',serif">Réserver</h3>
        <button id="resClose" style="border:none;background:none;font-size:26px;cursor:pointer;color:#666">×</button>
      </div>
      <div id="resErr" style="color:#c0392b;background:#fdecea;padding:10px;border-radius:8px;display:none;margin-bottom:10px;font-size:13px"></div>
      <div style="display:flex;flex-direction:column;gap:10px">
        <label style="font-size:13px;font-weight:600">Offre choisie</label>
        <input id="res_offer" value="${esc(offerName || '')}" style="padding:11px;border:1px solid #e3dccb;border-radius:8px;font-size:14px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div><label style="font-size:13px;font-weight:600">Date souhaitée</label><input id="res_date" type="date" style="width:100%;padding:11px;border:1px solid #e3dccb;border-radius:8px;font-size:14px;margin-top:4px"></div>
          <div><label style="font-size:13px;font-weight:600">Personnes</label><input id="res_people" type="number" min="1" value="2" style="width:100%;padding:11px;border:1px solid #e3dccb;border-radius:8px;font-size:14px;margin-top:4px"></div>
        </div>
        <div><label style="font-size:13px;font-weight:600">Téléphone</label><input id="res_phone" placeholder="Votre téléphone" style="width:100%;padding:11px;border:1px solid #e3dccb;border-radius:8px;font-size:14px;margin-top:4px"></div>
        <div><label style="font-size:13px;font-weight:600">Message</label><textarea id="res_msg" placeholder="Vos souhaits, dates flexibles…" style="width:100%;padding:11px;border:1px solid #e3dccb;border-radius:8px;font-size:14px;margin-top:4px;min-height:70px"></textarea></div>
        <button id="resSubmit" style="background:#122a4d;color:#fff;border:none;padding:13px;border-radius:10px;font-weight:700;font-size:15px;cursor:pointer">Envoyer ma demande</button>
      </div>
    </div>`;
    document.body.appendChild(m);
    m.querySelector('#resClose').addEventListener('click', () => m.remove());
    m.addEventListener('click', (e) => { if (e.target === m) m.remove(); });
    m.querySelector('#resSubmit').addEventListener('click', async () => {
      const errBox = m.querySelector('#resErr');
      errBox.style.display = 'none';
      const payload = {
        offer_name: m.querySelector('#res_offer').value.trim(),
        type: offerName ? guessType(offerName) : (document.body.classList.contains('excursions') ? 'excursion' : 'circuit'),
        travel_date: m.querySelector('#res_date').value,
        people: parseInt(m.querySelector('#res_people').value, 10) || 1,
        contact_phone: m.querySelector('#res_phone').value.trim(),
        message: m.querySelector('#res_msg').value.trim(),
      };
      if (!payload.offer_name) {
        errBox.textContent = 'Précisez l\'offre à réserver.';
        errBox.style.display = 'block';
        return;
      }
      try {
        await API.req('POST', '/reservations', payload);
        m.innerHTML = `<div style="text-align:center;padding:30px">
          <div style="font-size:44px">✅</div>
          <h3 style="color:#122a4d;margin:12px 0 6px">Demande envoyée !</h3>
          <p style="color:#666;font-size:14px">Votre réservation a bien été transmise. Notre équipe vous contactera rapidement.</p>
          <button onclick="this.closest('#resModal').remove()" style="margin-top:16px;background:#b8912f;color:#fff;border:none;padding:11px 26px;border-radius:8px;font-weight:700;cursor:pointer">Fermer</button>
        </div>`;
      } catch (e) {
        errBox.textContent = e.message;
        errBox.style.display = 'block';
      }
    });
  }

  function guessType(name) {
    const s = String(name).toLowerCase();
    return (s.indexOf('excursion') > -1 || s.indexOf('séjour') > -1 || document.body.classList.contains('excursions-page')) ? 'excursion' : 'circuit';
  }

  // auto-add "Réserver" button to offer cards on tours/excursion pages
  function addReserveButtons() {
    const cards = document.querySelectorAll('.card, .offer-card');
    cards.forEach((c) => {
      if (c.querySelector('[data-satv-reserve], .reserve-btn, [data-book]')) return;
      const title = (c.querySelector('h3, .card-body h3, h4') || {}).textContent || '';
      if (!title) return;
      // avoid buttons on blog articles page if desired; keep it generic to offer cards
      const btn = document.createElement('button');
      btn.setAttribute('data-satv-reserve', '1');
      btn.textContent = 'Réserver';
      btn.style.cssText = 'margin:10px 16px 16px;background:#b8912f;color:#fff;border:none;padding:9px 16px;border-radius:20px;font-weight:700;font-size:13px;cursor:pointer;font-family:inherit';
      btn.addEventListener('click', () => openReserve(title));
      const body = c.querySelector('.card-body') || c;
      body.appendChild(btn);
    });
  }

  // ---- init ----
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  handleCallback();
  buildAccountUI();
  // expose reservation modal for dynamic offer cards
  window.openReserve = openReserve;
  // add reserve buttons only on tour/excursion related pages
  const isTours = /circuits|excursions|index/.test(location.pathname);
  if (isTours) addReserveButtons();
})();