/**
 * Payload 12-Month Marketing Plan. Vanilla, no dependencies.
 *
 * Phase tabs with #phase-N hashes and working back button, left and right
 * arrow keys while the plan is on screen, timeline segments that jump to a
 * phase, accordion cards whose open state survives tab switches and reloads
 * for the browser session, and the flywheel draw-in.
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PHASE_COUNT = 4;
  var STORE_KEY = 'payload-plan:open';

  function storeGet() {
    try {
      var raw = sessionStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function storeSet(ids) {
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify(ids));
    } catch (e) {
      /* Private mode or storage blocked. State just won't persist. */
    }
  }

  /* Reveal on scroll ------------------------------------------------------ */
  function reveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || reduceMotion) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* Accordion cards ------------------------------------------------------- */
  var openIds = storeGet();

  function setCard(fn, open) {
    var btn = fn.querySelector('.fn__toggle');
    fn.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
    var id = fn.getAttribute('data-fn');
    var at = openIds.indexOf(id);
    if (open && at === -1) openIds.push(id);
    if (!open && at !== -1) openIds.splice(at, 1);
  }

  function syncExpandAll(panel) {
    var cards = panel.querySelectorAll('.fn');
    var allOpen = Array.prototype.every.call(cards, function (c) {
      return c.classList.contains('is-open');
    });
    var btn = panel.querySelector('[data-expand-all]');
    btn.textContent = allOpen ? 'Collapse all' : 'Expand all';
  }

  function cards() {
    document.querySelectorAll('.fn').forEach(function (fn) {
      if (openIds.indexOf(fn.getAttribute('data-fn')) !== -1) setCard(fn, true);
      fn.querySelector('.fn__toggle').addEventListener('click', function () {
        setCard(fn, !fn.classList.contains('is-open'));
        storeSet(openIds);
        syncExpandAll(fn.closest('.phase'));
      });
    });

    document.querySelectorAll('.phase').forEach(function (panel) {
      syncExpandAll(panel);
      panel.querySelector('[data-expand-all]').addEventListener('click', function () {
        var list = panel.querySelectorAll('.fn');
        var open = Array.prototype.some.call(list, function (c) {
          return !c.classList.contains('is-open');
        });
        list.forEach(function (c) { setCard(c, open); });
        storeSet(openIds);
        syncExpandAll(panel);
      });
    });
  }

  /* Phase tabs ------------------------------------------------------------ */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.phase'));
  var segs = Array.prototype.slice.call(document.querySelectorAll('.seg'));
  var tabsBar = document.querySelector('.tabs-bar');
  var plan = document.getElementById('plan');
  var current = 1;

  function phaseFromHash() {
    var m = /^#phase-([1-4])$/.exec(location.hash);
    return m ? Number(m[1]) : null;
  }

  /* A 1px marker in normal flow directly above the sticky bar. It gives the
     bar's natural position even while the bar itself is pinned, and it
     leaves the viewport at the moment the bar starts sticking. */
  var sentinel = document.createElement('div');
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.style.height = '1px';
  tabsBar.parentNode.insertBefore(sentinel, tabsBar);

  function scrollToPlan(instant) {
    var top = window.pageYOffset + sentinel.getBoundingClientRect().top + 1;
    window.scrollTo({ top: top, behavior: instant || reduceMotion ? 'auto' : 'smooth' });
  }

  function activate(n, opts) {
    opts = opts || {};
    if (n < 1 || n > PHASE_COUNT) return;
    var changed = n !== current;
    current = n;

    tabs.forEach(function (tab) {
      var on = Number(tab.getAttribute('data-phase')) === n;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
    });
    segs.forEach(function (seg) {
      seg.classList.toggle('is-current', Number(seg.getAttribute('data-goto-phase')) === n);
    });
    panels.forEach(function (panel) {
      var on = Number(panel.getAttribute('data-phase')) === n;
      panel.hidden = !on;
      if (on && changed && !reduceMotion) {
        panel.classList.remove('is-entering');
        void panel.offsetWidth;
        panel.classList.add('is-entering');
      }
    });

    if (opts.focusTab) tabs[n - 1].focus();

    if (opts.push && changed) {
      history.pushState({ phase: n }, '', '#phase-' + n);
    } else if (opts.replace) {
      history.replaceState({ phase: n }, '', '#phase-' + n);
    }

    /* If the reader is already deep inside the old panel, bring the top of
       the new one up under the sticky tab bar instead of stranding them
       somewhere in the middle of it. */
    if (opts.scroll) {
      /* From the timeline, land on the plan heading so the legend shows too. */
      var head = plan.querySelector('.plan__head');
      window.scrollTo({
        top: window.pageYOffset + head.getBoundingClientRect().top - 32,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    } else if (changed && tabsBar.classList.contains('is-stuck')) {
      var panelTop = panels[n - 1].getBoundingClientRect().top;
      if (panelTop < tabsBar.offsetHeight) scrollToPlan();
    }
  }

  function phaseTabs() {
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        activate(Number(tab.getAttribute('data-phase')), { push: true });
      });
    });

    document.querySelectorAll('[data-goto-phase]').forEach(function (el) {
      el.addEventListener('click', function () {
        activate(Number(el.getAttribute('data-goto-phase')), { push: true, scroll: true });
      });
    });

    window.addEventListener('popstate', function () {
      activate(phaseFromHash() || 1, {});
    });

    /* Mark the bar once it pins, for its shadow. */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        var e = entries[0];
        tabsBar.classList.toggle('is-stuck', !e.isIntersecting && e.boundingClientRect.top < 0);
      }).observe(sentinel);
    }

    var initial = phaseFromHash();
    activate(initial || 1, {});
    if (initial) {
      /* Let fonts and layout settle so the jump lands on the tab bar. */
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
      window.addEventListener('load', function () { scrollToPlan(true); });
    }
  }

  /* Arrow keys switch phase whenever the plan section is on screen. ------- */
  function arrowKeys() {
    var planInView = false;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        planInView = entries[0].isIntersecting;
      }, { threshold: 0, rootMargin: '-20% 0px -20% 0px' }).observe(plan);
    }

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      var t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      var onTab = t && t.classList && t.classList.contains('tab');
      if (!onTab && !planInView) return;

      e.preventDefault();
      var dir = e.key === 'ArrowRight' ? 1 : -1;
      var n = ((current - 1 + dir + PHASE_COUNT) % PHASE_COUNT) + 1;
      activate(n, { push: true, focusTab: onTab });
    });

    /* Home and End on the tablist, per the ARIA tabs pattern. */
    document.querySelector('.tabs').addEventListener('keydown', function (e) {
      if (e.key === 'Home' || e.key === 'End') {
        e.preventDefault();
        activate(e.key === 'Home' ? 1 : PHASE_COUNT, { push: true, focusTab: true });
      }
    });
  }

  /* Flywheel -------------------------------------------------------------- */
  function flywheel() {
    var wheel = document.querySelector('[data-flywheel]');
    if (!wheel) return;
    var data = JSON.parse(document.getElementById('flywheel-data').textContent);
    var nodes = Array.prototype.slice.call(wheel.querySelectorAll('.wheel__node'));
    var center = wheel.querySelector('.wheel__center');
    var num = center.querySelector('.wheel__center-num');
    var name = center.querySelector('.wheel__center-name');
    var desc = center.querySelector('.wheel__center-desc');
    var active = 0;

    function select(i) {
      if (i === active) return;
      active = i;
      nodes.forEach(function (node, k) {
        node.classList.toggle('is-active', k === i);
        node.setAttribute('aria-pressed', String(k === i));
      });
      num.textContent = (i < 9 ? '0' : '') + (i + 1);
      name.textContent = data[i][0];
      desc.textContent = data[i][1];
      if (!reduceMotion) {
        center.classList.remove('is-swapping');
        void center.offsetWidth;
        center.classList.add('is-swapping');
      }
    }

    nodes[0].classList.add('is-active');
    nodes.forEach(function (node, i) {
      node.addEventListener('mouseenter', function () { select(i); });
      node.addEventListener('focus', function () { select(i); });
      node.addEventListener('click', function () { select(i); });
    });

    if (reduceMotion || !('IntersectionObserver' in window)) {
      wheel.classList.add('is-drawn');
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      wheel.classList.add('is-drawn');
      io.disconnect();
    }, { threshold: 0, rootMargin: '0px 0px -25% 0px' });
    io.observe(wheel);
  }

  reveal();
  cards();
  phaseTabs();
  arrowKeys();
  flywheel();
})();
