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
      ? '<button type="button" class="btn outline offer-detail-btn" data-program="' + esc(t.program || '') + '" data-offer-name="' + esc(t.name || '') + '">' + esc(lbl('quiz_detail')) + '</button>'
      : '';

    return (
      '<div class="card offer-card" data-offer-id="' + esc(o.id) + '" data-lang-content="' + content + '">' +
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

  function programModal(program, name) {
    const old = document.getElementById('offerProgramModal');
    if (old) old.remove();
    const m = document.createElement('div');
    m.id = 'offerProgramModal';
    m.style.cssText = 'position:fixed;inset:0;background:rgba(10,18,30,.6);display:flex;align-items:center;justify-content:center;z-index:600;padding:20px;font-family:Montserrat,sans-serif;';
    m.innerHTML =
      '<div style="background:#fff;border-radius:16px;width:520px;max-width:100%;max-height:88vh;overflow:auto;padding:26px;box-shadow:0 30px 80px rgba(0,0,0,.4)">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">' +
          '<h3 style="margin:0;color:#122a4d;font-family:Playfair Display,serif">' + esc(name) + '</h3>' +
          '<button class="offer-modal-close" style="border:none;background:none;font-size:26px;cursor:pointer;color:#666">×</button>' +
        '</div>' +
        '<div style="white-space:pre-wrap;color:#333;font-size:14px;line-height:1.7">' + esc(program) + '</div>' +
      '</div>';
    document.body.appendChild(m);
    m.querySelector('.offer-modal-close').addEventListener('click', function () { m.remove(); });
    m.addEventListener('click', function (e) { if (e.target === m) m.remove(); });
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
          programModal(db.getAttribute('data-program'), db.getAttribute('data-offer-name'));
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
