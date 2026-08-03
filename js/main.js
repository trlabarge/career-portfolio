/* ==========================================================================
   Tim LaBarge — Career Portfolio
   Vanilla JS: nav toggle, scroll progress, reveal-on-scroll, metric counters,
   rotating hero word, tool-stack constellation.
   No libraries. All motion respects prefers-reduced-motion.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Mobile nav toggle ------------------------------------------------- */
  (function nav() {
    var toggle = document.querySelector('.primary-nav__toggle');
    var list = document.querySelector('.primary-nav__list');
    if (!toggle || !list) return;

    toggle.addEventListener('click', function () {
      var open = list.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    list.addEventListener('click', function (e) {
      if (e.target.closest('.primary-nav__link')) {
        list.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  })();

  /* --- Scroll progress bar ---------------------------------------------- */
  (function scrollProgress() {
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    var ticking = false;
    function update() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var ratio = max > 0 ? doc.scrollTop / max : 0;
      bar.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  })();

  /* --- Reveal on scroll -------------------------------------------------- */
  (function reveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    items.forEach(function (el) { io.observe(el); });
  })();

  /* --- Rotating hero word ------------------------------------------------ */
  (function rotator() {
    var root = document.querySelector('[data-rotator]');
    if (!root) return;
    var words = Array.prototype.slice.call(root.querySelectorAll('.rotator__word'));
    if (words.length < 2) return;

    // Size the grid to the widest word so layout does not jump.
    var i = 0;
    words[0].classList.add('is-active');
    if (reduceMotion) return;

    setInterval(function () {
      var current = words[i];
      var next = words[(i + 1) % words.length];
      current.classList.remove('is-active');
      current.classList.add('is-leaving');
      next.classList.remove('is-leaving');
      next.classList.add('is-active');
      window.setTimeout(function () {
        current.classList.remove('is-leaving');
      }, 450);
      i = (i + 1) % words.length;
    }, 2200);
  })();

  /* --- Metric counters --------------------------------------------------- */
  (function counters() {
    var els = document.querySelectorAll('[data-count]');
    if (!els.length) return;

    function format(value, decimals) {
      return value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
    }

    function run(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';

      if (reduceMotion) {
        el.textContent = prefix + format(target, decimals) + suffix;
        return;
      }

      var duration = 1500;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        // easeOutCubic
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + format(target * eased, decimals) + suffix;
        if (p < 1) window.requestAnimationFrame(step);
        else el.textContent = prefix + format(target, decimals) + suffix;
      }
      window.requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      els.forEach(run);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          run(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* --- About page: player/coach illustration pair ------------------------ */
  /* Two jobs, both skipped under reduced motion (the stylesheet's base rules
     then apply: both images stacked in normal flow, fully visible, static).
     1. layout() sizes and positions the transparent-background artwork once
        per viewport size, NOT on every scroll tick, so it never moves while
        the user scrolls. The coach and player images are the same size but
        NOT stacked at the same top offset: the coach starts level with the
        "Player coach, literally." heading, the player starts lower, level
        with the first card row, so the two figures' heads land in visibly
        different places. That stagger, combined with delaying the fade
        (see updateMix below), is what keeps the cross-fade from reading as
        a double exposure, since the two are rarely both at full opacity in
        the same place at the same time. .pc-frame itself is just an
        overflow:hidden bounding box sized to the union of the two images
        (relative to the <section>, its positioned ancestor, since
        .player-coach__media itself stays position: static in the enhanced
        view), flush against the section's right edge. Each image's own
        width/height is derived from a shared target height using the source
        art's 4:5 aspect ratio (so neither resizes relative to the other
        mid-fade), clamped so neither overlaps the copy column, which is why
        it doesn't always reach the full target on narrower wide-viewport
        widths (901-1200px or so).
     2. update() writes --pc-mix (0 = coach, 1 = player) on .player-coach as
        the now-static images scroll through the viewport, driving the CSS
        cross-fade. This runs on scroll; layout() does not. */
  (function playerCoach() {
    var section = document.querySelector('[data-player-coach]');
    if (!section || reduceMotion) return;

    var body = section.querySelector('.player-coach__body');
    var frame = section.querySelector('.pc-frame');
    var coachImg = section.querySelector('.pc-frame__img--coach');
    var playerImg = section.querySelector('.pc-frame__img--player');
    var heading = section.querySelector('.section__head h2');
    var cards = section.querySelectorAll('.card-grid > .icon-card');
    if (!body || !frame || !coachImg || !playerImg || !heading || cards.length < 4) return;

    var wideQuery = window.matchMedia('(min-width: 901px)');
    var scrollTicking = false;
    var MAX_WIDTH = 680; // keeps the art tethered near the copy on ultra-wide screens
    var EDGE_GAP = 32; // breathing room between the copy column and the art

    function clamp01(n) {
      return n < 0 ? 0 : n > 1 ? 1 : n;
    }

    function layout() {
      if (!wideQuery.matches) {
        frame.style.cssText = '';
        coachImg.style.cssText = '';
        playerImg.style.cssText = '';
        return;
      }

      var sectionRect = section.getBoundingClientRect();
      var bodyRect = body.getBoundingClientRect();
      var headRect = heading.getBoundingClientRect();
      var row1Rect = cards[0].getBoundingClientRect();

      // Cards 2 and 3 (0-indexed) are the second row of the 2x2 grid. Rows
      // can differ slightly in height depending on copy length, so use the
      // taller of the two as the row's true bottom edge.
      var row2Top = cards[2].getBoundingClientRect().top;
      var row2Bottom = row2Top;
      for (var i = 2; i < cards.length; i++) {
        var cardRect = cards[i].getBoundingClientRect();
        if (cardRect.bottom > row2Bottom) row2Bottom = cardRect.bottom;
      }
      var targetBottom = row2Top + (row2Bottom - row2Top) * 0.7;

      var coachTop = headRect.top - sectionRect.top;
      var playerTop = row1Rect.top - sectionRect.top;
      var desiredHeight = targetBottom - headRect.top;
      if (desiredHeight < 120) {
        frame.style.cssText = '';
        coachImg.style.cssText = '';
        playerImg.style.cssText = '';
        return;
      }

      // Source art is 960x1200 (4:5). Both images share this size so the
      // fade never reads as a resize, only a cross-fade. The frame sits
      // flush against the section's right edge (a full-bleed sibling of
      // .container, matching the tool-stack section's pattern), so it can
      // borrow width the copy column doesn't have, up to where it would
      // start overlapping the copy or looking disconnected from it on very
      // wide screens.
      var availableWidth = sectionRect.right - bodyRect.right - EDGE_GAP;
      var desiredWidth = desiredHeight * (960 / 1200);
      var width = Math.max(Math.min(desiredWidth, availableWidth, MAX_WIDTH), 0);
      var height = width / (960 / 1200);

      // .pc-frame bounds both images (it's what clips the cross-fade's
      // scale/drift transform so it never creates horizontal overflow at
      // the section's edge), so it has to span from the higher image's top
      // to the lower image's bottom.
      var frameTop = Math.min(coachTop, playerTop);
      var frameBottom = Math.max(coachTop + height, playerTop + height);

      frame.style.top = frameTop + 'px';
      frame.style.height = (frameBottom - frameTop) + 'px';
      frame.style.width = width + 'px';

      coachImg.style.top = (coachTop - frameTop) + 'px';
      coachImg.style.width = width + 'px';
      coachImg.style.height = height + 'px';

      playerImg.style.top = (playerTop - frameTop) + 'px';
      playerImg.style.width = width + 'px';
      playerImg.style.height = height + 'px';
    }

    function updateMix() {
      scrollTicking = false;
      if (!wideQuery.matches) return;

      var rect = frame.getBoundingClientRect();
      var vh = window.innerHeight || 1;

      // Standard "progress through the viewport" formula: 0 when the frame's
      // top is just entering at the bottom edge, 1 when its bottom has just
      // left at the top edge. Since the frame no longer moves on its own
      // (layout() only repositions it on resize), this is driven purely by
      // page scroll.
      var raw = clamp01((vh - rect.top) / (vh + rect.height));

      // Hold on the coach for a while (the two figures are already staggered
      // vertically by layout() above, but delaying the hand-off on top of
      // that keeps them from both reading at full strength in the same
      // place at the same time), then transition, then hold on the player.
      // The frame is roughly one viewport tall, so raw ~0.5 is the point
      // where it's most fully on screen (top around y=0); the transition is
      // kept centered before that, not after, so the player's head (which
      // sits below the coach's, see layout() above) is still on screen by
      // the time it's fully faded in, not already scrolled past the top.
      var mix = clamp01((raw - 0.25) / 0.3);
      mix = mix * mix * (3 - 2 * mix); // smoothstep
      section.style.setProperty('--pc-mix', mix.toFixed(4));
    }

    function requestMix() {
      if (!scrollTicking) {
        window.requestAnimationFrame(updateMix);
        scrollTicking = true;
      }
    }

    function requestLayout() {
      layout();
      updateMix();
    }

    window.addEventListener('scroll', requestMix, { passive: true });
    window.addEventListener('resize', requestLayout);
    window.addEventListener('load', requestLayout);
    if (wideQuery.addEventListener) {
      wideQuery.addEventListener('change', requestLayout);
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(requestLayout);
    }

    requestLayout();
  })();

  /* --- Capabilities: clickable tabs + dynamic stage --------------------- */
  (function capabilities() {
    var list = document.querySelector('.cap-list');
    if (!list) return;
    var tabs = Array.prototype.slice.call(list.querySelectorAll('.cap-item'));
    var panels = Array.prototype.slice.call(document.querySelectorAll('.cap-panel'));
    if (!tabs.length) return;

    function activate(idx, focus) {
      tabs.forEach(function (t, i) {
        var on = i === idx;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        if (on && focus) t.focus();
      });
      panels.forEach(function (p, i) { p.hidden = i !== idx; });
    }

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { activate(i, false); });
    });

    list.addEventListener('keydown', function (e) {
      var idx = tabs.indexOf(document.activeElement);
      if (idx < 0) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault(); activate((idx + 1) % tabs.length, true);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault(); activate((idx - 1 + tabs.length) % tabs.length, true);
      } else if (e.key === 'Home') {
        e.preventDefault(); activate(0, true);
      } else if (e.key === 'End') {
        e.preventDefault(); activate(tabs.length - 1, true);
      }
    });
  })();

  /* --- Demand that compounds: layered channel stack --------------------- */
  /* Four channels come online in turn and stack on each other over eight
     quarters. The model gives the combined total a synergy multiplier that
     grows with the number of live channels and with time, so the top of the
     stack pulls away from the dashed "same channels in isolation" line and
     the hatched wedge between them widens. That wedge is the whole point of
     the section, so turning a channel off shrinks every other band too.

     The final-state paths ship in the markup (generated from this same
     model), which is what renders with no JS. This adds the left-to-right
     reveal wipe, the readout that counts through the quarters as the wipe
     passes them, and the legend toggles. */
  (function demandStack() {
    var root = document.querySelector('[data-demand-stack]');
    if (!root) return;
    var stack = root.querySelector('.dstack');
    var wipe = root.querySelector('.dstack__wipe');
    var wedge = root.querySelector('.dstack__wedge');
    var isoPath = root.querySelector('.dstack__iso');
    var keys = Array.prototype.slice.call(root.querySelectorAll('.dstack__key'));
    if (!stack || !wipe || !wedge || !isoPath || !keys.length) return;

    var out = {
      total: root.querySelector('[data-role="total"]'),
      iso: root.querySelector('[data-role="iso"]'),
      lift: root.querySelector('[data-role="lift"]')
    };
    if (!out.total || !out.iso || !out.lift) return;

    /* Bottom to top of the stack, in the order each channel comes online. */
    var CHANNELS = [
      { key: 'paid', base: [12, 14, 15, 16, 16, 17, 17, 18] },
      { key: 'seo', base: [0, 3, 7, 13, 21, 30, 40, 51] },
      { key: 'content', base: [0, 0, 4, 9, 16, 25, 35, 46] },
      { key: 'community', base: [0, 0, 0, 0, 5, 11, 19, 29] }
    ];
    var QUARTERS = 8;
    var SYN_K = 0.09;   /* lift per extra live channel, at full ramp */
    var Y_MAX = 200;    /* fixed, so toggling a channel never rescales the axis */
    var VIEW_W = 538;
    var X0 = 10, X1 = 528, Y_TOP = 12, Y_BASE = 190;

    var areas = CHANNELS.map(function (c) {
      return root.querySelector('.dstack__area[data-ch="' + c.key + '"]');
    });
    if (areas.indexOf(null) > -1) return;

    var enabled = CHANNELS.map(function () { return true; });

    /* --- model --- */
    function compute(on) {
      var bounds = [], iso = [], i, t;
      for (i = 0; i <= CHANNELS.length; i++) bounds.push([]);
      for (t = 0; t < QUARTERS; t++) {
        var live = 0;
        for (i = 0; i < CHANNELS.length; i++) {
          if (on[i] && CHANNELS[i].base[t] > 0) live++;
        }
        var syn = live < 2 ? 1
          : 1 + SYN_K * (live - 1) * (0.4 + 0.6 * (t / (QUARTERS - 1)));
        var raw = 0, run = 0;
        bounds[0][t] = 0;
        for (i = 0; i < CHANNELS.length; i++) {
          var v = on[i] ? CHANNELS[i].base[t] : 0;
          raw += v;
          run += v * syn;
          bounds[i + 1][t] = run;
        }
        iso[t] = raw;
      }
      return { bounds: bounds, iso: iso };
    }

    function blend(a, b, e) {
      var res = { bounds: [], iso: [] }, i, t;
      for (i = 0; i < a.bounds.length; i++) {
        res.bounds[i] = [];
        for (t = 0; t < QUARTERS; t++) {
          res.bounds[i][t] = a.bounds[i][t] + (b.bounds[i][t] - a.bounds[i][t]) * e;
        }
      }
      for (t = 0; t < QUARTERS; t++) {
        res.iso[t] = a.iso[t] + (b.iso[t] - a.iso[t]) * e;
      }
      return res;
    }

    /* --- geometry --- */
    function xAt(t) { return X0 + t * (X1 - X0) / (QUARTERS - 1); }
    function yAt(v) { return Y_BASE - (v / Y_MAX) * (Y_BASE - Y_TOP); }
    function r1(v) { return Math.round(v * 10) / 10; }

    function pts(series) {
      var o = [], t;
      for (t = 0; t < QUARTERS; t++) o.push([xAt(t), yAt(series[t])]);
      return o;
    }

    /* Catmull-Rom to cubic bezier. Control-point y is clamped to its own
       segment so a curve can never overshoot into the band stacked below it,
       which would show as a sliver of the wrong color. */
    function smooth(p) {
      var d = 'M' + r1(p[0][0]) + ' ' + r1(p[0][1]);
      for (var i = 0; i < p.length - 1; i++) {
        var p0 = p[Math.max(i - 1, 0)];
        var p1 = p[i];
        var p2 = p[i + 1];
        var p3 = p[Math.min(i + 2, p.length - 1)];
        var lo = Math.min(p1[1], p2[1]);
        var hi = Math.max(p1[1], p2[1]);
        var c1y = Math.min(hi, Math.max(lo, p1[1] + (p2[1] - p0[1]) / 6));
        var c2y = Math.min(hi, Math.max(lo, p2[1] - (p3[1] - p1[1]) / 6));
        d += ' C' + r1(p1[0] + (p2[0] - p0[0]) / 6) + ' ' + r1(c1y) +
          ' ' + r1(p2[0] - (p3[0] - p1[0]) / 6) + ' ' + r1(c2y) +
          ' ' + r1(p2[0]) + ' ' + r1(p2[1]);
      }
      return d;
    }

    function closed(upper, lower) {
      return smooth(pts(upper)) + ' L' + smooth(pts(lower).reverse()).slice(1) + ' Z';
    }

    function draw(m) {
      var top = m.bounds[CHANNELS.length];
      areas.forEach(function (el, i) {
        el.setAttribute('d', closed(m.bounds[i + 1], m.bounds[i]));
      });
      wedge.setAttribute('d', closed(top, m.iso));
      isoPath.setAttribute('d', smooth(pts(m.iso)));
    }

    /* --- readout --- */
    function valueAt(series, q) {
      var i = Math.max(0, Math.min(Math.floor(q), QUARTERS - 1));
      var j = Math.min(i + 1, QUARTERS - 1);
      return series[i] + (series[j] - series[i]) * (q - i);
    }

    function readout(m, q) {
      var total = valueAt(m.bounds[CHANNELS.length], q);
      var raw = valueAt(m.iso, q);
      out.total.textContent = Math.round(total).toLocaleString('en-US');
      out.iso.textContent = Math.round(raw).toLocaleString('en-US');
      out.lift.textContent = '+' +
        Math.round(raw > 0 ? (total / raw - 1) * 100 : 0) + '%';
    }

    var current = compute(enabled);
    var tweenId = 0;

    function retarget() {
      var target = compute(enabled);
      if (reduceMotion) {
        current = target;
        draw(current);
        readout(current, QUARTERS - 1);
        return;
      }
      var from = current;
      var start = null;
      window.cancelAnimationFrame(tweenId);
      tweenId = window.requestAnimationFrame(function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / 420, 1);
        current = blend(from, target, 1 - Math.pow(1 - p, 3));
        draw(current);
        readout(current, QUARTERS - 1);
        if (p < 1) tweenId = window.requestAnimationFrame(step);
      });
    }

    /* --- entrance wipe --- */
    var wiping = false;

    function endWipe() {
      wiping = false;
      wipe.setAttribute('width', String(VIEW_W));
      readout(current, QUARTERS - 1);
    }

    function playWipe() {
      if (wiping) return;
      wiping = true;
      var start = null;
      var step = (X1 - X0) / (QUARTERS - 1);
      wipe.setAttribute('width', '0');
      readout(current, 0);
      window.requestAnimationFrame(function frame(ts) {
        if (!wiping) return;
        if (start === null) start = ts;
        var p = Math.min((ts - start) / 1900, 1);
        /* Near-linear (easeOutSine) rather than a strong ease, so the sweep
           reads as time passing at a steady rate and the acceleration the
           viewer sees belongs to the curve, not to the animation. */
        var x = VIEW_W * Math.sin(p * Math.PI / 2);
        wipe.setAttribute('width', String(r1(x)));
        readout(current, Math.max(0, Math.min(QUARTERS - 1, (x - X0) / step)));
        if (p < 1) window.requestAnimationFrame(frame);
        else endWipe();
      });
    }

    /* --- legend --- */
    keys.forEach(function (btn) {
      var idx = -1;
      CHANNELS.forEach(function (c, i) { if (c.key === btn.dataset.ch) idx = i; });
      if (idx < 0) return;

      function isolate(on) {
        var live = on && enabled[idx];
        stack.classList.toggle('is-isolating', live);
        areas[idx].classList.toggle('is-focus', live);
      }

      btn.addEventListener('click', function () {
        /* Emptying the chart entirely reads as a broken panel, so the last
           live channel stays on. */
        var live = enabled.filter(Boolean).length;
        if (enabled[idx] && live === 1) return;
        enabled[idx] = !enabled[idx];
        btn.classList.toggle('is-on', enabled[idx]);
        btn.setAttribute('aria-pressed', String(enabled[idx]));
        if (wiping) endWipe();
        retarget();
        /* The pointer is still on the key, so re-resolve the isolate state.
           Without this, turning a channel off leaves the whole chart dimmed
           around a band that no longer exists. */
        isolate(true);
      });

      btn.addEventListener('pointerenter', function () { isolate(true); });
      btn.addEventListener('pointerleave', function () { isolate(false); });
      btn.addEventListener('focus', function () { isolate(true); });
      btn.addEventListener('blur', function () { isolate(false); });
    });

    draw(current);

    if (reduceMotion || !('IntersectionObserver' in window)) {
      endWipe();
      return;
    }

    /* Collapse the wipe now rather than when the observer fires, otherwise
       the finished chart shows for the scroll distance between the reveal
       threshold and the wipe threshold and then snaps back to empty. */
    wipe.setAttribute('width', '0');
    readout(current, 0);

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        playWipe();
      });
    }, { threshold: 0.35 });
    io.observe(root);
  })();

  /* --- Content built for how people search now: query to page match ------ */
  /* A buyer question rotates above the same product described two ways. The
     words the question and the page share light up in sequence, then each
     retrieval surface resolves. Vendor language carries no [data-w] words at
     all, so nothing can ever match it and no surface returns it, which is
     the argument rather than a scripted outcome.

     The panel is hidden until its tab is selected, and a hidden element does
     not intersect, so one IntersectionObserver covers both scrolling away
     and switching tabs without this needing to know about capabilities(). */
  (function queryMatch() {
    var root = document.querySelector('[data-query-match]');
    if (!root) return;

    function all(sel, scope) {
      return Array.prototype.slice.call((scope || root).querySelectorAll(sel));
    }

    var questions = all('.qmatch__q');
    var copies = all('.qmatch__copy');
    var modeBtns = all('.qmatch__mode');
    var surfaces = all('.qmatch__surface');
    var hits = root.querySelector('[data-role="hits"]');
    var note = root.querySelector('[data-role="note"]');
    if (!questions.length || !copies.length || !surfaces.length) return;
    if (!modeBtns.length || !hits || !note) return;

    var NOTES = {
      buyer: 'Every surface retrieves on the words the question was asked in.',
      vendor: 'Vendor language still ranks for vendor language. The buyer never types it.'
    };

    var CYCLE = 4400;
    var mode = 'buyer';
    var qi = 0;
    var timers = [];
    var advanceId = 0;
    var running = false;

    function later(fn, ms) { timers.push(window.setTimeout(fn, ms)); }

    function clearEffects() {
      timers.forEach(function (id) { window.clearTimeout(id); });
      timers = [];
    }

    function darken() {
      all('[data-w]').forEach(function (w) { w.classList.remove('is-lit'); });
      surfaces.forEach(function (s) { s.classList.remove('is-cited'); });
      hits.textContent = '0';
    }

    function showQuestion(i) {
      qi = i;
      questions.forEach(function (q, n) { q.classList.toggle('is-on', n === i); });
    }

    function showMode(next) {
      mode = next;
      copies.forEach(function (c) {
        c.classList.toggle('is-on', c.dataset.mode === next);
      });
      modeBtns.forEach(function (b) {
        var on = b.dataset.mode === next;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', String(on));
      });
      note.textContent = NOTES[next] || '';
    }

    function activeCopy() {
      var found = copies.filter(function (c) { return c.dataset.mode === mode; });
      return found[0] || copies[0];
    }

    function play(instant) {
      clearEffects();
      darken();

      var q = questions[qi];
      var keys = (q.getAttribute('data-hits') || '').split(',');
      var asked = all('[data-w]', q);
      var shared = all('[data-w]', activeCopy()).filter(function (w) {
        return keys.indexOf(w.dataset.w) > -1;
      });
      var matched = shared.length > 0;

      if (instant) {
        asked.concat(shared).forEach(function (w) { w.classList.add('is-lit'); });
        surfaces.forEach(function (s) { s.classList.toggle('is-cited', matched); });
        hits.textContent = String(matched ? surfaces.length : 0);
        return;
      }

      asked.forEach(function (w, n) {
        later(function () { w.classList.add('is-lit'); }, 260 + n * 110);
      });
      shared.forEach(function (w, n) {
        later(function () { w.classList.add('is-lit'); }, 640 + n * 110);
      });

      /* Surfaces resolve after the last word has landed, so the causality
         reads in the right order. A miss has nothing to stagger, so the
         chips simply stay dark. */
      if (!matched) return;
      var base = 640 + shared.length * 110 + 260;
      surfaces.forEach(function (s, n) {
        later(function () {
          s.classList.add('is-cited');
          hits.textContent = String(n + 1);
        }, base + n * 140);
      });
    }

    function scheduleAdvance() {
      window.clearTimeout(advanceId);
      advanceId = window.setTimeout(function () {
        if (!running) return;
        showQuestion((qi + 1) % questions.length);
        play(false);
        scheduleAdvance();
      }, CYCLE);
    }

    function start() {
      if (running || reduceMotion) return;
      running = true;
      play(false);
      scheduleAdvance();
    }

    function stop() {
      running = false;
      clearEffects();
      window.clearTimeout(advanceId);
    }

    /* Toggling restarts the dwell, so the change gets a full cycle to be
       read rather than however much of one happened to be left. */
    modeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.dataset.mode === mode) return;
        showMode(btn.dataset.mode);
        if (running) {
          play(false);
          scheduleAdvance();
        } else {
          play(true);
        }
      });
    });

    showMode(mode);
    showQuestion(0);

    if (reduceMotion || !('IntersectionObserver' in window)) {
      play(true);
      return;
    }

    /* Clear the shipped end state now, so the sequence always starts from
       nothing rather than flashing the finished panel first. */
    darken();

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) start();
        else stop();
      });
    }, { threshold: 0.3 });
    io.observe(root);
  })();

  /* --- Tool-stack knowledge graph (clustered, logo-aware, mouse-reactive) */
  (function constellation() {
    var wrap = document.querySelector('.stack__canvas-wrap[data-constellation]');
    if (!wrap) return;
    var canvas = wrap.querySelector('.stack__canvas');
    var nodesHost = wrap.querySelector('.stack__nodes');
    if (!canvas || !nodesHost) return;
    var ctx = canvas.getContext('2d');

    function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

    var LOGO_BASE = '/assets/tools-logos/';
    // Tools without a mapped file fall back to a plain text pill.
    var LOGOS = {
      'Claude': LOGO_BASE + 'claude-generic.png',
      'Claude Code': LOGO_BASE + 'claude-code.png',
      'Claude Cowork': LOGO_BASE + 'claude-cowork.png',
      'Claude Design': LOGO_BASE + 'claude-design.png',
      'ChatGPT': LOGO_BASE + 'chatgpt.png',
      'Codex': LOGO_BASE + 'codex.png',
      'Lovable': LOGO_BASE + 'lovable.png',
      'Bolt': LOGO_BASE + 'bolt.png',
      'Replit': LOGO_BASE + 'replit.png',
      'HubSpot': LOGO_BASE + 'hubspot.png',
      'Salesforce': LOGO_BASE + 'salesforce.png',
      'Marketo': LOGO_BASE + 'marketo.png',
      'Webflow': LOGO_BASE + 'webflow-clean.png',
      'Squarespace': LOGO_BASE + 'squarespace.png',
      'WordPress': LOGO_BASE + 'wordpress.png',
      'GA4': LOGO_BASE + 'ga4.png',
      'Google Ads': LOGO_BASE + 'google-ads.png',
      'SEM Rush': LOGO_BASE + 'semrush.png',
      'PostHog': LOGO_BASE + 'posthog.png',
      'Amplitude': LOGO_BASE + 'amplitude.svg',
      'GitHub': LOGO_BASE + 'github.png',
      'Vercel': LOGO_BASE + 'vercel.svg',
      'Netlify': LOGO_BASE + 'netlify.svg',
      'Canva': LOGO_BASE + 'canva.png',
      'Figma': LOGO_BASE + 'figma.png'
    };

    // Clusters are explicit, non-overlapping rectangular cells (percent of
    // the panel) that tile the space below the headline, sized roughly to
    // each cluster's tool count so the grid reads as deliberate, not
    // scattered. Each cluster's own nodes are laid out in a small sub-grid
    // inside its cell, and the label sits directly above that sub-grid, so
    // label-to-cluster proximity is guaranteed by construction.
    var clusters = [
      { label: 'AI', x0: 2, x1: 37, y0: 34, y1: 63, cols: 3, tools: ['Claude', 'Claude Code', 'Claude Cowork', 'Claude Design', 'ChatGPT', 'Codex'] },
      { label: 'App builders', x0: 37, x1: 57, y0: 34, y1: 63, cols: 2, tools: ['Lovable', 'Bolt', 'Replit'] },
      { label: 'CRM & MOPs', x0: 57, x1: 78, y0: 34, y1: 63, cols: 2, tools: ['HubSpot', 'Salesforce', 'Marketo'] },
      { label: 'Website builders', x0: 78, x1: 98, y0: 34, y1: 63, cols: 2, tools: ['Webflow', 'Squarespace', 'WordPress'] },
      { label: 'SEO & paid', x0: 2, x1: 27, y0: 66, y1: 96, cols: 2, tools: ['GA4', 'Google Ads', 'SEM Rush'] },
      { label: 'Product analytics', x0: 27, x1: 47, y0: 66, y1: 96, cols: 2, tools: ['PostHog', 'Amplitude'] },
      { label: 'Dev & deploy', x0: 47, x1: 72, y0: 66, y1: 96, cols: 2, tools: ['GitHub', 'Vercel', 'Netlify'] },
      { label: 'Design', x0: 72, x1: 98, y0: 66, y1: 96, cols: 2, tools: ['Canva', 'Figma'] }
    ];

    var pts = [];
    var centers = [];

    clusters.forEach(function (c, ci) {
      var n = c.tools.length;
      var cols = c.cols || Math.min(3, n);
      var rows = Math.ceil(n / cols);
      var cellCx = (c.x0 + c.x1) / 2;
      var cellW = c.x1 - c.x0;
      var cellH = c.y1 - c.y0;
      var labelSpace = 8; // percent reserved at the top of the cell for the label
      var gridTop = c.y0 + labelSpace;
      var gridH = cellH - labelSpace;
      var colW = cellW / cols;
      var rowH = gridH / rows;

      centers.push({ x: 0, y: 0, bx: cellCx, by: c.y0 + cellH / 2 + labelSpace / 2 });

      var label = document.createElement('span');
      label.className = 'stack__group-label';
      label.textContent = c.label;
      label.setAttribute('data-lx', cellCx);
      label.setAttribute('data-ly', c.y0 + 2);
      nodesHost.appendChild(label);

      c.tools.forEach(function (tool, k) {
        var logo = LOGOS[tool];
        var el = document.createElement('span');
        el.setAttribute('role', 'listitem');
        el.tabIndex = 0;

        if (logo) {
          el.className = 'stack__node stack__node--logo';
          el.innerHTML =
            '<span class="stack__node-chip">' +
              '<img src="' + logo + '" alt="' + tool + ' logo" loading="lazy" decoding="async">' +
            '</span>' +
            '<span class="stack__node-label">' + tool + '</span>';
        } else {
          el.className = 'stack__node stack__node--text';
          el.textContent = tool;
        }
        nodesHost.appendChild(el);

        var col = k % cols;
        var row = Math.floor(k / cols);
        // Center the last (possibly incomplete) row of the sub-grid.
        var itemsInRow = Math.min(cols, n - row * cols);
        var rowOffset = (cols - itemsInRow) * colW / 2;
        var bx = c.x0 + rowOffset + colW * (col + 0.5);
        var by = gridTop + rowH * (row + 0.5);

        pts.push({
          el: el, cluster: ci, bx: bx, by: by,
          phase: Math.random() * Math.PI * 2,
          amp: 2 + Math.random() * 2,
          hoverInfluence: 0,
          x: 0, y: 0
        });
      });
    });

    var labels = Array.prototype.slice.call(nodesHost.querySelectorAll('.stack__group-label'));
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0;

    var lerp = function (a, b, t) { return a + (b - a) * t; };
    var mouse = { x: 0, y: 0, targetX: 0, targetY: 0, active: false, strength: 0 };

    // Dense ambient background mesh, echoing a knowledge-graph texture behind
    // the meaningful cluster nodes. Avoids the headline/copy text zone.
    var textEl = wrap.parentElement.querySelector('.section__head');
    var mesh = { points: [], edges: [] };
    var meshPulses = [];

    function measureTextZone() {
      if (!textEl) return null;
      var tr = textEl.getBoundingClientRect();
      var wr = wrap.getBoundingClientRect();
      var pad = 44;
      return {
        x0: tr.left - wr.left - pad, y0: tr.top - wr.top - pad,
        x1: tr.right - wr.left + pad, y1: tr.bottom - wr.top + pad
      };
    }

    function buildMesh() {
      var textRect = measureTextZone();
      var area = w * h;
      var count = clamp(Math.floor(area / 8500), 70, 170);
      var maxDist = Math.min(w, h) * 0.17;

      function inQuiet(x, y) {
        return textRect && x > textRect.x0 && x < textRect.x1 && y > textRect.y0 && y < textRect.y1;
      }

      var points = [];
      var attempts = 0;
      while (points.length < count && attempts < count * 8) {
        attempts++;
        var x = Math.random() * w;
        var y = Math.random() * h;
        if (inQuiet(x, y)) continue;
        points.push({ x0: x, y0: y, x: x, y: y, phase: Math.random() * Math.PI * 2, amp: 4 + Math.random() * 5 });
      }

      var edges = [];
      for (var i = 0; i < points.length; i++) {
        var nearby = [];
        for (var j = 0; j < points.length; j++) {
          if (i === j) continue;
          var dx = points[i].x0 - points[j].x0;
          var dy = points[i].y0 - points[j].y0;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < maxDist) nearby.push({ j: j, d: d });
        }
        nearby.sort(function (a, b) { return a.d - b.d; }).slice(0, 2).forEach(function (nb) {
          edges.push({ a: i, b: nb.j, d: nb.d });
        });
      }

      mesh.points = points;
      mesh.edges = edges;
      mesh.maxDist = maxDist;

      meshPulses = [];
      var pulseCount = Math.min(18, Math.floor(edges.length / 5));
      for (var k = 0; k < pulseCount; k++) {
        meshPulses.push({
          edge: edges[Math.floor(Math.random() * edges.length)],
          progress: Math.random(),
          speed: reduceMotion ? 0 : (0.00016 + Math.random() * 0.00022)
        });
      }
    }

    // Safety net: if a cluster node's fixed position still lands on the
    // headline/copy despite the manual layout, nudge it clear at runtime.
    function resolveQuietZone(textRect) {
      pts.forEach(function (p, idx) {
        if (!textRect) { p.qx = 0; p.qy = 0; return; }
        var px = (p.bx / 100) * w;
        var py = (p.by / 100) * h;
        if (px > textRect.x0 && px < textRect.x1 && py > textRect.y0 && py < textRect.y1) {
          var stagger = (idx % 5) * 34;
          p.qy = (textRect.y1 - py) + 30 + stagger;
          p.qx = (idx % 2 === 0 ? -1 : 1) * (16 + stagger * 0.4);
        } else {
          p.qx = 0; p.qy = 0;
        }
      });
    }

    function resize() {
      var rect = wrap.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mouse.targetX = w / 2; mouse.targetY = h / 2;
      mouse.x = mouse.targetX; mouse.y = mouse.targetY;
      buildMesh();
      resolveQuietZone(measureTextZone());
    }

    function place(t) {
      centers.forEach(function (c) {
        c.x = (c.bx / 100) * w;
        c.y = (c.by / 100) * h;
      });

      if (!reduceMotion) {
        mouse.x = lerp(mouse.x, mouse.targetX, 0.09);
        mouse.y = lerp(mouse.y, mouse.targetY, 0.09);
        mouse.strength = lerp(mouse.strength, mouse.active ? 1 : 0, 0.06);
      }

      var influenceRadius = Math.min(w, h) * 0.4;

      pts.forEach(function (p) {
        var driftX = reduceMotion ? 0 : Math.cos(t / 2800 + p.phase) * p.amp;
        var driftY = reduceMotion ? 0 : Math.sin(t / 3300 + p.phase) * p.amp;

        var baseX = (p.bx / 100) * w + driftX + (p.qx || 0);
        var baseY = (p.by / 100) * h + driftY + (p.qy || 0);

        var influence = 0;
        if (!reduceMotion && mouse.strength > 0.01) {
          var dx = mouse.x - baseX;
          var dy = mouse.y - baseY;
          var dist = Math.sqrt(dx * dx + dy * dy) || 1;
          influence = mouse.strength * Math.max(0, 1 - dist / influenceRadius);
          p.hoverInfluence = lerp(p.hoverInfluence, influence, 0.1);
          var pull = p.hoverInfluence * p.hoverInfluence * 16;
          baseX += (dx / dist) * pull;
          baseY += (dy / dist) * pull;
        } else {
          p.hoverInfluence = lerp(p.hoverInfluence, 0, 0.1);
        }

        p.x = baseX; p.y = baseY;
        p.el.style.left = p.x + 'px';
        p.el.style.top = p.y + 'px';
        p.el.style.setProperty('--hover-influence', p.hoverInfluence.toFixed(3));
      });

      labels.forEach(function (el) {
        el.style.left = (parseFloat(el.getAttribute('data-lx')) / 100) * w + 'px';
        el.style.top = (parseFloat(el.getAttribute('data-ly')) / 100) * h + 'px';
      });

      mesh.points.forEach(function (p) {
        var dx = reduceMotion ? 0 : Math.cos(t / 4200 + p.phase) * p.amp;
        var dy = reduceMotion ? 0 : Math.sin(t / 5000 + p.phase) * p.amp;
        p.x = p.x0 + dx;
        p.y = p.y0 + dy;
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      // Dense ambient mesh, a quiet texture behind the meaningful graph.
      mesh.edges.forEach(function (e) {
        var a = mesh.points[e.a], b = mesh.points[e.b];
        var alpha = 0.1 * (1 - e.d / mesh.maxDist);
        if (alpha <= 0) return;
        ctx.strokeStyle = 'rgba(220, 229, 218, ' + alpha.toFixed(3) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      });
      mesh.points.forEach(function (p) {
        ctx.fillStyle = 'rgba(220, 229, 218, 0.4)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.1, 0, Math.PI * 2);
        ctx.fill();
      });
      meshPulses.forEach(function (pulse) {
        var t2 = pulse.progress;
        if (t2 < 0 || t2 > 1) return;
        var a = mesh.points[pulse.edge.a], b = mesh.points[pulse.edge.b];
        var x = lerp(a.x, b.x, t2);
        var y = lerp(a.y, b.y, t2);
        ctx.beginPath();
        ctx.arc(x, y, 1.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(220, 229, 218, 0.55)';
        ctx.fill();
      });

      // Faint backbone between nearby cluster centers.
      for (var a = 0; a < centers.length; a++) {
        for (var b = a + 1; b < centers.length; b++) {
          var ddx = centers[a].x - centers[b].x;
          var ddy = centers[a].y - centers[b].y;
          var d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d < w * 0.34) {
            ctx.strokeStyle = 'rgba(220, 229, 218, ' + (0.12 * (1 - d / (w * 0.34))).toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(centers[a].x, centers[a].y);
            ctx.lineTo(centers[b].x, centers[b].y);
            ctx.stroke();
          }
        }
      }

      // Lines from each node to its cluster center, brightening near the pointer.
      pts.forEach(function (p) {
        var c = centers[p.cluster];
        var boost = p.hoverInfluence * 0.5;
        ctx.strokeStyle = 'rgba(201, 160, 81, ' + (0.3 + boost).toFixed(3) + ')';
        ctx.lineWidth = 1 + p.hoverInfluence * 1.4;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      });

      // Traveling pulses along the node connector lines.
      pulses.forEach(function (pulse) {
        var p = pts[pulse.nodeIndex];
        var c = centers[p.cluster];
        var t = pulse.progress;
        if (t < 0 || t > 1) return;
        var x = lerp(c.x, p.x, t);
        var y = lerp(c.y, p.y, t);
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(232, 214, 168, 0.85)';
        ctx.fill();
      });

      // Cluster center dots.
      centers.forEach(function (c) {
        ctx.fillStyle = 'rgba(220, 229, 218, 0.55)';
        ctx.beginPath();
        ctx.arc(c.x, c.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Soft glow behind each node, boosted near the pointer.
      pts.forEach(function (p) {
        var glowR = 20 + p.hoverInfluence * 26;
        if (p.hoverInfluence > 0.02) {
          var glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
          glow.addColorStop(0, 'rgba(201, 160, 81, ' + (0.22 * p.hoverInfluence).toFixed(3) + ')');
          glow.addColorStop(1, 'rgba(201, 160, 81, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    // Ambient pulses traveling from each cluster center out to a node.
    var pulses = pts.map(function (_, i) {
      return { nodeIndex: i, progress: Math.random(), speed: reduceMotion ? 0 : (0.00028 + Math.random() * 0.00035) };
    });

    function advancePulses(dt) {
      if (reduceMotion) return;
      pulses.forEach(function (pulse) {
        pulse.progress += pulse.speed * dt;
        if (pulse.progress > 1.15) pulse.progress = -Math.random() * 0.4;
      });
      meshPulses.forEach(function (pulse) {
        pulse.progress += pulse.speed * dt;
        if (pulse.progress > 1.15) pulse.progress = -Math.random() * 0.4;
      });
    }

    var running = false, raf = null, lastT = 0;
    function frame(t) {
      var dt = lastT ? t - lastT : 16;
      lastT = t;
      place(t);
      advancePulses(dt);
      draw();
      raf = window.requestAnimationFrame(frame);
    }
    function start() {
      if (running) return;
      running = true;
      if (reduceMotion) { place(0); draw(); }
      else raf = window.requestAnimationFrame(frame);
    }
    function stop() { running = false; if (raf) window.cancelAnimationFrame(raf); }

    function updatePointer(clientX, clientY) {
      var rect = wrap.getBoundingClientRect();
      var x = clientX - rect.left;
      var y = clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        mouse.active = false;
      } else {
        mouse.targetX = x; mouse.targetY = y; mouse.active = true;
        if (reduceMotion) { place(0); draw(); }
      }
    }

    wrap.addEventListener('pointermove', function (e) { updatePointer(e.clientX, e.clientY); }, { passive: true });
    wrap.addEventListener('pointerleave', function () {
      mouse.active = false;
      if (reduceMotion) { place(0); draw(); }
    }, { passive: true });

    resize(); place(0); draw();

    window.addEventListener('resize', function () {
      resize(); place(performance.now()); draw();
    }, { passive: true });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) start(); else stop();
        });
      }, { threshold: 0.02 });
      io.observe(wrap);
    } else {
      start();
    }
  })();

  /* --- Case study growth chart hover ------------------------------------- */
  /* The chart itself is static SVG in the markup, so it renders with no JS and
     is fully crawlable. This only adds the crosshair dot and tooltip. */
  (function growthChart() {
    var charts = document.querySelectorAll('[data-growth]');
    if (!charts.length) return;

    charts.forEach(function (root) {
      var svg = root.querySelector('.growth__svg, .qbars__svg');
      var hits = root.querySelectorAll('.growth__hits rect, .qbars__hits rect');
      if (!svg || !hits.length) return;

      /* Anchor to the plot wrapper, which is the scroll container on narrow
         screens, so the tooltip travels with the chart. */
      var frame = root.querySelector('.growth__plot, .qbars__plot') || root;

      /* Each chart names its own unit so the tooltip is not hardcoded to the
         signup chart it was first written for. */
      var unit = root.dataset.unit || 'signups';

      var tip = document.createElement('div');
      tip.className = 'growth__tip';
      tip.setAttribute('aria-hidden', 'true');
      var cursor = document.createElement('div');
      cursor.className = 'growth__cursor';
      cursor.setAttribute('aria-hidden', 'true');
      frame.appendChild(cursor);
      frame.appendChild(tip);

      var box = svg.viewBox.baseVal;

      /* SVG user units to CSS pixels within the plot wrapper. */
      function toPixels(ux, uy) {
        var r = svg.getBoundingClientRect();
        var frameRect = frame.getBoundingClientRect();
        var scale = r.width / box.width;
        return {
          x: (r.left - frameRect.left) + frame.scrollLeft + ux * scale,
          y: (r.top - frameRect.top) + frame.scrollTop + uy * scale
        };
      }

      function show(rect) {
        var p = toPixels(parseFloat(rect.dataset.x), parseFloat(rect.dataset.y));
        cursor.style.left = p.x + 'px';
        cursor.style.top = p.y + 'px';
        tip.style.left = p.x + 'px';
        tip.style.top = p.y + 'px';
        tip.innerHTML = '<b>' + rect.dataset.value + ' ' + unit + '</b><br>' +
          rect.dataset.label;
        cursor.classList.add('is-on');
        tip.classList.add('is-on');
      }

      function hide() {
        cursor.classList.remove('is-on');
        tip.classList.remove('is-on');
      }

      hits.forEach(function (rect) {
        rect.addEventListener('pointerenter', function () { show(rect); });
        rect.addEventListener('pointermove', function () { show(rect); });
      });

      svg.addEventListener('pointerleave', hide);
      window.addEventListener('resize', hide, { passive: true });
    });
  })();

  /* --- Engagement path: light the steps in sequence ------------------------ */
  /* Used by the Fractional CMO page. Each step fades up and draws its incoming
     connector in turn, so the three-step route reads as a progression rather
     than three cards that happen to sit in a row. CSS gates the hidden state
     behind html.js, so with no JS the steps render as the plain static path. */
  (function pathProgress() {
    var paths = document.querySelectorAll('[data-path-progress]');
    if (!paths.length) return;

    function steps(path) {
      return Array.prototype.slice.call(path.querySelectorAll('.path__step'));
    }

    function lightAll(path) {
      steps(path).forEach(function (step) { step.classList.add('is-lit'); });
    }

    if (reduceMotion || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(paths, lightAll);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        steps(entry.target).forEach(function (step, i) {
          setTimeout(function () { step.classList.add('is-lit'); }, i * 260);
        });
      });
    }, { threshold: 0.3, rootMargin: '0px 0px -5% 0px' });

    Array.prototype.forEach.call(paths, function (p) { io.observe(p); });
  })();

  /* --- Play-once-in-view video -------------------------------------------- */
  /* Used by the rebrand transition on the Agolo/Implicit case study. The clip
     opens on the old wordmark and resolves to the new one, so it only reads
     correctly from the first frame. Autoplay would burn the transition while
     the section is still offscreen, so playback waits for the element to be
     visible and then runs once. CSS hides the video entirely under
     prefers-reduced-motion, where the static wordmark pair carries the story,
     but the guard is repeated here so playback is never even requested. */
  (function playInView() {
    var vids = document.querySelectorAll('video[data-play-in-view]');
    if (!vids.length) return;

    var reduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    if (!('IntersectionObserver' in window)) {
      /* No observer support, so fall back to playing on load rather than
         leaving the poster frame sitting there forever. */
      vids.forEach(function (v) { v.play().catch(function () {}); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var v = entry.target;
        io.unobserve(v);
        v.currentTime = 0;
        /* A rejected play() promise (autoplay policy, decode failure) leaves
           the poster showing, which is a fine resting state. */
        v.play().catch(function () {});
      });
    }, { threshold: 0.4 });

    vids.forEach(function (v) { io.observe(v); });
  })();
})();
