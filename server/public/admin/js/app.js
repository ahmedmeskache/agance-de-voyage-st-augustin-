// ---------- Boot ----------
const loginView = $('#loginView');
const appView = $('#appView');

function showLogin() { loginView.classList.remove('hidden'); appView.classList.add('hidden'); }
function showApp() { loginView.classList.add('hidden'); appView.classList.remove('hidden'); }

// Preview/demo mode: show the whole interface with sample data, no server needed.
function enterPreview() {
  showApp();
  $('#adminName').textContent = 'Aperçu (données de démonstration)';
  const fill = { loaders: { dashboard: previewDashboard, offers: previewOffers, reservations: previewReservations, users: previewUsers, blog: previewBlog, extra: previewExtra } };
  window.__PREVIEW = true;
  Object.assign(loaders, fill.loaders);
  route();
}
window.enterPreview = enterPreview;
let __currentUserId = 0;
let __currentRole = 'user';

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
  // best-effort: remember current user id and role from login payload
  try { const p = JSON.parse(atob((API.token || '').split('.')[1] + '==')); __currentUserId = p.id; if (p.role) __currentRole = p.role; } catch (_) {}
  $('#adminName').textContent = __currentRole.charAt(0).toUpperCase() + __currentRole.slice(1);
  applyRoleRestrictions();
  loadDashboard();
} else {
  showLogin();
}

$('#previewBtn').addEventListener('click', enterPreview);

// ---------- Login ----------
$('#loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = $('#loginEmail').value.trim();
  const password = $('#loginPassword').value;
  const errBox = $('#loginError');
  errBox.classList.add('hidden');
  try {
    const data = await API.post('/auth/admin/login', { email, password });
    API.token = data.token;
    __currentUserId = data.user.id;
    __currentRole = data.user.role;
    $('#adminName').textContent = __currentRole.charAt(0).toUpperCase() + __currentRole.slice(1);
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
            ${o.category ? `<span class="badge inactive">${esc(o.category)}</span>` : ''}
            ${!o.active ? '<span class="badge inactive">Masquée</span>' : ''}
          </div>
          <h4>${esc(o.name)}</h4>
          ${o.price ? `<div class="oc-price">${esc(o.price)}</div>` : ''}
          <div class="oc-details">${esc((o.details || '').slice(0, 120))}</div>
        </div>
        <div class="oc-actions">
          <button class="btn-sm" onclick="openOfferForm(${o.id})">Modifier</button>
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

function openOfferForm(id) {
  const edit = id ? offersCache.find(o => o.id === id) : null;
  const body = `
    <div class="form-grid">
      <div class="form-field">
        <label>Type</label>
        <select id="f_type">
          <option value="circuit" ${edit && edit.type === 'circuit' ? 'selected' : ''}>Circuit</option>
          <option value="excursion" ${edit && edit.type === 'excursion' ? 'selected' : ''}>Excursion</option>
        </select>
      </div>
      <div class="form-field"><label>Nom</label><input id="f_name" value="${esc(edit?.name || '')}" placeholder="Ex : Circuit Annaba"></div>
      <div class="form-field"><label>Type / catégorie</label><input id="f_category" value="${esc(edit?.category || '')}" placeholder="Ex : Spirituel, Culturel…"></div>
      <div class="form-field"><label>Tarif</label><input id="f_price" value="${esc(edit?.price || '')}" placeholder="Ex : 25 000 DZD"></div>
      <div class="form-field full"><label>Image</label><input id="f_image_url" value="${esc(edit?.image || '')}" placeholder="URL de l'image (ou choisir un fichier)">
        <input id="f_image_file" type="file" accept="image/*"></div>
      ${edit && edit.image ? `<img class="img-preview" src="${esc(edit.image)}">` : ''}
      <div class="form-field full"><label>Détails (description courte)</label><textarea id="f_details" placeholder="Description">${esc(edit?.details || '')}</textarea></div>
      <div class="form-field full"><label>Programme</label><textarea id="f_program" style="min-height:150px" placeholder="Jour 1 : …, Jour 2 : …">${esc(edit?.program || '')}</textarea></div>
      <div class="form-field"><label>Durée</label><input id="f_duration" value="${esc(edit?.duration || '')}" placeholder="Ex : 5 jours / 4 nuits"></div>
      <div class="checkbox-row"><input type="checkbox" id="f_active" ${!edit || edit.active ? 'checked' : ''}><label for="f_active">Offre active / publiée</label></div>
    </div>
    <div class="form-row">
      <button class="btn-sm gray" onclick="closeModal()">Annuler</button>
      <button class="btn-primary" id="saveOfferBtn">Enregistrer</button>
    </div>`;
  openModal(edit ? 'Modifier l\'offre' : 'Nouvelle offre', body);

  $('#saveOfferBtn').addEventListener('click', async () => {
    const fd = new FormData();
    fd.append('type', $('#f_type').value);
    fd.append('name', $('#f_name').value);
    fd.append('category', $('#f_category').value);
    fd.append('price', $('#f_price').value);
    fd.append('details', $('#f_details').value);
    fd.append('program', $('#f_program').value);
    fd.append('duration', $('#f_duration').value);
    fd.append('active', $('#f_active').checked ? '1' : '0');
    const file = $('#f_image_file').files[0];
    if (file) fd.append('image', file);
    else fd.append('image_url', $('#f_image_url').value);

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
  $('#userList').innerHTML = usersCache.length ? `
    <div class="list-tools">
      <span class="muted">${usersCache.length} compte(s)</span>
    </div>
    ${usersCache.map(u => `
      <div class="offer-card user-card">
        <div class="oc-body" style="flex:1">
          <div class="oc-tags">
            <span class="badge ${u.role === 'admin' ? 'admin' : 'inactive'}">${u.role === 'admin' ? 'Admin' : 'Utilisateur'}</span>
            ${u.provider && u.provider !== 'email' ? `<span class="badge inactive">${esc(u.provider)}</span>` : ''}
          </div>
          <h4>${esc(u.name)} ${u.id === __currentUserId ? '<span class="badge inactive">vous</span>' : ''}</h4>
          <div class="muted">${esc(u.email || '—')}${u.phone ? ' · ' + esc(u.phone) : ''}</div>
          <div class="muted">Inscrit le ${fmtDate(u.created_at)} · ${u.reservations_count || 0} réservation(s)</div>
        </div>
        <div class="oc-actions">
          <button class="btn-sm" onclick="openUserForm(${u.id})">Modifier</button>
          <button class="btn-sm gray" onclick="openUserPassword(${u.id})">Mot de passe</button>
          <button class="btn-sm ${u.role === 'admin' ? 'green' : 'gray'}" onclick="toggleUserRole(${u.id})">${u.role === 'admin' ? 'Passer en user' : 'Passer en admin'}</button>
          <button class="btn-sm red" onclick="deleteUser(${u.id})">Supprimer</button>
        </div>
      </div>`).join('')}`
    : '<p class="muted">Aucun utilisateur pour le moment.</p>';
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
          <option value="user" ${edit && edit.role === 'user' ? 'selected' : ''}>Utilisateur</option>
          <option value="admin" ${edit && edit.role === 'admin' ? 'selected' : ''}>Administrateur</option>
        </select>
      </div>
    </div>
    <div class="form-row">
      <button class="btn-sm gray" onclick="closeModal()">Annuler</button>
      <button class="btn-primary" id="saveUserBtn">${edit ? 'Enregistrer' : 'Créer le compte'}</button>
    </div>`;
  openModal(edit ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur', body);

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
  const want = u.role === 'admin' ? 'user' : 'admin';
  if (!confirm(`Passer « ${u.name} » en ${want === 'admin' ? 'administrateur' : 'utilisateur'} ?`)) return;
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

function openPostForm(id) {
  const edit = id ? postsCache.find(p => p.id === id) : null;
  const body = `
    <div class="form-grid">
      <div class="form-field full"><label>Titre</label><input id="p_title" value="${esc(edit?.title || '')}"></div>
      <div class="form-field"><label>Catégorie</label><input id="p_category" value="${esc(edit?.category || '')}" placeholder="Ex : Guide, Actualité…"></div>
      <div class="form-field"><label>Image</label><input id="p_image_url" value="${esc(edit?.image || '')}" placeholder="URL"><input id="p_image_file" type="file" accept="image/*"></div>
      <div class="form-field full"><label>Extrait</label><textarea id="p_excerpt">${esc(edit?.excerpt || '')}</textarea></div>
      <div class="form-field full"><label>Contenu</label><textarea id="p_content" style="min-height:180px">${esc(edit?.content || '')}</textarea></div>
      <div class="checkbox-row"><input type="checkbox" id="p_active" ${!edit || edit.active ? 'checked' : ''}><label for="p_active">Publié</label></div>
    </div>
    <div class="form-row">
      <button class="btn-sm gray" onclick="closeModal()">Annuler</button>
      <button class="btn-primary" id="savePostBtn">Enregistrer</button>
    </div>`;
  openModal(edit ? 'Modifier l\'article' : 'Nouvel article', body);

  $('#savePostBtn').addEventListener('click', async () => {
    const fd = new FormData();
    fd.append('title', $('#p_title').value);
    fd.append('category', $('#p_category').value);
    fd.append('excerpt', $('#p_excerpt').value);
    fd.append('content', $('#p_content').value);
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
route();

// ============================================================
// PREVIEW / DEMO — shows the whole interface with sample data
// (no backend required). Used when opening the frontend alone.
// ============================================================
function previewDashboard() {
  $('#statGrid').innerHTML = `
    <div class="stat-card"><b>24</b><span>Inscrits</span></div>
    <div class="stat-card accent"><b>12</b><span>Offres</span></div>
    <div class="stat-card"><b>7</b><span>Circuits</span></div>
    <div class="stat-card"><b>5</b><span>Excursions</span></div>
    <div class="stat-card"><b>8</b><span>Articles</span></div>
    <div class="stat-card pending"><b>3</b><span>Réservations en attente</span></div>
    <div class="stat-card"><b>5</b><span>Confirmées</span></div>
    <div class="stat-card accent"><b>9</b><span>Réservations totales</span></div>`;
  $('#dashReservations').innerHTML = `<table class="dash-table">
      <tr><td><strong>Circuit Annaba</strong></td><td>Ahmed Benali</td><td><span class="status-pill pending">pending</span></td><td>13 août 2026, 14:02</td></tr>
      <tr><td><strong>Omra 2026</strong></td><td>Fatima Zohra</td><td><span class="status-pill confirmed">confirmed</span></td><td>12 août 2026, 09:41</td></tr>
      <tr><td><strong>Excursion Constantine</strong></td><td>Karim B.</td><td><span class="status-pill pending">pending</span></td><td>11 août 2026, 18:20</td></tr>
    </table>`;
  $('#dashUsers').innerHTML = `<table class="dash-table">
      <tr><td><strong>Ahmed Benali</strong></td><td>ahmed@gmail.com</td><td>13 août 2026</td></tr>
      <tr><td><strong>Fatima Zohra</strong></td><td>fatima@mail.dz</td><td>12 août 2026</td></tr>
      <tr><td><strong>Karim B.</strong></td><td>karim@mail.dz</td><td>11 août 2026</td></tr>
    </table>`;
}

function previewOffers() {
  offersCache = [
    { id:1, type:'circuit', category:'Spirituel', name:'Circuits en Algérie', price:'24 000 DA', details:'Programme touristique à Constantine (Cirta) : 3 jours / 2 nuits de visites historiques.', active:1 },
    { id:2, type:'circuit', category:'Culturel', name:'Circuit Ouest – Oran / Tlemcen / Mostaganem', price:'À partir de 30 000 DA', details:'Randonnée estivale en 3 étapes avec départs d\'Annaba (Bouni).', active:1 },
    { id:3, type:'excursion', category:'Nature', name:'Excursion – Fonds d\'or / Plages d\'Annaba', price:'Sur demande', details:'Journée détente sur les plages de sable doré de Djenane El Bey.', active:1 },
    { id:4, type:'circuit', category:'Religion', name:'Omra & Pèlerinage', price:'À partir de 180 000 DA', details:'Voyage spirituel vers les lieux saints de la Mecque et de Médine.', active:0 }
  ];
  renderOffers();
}

function previewReservations() {
  renderReservations([
    { id:1, offer_name:'Circuit Annaba', type:'circuit', status:'pending', contact_name:'Ahmed Benali', contact_email:'ahmed@gmail.com', contact_phone:'0551 84 84 23', travel_date:'2026-08-25', people:2, message:'Bonjour, je souhaite réserver pour 2 personnes.', created_at:'2026-08-13T14:02:00Z' },
    { id:2, offer_name:'Omra 2026', type:'circuit', status:'confirmed', contact_name:'Fatima Zohra', contact_email:'fatima@mail.dz', contact_phone:'0669 00 21 18', travel_date:'2026-12-10', people:4, message:'', created_at:'2026-08-12T09:41:00Z' },
    { id:3, offer_name:'Excursion Constantine', type:'excursion', status:'pending', contact_name:'Karim B.', contact_email:'karim@mail.dz', contact_phone:'0554 67 89 21', travel_date:'2026-08-20', people:1, message:'', created_at:'2026-08-11T18:20:00Z' }
  ]);
}

function previewUsers() {
  usersCache = [
    { id:1, name:'Administrateur', email:'admin@satv.dz', role:'admin', provider:'email', phone:'', created_at:'2026-08-13T10:00:00Z', reservations_count:0 },
    { id:2, name:'Ahmed Benali', email:'ahmed@gmail.com', role:'user', provider:'email', phone:'0551 84 84 23', created_at:'2026-08-13T14:02:00Z', reservations_count:2 },
    { id:3, name:'Fatima Zohra', email:'fatima@mail.dz', role:'user', provider:'google', phone:'', created_at:'2026-08-12T09:41:00Z', reservations_count:1 }
  ];
  renderUsers();
}

function previewBlog() {
  postsCache = [
    { id:1, title:'Les plus beaux circuits d\'Algérie', category:'Guide', active:1, created_at:'2026-08-01T10:00:00Z' },
    { id:2, title:'Préparer son sac pour le Sahara', category:'Conseils', active:1, created_at:'2026-07-28T16:30:00Z' },
    { id:3, title:'Brouillon : Omra mode d\'emploi', category:'Religion', active:0, created_at:'2026-07-20T08:00:00Z' }
  ];
  renderPosts();
}

function previewExtra() {
  const meta = [
    { key: 'hero_quote', label: 'Citation d\'accueil' },
    { key: 'agence_phones', label: 'Téléphones affichés' },
    { key: 'agence_email', label: 'Email contact' },
    { key: 'agence_address', label: 'Adresse' },
    { key: 'instagram_url', label: 'Lien Instagram' },
    { key: 'facebook_url', label: 'Lien Facebook' },
  ];
  const vals = {
    hero_quote:'Voyagez avec foi, découvrez avec le cœur. ✈',
    agence_phones:'0551 84 84 23 — 0554 67 89 21 — 0669 00 21 18',
    agence_email:'comercial.staugustin@gmail.com',
    agence_address:'Tour Medibat, Bouni, Annaba',
    instagram_url:'https://www.instagram.com/saintaugustintravel23',
    facebook_url:'https://www.facebook.com/share/1EjGeWNXgi/'
  };
  $('#extraForm').innerHTML = `
    <div class="form-grid">
      ${meta.map(m => `
        <div class="form-field"><label>${esc(m.label)}</label><input value="${esc(vals[m.key] || '')}" placeholder="${esc(m.key)}"></div>`).join('')}
    </div>
    <div class="form-row"><button class="btn-primary">Enregistrer</button></div>`;
}