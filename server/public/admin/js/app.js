// ---------- Boot ----------
const loginView = $('#loginView');
const appView = $('#appView');

function showLogin() { loginView.classList.remove('hidden'); appView.classList.add('hidden'); }
function showApp() { loginView.classList.add('hidden'); appView.classList.remove('hidden'); }

let __currentUserId = 0;
let __currentRole = 'admin';

// Admin full: everything. Manager & user: content only (no Users, no Extra/settings)
const ADMIN_ONLY_VIEWS = ['users', 'extra'];

function applyRoleRestrictions() {
  const isFullAdmin = __currentRole === 'admin';
  ADMIN_ONLY_VIEWS.forEach(v => {
    const el = $('#view-' + v);
    if (el) el.classList.toggle('hidden', !isFullAdmin);
  });
  $$('.sidebar nav a').forEach(a => {
    if (ADMIN_ONLY_VIEWS.includes(a.dataset.view)) a.style.display = isFullAdmin ? '' : 'none';
  });
  // If currently on a restricted hash, go to dashboard
  if (!isFullAdmin && ADMIN_ONLY_VIEWS.includes((location.hash || '').replace('#', ''))) {
    location.hash = '#dashboard';
    route();
  }
}

if (API.token) {
  showApp();
  // Always land on the dashboard after a refresh (don't restore an old hash
  // like #extra, which would show the wrong section on page load).
  location.hash = '#dashboard';
  // best-effort: remember current user id and role from login payload
  try { const p = JSON.parse(atob((API.token || '').split('.')[1] + '==')); __currentUserId = p.id; if (p.role) __currentRole = p.role; } catch (_) {}
  $('#adminName').textContent = __currentRole.charAt(0).toUpperCase() + __currentRole.slice(1);
  applyRoleRestrictions();
  loadDashboard();
  // fetch the real user (name/role) so the sidebar is correct after a refresh
  API.get('/auth/me').then(d => {
    const u = d.user || {};
    __currentUserId = u.id ?? __currentUserId;
    __currentRole = u.role || __currentRole;
    if (u.name) $('#adminName').textContent = u.name.charAt(0).toUpperCase() + u.name.slice(1);
    const roleLabel = __currentRole === 'admin' ? 'Administrateur' : (__currentRole === 'manager' ? 'Manager' : 'Utilisateur');
    $('#adminRole').textContent = '👤 ' + roleLabel;
    applyRoleRestrictions();
  }).catch(() => {});
} else {
  showLogin();
}

// ---------- Login ----------
$('#loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = $('#loginEmail').value.trim();
  const password = $('#loginPassword').value;
  const errBox = $('#loginError');
  errBox.classList.add('hidden');
  try {
    // Admin panel is only for administrators/managers.
    const data = await API.post('/auth/admin/login', { email, password });
    API.token = data.token;
    __currentUserId = data.user.id;
    __currentRole = data.user.role;
    $('#adminName').textContent = (data.user.name || __currentRole).charAt(0).toUpperCase() + (data.user.name || __currentRole).slice(1);
    const roleLabel = __currentRole === 'admin' ? 'Administrateur' : 'Manager';
    $('#adminRole').textContent = '👤 ' + roleLabel;
    errBox.classList.add('hidden');
    showApp();
    applyRoleRestrictions();
    loadDashboard();
    location.hash = '#dashboard';
  } catch (err) {
    errBox.textContent = err.message;
    errBox.classList.remove('hidden');
  }
});

$('#logoutBtn').addEventListener('click', () => {
  API.token = null;
  showLogin();
});

// ---------- Change password ----------
$('#changePwBtn').addEventListener('click', () => {
  openModal('Changer le mot de passe', `
    <div class="form-grid">
      <div class="form-field full"><label>Mot de passe actuel</label><input id="pw_current" type="password" placeholder="Votre mot de passe actuel"></div>
      <div class="form-field full"><label>Nouveau mot de passe</label><input id="pw_new" type="password" placeholder="Au moins 6 caractères"></div>
      <div class="form-field full"><label>Confirmer</label><input id="pw_confirm" type="password" placeholder="Répéter le nouveau mot de passe"></div>
    </div>
    <div class="form-row">
      <button class="btn-sm gray" onclick="closeModal()">Annuler</button>
      <button class="btn-primary" id="savePwBtn">Mettre à jour</button>
    </div>`);
  $('#savePwBtn').addEventListener('click', async () => {
    const cur = $('#pw_current').value;
    const nw = $('#pw_new').value;
    const cf = $('#pw_confirm').value;
    if (nw !== cf) return alert('La confirmation ne correspond pas.');
    if (nw.length < 6) return alert('Le mot de passe doit faire au moins 6 caractères.');
    try {
      await API.post('/auth/change-password', { current_password: cur, new_password: nw });
      closeModal();
      alert('Mot de passe modifié ✓ Connectez-vous à nouveau.');
      API.token = null;
      showLogin();
    } catch (err) {
      alert(err.message);
    }
  });
});

// ---------- Change username (name / email) ----------
$('#changeNameBtn').addEventListener('click', async () => {
  let me = {};
  try { me = (await API.get('/auth/me'))?.user || {}; } catch (_) {}
  openModal('Changer le nom d\'utilisateur', `
    <div class="form-grid">
      <div class="form-field full"><label>Nom</label><input id="un_name" value="${esc(me.name || '')}" placeholder="Votre nom"></div>
      <div class="form-field full"><label>Email</label><input id="un_email" type="email" value="${esc(me.email || '')}" placeholder="Votre email"></div>
      <div class="form-field full"><label>Téléphone</label><input id="un_phone" value="${esc(me.phone || '')}" placeholder="055..."></div>
    </div>
    <div class="form-row">
      <button class="btn-sm gray" onclick="closeModal()">Annuler</button>
      <button class="btn-primary" id="saveNameBtn">Enregistrer</button>
    </div>`);
  $('#saveNameBtn').addEventListener('click', async () => {
    const payload = {
      name: $('#un_name').value.trim(),
      email: $('#un_email').value.trim(),
      phone: $('#un_phone').value.trim(),
    };
    if (!payload.name || !payload.email) return alert('Nom et email requis.');
    try {
      await API.put('/auth/me', payload);
      closeModal();
      $('#adminName').textContent = payload.name.charAt(0).toUpperCase() + payload.name.slice(1);
      alert('Nom d\'utilisateur mis à jour ✓');
    } catch (err) {
      alert(err.message);
    }
  });
});

// ---------- Simple hash router ----------
const views = { dashboard: '#view-dashboard', offers: '#view-offers', reservations: '#view-reservations', users: '#view-users', blog: '#view-blog', extra: '#view-extra' };
const loaders = { dashboard: loadDashboard, offers: loadOffers, reservations: loadReservations, users: loadUsers, blog: loadBlog, extra: loadExtra };

function route() {
  let v = (location.hash || '#dashboard').replace('#', '') || 'dashboard';
  if (!views[v]) v = 'dashboard';
  $$('.sidebar nav a').forEach(a => a.classList.toggle('active', a.dataset.view === v));
  Object.entries(views).forEach(([key, sel]) => {
    $(sel).classList.toggle('hidden', key !== v);
  });
  if (loaders[v]) loaders[v]();
}
window.addEventListener('hashchange', route);

// ============================================================
// DASHBOARD
// ============================================================
async function loadDashboard() {
  const st = await API.get('/admin/stats');
  $('#statGrid').innerHTML = `
    <div class="stat-card"><b>${st.users}</b><span>Inscrits</span></div>
    <div class="stat-card accent"><b>${st.offers}</b><span>Offres</span></div>
    <div class="stat-card"><b>${st.circuits}</b><span>Circuits</span></div>
    <div class="stat-card"><b>${st.excursions}</b><span>Excursions</span></div>
    <div class="stat-card"><b>${st.posts}</b><span>Articles</span></div>
    <div class="stat-card pending"><b>${st.reservationsPending}</b><span>Réservations en attente</span></div>
    <div class="stat-card"><b>${st.reservationsConfirmed}</b><span>Confirmées</span></div>
    <div class="stat-card accent"><b>${st.reservationsTotal}</b><span>Réservations totales</span></div>`;

  $('#dashReservations').innerHTML = st.recentReservations.length
    ? `<table class="dash-table">${st.recentReservations.map(r => `
        <tr>
          <td><strong>${esc(r.offer_name)}</strong></td>
          <td>${esc(r.contact_name || r.user_name || '?')}</td>
          <td><span class="status-pill ${esc(r.status)}">${esc(r.status)}</span></td>
          <td>${fmtDate(r.created_at)}</td>
        </tr>`).join('')}</table>`
    : '<p class="muted">Aucune réservation pour le moment.</p>';

  $('#dashUsers').innerHTML = st.recentUsers.length
    ? `<table class="dash-table">${st.recentUsers.map(u => `
        <tr><td><strong>${esc(u.name)}</strong></td><td>${esc(u.email || '')}</td><td>${fmtDate(u.created_at)}</td></tr>`).join('')}</table>`
    : '<p class="muted">Aucun inscrit.</p>';
}

// ============================================================
// OFFERS
// ============================================================
let offerFilter = 'all';
let offersCache = [];

async function loadOffers() {
  const data = await API.get('/offers?all=1');
  offersCache = data;
  renderOffers();
}

function renderOffers() {
  const list = offersCache.filter(o => offerFilter === 'all' || o.type === offerFilter);
  $('#offerList').innerHTML = list.length
    ? list.map(o => `
      <div class="offer-card">
        <div class="oc-img">${o.image ? `<img src="${esc(o.image)}" alt="">` : '<div class="ph">Aucune image</div>'}</div>
        <div class="oc-body">
          <div class="oc-tags">
            <span class="badge ${esc(o.type)}">${o.type === 'circuit' ? 'Circuit' : 'Excursion'}</span>
            ${o.page ? `<span class="badge inactive">${({local:'Local',international:'International',omra:'Omra',etranger:'Étrangers',excursions:'Excursions'})[o.page] || o.page}</span>` : ''}
            ${o.category ? `<span class="badge inactive">${esc(o.category)}</span>` : ''}
            ${!o.active ? '<span class="badge inactive">Masquée</span>' : ''}
          </div>
          <h4>${esc(o.name)}</h4>
          ${o.price ? `<div class="oc-price">${esc(o.price)}</div>` : ''}
          <div class="oc-details">${esc((o.details || '').slice(0, 120))}</div>
        </div>
        <div class="oc-actions">
          <button class="btn-sm" onclick="openOfferForm(${o.id})">Modifier</button>
          <button class="btn-sm" onclick="retranslateOffer(${o.id})" title="Re-traduire les champs manquants ou incorrects">↻ Traduire</button>
          <button class="btn-sm ${o.active ? 'gray' : 'green'}" onclick="toggleOffer(${o.id})">${o.active ? 'Masquer' : 'Publier'}</button>
          <button class="btn-sm red" onclick="deleteOffer(${o.id})">Supprimer</button>
        </div>
      </div>`).join('')
    : '<p class="muted">Aucune offre. Cliquez sur « + Nouvelle offre ».</p>';
}

$$('#view-offers .tab-btn').forEach(btn => btn.addEventListener('click', () => {
  $$('#view-offers .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  offerFilter = btn.dataset.filter;
  renderOffers();
}));

async function toggleOffer(id) {
  const o = offersCache.find(x => x.id === id);
  await API.put(`/offers/${id}`, { active: o.active ? 0 : 1 });
  await loadOffers();
}

async function deleteOffer(id) {
  if (!confirm('Supprimer cette offre ?')) return;
  await API.del(`/offers/${id}`);
  await loadOffers();
}

// Re-translate one offer (only missing/broken fields — manual ones are kept).
async function retranslateOffer(id) {
  if (!confirm('Re-traduire cette offre (EN/AR) ? Les traductions déjà correctes seront conservées.')) return;
  try {
    const r = await API.post(`/offers/${id}/retranslate`);
    await loadOffers();
    alert(r.translated.length
      ? `Offre re-traduite : ${r.translated.join(', ')}`
      : 'Cette offre est déjà traduite (ou la traduction est indisponible).');
  } catch (err) { alert(err.message); }
}

// Force re-translation of every offer (overwrites manual translations too).
async function retranslateAllOffers() {
  if (!confirm('Re-traduire TOUTES les offres ? Attention : cela écrase aussi les traductions saisies manuellement.')) return;
  const list = offersCache.filter(o => o.name || o.details || o.program);
  let done = 0;
  for (const o of list) {
    try { await API.post(`/offers/${o.id}/retranslate`, { force: true }); done++; } catch (_) {}
  }
  await loadOffers();
  alert(`${done}/${list.length} offres re-traduites.`);
}

function parseProgramSteps(text) {
  const blocks = String(text || '').split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  return blocks.map(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    const first = lines.shift() || '';
    let label = '', title = first;
    const sep = first.indexOf(' · ');
    if (sep > -1) { label = first.slice(0, sep).trim(); title = first.slice(sep + 3).trim(); }
    return { label, title, desc: lines.join('\n') };
  });
}
function serializeProgramSteps(steps) {
  return steps.map(s => {
    const head = s.label ? `${s.label} · ${s.title}` : s.title;
    return (head + (s.desc ? '\n' + s.desc : '')).trim();
  }).filter(Boolean).join('\n\n');
}

function openOfferForm(id) {
  const edit = id ? offersCache.find(o => o.id === id) : null;
  const body = `
    <div class="form-grid">
      <div class="form-field full" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <button type="button" class="btn-sm gray" id="loadOfferTemplateBtn">Charger un modèle (Cirta)</button>
        <span class="muted" style="font-size:12px">Remplit le formulaire avec un exemple prêt à personnaliser.</span>
      </div>
      <div class="form-field">
        <label>Type</label>
        <select id="f_type">
          <option value="circuit" ${edit && edit.type === 'circuit' ? 'selected' : ''}>Circuit</option>
          <option value="excursion" ${edit && edit.type === 'excursion' ? 'selected' : ''}>Excursion</option>
        </select>
      </div>
      <div class="form-field">
        <label>Page / catégorie (où afficher)</label>
        <select id="f_page">
          <option value="local" data-page-for="circuit">Circuit Local (Algérie)</option>
          <option value="international" data-page-for="circuit">Circuit International</option>
          <option value="omra" data-page-for="circuit">Omra</option>
          <option value="etranger" data-page-for="circuit">Étrangers (Découverte de l'Afrique du Nord)</option>
          <option value="excursions" data-page-for="excursion">Excursions intérieur</option>
        </select>
      </div>
      <div class="form-field"><label>Nom</label><input id="f_name" value="${esc(edit?.name || '')}" placeholder="Ex : Circuit Annaba"></div>
      <div class="form-field"><label>Type / catégorie</label><input id="f_category" value="${esc(edit?.category || '')}" placeholder="Ex : Spirituel, Culturel."></div>
      <div class="form-field"><label>Tarif</label><input id="f_price" value="${esc(edit?.price || '')}" placeholder="Ex : 25 000 DZD"></div>
      <div class="form-field full"><label>Image - Français</label><input id="f_image_url" value="${esc(edit?.image || '')}" placeholder="URL (ou choisir un fichier)">
        <input id="f_image_file" type="file" accept="image/*">
        ${edit && edit.image ? `<img class="img-preview" src="${esc(edit.image)}">` : ''}</div>
      <div class="form-field full"><label>Image - English</label><input id="f_image_en_url" value="${esc(edit?.image_en || '')}" placeholder="URL (ou choisir un fichier)">
        <input id="f_image_en_file" type="file" accept="image/*">
        ${edit && edit.image_en ? `<img class="img-preview" src="${esc(edit.image_en)}">` : ''}</div>
      <div class="form-field full"><label>Image - العربية</label><input id="f_image_ar_url" value="${esc(edit?.image_ar || '')}" placeholder="URL (ou choisir un fichier)">
        <input id="f_image_ar_file" type="file" accept="image/*">
        ${edit && edit.image_ar ? `<img class="img-preview" src="${esc(edit.image_ar)}">` : ''}</div>
      <div class="form-field full"><label>Détails (description courte)</label><textarea id="f_details" placeholder="Description">${esc(edit?.details || '')}</textarea></div>
      <div class="form-field full" style="grid-column:1/-1;border-top:1px solid var(--line);padding-top:12px;margin-top:6px"><label style="font-size:13px;text-transform:uppercase;letter-spacing:.5px">🌐 Traductions — Anglais / Arabe</label><span class="muted" style="font-size:12px">Écrivez ici les traductions manuelles. Ce que vous tapez est utilisé tel quel (rien n'est écrasé).</span></div>
      <div class="form-field full"><label>Traduction — Nom (Anglais)</label><input id="f_name_en" value="${esc(edit?.name_en || '')}"></div>
      <div class="form-field full"><label>Traduction — Nom (Arabe)</label><input id="f_name_ar" value="${esc(edit?.name_ar || '')}"></div>
      <div class="form-field full"><label>Traduction — Détails (Anglais)</label><textarea id="f_details_en">${esc(edit?.details_en || '')}</textarea></div>
      <div class="form-field full"><label>Traduction — Détails (Arabe)</label><textarea id="f_details_ar">${esc(edit?.details_ar || '')}</textarea></div>
      <div class="form-field full"><label>Traduction — Programme (Anglais)</label><textarea id="f_program_en" style="min-height:80px" placeholder="Texte libre : reprendre le programme traduit">${esc(edit?.program_en || '')}</textarea></div>
      <div class="form-field full"><label>Traduction — Programme (Arabe)</label><textarea id="f_program_ar" style="min-height:80px" placeholder="Texte libre : reprendre le programme traduit">${esc(edit?.program_ar || '')}</textarea></div>
      <div class="form-field full">
        <label>Programme (étapes)</label>
        <div id="f_program_steps"></div>
        <button type="button" class="btn-sm gray" id="addProgStepBtn" style="margin-top:8px">+ Ajouter une étape</button>
      </div>
      <div class="form-field"><label>Durée</label><input id="f_duration" value="${esc(edit?.duration || '')}" placeholder="Ex : 5 jours / 4 nuits"></div>
      <div class="form-field"><label>Tags des détails (séparés par des virgules)</label><input id="f_tags" value="${esc(edit?.tags || '')}" placeholder="Ex : UNESCO, Culture, Découverte"></div>
      <div class="checkbox-row"><input type="checkbox" id="f_active" ${!edit || edit.active ? 'checked' : ''}><label for="f_active">Offre active / publiée</label></div>
    </div>
    <input type="hidden" id="f_program" value="${esc(edit?.program || '')}">
    <div class="form-row">
      <button class="btn-sm gray" onclick="closeModal()">Annuler</button>
      <button class="btn-primary" id="saveOfferBtn">Enregistrer</button>
    </div>`;
  openModal(edit ? 'Modifier l\'offre' : 'Nouvelle offre', body);

  // Structured program steps editor.
  const stepsWrap = $('#f_program_steps');
  function renderSteps(steps) {
    stepsWrap.innerHTML = steps.map((s, i) => `
      <div class="prog-step" data-idx="${i}" style="display:grid;grid-template-columns:140px 1fr 1fr auto;gap:8px;margin-bottom:8px;align-items:start">
        <input class="ps-label" placeholder="Jour 1" value="${esc(s.label)}">
        <input class="ps-title" placeholder="Titre de l'étape" value="${esc(s.title)}">
        <textarea class="ps-desc" rows="2" placeholder="Description...">${esc(s.desc)}</textarea>
        <button type="button" class="btn-sm red ps-del" data-idx="${i}">×</button>
      </div>`).join('') || '<p class="muted" style="margin:0">Aucune étape. Cliquez sur &#171; + Ajouter une étape &#187;.</p>';
    stepsWrap.querySelectorAll('.ps-del').forEach(b => b.addEventListener('click', () => {
      const steps = getSteps();
      steps.splice(+b.dataset.idx, 1);
      renderSteps(steps);
      syncHidden();
    }));
  }
  function getSteps() {
    return Array.from(stepsWrap.querySelectorAll('.prog-step')).map(r => ({
      label: r.querySelector('.ps-label').value,
      title: r.querySelector('.ps-title').value,
      desc: r.querySelector('.ps-desc').value,
    }));
  }
  function syncHidden() { $('#f_program').value = serializeProgramSteps(getSteps()); }
  stepsWrap.addEventListener('input', syncHidden);
  renderSteps(parseProgramSteps(edit?.program));
  $('#addProgStepBtn').addEventListener('click', () => {
    const steps = getSteps();
    steps.push({ label: 'Jour ' + (steps.length + 1), title: '', desc: '' });
    renderSteps(steps);
  });

  // Ready-to-use template mirroring the static Cirta card.
  $('#loadOfferTemplateBtn').addEventListener('click', () => {
    $('#f_type').value = 'circuit';
    $('#f_name').value = 'Nom du circuit (ex : Cirta - Constantine)';
    $('#f_category').value = 'Culturel / Patrimoine';
    $('#f_price').value = '';
    $('#f_duration').value = '3 jours / 2 nuits';
    $('#f_details').value = 'Programme touristique de 3 jours / 2 nuits : visites historiques, patrimoine et paysages spectaculaires. Accompagné et sur demande.';
    renderSteps([
      { label: 'Jour 1', title: 'Arrivée et découverte', desc: 'Installation puis première visite : panoramas et principaux monuments de la ville.' },
      { label: 'Jour 2', title: 'Patrimoine et culture', desc: 'Visites guidées des sites historiques, musées et marchés locaux.' },
      { label: 'Jour 3', title: 'Départ', desc: 'Dernière visite, pause souvenir, puis retour. Fin du circuit.' },
    ]);
    syncPageOptions();
  });

  // Show only the page options matching the selected type (circuit/excursion).
  const $type = $('#f_type');
  const $page = $('#f_page');
  function syncPageOptions() {
    const t = $type.value;
    Array.from($page.options).forEach(opt => {
      const forType = opt.dataset.pageFor;
      opt.style.display = (forType === t) ? '' : 'none';
      opt.disabled = (forType === t) ? false : true;
    });
    // Set the current value from the edited offer if it's compatible.
    if (edit && edit.page) {
      const match = Array.from($page.options).find(o => o.value === edit.page);
      if (match && match.dataset.pageFor === t) $page.value = edit.page;
      else $page.value = Array.from($page.options).find(o => o.dataset.pageFor === t && o.value).value;
    } else if (!$page.value || $page.selectedOptions[0].dataset.pageFor !== t) {
      const first = Array.from($page.options).find(o => o.dataset.pageFor === t && o.value);
      $page.value = first ? first.value : '';
    }
  }
  $type.addEventListener('change', syncPageOptions);
  syncPageOptions();

  // Live preview of the chosen image file, at the same size as the static cards.
  ['f_image_file', 'f_image_en_file', 'f_image_ar_file'].forEach(id => {
    $(`#${id}`).addEventListener('change', () => {
      const file = $(`#${id}`).files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      let prev = $(`#${id}`).parentElement.querySelector('.img-preview');
      if (!prev) {
        prev = document.createElement('img');
        prev.className = 'img-preview';
        $(`#${id}`).parentElement.appendChild(prev);
      }
      prev.src = url;
    });
  });

  $('#saveOfferBtn').addEventListener('click', async () => {
    const fd = new FormData();
    fd.append('type', $('#f_type').value);
    fd.append('page', $('#f_page').value);
    fd.append('name', $('#f_name').value);
    fd.append('category', $('#f_category').value);
    fd.append('price', $('#f_price').value);
    fd.append('details', $('#f_details').value);
    fd.append('program', $('#f_program').value);
    fd.append('name_en', $('#f_name_en').value);
    fd.append('name_ar', $('#f_name_ar').value);
    fd.append('details_en', $('#f_details_en').value);
    fd.append('details_ar', $('#f_details_ar').value);
    fd.append('program_en', $('#f_program_en').value);
    fd.append('program_ar', $('#f_program_ar').value);
    fd.append('duration', $('#f_duration').value);
    fd.append('tags', $('#f_tags').value);
    fd.append('active', $('#f_active').checked ? '1' : '0');
    const frFile = $('#f_image_file').files[0];
    if (frFile) fd.append('image', frFile);
    else if ($('#f_image_url').value) fd.append('image_url', $('#f_image_url').value);

    const enFile = $('#f_image_en_file').files[0];
    if (enFile) fd.append('image_en', enFile);
    else if ($('#f_image_en_url').value) fd.append('image_en_url', $('#f_image_en_url').value);

    const arFile = $('#f_image_ar_file').files[0];
    if (arFile) fd.append('image_ar', arFile);
    else if ($('#f_image_ar_url').value) fd.append('image_ar_url', $('#f_image_ar_url').value);

    try {
      if (edit) await API.upload('PUT', `/offers/${edit.id}`, fd);
      else await API.upload('POST', '/offers', fd);
      closeModal();
      await loadOffers();
    } catch (err) { alert(err.message); }
  });
}

// ============================================================
// RESERVATIONS
// ============================================================
let resStatus = 'all';

async function loadReservations() {
  const q = resStatus === 'all' ? '' : `?status=${resStatus}`;
  const list = await API.get('/reservations' + q);
  renderReservations(list);
}

function renderReservations(list) {
  $('#reservationList').innerHTML = list.length ? list.map(r => `
    <div class="res-item">
      <div class="res-info">
        <h4>${esc(r.offer_name)} <span class="status-pill ${esc(r.status)}">${esc(r.status)}</span></h4>
        <div class="muted">${esc(r.type || '')}${r.travel_date ? ' · ' + esc(r.travel_date) : ''}${r.people ? ' · ' + r.people + ' pers.' : ''}</div>
        <div class="res-detail">
          <strong>${esc(r.contact_name || '')}</strong>${r.contact_email ? ' · ' + esc(r.contact_email) : ''}${r.contact_phone ? ' · ' + esc(r.contact_phone) : ''}
          ${r.message ? '<br>« ' + esc(r.message) + ' »' : ''}
          <br>Créée le ${fmtDate(r.created_at)}
        </div>
      </div>
      <div class="res-actions">
        <button class="btn-sm green" onclick="setResStatus(${r.id},'confirmed')">✔ Confirmer</button>
        <button class="btn-sm ${r.status === 'pending' ? 'gray' : (r.type ? 'green' : '')}"  onclick="setResStatus(${r.id},'pending')">Remettre en attente</button>
        <button class="btn-sm red" onclick="setResStatus(${r.id},'cancelled')">Annuler</button>
        <button class="btn-sm gray" onclick="deleteReservation(${r.id})">Suppr.</button>
      </div>
    </div>`).join('')
  : '<p class="muted">Aucune réservation ici.</p>';
}

$$('#view-reservations .tab-btn').forEach(btn => btn.addEventListener('click', () => {
  $$('#view-reservations .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  resStatus = btn.dataset.status;
  loadReservations();
}));

async function setResStatus(id, status) {
  await API.patch(`/reservations/${id}`, { status });
  await loadReservations();
  loadDashboard();
}
async function deleteReservation(id) {
  if (!confirm('Supprimer cette réservation ?')) return;
  await API.del(`/reservations/${id}`);
  await loadReservations();
  loadDashboard();
}

// ============================================================
// USERS
// ============================================================
let usersCache = [];

async function loadUsers() {
  usersCache = await API.get('/admin/users');
  renderUsers();
}

function renderUsers() {
  // Only staff accounts (admin / manager) are manageable here. Regular
  // website users are excluded so they can never be promoted to admin.
  const staff = usersCache.filter(u => u.role === 'admin' || u.role === 'manager');
  $('#userList').innerHTML = staff.length ? `
    <div class="list-tools">
      <span class="muted">${staff.length} compte(s) d'administration</span>
    </div>
    ${staff.map(u => `
      <div class="offer-card user-card">
        <div class="oc-body" style="flex:1">
          <div class="oc-tags">
            <span class="badge ${u.role === 'admin' ? 'admin' : 'inactive'}">${u.role === 'admin' ? 'Admin' : 'Manager'}</span>
            ${u.provider && u.provider !== 'email' ? `<span class="badge inactive">${esc(u.provider)}</span>` : ''}
          </div>
          <h4>${esc(u.name)} ${u.id === __currentUserId ? '<span class="badge inactive">vous</span>' : ''}</h4>
          <div class="muted">${esc(u.email || '—')}${u.phone ? ' · ' + esc(u.phone) : ''}</div>
          <div class="muted">Inscrit le ${fmtDate(u.created_at)}</div>
        </div>
        <div class="oc-actions">
          <button class="btn-sm" onclick="openUserForm(${u.id})">Modifier</button>
          <button class="btn-sm gray" onclick="openUserPassword(${u.id})">Mot de passe</button>
          <button class="btn-sm ${u.role === 'admin' ? 'green' : 'gray'}" onclick="toggleUserRole(${u.id})">${u.role === 'admin' ? 'Passer en manager' : 'Passer en admin'}</button>
          <button class="btn-sm red" onclick="deleteUser(${u.id})">Supprimer</button>
        </div>
      </div>`).join('')}`
    : '<p class="muted">Aucun compte d\'administration pour le moment.</p>';
}

function openUserForm(id) {
  const edit = id ? usersCache.find(u => u.id === id) : null;
  const body = `
    <div class="form-grid">
      <div class="form-field full"><label>Nom complet</label><input id="u_name" value="${esc(edit?.name || '')}" placeholder="Ex : Ahmed Benali"></div>
      <div class="form-field"><label>Email</label><input id="u_email" type="email" value="${esc(edit?.email || '')}" ${edit ? 'required' : ''}></div>
      ${!edit ? '<div class="form-field"><label>Mot de passe</label><input id="u_password" type="password" placeholder="Au moins 6 caractères"></div>' : ''}
      <div class="form-field"><label>Téléphone</label><input id="u_phone" value="${esc(edit?.phone || '')}" placeholder="055..." ></div>
      <div class="form-field full"><label>Rôle</label>
        <select id="u_role">
          <option value="admin" ${!edit || edit.role === 'admin' ? 'selected' : ''}>Administrateur</option>
          <option value="manager" ${edit && edit.role === 'manager' ? 'selected' : ''}>Manager</option>
        </select>
      </div>
    </div>
    <div class="form-row">
      <button class="btn-sm gray" onclick="closeModal()">Annuler</button>
      <button class="btn-primary" id="saveUserBtn">${edit ? 'Enregistrer' : 'Créer le compte admin'}</button>
    </div>`;
  openModal(edit ? 'Modifier le compte admin' : 'Nouveau compte admin', body);

  $('#saveUserBtn').addEventListener('click', async () => {
    const payload = { name: $('#u_name').value.trim(), email: $('#u_email').value.trim(), phone: $('#u_phone').value.trim(), role: $('#u_role').value };
    if (!payload.name || !payload.email) return alert('Nom et email requis.');
    try {
      if (edit) {
        if (edit.id === __currentUserId && payload.role !== 'admin') return alert('Vous ne pouvez pas rétrograder votre propre compte.');
        await API.put(`/admin/users/${edit.id}`, payload);
      } else {
        const pw = $('#u_password').value;
        if (pw.length < 6) return alert('Le mot de passe doit faire au moins 6 caractères.');
        await API.post('/admin/users', { ...payload, password: pw });
      }
      closeModal();
      await loadUsers();
    } catch (err) { alert(err.message); }
  });
}

function openUserPassword(id) {
  const u = usersCache.find(x => x.id === id);
  const body = `
    <div class="form-grid">
      <div class="form-field full"><label>Nouveau mot de passe pour <strong>${esc(u?.name || '')}</strong></label><input id="upw_new" type="password" placeholder="Au moins 6 caractères"></div>
      <div class="form-field full"><label>Confirmer</label><input id="upw_confirm" type="password" placeholder="Répéter le nouveau mot de passe"></div>
    </div>
    <div class="form-row">
      <button class="btn-sm gray" onclick="closeModal()">Annuler</button>
      <button class="btn-primary" id="saveUwBtn">Réinitialiser</button>
    </div>`;
  openModal('Réinitialiser le mot de passe', body);
  $('#saveUwBtn').addEventListener('click', async () => {
    const nw = $('#upw_new').value;
    const cf = $('#upw_confirm').value;
    if (nw !== cf) return alert('La confirmation ne correspond pas.');
    if (nw.length < 6) return alert('Le mot de passe doit faire au moins 6 caractères.');
    try {
      await API.put(`/admin/users/${id}/password`, { password: nw });
      closeModal();
      alert('Mot de passe réinitialisé ✓');
    } catch (err) { alert(err.message); }
  });
}

async function toggleUserRole(id) {
  const u = usersCache.find(x => x.id === id);
  if (!u) return;
  if (u.id === __currentUserId) return alert('Vous ne pouvez pas modifier votre propre rôle.');
  const want = u.role === 'admin' ? 'manager' : 'admin';
  if (!confirm(`Passer « ${u.name} » en ${want === 'admin' ? 'administrateur' : 'manager'} ?`)) return;
  try {
    await API.put(`/admin/users/${id}`, { role: want });
    await loadUsers();
  } catch (err) { alert(err.message); }
}

async function deleteUser(id) {
  const u = usersCache.find(x => x.id === id);
  if (!u) return;
  if (!confirm(`Supprimer le compte « ${u.name} » ?`)) return;
  try {
    await API.del(`/admin/users/${id}`);
    await loadUsers();
  } catch (err) { alert(err.message); }
}

// ============================================================
// BLOG
// ============================================================
let postsCache = [];

async function loadBlog() {
  postsCache = await API.get('/blog/admin/all');
  renderPosts();
}

function renderPosts() {
  $('#postList').innerHTML = postsCache.length ? postsCache.map(p => `
    <div class="post-item">
      <div>
        <h4>${esc(p.title)} ${!p.active ? '<span class="badge inactive">brouillon</span>' : ''}</h4>
        <div class="muted">${esc(p.category || '')} · ${fmtDate(p.created_at)}</div>
      </div>
      <div class="post-actions">
        <button class="btn-sm" onclick="openPostForm(${p.id})">Modifier</button>
        <button class="btn-sm" onclick="retranslatePost(${p.id})" title="Re-traduire les champs manquants ou incorrects">↻ Traduire</button>
        <button class="btn-sm ${p.active ? 'gray' : 'green'}" onclick="togglePost(${p.id})">${p.active ? 'Masquer' : 'Publier'}</button>
        <button class="btn-sm red" onclick="deletePost(${p.id})">Supprimer</button>
      </div>
    </div>`).join('')
  : '<p class="muted">Aucun article. Cliquez sur « + Nouvel article ».</p>';
}

async function togglePost(id) {
  const p = postsCache.find(x => x.id === id);
  await API.put(`/blog/${id}`, { active: p.active ? 0 : 1 });
  await loadBlog();
}
async function deletePost(id) {
  if (!confirm('Supprimer cet article ?')) return;
  await API.del(`/blog/${id}`);
  await loadBlog();
}

// Re-translate one article (only missing/broken fields — manual ones are kept).
async function retranslatePost(id) {
  if (!confirm('Re-traduire cet article (EN/AR) ? Les traductions déjà correctes seront conservées.')) return;
  try {
    const r = await API.post(`/blog/${id}/retranslate`);
    await loadBlog();
    alert(r.translated.length
      ? `Article re-traduit : ${r.translated.join(', ')}`
      : 'Cet article est déjà traduit (ou la traduction est indisponible).');
  } catch (err) { alert(err.message); }
}

// Force re-translation of every article (overwrites manual translations too).
async function retranslateAllPosts() {
  if (!confirm('Re-traduire TOUS les articles ? Attention : cela écrase aussi les traductions saisies manuellement.')) return;
  const list = postsCache.filter(p => p.title || p.excerpt || p.content);
  let done = 0;
  for (const p of list) {
    try { await API.post(`/blog/${p.id}/retranslate`, { force: true }); done++; } catch (_) {}
  }
  await loadBlog();
  alert(`${done}/${list.length} articles re-traduits.`);
}

function openPostForm(id) {
const edit = id ? postsCache.find(p => p.id === id) : null;
  const body = `
    <div class="form-grid">
      <div class="form-field full" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <button type="button" class="btn-sm gray" id="loadPostTemplateBtn">Charger un modèle (article)</button>
        <span class="muted" style="font-size:12px">Pré-remplit un article type prêt à personnaliser.</span>
      </div>
      <div class="form-field full"><label>Titre</label><input id="p_title" value="${esc(edit?.title || '')}"></div>
      <div class="form-field"><label>Catégorie (Français)</label><input id="p_category" value="${esc(edit?.category || '')}" placeholder="Ex : Guide, Actualité."></div>
      <div class="form-field"><label>Catégorie (English)</label><input id="p_category_en" value="${esc(edit?.category_en || '')}" placeholder="Ex : Guide, News."></div>
      <div class="form-field"><label>Catégorie (العربية)</label><input id="p_category_ar" value="${esc(edit?.category_ar || '')}" placeholder="مثال: دليل، أخبار"></div>
      <div class="form-field"><label>Tags (séparés par des virgules)</label><input id="p_tags" value="${esc(edit?.tags || '')}" placeholder="Ex : UNESCO, Culture, Festival"></div>
      <div class="form-field"><label>Image</label><input id="p_image_url" value="${esc(edit?.image || '')}" placeholder="URL"><input id="p_image_file" type="file" accept="image/*"></div>
      <div class="form-field full"><label>Extrait (accroche)</label><textarea id="p_excerpt">${esc(edit?.excerpt || '')}</textarea></div>
      <div class="form-field full"><label>Contenu</label><textarea id="p_content" style="min-height:180px">${esc(edit?.content || '')}</textarea></div>
      <div class="form-field full" style="grid-column:1/-1;border-top:1px solid var(--line);padding-top:12px;margin-top:6px"><label style="font-size:13px;text-transform:uppercase;letter-spacing:.5px">🌐 Traductions — Anglais / Arabe</label><span class="muted" style="font-size:12px">Écrivez ici les traductions manuelles. Ce que vous tapez est utilisé tel quel (rien n'est écrasé).</span></div>
      <div class="form-field full"><label>Traduction — Titre (Anglais)</label><input id="p_title_en" value="${esc(edit?.title_en || '')}"></div>
      <div class="form-field full"><label>Traduction — Titre (Arabe)</label><input id="p_title_ar" value="${esc(edit?.title_ar || '')}"></div>
      <div class="form-field full"><label>Traduction — Extrait (Anglais)</label><textarea id="p_excerpt_en">${esc(edit?.excerpt_en || '')}</textarea></div>
      <div class="form-field full"><label>Traduction — Extrait (Arabe)</label><textarea id="p_excerpt_ar">${esc(edit?.excerpt_ar || '')}</textarea></div>
      <div class="form-field full"><label>Traduction — Contenu (Anglais)</label><textarea id="p_content_en" style="min-height:120px">${esc(edit?.content_en || '')}</textarea></div>
      <div class="form-field full"><label>Traduction — Contenu (Arabe)</label><textarea id="p_content_ar" style="min-height:120px">${esc(edit?.content_ar || '')}</textarea></div>
      <div class="checkbox-row"><input type="checkbox" id="p_active" ${!edit || edit.active ? 'checked' : ''}><label for="p_active">Publié</label></div>
    </div>
    <div class="form-row">
      <button class="btn-sm gray" onclick="closeModal()">Annuler</button>
      <button class="btn-primary" id="savePostBtn">Enregistrer</button>
    </div>`;
  openModal(edit ? 'Modifier l\'article' : 'Nouvel article', body);

  $('#loadPostTemplateBtn').addEventListener('click', () => {
    $('#p_category').value = 'Culture & Patrimoine';
    $('#p_tags').value = 'UNESCO, Algérie, Découverte';
    $('#p_excerpt').value = 'Découvrez ce lieu exceptionnel : histoire millénaire, paysages spectaculaires et traditions vivantes vous attendent.';
    $('#p_content').value = [
      'Un voyage au coeur de l\'histoire',
      'De ce haut lieu, chaque pierre raconte une histoire. Classé/reconnu pour son patrimoine, il fascine par son atmosphère unique et ses panoramas remarquables.',
      'Les temps forts de la visite',
      'Parcourez les principaux sites, rencontrez les habitants et laissez-vous guider par nos accompagnateurs passionnés.',
      'Pourquoi y aller avec S.A.T.V.',
      'Transport, guide et logistique pris en charge : vivez l\'expérience en toute sérénité, à votre rythme.'
    ].join('\n\n');
  });

  $('#savePostBtn').addEventListener('click', async () => {
    const fd = new FormData();
    fd.append('title', $('#p_title').value);
    fd.append('category', $('#p_category').value);
    fd.append('category_en', $('#p_category_en').value);
    fd.append('category_ar', $('#p_category_ar').value);
    fd.append('tags', $('#p_tags').value);
    fd.append('excerpt', $('#p_excerpt').value);
    fd.append('content', $('#p_content').value);
    fd.append('title_en', $('#p_title_en').value);
    fd.append('title_ar', $('#p_title_ar').value);
    fd.append('excerpt_en', $('#p_excerpt_en').value);
    fd.append('excerpt_ar', $('#p_excerpt_ar').value);
    fd.append('content_en', $('#p_content_en').value);
    fd.append('content_ar', $('#p_content_ar').value);
    fd.append('active', $('#p_active').checked ? '1' : '0');
    const file = $('#p_image_file').files[0];
    if (file) fd.append('image', file);
    else fd.append('image_url', $('#p_image_url').value);
    try {
      if (edit) await API.upload('PUT', `/blog/${edit.id}`, fd);
      else await API.upload('POST', '/blog', fd);
      closeModal();
      await loadBlog();
    } catch (err) { alert(err.message); }
  });
}

// ============================================================
// EXTRA
// ============================================================
async function loadExtra() {
  const s = await API.get('/admin/settings');
  const meta = [
    { key: 'hero_quote', label: 'Citation d\'accueil' },
    { key: 'agence_phones', label: 'Téléphones affichés' },
    { key: 'agence_email', label: 'Email contact' },
    { key: 'agence_address', label: 'Adresse' },
    { key: 'instagram_url', label: 'Lien Instagram' },
    { key: 'facebook_url', label: 'Lien Facebook' },
  ];
  $('#extraForm').innerHTML = `
    <div class="form-grid">
      ${meta.map(m => `
        <div class="form-field"><label>${esc(m.label)}</label><input id="x_${esc(m.key)}" value="${esc(s[m.key] || '')}" placeholder="${esc(m.key)}"></div>`).join('')}
    </div>
    <div class="form-row"><button class="btn-primary" id="saveExtraBtn">Enregistrer</button></div>`;

  $('#saveExtraBtn').addEventListener('click', async () => {
    const payload = {};
    meta.forEach(m => payload[m.key] = $(`#x_${m.key}`).value);
    await API.put('/admin/settings', payload);
    alert('Enregistré ✓');
  });
}

// ============================================================
// Modal helpers
// ============================================================
function openModal(title, html) {
  $('#modalTitle').textContent = title;
  $('#modalBody').innerHTML = html;
  $('#modal').classList.remove('hidden');
}
function closeModal() { $('#modal').classList.add('hidden'); }
$('#modalClose').addEventListener('click', closeModal);
$('#modal').addEventListener('click', (e) => { if (e.target === $('#modal')) closeModal(); });

// Wire views & event bindings
$('#addOfferBtn').addEventListener('click', () => openOfferForm(null));
$('#addPostBtn').addEventListener('click', () => openPostForm(null));
$('#addUserBtn').addEventListener('click', () => openUserForm(null));
$('#retranslateAllOffersBtn').addEventListener('click', () => retranslateAllOffers());
$('#retranslateAllPostsBtn').addEventListener('click', () => retranslateAllPosts());
route();

