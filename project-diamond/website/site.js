/* Evenfall prototype interactions: cart drawer, order bump, sticky ATC,
   exit intent, variant select, scroll reveal. No dependencies. */
(function () {
  var cart = { items: [], bumpAdded: false };
  var FREE_SHIP = 80;

  function $(s, c) { return (c || document).querySelector(s); }
  function $all(s, c) { return Array.from((c || document).querySelectorAll(s)); }

  /* ---- cart drawer ---- */
  function renderCart() {
    var list = $('#cart-lines'); if (!list) return;
    list.innerHTML = '';
    var total = 0;
    cart.items.forEach(function (it) {
      total += it.price;
      var div = document.createElement('div');
      div.className = 'line';
      div.innerHTML = '<div class="mini jar ' + (it.cls || '') + '"></div>' +
        '<div><strong>' + it.name + '</strong><br><span style="opacity:.7;font-size:.85rem">$' + it.price.toFixed(2) + '</span></div>';
      list.appendChild(div);
    });
    var remaining = Math.max(0, FREE_SHIP - total);
    $('#ship-msg').textContent = remaining > 0
      ? '$' + remaining.toFixed(2) + ' away from free AU shipping'
      : 'Free AU shipping unlocked';
    $('#ship-fill').style.width = Math.min(100, (total / FREE_SHIP) * 100) + '%';
    $('#cart-total').textContent = '$' + total.toFixed(2);
    $('#cart-count') && ($('#cart-count').textContent = cart.items.length);
    $('#bump') && ($('#bump').style.display = cart.bumpAdded ? 'none' : 'block');
  }
  function openCart() { $('#drawer').classList.add('open'); $('#overlay').classList.add('open'); renderCart(); }
  function closeCart() { $('#drawer').classList.remove('open'); $('#overlay').classList.remove('open'); }
  window.evAddToCart = function (name, price, cls) {
    cart.items.push({ name: name, price: price, cls: cls });
    openCart();
  };
  window.evAddBump = function () {
    cart.bumpAdded = true;
    cart.items.push({ name: 'The Night Balm (order bump)', price: 19, cls: 'balm' });
    renderCart();
  };
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-open-cart]')) { e.preventDefault(); openCart(); }
    if (e.target.closest('[data-close-cart]')) closeCart();
  });

  /* ---- variant selection ---- */
  $all('.variant').forEach(function (v) {
    v.addEventListener('click', function () {
      $all('.variant').forEach(function (o) { o.classList.remove('selected'); });
      v.classList.add('selected');
      var btn = $('#atc-main');
      if (btn) btn.textContent = 'Add to cart — $' + v.dataset.price;
    });
  });

  /* ---- sticky ATC on PDP ---- */
  var atcAnchor = $('#atc-main');
  var sticky = $('#sticky-atc');
  if (atcAnchor && sticky && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      sticky.classList.toggle('show', !entries[0].isIntersecting);
    }, { threshold: 0 }).observe(atcAnchor);
  }

  /* ---- exit intent (desktop, once per session, after 20s) ---- */
  var shown = sessionStorage.getItem('ev-exit');
  var armed = false;
  setTimeout(function () { armed = true; }, 20000);
  document.addEventListener('mouseout', function (e) {
    if (!armed || shown || e.relatedTarget || e.clientY > 10) return;
    var m = $('#exit-modal');
    if (m) { m.classList.add('open'); shown = '1'; sessionStorage.setItem('ev-exit', '1'); }
  });
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-close-modal]')) $('#exit-modal').classList.remove('open');
  });

  /* ---- scroll reveal ---- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    $all('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    $all('.reveal').forEach(function (el) { el.classList.add('in'); });
  }
})();
