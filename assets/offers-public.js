// Public-site dynamic offers renderer.
// Fetches ACTIVE offers from the backend and renders them into any
// container marked with data-offers-grid. Each container may specify:
//   data-offers-type="circuit"|"excursion" (or none for all)
//   data-offers-page="local|international|omra|etranger|excursions" (or none for all)
// Uses the same card markup/CSS classes as the rest of the site.
(function () {
  const CONTAINER = '[data-offers-grid]';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // Look up a translated UI string from the site's language dictionaries
  // (same keys used by the rest of the site). Falls back to French, then
  // to the key itself.
  function lbl(key) {
    try {
      var lang = window.currentLang || 'fr';
      var dict = (window.getMergedTranslations && window.getMergedTranslations()) || {};
      var d = dict[lang] || dict.fr || {};
      if (d[key] !== undefined) return d[key];
      if (dict.fr && dict.fr[key] !== undefined) return dict.fr[key];
    } catch (_) {}
    return key;
  }

  function cardHTML(o) {
    // Per-language images: default (FR) always exists via o.image.
    const imgs = {
      fr: o.image,
      en: o.image_en || o.image,
      ar: o.image_ar || o.image,
    };
    // Per-language text: fall back to the French/base text.
    const texts = {
      fr: { name: o.name, details: o.details, program: o.program },
      en: { name: o.name_en || o.name, details: o.details_en || o.details, program: o.program_en || o.program },
      ar: { name: o.name_ar || o.name, details: o.details_ar || o.details, program: o.program_ar || o.program },
    };
    const lang = (window.currentLang || 'fr');
    const active = imgs[lang] || imgs.fr;
    const img = active
      ? '<img class="offer-img" data-fr="' + esc(imgs.fr) + '" data-en="' + esc(imgs.en) + '" data-ar="' + esc(imgs.ar) + '" src="' + esc(active) + '" alt="' + esc(o.name) + '" loading="lazy">'
      : '<div class="icon-media"><span class="icon-glyph">🗺️</span></div>';
    const chips = [];
    if (o.duration) chips.push('🗓️ ' + esc(o.duration));
    if (o.category) chips.push(esc(o.category));
    const meta = chips.length
      ? '<div class="card-meta">' + chips.map(function (c) { return '<span>' + c + '</span>'; }).join('') + '</div>'
      : '';
    const price = o.price ? '<div class="offer-price">' + esc(o.price) + '</div>' : '';
    const t = texts[lang] || texts.fr;
    const details = t.details ? '<p class="offer-details">' + esc(t.details) + '</p>' : '';
    const content = JSON.stringify(texts).replace(/"/g, '&quot;');
    const detailBtn = o._hasProgram
      ? '<button type="button" class="btn outline offer-detail-btn" data-offer-id="' + esc(o.id) + '">' + esc(lbl('quiz_detail')) + '</button>'
      : '';

    return (
      '<div class="card offer-card" data-offer-id="' + esc(o.id) + '" data-lang-content="' + content + '" data-offer-name="' + esc(o.name) + '" data-offer-img="' + esc(imgs.fr) + '" data-offer-img-en="' + esc(imgs.en) + '" data-offer-img-ar="' + esc(imgs.ar) + '" data-offer-duration="' + esc(o.duration || '') + '" data-offer-category="' + esc(o.category || '') + '" data-offer-price="' + esc(o.price || '') + '" data-offer-details="' + esc(o.details || '') + '" data-offer-details-en="' + esc(o.details_en || '') + '" data-offer-details-ar="' + esc(o.details_ar || '') + '" data-offer-program="' + esc(o.program || '') + '" data-offer-program-en="' + esc(o.program_en || '') + '" data-offer-program-ar="' + esc(o.program_ar || '') + '" data-offer-name-en="' + esc(o.name_en || '') + '" data-offer-name-ar="' + esc(o.name_ar || '') + '" data-offer-tags="' + esc(o.tags || '') + '">' +
        '<div class="card-media">' + img + '</div>' +
        '<div class="card-body">' +
          meta +
          '<h3>' + esc(t.name) + '</h3>' +
          details +
          price +
          '<div class="card-actions">' +
            detailBtn +
            '<button type="button" class="btn reserve-btn" data-book="' + esc(o.name) + '">' + esc(lbl('btn_reserve')) + '</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  // Auto-extract short keyword "tag pills" from the description text.
  function autoTags(text) {
    if (!text) return [];
    var STOP = new Set([
      'de','du','des','la','le','les','et','ou','une','un','avec','pour','sur','dans','au','aux','en','à','a',
      'the','a','an','and','or','of','with','for','in','on','at','to','by','from',
      'al','el','la','le','los','las','un','una','con','para','en','por','y','del','ال','من','في','على','و','عن','مع','إلى','أن','هذا','هذه','ب','ك','ل'
    ]);
    var raw = String(text)
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .map(function (w) { return w.trim(); })
      .filter(function (w) { return w.length >= 3 && !STOP.has(w.toLowerCase()); });
    // Count occurrences, keep the most frequent unique words (max 6).
    var counts = {};
    raw.forEach(function (w) { var k = w.toLowerCase(); counts[k] = (counts[k] || 0) + 1; });
    var uniq = [];
    Object.keys(counts).forEach(function (k) {
      if (uniq.indexOf(k) === -1) uniq.push(k);
    });
    uniq.sort(function (a, b) { return counts[b] - counts[a]; });
    return uniq.slice(0, 6);
  }

  function offerDetailModal(card) {
    const old = document.getElementById('offerDetailModal');
    if (old) old.remove();
    const lang = (window.currentLang || 'fr');

    function pick(base, en, ar) {
      if (lang === 'en') return (en || base || '');
      if (lang === 'ar') return (ar || base || '');
      return (base || '');
    }
    function attr(name) { return card.getAttribute(name) || ''; }

    const name = pick(attr('data-offer-name'), attr('data-offer-name-en'), attr('data-offer-name-ar'));
    const details = pick(attr('data-offer-details'), attr('data-offer-details-en'), attr('data-offer-details-ar'));
    const program = pick(attr('data-offer-program'), attr('data-offer-program-en'), attr('data-offer-program-ar'));
    const img = pick(attr('data-offer-img'), attr('data-offer-img-en'), attr('data-offer-img-ar'));

    const chips = [];
    if (attr('data-offer-duration')) chips.push({ k: 'duration', v: attr('data-offer-duration') });
    if (attr('data-offer-category')) chips.push({ k: 'category', v: attr('data-offer-category') });
    if (attr('data-offer-price')) chips.push({ k: 'price', v: attr('data-offer-price') });
    const chipsHTML = chips.length
      ? '<div class="detail-info">' + chips.map(function (c) { return '<span class="detail-chip">' + esc(c.v) + '</span>'; }).join('') + '</div>'
      : '';

    const hero = img
      ? '<div class="detail-hero"><img src="' + esc(img) + '" alt="' + esc(name) + '"></div>'
      : '';

    // Tags you type in the admin win; otherwise auto-extract keywords from the description.
    const customTags = String(attr('data-offer-tags') || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    const tags = customTags.length ? customTags : autoTags(details);
    const tagsHTML = tags.length
      ? '<div class="tag-row offer-detail-tags">' + tags.map(function (t) { return '<span class="tag-pill">' + esc(t) + '</span>'; }).join('') + '</div>'
      : '';

    // Structured program: render each step (blank-line separated) as its own block.
    const steps = String(program || '')
      .split(/\n\s*\n/)
      .map(function (b) { return b.trim(); })
      .filter(Boolean)
      .map(function (b) {
        var lines = b.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
        var first = lines.shift() || '';
        var label = '', title = first;
        var sep = first.indexOf(' · ');
        if (sep > -1) { label = first.slice(0, sep).trim(); title = first.slice(sep + 3).trim(); }
        return { label: label, title: title, desc: lines.join('<br>') };
      });
    const programHTML = steps.length
      ? '<h4 class="detail-sec">' + esc(lbl('program_title')) + '</h4><div class="detail-program">' +
        steps.map(function (s) {
          return '<div class="detail-step">' +
            (s.label ? '<div class="step-time">' + esc(s.label) + '</div>' : '') +
            '<div class="step-body"><strong>' + esc(s.title) + '</strong>' +
            (s.desc ? '<span>' + s.desc + '</span>' : '') +
            '</div></div>';
        }).join('') +
        '</div>'
      : '';

    const body = document.createElement('div');
    body.className = 'detail-content';
    body.innerHTML =
      '<button class="offer-modal-close" type="button" aria-label="Close">×</button>' +
      hero +
      '<h3 class="detail-title">' + esc(name) + '</h3>' +
      chipsHTML +
      (details ? '<p class="detail-text">' + esc(details) + '</p>' : '') +
      tagsHTML +
      programHTML +
      '<div class="detail-actions"><button type="button" class="btn reserve-btn" data-book="' + esc(name) + '">' + esc(lbl('btn_reserve')) + '</button></div>';

    const overlay = document.createElement('div');
    overlay.id = 'offerDetailModal';
    overlay.className = 'offer-detail-overlay';
    overlay.appendChild(body);
    document.body.appendChild(overlay);

    overlay.querySelector('.offer-modal-close').addEventListener('click', function () { overlay.remove(); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.remove(); });
    body.querySelector('.reserve-btn').addEventListener('click', function () {
      overlay.remove();
      if (window.siteOpenBookModal) window.siteOpenBookModal(this.getAttribute('data-book'));
    });
  }

  async function render(container) {
    const type = container.getAttribute('data-offers-type') || '';
    const page = container.getAttribute('data-offers-page') || '';
    const limit = parseInt(container.getAttribute('data-offers-limit') || '0', 10);
    const params = [];
    if (type) params.push('type=' + encodeURIComponent(type));
    if (page) params.push('page=' + encodeURIComponent(page));
    const url = '/api/offers' + (params.length ? '?' + params.join('&') : '');
    try {
      const res = await fetch(url);
      let offers = await res.json();
      if (!Array.isArray(offers)) offers = [];
      if (limit > 0) offers = offers.slice(0, limit);
      offers.forEach(function (o) { o._hasProgram = !!(o.program || o.program_en || o.program_ar); });

      if (offers.length === 0) {
        // Keep the static cards; only show a notice if the container is empty.
        if (container.querySelector('.offer-card') === null && container.children.length === 0) {
          container.innerHTML = '<p style="grid-column:1/-1;color:#7a7360;text-align:center;grid-row:100">Aucune offre disponible pour le moment. Revenez bientôt !</p>';
        }
        return; // do not wipe static cards
      }

      // APPEND admin offers into the existing grid, keeping any static cards.
      const html = offers.map(cardHTML).join('');
      if (container.classList.contains('grid')) {
        // Container is already a grid (merged with static cards): append cards directly.
        container.insertAdjacentHTML('beforeend', html);
      } else {
        // Standalone container: wrap the cards in a fresh grid.
        const grid = document.createElement('div');
        grid.className = 'grid cols-3 offer-grid';
        grid.innerHTML = html;
        container.innerHTML = '';
        container.appendChild(grid);
      }

      // wire reservation + details (only for the cards just added)
      const added = Array.prototype.slice.call(container.querySelectorAll('.offer-card')).slice(-offers.length);
      added.forEach(function (card) {
        var b = card.querySelector('[data-book]');
        if (b) b.addEventListener('click', function () {
          if (window.openReserve) window.openReserve(b.getAttribute('data-book'));
          else if (window.location) window.location.href = 'login.html';
        });
        var db = card.querySelector('.offer-detail-btn');
        if (db) db.addEventListener('click', function () {
          offerDetailModal(card);
        });
      });
    } catch (e) {
      // Only show an error if there are no static cards to fall back on.
      if (container.querySelector('.offer-card') === null && container.children.length === 0) {
        container.innerHTML = '<p style="color:#c0392b;text-align:center">Impossible de charger les offres.</p>';
      }
    }
  }

  // Swap every offer image AND text to the current language when the site
  // language changes. Works on cards already in the DOM (including ones
  // added later).
  function applyLang() {
    const lang = (window.currentLang || 'fr');
    document.querySelectorAll('img.offer-img').forEach(function (img) {
      const src = img.getAttribute('data-' + lang) || img.getAttribute('data-fr');
      if (src) img.src = src;
    });
    document.querySelectorAll('.offer-card[data-lang-content]').forEach(function (card) {
      let texts;
      try { texts = JSON.parse(card.getAttribute('data-lang-content')); } catch (_) { return; }
      const t = texts[lang] || texts.fr;
      var h3 = card.querySelector('h3');
      if (h3) h3.textContent = t.name || '';
      var det = card.querySelector('.offer-details');
      if (det) det.textContent = t.details || '';
      var btn = card.querySelector('.offer-detail-btn');
      if (btn) {
        if (t.program) btn.setAttribute('data-program', t.program);
        btn.setAttribute('data-offer-name', t.name || '');
        btn.textContent = lbl('quiz_detail');
      }
      var rbtn = card.querySelector('.reserve-btn');
      if (rbtn) rbtn.textContent = lbl('btn_reserve');
    });
  }

  // Re-apply after cards render, since render() is async and may complete
  // after the language was already set.
  const _origRender = render;
  render = function (container) {
    _origRender(container).then(applyLang).catch(function () {});
  };

  function init() {
    document.querySelectorAll(CONTAINER).forEach(render);
    if (window._langHandlers) {
      window._langHandlers.push(applyLang);
    } else {
      window._langHandlers = [applyLang];
    }
    applyLang();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
