(function () {
  'use strict';

  // Copyright year
  var yearEl = document.getElementById('copyright-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var scroller = document.querySelector('.main-scroll');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.vnav-link[data-target]'));
  var sections = ['home', 'research', 'teaching', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  // ── Smooth scroll on sidebar nav clicks (in-page targets only)
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('data-target');
      var target = document.getElementById(id);
      if (!target || !scroller) return;
      e.preventDefault();
      scroller.scrollTo({ top: target.offsetTop - 24, behavior: 'smooth' });
    });
  });

  // ── Scroll-spy active nav
  function updateActive() {
    if (!scroller) return;
    var y = scroller.scrollTop + 120;
    var current = 'home';
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= y) current = sections[i].id;
    }
    navLinks.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('data-target') === current);
    });
  }
  if (scroller) {
    scroller.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
  }

  // ── Abstract toggle
  document.querySelectorAll('.abstract-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var wrap = btn.parentElement;
      var body = wrap ? wrap.querySelector('.abstract-body') : null;
      var label = btn.querySelector('.abstract-label');
      var open = btn.getAttribute('aria-expanded') === 'true';
      var next = !open;
      btn.setAttribute('aria-expanded', next ? 'true' : 'false');
      if (body) {
        if (next) body.removeAttribute('hidden');
        else body.setAttribute('hidden', '');
      }
      if (label) label.textContent = next ? 'Hide Abstract' : 'Show Abstract';
    });
  });

  // ── Scroll-reveal (IntersectionObserver)
  var revealEls = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || !scroller) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { root: scroller, rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  requestAnimationFrame(function () {
    revealEls.forEach(function (el) { io.observe(el); });
  });
})();
