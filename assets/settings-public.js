// Public-site renderer for the admin "Extra" settings.
// Fetches the whitelisted public settings (/api/settings) and applies them to
// any element tagged with data-setting="key". Supports:
//   data-setting="hero_quote"          -> textContent / placeholder
//   data-setting="agence_phones"       -> textContent
//   data-setting="agence_email"        -> textContent + mailto: href
//   data-setting="agence_address"      -> textContent
//   data-setting="instagram_url"       -> href on an <a>
//   data-setting="facebook_url"        -> href on an <a>
(function () {
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  async function apply() {
    let data = {};
    try {
      const res = await fetch('/api/settings');
      if (res.ok) data = await res.json();
    } catch (_) { return; }

    document.querySelectorAll('[data-setting]').forEach(function (el) {
      const key = el.getAttribute('data-setting');
      const val = data[key];
      if (val === undefined || val === null || val === '') return;

      if (key === 'agence_email') {
        el.textContent = val;
        el.setAttribute('href', 'mailto:' + val);
      } else if (key === 'instagram_url' || key === 'facebook_url') {
        el.setAttribute('href', val);
      } else {
        el.textContent = val;
      }
    });

    // Also refresh any [data-i18n] text that was replaced so language
    // switching re-applies the (single-language) admin value.
    document.querySelectorAll('[data-setting]').forEach(function (el) {
      const key = el.getAttribute('data-setting');
      const val = data[key];
      if (val === undefined || val === null || val === '') return;
      el.dataset.forced = val;
    });
  }

  function reapplyOnLang() {
    document.querySelectorAll('[data-setting][data-forced]').forEach(function (el) {
      const key = el.getAttribute('data-setting');
      if (key === 'agence_email') {
        el.setAttribute('href', 'mailto:' + el.dataset.forced);
      } else if (key === 'instagram_url' || key === 'facebook_url') {
        el.setAttribute('href', el.dataset.forced);
      } else {
        el.textContent = el.dataset.forced;
      }
    });
  }

  if (window._langHandlers) {
    window._langHandlers.push(reapplyOnLang);
  } else {
    window._langHandlers = [reapplyOnLang];
  }

  apply();
})();
