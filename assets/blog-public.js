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
            '<button type="button" class="btn outline blog-open-btn" data-post-id="' + esc(p.id) + '" data-post-title="' + esc(p.title) + '" data-post-content="' + esc(p.content || '') + '" data-post-img="' + esc(p.image || '') + '" data-post-category="' + esc(p.category || '') + '">Lire l\'article →</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function articleModal(postId) {
    const card = document.querySelector('.blog-card[data-post-id="' + postId + '"]');
    if (!card) return;
    const btn = card.querySelector('.blog-open-btn');
    if (!btn) return;
    const old = document.getElementById('blogArticleModal');
    if (old) old.remove();
    const m = document.createElement('div');
    m.id = 'blogArticleModal';
    m.style.cssText = 'position:fixed;inset:0;background:rgba(10,18,30,.6);display:flex;align-items:center;justify-content:center;z-index:600;padding:20px;font-family:inherit;';
    const img = btn.getAttribute('data-post-img')
      ? '<img src="' + esc(btn.getAttribute('data-post-img')) + '" alt="" style="width:100%;height:220px;object-fit:cover;border-radius:10px;margin-bottom:14px">'
      : '';
    m.innerHTML =
      '<div style="background:#fff;border-radius:16px;width:640px;max-width:100%;max-height:88vh;overflow:auto;padding:26px;box-shadow:0 30px 80px rgba(0,0,0,.4);font-family:\'Montserrat\',sans-serif">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">' +
          '<h3 style="margin:0;color:#122a4d;font-family:\'Playfair Display\',serif">' + esc(btn.getAttribute('data-post-title')) + '</h3>' +
          '<button class="blog-modal-close" style="border:none;background:none;font-size:26px;cursor:pointer;color:#666">×</button>' +
        '</div>' +
        (btn.getAttribute('data-post-category') ? '<div class="card-meta" style="margin-bottom:12px"><span>🗓️ ' + esc(btn.getAttribute('data-post-category')) + '</span></div>' : '') +
        img +
        '<div style="color:#333;font-size:14.5px;line-height:1.75;white-space:pre-wrap">' + esc(btn.getAttribute('data-post-content')) + '</div>' +
      '</div>';
    document.body.appendChild(m);
    m.querySelector('.blog-modal-close').addEventListener('click', function () { m.remove(); });
    m.addEventListener('click', function (e) { if (e.target === m) m.remove(); });
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

      container.querySelectorAll('.blog-open-btn').forEach(function (b) {
        if (b.__wired) return;
        b.__wired = true;
        b.addEventListener('click', function () {
          articleModal(b.getAttribute('data-post-id'));
        });
      });
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
