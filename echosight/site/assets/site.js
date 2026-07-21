/* EchoSight shared site JS: nav, reveal, forms (demo mode), consent stub. No tracking without consent; no fake backends. */
(function () {
  'use strict';

  // Mobile menu
  var menuBtn = document.querySelector('.menu-btn');
  var mobileMenu = document.querySelector('.mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      var open = mobileMenu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Reveal on scroll
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.rv').forEach(function (el) { el.classList.add('in'); });
  }

  // Forms — demo mode: validate, store locally, tell the truth about it.
  // When a real endpoint exists, set data-endpoint on the form (see launch/tool-setup-order.md).
  document.querySelectorAll('form[data-demo-form]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var valid = true;
      form.querySelectorAll('[required]').forEach(function (input) {
        var field = input.closest('.field');
        var ok = input.checkValidity();
        if (field) field.classList.toggle('invalid', !ok);
        if (!ok) valid = false;
      });
      if (!valid) return;
      var endpoint = form.getAttribute('data-endpoint');
      var payload = {};
      new FormData(form).forEach(function (v, k) { payload[k] = v; });
      if (endpoint) {
        fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
          .then(function () { done(true); })
          .catch(function () { done(false); });
      } else {
        try {
          var key = 'echosight.' + (form.getAttribute('data-demo-form') || 'form');
          var arr = JSON.parse(localStorage.getItem(key) || '[]');
          arr.push({ at: new Date().toISOString(), data: payload });
          localStorage.setItem(key, JSON.stringify(arr));
        } catch (e) { /* storage unavailable — still show honest message */ }
        done(null);
      }
      function done(sent) {
        var ok = form.parentElement.querySelector('.form-ok');
        if (ok) {
          if (sent === null) {
            ok.innerHTML = '<strong>Saved on this device (demo mode).</strong> This site isn’t connected to a form backend yet, so your details are stored only in this browser. Once the backend is connected (one step, see setup guide) submissions will send for real.';
          } else if (sent) {
            ok.innerHTML = '<strong>Thanks — got it.</strong> We’ll be in touch at the address you gave us.';
          } else {
            ok.innerHTML = '<strong>That didn’t send.</strong> Please try again in a minute or email hello@echosight.ai.';
          }
          ok.classList.add('show');
          form.style.display = 'none';
        }
      }
    });
  });

  // Consent banner stub — analytics only load after explicit consent AND a configured key.
  var consent = document.querySelector('.consent');
  if (consent) {
    var state = null;
    try { state = localStorage.getItem('echosight.consent'); } catch (e) {}
    if (!state) consent.classList.add('show');
    consent.querySelectorAll('button[data-consent]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        try { localStorage.setItem('echosight.consent', btn.getAttribute('data-consent')); } catch (e) {}
        consent.classList.remove('show');
        // Analytics intentionally not loaded: no key configured. See qa/known-limitations.md.
      });
    });
  }
})();
