// Public-site blog renderer.
// Loads ACTIVE blog posts from the backend and appends them into any
// container marked with data-blog-grid, keeping any static cards already
// present. Matches the site's card markup/CSS.
(function () {
  const CONTAINER = '[data-blog-grid]';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function truncate(txt, n) {
    txt = String(txt == null ? '' : txt).trim();
    if (!txt) return '';
    return txt.length > n ? txt.slice(0, n).replace(/\s+\S*$/, '') + '…' : txt;
  }

  // Look up a translated UI string from the site's language dictionaries.
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

  function cardHTML(p) {
    const lang = (window.currentLang || 'fr');
    const texts = {
      fr: { title: p.title, category: p.category, excerpt: p.excerpt },
      en: { title: p.title_en || p.title, category: p.category_en || p.category, excerpt: p.excerpt_en || p.excerpt },
      ar: { title: p.title_ar || p.title, category: p.category_ar || p.category, excerpt: p.excerpt_ar || p.excerpt },
    };
    const t = texts[lang] || texts.fr;
    const img = p.image
      ? '<div class="card-media"><img src="' + esc(p.image) + '" alt="' + esc(t.title) + '" loading="lazy"></div>'
      : '<div class="card-media icon-media"><span class="icon-glyph">📰</span></div>';
    const meta = t.category
      ? '<div class="card-meta"><span class="blog-cat">' + esc(t.category) + '</span></div>'
      : '';
    const content = JSON.stringify(texts).replace(/"/g, '&quot;');
    return (
      '<div class="card blog-card" data-post-id="' + esc(p.id) + '" data-lang-content="' + content + '">' +
        img +
        '<div class="card-body">' +
          meta +
          '<h3>' + esc(t.title) + '</h3>' +
          (t.excerpt ? '<p class="offer-details">' + esc(truncate(t.excerpt, 140)) + '</p>' : '') +
          '<div class="card-actions">' +
            '<a class="card-link blog-open-btn" href="blog-post?id=' + esc(p.id) + '" data-post-id="' + esc(p.id) + '">' + esc(lbl('blog_read')) + '</a>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function applyLang() {
    const lang = (window.currentLang || 'fr');
    document.querySelectorAll('.blog-card[data-lang-content]').forEach(function (card) {
      let texts;
      try { texts = JSON.parse(card.getAttribute('data-lang-content')); } catch (_) { return; }
      const t = texts[lang] || texts.fr;
      var h3 = card.querySelector('h3');
      if (h3) h3.textContent = t.title || '';
      var cat = card.querySelector('.blog-cat');
      if (cat) cat.textContent = t.category || '';
      var det = card.querySelector('.offer-details');
      if (det) det.textContent = truncate(t.excerpt || '', 140);
      var link = card.querySelector('.blog-open-btn');
      if (link) link.textContent = lbl('blog_read');
    });
  }

  async function render(container) {
    const limit = parseInt(container.getAttribute('data-blog-limit') || '0', 10);
    try {
      const res = await fetch('/api/blog');
      let posts = await res.json();
      if (!Array.isArray(posts)) posts = [];
      if (limit > 0) posts = posts.slice(0, limit);

      if (posts.length === 0) return; // keep static cards

      const html = posts.map(cardHTML).join('');
      if (container.classList.contains('grid')) {
        container.insertAdjacentHTML('beforeend', html);
      } else {
        const grid = document.createElement('div');
        grid.className = 'grid cols-3 blog-grid';
        grid.innerHTML = html;
        container.innerHTML = '';
        container.appendChild(grid);
      }
      applyLang();
    } catch (_) {
      // silently ignore: static cards remain visible
    }
  }

  function init() {
    document.querySelectorAll(CONTAINER).forEach(render);
    if (window._langHandlers) {
      window._langHandlers.push(applyLang);
    } else {
      window._langHandlers = [applyLang];
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
