/**
 * Nucleus Security ABX hypothesis. Vanilla, plus GSAP and ScrollTrigger from
 * cdnjs where they help (the hero sort and the journey line). Every feature
 * checks for GSAP and falls back to a plain version, and the markup ships in
 * its finished state, so the page reads fully with no JS and no CDN.
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger) && !reduceMotion;
  if (hasGsap) window.gsap.registerPlugin(window.ScrollTrigger);

  function onVisible(el, fn, margin) {
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.disconnect();
        fn();
      });
    }, { threshold: 0, rootMargin: margin || '0px 0px -10% 0px' });
    io.observe(el);
  }

  /* Reveal on scroll ------------------------------------------------------ */
  function reveal() {
    var els = document.querySelectorAll('.reveal, .tiers, .flow, .compare, .shift, .when');
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

  /* Count-up on the stat tiles. The final value ships as the text. -------- */
  function counters() {
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var to = Number(el.getAttribute('data-count'));
      if (reduceMotion) return;
      el.textContent = '0';
      onVisible(el, function () {
        var start = null;
        var dur = 1100;
        function step(t) {
          if (start === null) start = t;
          var k = Math.min(1, (t - start) / dur);
          el.textContent = String(Math.round(to * (1 - Math.pow(1 - k, 3))));
          if (k < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    });
  }

  /* Hero. 200 dots scatter, then sort into the three tiers. Once sorted
     they react to the pointer, pushed aside by a spring field, and a click
     sends a ripple outward. Positions are offsets on the static circles, so
     the sorted layout in the markup stays the resting state. ----------- */
  function heroDots() {
    var svg = document.querySelector('[data-dots]');
    if (!svg) return;
    var dots = svg.querySelectorAll('.dot');
    if (reduceMotion) { svg.classList.add('is-sorted'); return; }
    if (!hasGsap) { svg.classList.add('is-sorted'); dotField(svg, dots); return; }
    var gsap = window.gsap;
    gsap.from(dots, {
      x: function () { return (Math.random() - 0.5) * 520; },
      y: function () { return (Math.random() - 0.5) * 520; },
      opacity: 0.25,
      duration: 1.6,
      ease: 'power3.inOut',
      delay: 0.25,
      stagger: { amount: 0.7, from: 'random' },
      onComplete: function () {
        gsap.set(dots, { clearProps: 'transform' });
        svg.classList.add('is-sorted');
        dotField(svg, dots);
      },
    });
  }

  function dotField(svg, dots) {
    var hero = svg.closest('.hero');
    var RADIUS = 95;
    var PUSH = 34;
    var pts = Array.prototype.map.call(dots, function (el) {
      return { el: el, x: Number(el.getAttribute('cx')), y: Number(el.getAttribute('cy')), ox: 0, oy: 0, vx: 0, vy: 0 };
    });
    var mouse = null;
    var running = false;

    function toSvg(e) {
      var m = svg.getScreenCTM();
      if (!m) return null;
      var pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      return pt.matrixTransform(m.inverse());
    }
    function kick() {
      if (!running) { running = true; requestAnimationFrame(step); }
    }
    function step() {
      var moving = false;
      for (var i = 0; i < pts.length; i++) {
        var q = pts[i];
        var tx = 0;
        var ty = 0;
        if (mouse) {
          var dx = q.x - mouse.x;
          var dy = q.y - mouse.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < RADIUS) {
            var s = 1 - d / RADIUS;
            var n = d || 1;
            tx = (dx / n) * PUSH * s * s;
            ty = (dy / n) * PUSH * s * s;
          }
        }
        q.vx = (q.vx + (tx - q.ox) * 0.14) * 0.8;
        q.vy = (q.vy + (ty - q.oy) * 0.14) * 0.8;
        q.ox += q.vx;
        q.oy += q.vy;
        if (Math.abs(q.vx) > 0.02 || Math.abs(q.vy) > 0.02 || Math.abs(q.ox - tx) > 0.05 || Math.abs(q.oy - ty) > 0.05) moving = true;
        q.el.setAttribute('transform', 'translate(' + q.ox.toFixed(2) + ' ' + q.oy.toFixed(2) + ')');
      }
      if (moving) requestAnimationFrame(step);
      else running = false;
    }

    hero.addEventListener('pointermove', function (e) { mouse = toSvg(e); kick(); });
    hero.addEventListener('pointerleave', function () { mouse = null; kick(); });
    hero.addEventListener('pointerdown', function (e) {
      var p = toSvg(e);
      if (!p) return;
      pts.forEach(function (q) {
        var dx = q.x - p.x;
        var dy = q.y - p.y;
        var d = Math.sqrt(dx * dx + dy * dy) || 1;
        if (d < 280) {
          var f = (1 - d / 280) * 16;
          q.vx += (dx / d) * f;
          q.vy += (dy / d) * f;
        }
      });
      kick();
    });
  }

  /* Section nav, scroll spy, progress bar, presentation mode -------------- */
  function navigation() {
    var sections = Array.prototype.slice.call(document.querySelectorAll('main > section[data-nav]'));
    var nav = document.querySelector('[data-secnav]');
    var bar = document.querySelector('[data-secbar]');
    var progress = document.querySelector('.progress__bar');
    var hint = document.querySelector('[data-present-hint]');
    var presentBtn = document.querySelector('[data-present]');
    var current = 0;
    var links = [];

    var ol = document.createElement('ol');
    sections.forEach(function (s, i) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + s.id;
      a.innerHTML = '<span class="secnav__label"></span>';
      a.querySelector('.secnav__label').textContent = s.getAttribute('data-nav');
      a.setAttribute('aria-label', s.getAttribute('data-nav'));
      li.appendChild(a);
      ol.appendChild(li);
      links.push(a);
    });
    nav.appendChild(ol);

    function setCurrent(i) {
      current = i;
      links.forEach(function (a, j) {
        if (j === i) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
      var n = String(i + 1).padStart(2, '0');
      bar.querySelector('.secbar__count').textContent = n + ' / ' + sections.length;
      bar.querySelector('.secbar__name').textContent = sections[i].getAttribute('data-nav');
      bar.classList.toggle('is-shown', i > 0);
    }

    if ('IntersectionObserver' in window) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) setCurrent(sections.indexOf(e.target));
        });
      }, { rootMargin: '-45% 0px -54% 0px', threshold: 0 });
      sections.forEach(function (s) { spy.observe(s); });
    }
    setCurrent(0);

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.setProperty('--p', max > 0 ? Math.min(1, window.scrollY / max) : 0);
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Presentation mode. Arrow keys step through sections, for walking
       through the page on a call. */
    var presenting = false;
    var hintTimer;
    function showHint(text) {
      hint.textContent = text;
      hint.classList.add('is-shown');
      clearTimeout(hintTimer);
      hintTimer = setTimeout(function () { hint.classList.remove('is-shown'); }, 2600);
    }
    function go(i) {
      i = Math.max(0, Math.min(sections.length - 1, i));
      sections[i].scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      setCurrent(i);
    }
    function setPresenting(on) {
      presenting = on;
      document.documentElement.classList.toggle('is-presenting', on);
      presentBtn.setAttribute('aria-pressed', String(on));
      if (hasGsap) window.ScrollTrigger.refresh();
      if (on) {
        showHint('Presenting. Use the arrow keys to move between sections. Esc to exit.');
        go(current);
      } else {
        showHint('Presentation mode off.');
      }
    }
    presentBtn.addEventListener('click', function () { setPresenting(!presenting); });
    document.addEventListener('keydown', function (e) {
      if (!presenting || e.altKey || e.ctrlKey || e.metaKey) return;
      var t = e.target;
      if (t && (t.getAttribute('role') === 'tab' || /INPUT|TEXTAREA|SELECT/.test(t.tagName))) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); go(current + 1); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); go(current - 1); }
      else if (e.key === 'Escape') setPresenting(false);
    });
  }

  /* Account tiers. Buttons are an ARIA tablist; the rings mirror them. ---- */
  function tiers() {
    var root = document.querySelector('[data-tiers]');
    if (!root) return;
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var rings = root.querySelectorAll('[data-tier-ring]');

    function highlight(n) {
      rings.forEach(function (r) { r.classList.toggle('is-active', r.getAttribute('data-tier-ring') === String(n)); });
    }
    function select(i, focus) {
      tabs.forEach(function (tab, j) {
        var on = j === i;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(tab.getAttribute('aria-controls'));
        panel.hidden = !on;
        if (on) {
          panel.classList.remove('is-entering');
          void panel.offsetWidth;
          panel.classList.add('is-entering');
        }
      });
      highlight(i + 1);
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(i, false); });
      tab.addEventListener('keydown', function (e) {
        var n = tabs.length;
        var to = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') to = (i + 1) % n;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') to = (i - 1 + n) % n;
        else if (e.key === 'Home') to = 0;
        else if (e.key === 'End') to = n - 1;
        if (to === null) return;
        e.preventDefault();
        select(to, true);
      });
    });
    rings.forEach(function (r) {
      var n = Number(r.getAttribute('data-tier-ring'));
      r.addEventListener('click', function () { select(n - 1, false); });
    });
    highlight(1);
  }

  /* Journey progress line. Scrubbed by scroll with GSAP, else filled once. */
  function stepper() {
    var el = document.querySelector('[data-stepper]');
    if (!el) return;
    if (reduceMotion) { el.style.setProperty('--fill', 1); return; }
    if (hasGsap) {
      window.gsap.fromTo(el, { '--fill': 0 }, {
        '--fill': 1,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 55%', scrub: 0.6 },
      });
      return;
    }
    var fill = el.querySelector('.stepper__fill');
    fill.style.transition = 'transform 1.6s cubic-bezier(0.22, 1, 0.36, 1)';
    onVisible(el, function () { el.style.setProperty('--fill', 1); });
  }

  /* Budget donut. Built from whichever legend is showing, so the chart and
     its legend can never disagree. The toggle swaps program and stage. --- */
  function spend() {
    var root = document.querySelector('[data-spend]');
    if (!root) return;
    var svg = root.querySelector('.donut__svg');
    var donut = root.querySelector('.donut');
    var readout = root.querySelector('[data-spend-readout]');
    var defaultText = readout.innerHTML;
    var toggles = Array.prototype.slice.call(root.querySelectorAll('[data-spend-view]'));
    var legends = Array.prototype.slice.call(root.querySelectorAll('[data-spend-legend]'));
    var COLORS = {
      signal: 'var(--color-signal)',
      sage: 'var(--color-sage)',
      terracotta: 'var(--color-terracotta)',
      gold: 'var(--color-gold)',
      sky: 'var(--color-signal-soft)',
      muted: 'var(--color-muted-fill)',
    };
    var R = 80;
    var C = 2 * Math.PI * R;
    var GAP = 2.5;
    var segs = [];
    var items = [];
    var seen = false;

    function blur() {
      donut.classList.remove('is-focusing');
      segs.forEach(function (s) { s.classList.remove('is-focus'); });
      items.forEach(function (b) { b.parentNode.classList.remove('is-focus'); });
      readout.innerHTML = defaultText;
    }
    function focus(i) {
      donut.classList.add('is-focusing');
      segs.forEach(function (s, j) { s.classList.toggle('is-focus', j === i); });
      items.forEach(function (b, j) { b.parentNode.classList.toggle('is-focus', j === i); });
      readout.innerHTML = '<strong>' + items[i].getAttribute('data-pct') + '%</strong>';
      readout.appendChild(document.createTextNode(items[i].querySelector('.legend__name').textContent));
    }
    function draw(animate) {
      segs.forEach(function (seg, i) {
        var full = seg.dataset.len + ' ' + C;
        if (!animate || reduceMotion) { seg.style.transition = 'none'; seg.style.strokeDasharray = full; return; }
        seg.style.transition = 'stroke-dasharray 0.9s cubic-bezier(0.22, 1, 0.36, 1) ' + (0.1 + i * 0.12) + 's';
        requestAnimationFrame(function () { requestAnimationFrame(function () { seg.style.strokeDasharray = full; }); });
      });
    }
    function build(legend, animate) {
      segs.forEach(function (s) { s.remove(); });
      segs = [];
      items = Array.prototype.slice.call(legend.querySelectorAll('button.legend__item'));
      var acc = 0;
      items.forEach(function (btn, i) {
        var pct = Number(btn.getAttribute('data-pct'));
        var color = COLORS[btn.getAttribute('data-color')];
        btn.style.setProperty('--c', color);
        var seg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        seg.setAttribute('class', 'donut__seg');
        seg.setAttribute('cx', '110');
        seg.setAttribute('cy', '110');
        seg.setAttribute('r', String(R));
        seg.style.stroke = color;
        seg.setAttribute('stroke-dashoffset', String((-C * acc) / 100));
        seg.dataset.len = String(Math.max(0, (C * pct) / 100 - GAP));
        seg.style.strokeDasharray = '0 ' + C;
        seg.addEventListener('mouseenter', function () { focus(i); });
        seg.addEventListener('mouseleave', blur);
        acc += pct;
        svg.appendChild(seg);
        segs.push(seg);
      });
      blur();
      draw(animate);
    }

    legends.forEach(function (legend) {
      legend.querySelectorAll('button.legend__item').forEach(function (btn, i) {
        btn.addEventListener('mouseenter', function () { focus(i); });
        btn.addEventListener('focus', function () { focus(i); });
        btn.addEventListener('click', function () { focus(i); });
        btn.addEventListener('mouseleave', function () { if (document.activeElement !== btn) blur(); });
        btn.addEventListener('blur', blur);
      });
    });

    toggles.forEach(function (t) {
      t.addEventListener('click', function () {
        var view = t.getAttribute('data-spend-view');
        toggles.forEach(function (o) { o.setAttribute('aria-pressed', String(o === t)); });
        legends.forEach(function (l) { l.hidden = l.getAttribute('data-spend-legend') !== view; });
        build(root.querySelector('[data-spend-legend="' + view + '"]'), true);
      });
    });

    build(legends[0], false);
    segs.forEach(function (s) { s.style.strokeDasharray = '0 ' + C; });
    if (reduceMotion) { draw(false); return; }
    onVisible(root, function () { if (!seen) { seen = true; draw(true); } });
  }

  function init() {
    reveal();
    counters();
    heroDots();
    navigation();
    tiers();
    stepper();
    spend();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
