(function () {
  'use strict';

  // Copyright year
  var yearEl = document.getElementById('copyright-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var mainScroll = document.querySelector('.main-scroll');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.vnav-link[data-target]'));
  var sections = ['home', 'research', 'teaching', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  // On mobile (≤ 900px), the layout stacks and the window scrolls.
  // On desktop, .main-scroll is the scroller.
  function isMobile() {
    return window.matchMedia('(max-width: 900px)').matches;
  }
  function getScroller() {
    return isMobile() ? window : mainScroll;
  }
  function getScrollTop() {
    var s = getScroller();
    return s === window
      ? (window.pageYOffset || document.documentElement.scrollTop || 0)
      : s.scrollTop;
  }
  function sectionTop(sec) {
    return isMobile()
      ? sec.getBoundingClientRect().top + (window.pageYOffset || 0)
      : sec.offsetTop;
  }
  function scrollToId(id) {
    var target = document.getElementById(id);
    if (!target) return;
    var top = sectionTop(target) - 24;
    var s = getScroller();
    if (s.scrollTo) s.scrollTo({ top: top, behavior: 'smooth' });
    else s.scrollTop = top;
  }

  // ── Smooth scroll on sidebar nav clicks (in-page targets only)
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('data-target');
      if (!id || !document.getElementById(id)) return;
      e.preventDefault();
      scrollToId(id);
    });
  });

  // ── Scroll-spy active nav
  function updateActive() {
    var y = getScrollTop() + 120;
    var current = 'home';
    for (var i = 0; i < sections.length; i++) {
      if (sectionTop(sections[i]) <= y) current = sections[i].id;
    }
    navLinks.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('data-target') === current);
    });
  }

  // Listen on whichever element scrolls; re-bind on resize because
  // the scroller changes between desktop and mobile layouts.
  var currentListenerTarget = null;
  function bindScrollSpy() {
    var s = getScroller();
    if (s === currentListenerTarget) return;
    if (currentListenerTarget) {
      currentListenerTarget.removeEventListener('scroll', updateActive);
    }
    s.addEventListener('scroll', updateActive, { passive: true });
    currentListenerTarget = s;
  }
  bindScrollSpy();
  updateActive();
  window.addEventListener('resize', function () {
    bindScrollSpy();
    updateActive();
  }, { passive: true });

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
  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }
  // On mobile, .main-scroll isn't a scroll container — use viewport as root.
  // On desktop, scope to .main-scroll per README.
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, {
    root: isMobile() ? null : mainScroll,
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.08
  });

  requestAnimationFrame(function () {
    revealEls.forEach(function (el) { io.observe(el); });
  });
})();
