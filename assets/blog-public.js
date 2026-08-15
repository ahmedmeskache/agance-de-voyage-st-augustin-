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

  function cardHTML(p) {
    const img = p.image
      ? '<div class="card-media"><img src="' + esc(p.image) + '" alt="' + esc(p.title) + '" loading="lazy"></div>'
      : '<div class="card-media icon-media"><span class="icon-glyph">📰</span></div>';
    const meta = p.category
      ? '<div class="card-meta"><span>🗓️ ' + esc(p.category) + '</span></div>'
      : '';
    return (
      '<div class="card blog-card" data-post-id="' + esc(p.id) + '">' +
        img +
        '<div class="card-body">' +
          meta +
          '<h3>' + esc(p.title) + '</h3>' +
          (p.excerpt ? '<p class="offer-details">' + esc(truncate(p.excerpt, 140)) + '</p>' : '') +
          '<div class="card-actions">' +
            '<a class="btn outline blog-open-btn" href="blog-post.html?id=' + esc(p.id) + '" data-post-id="' + esc(p.id) + '">Lire l\'article →</a>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
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
    } catch (_) {
      // silently ignore: static cards remain visible
    }
  }

  function init() {
    document.querySelectorAll(CONTAINER).forEach(render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
