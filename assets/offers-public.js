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

  function cardHTML(o) {
    // Per-language images: default (FR) always exists via o.image.
    const imgs = {
      fr: o.image,
      en: o.image_en || o.image,
      ar: o.image_ar || o.image,
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
    const details = o.details ? '<p class="offer-details">' + esc(o.details) + '</p>' : '';

    return (
      '<div class="card offer-card" data-offer-id="' + esc(o.id) + '">' +
        '<div class="card-media">' + img + '</div>' +
        '<div class="card-body">' +
          meta +
          '<h3>' + esc(o.name) + '</h3>' +
          details +
          price +
          '<div class="card-actions">' +
            (o.program
              ? '<button type="button" class="btn outline offer-detail-btn" data-program="' + esc(o.program) + '">Voir les détails</button>'
              : '') +
            '<button type="button" class="btn reserve-btn" data-book="' + esc(o.name) + '">Réserver</button>' +
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
      const grid = document.createElement('div');
      grid.className = 'grid cols-3 offer-grid';
      if (offers.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1;color:#7a7360;text-align:center">Aucune offre disponible pour le moment. Revenez bientôt !</p>';
      } else {
        grid.innerHTML = offers.map(cardHTML).join('');
      }
      container.innerHTML = '';
      container.appendChild(grid);

      // wire reservation + details
      grid.querySelectorAll('[data-book]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (window.openReserve) window.openReserve(b.getAttribute('data-book'));
          else if (window.location) window.location.href = 'login.html';
        });
      });
      grid.querySelectorAll('.offer-detail-btn').forEach(function (b) {
        b.addEventListener('click', function () {
          programModal(b.getAttribute('data-program'), b.closest('.card').querySelector('h3').textContent);
        });
      });
    } catch (e) {
      container.innerHTML = '<p style="color:#c0392b;text-align:center">Impossible de charger les offres.</p>';
    }
  }

  // Swap every offer image to the current language when the site language
  // changes. Works on cards already in the DOM (including ones added later).
  function applyLangImages() {
    const lang = (window.currentLang || 'fr');
    document.querySelectorAll('img.offer-img').forEach(function (img) {
      const src = img.getAttribute('data-' + lang) || img.getAttribute('data-fr');
      if (src) img.src = src;
    });
  }

  // Re-apply after cards render, since render() is async and may complete
  // after the language was already set.
  const _origRender = render;
  render = function (container) {
    _origRender(container).then(applyLangImages).catch(function () {});
  };

  function init() {
    document.querySelectorAll(CONTAINER).forEach(render);
    if (window._langHandlers) {
      window._langHandlers.push(applyLangImages);
    } else {
      window._langHandlers = [applyLangImages];
    }
    applyLangImages();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
