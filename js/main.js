/* ==========================================================================
   Tim LaBarge — Career Portfolio
   Vanilla JS: nav toggle, scroll progress, reveal-on-scroll, metric counters,
   rotating hero word, growth-curve draw, tool-stack constellation.
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

  /* --- Growth curve draw ------------------------------------------------- */
  (function growth() {
    var box = document.querySelector('.growth');
    if (!box) return;
    var line = box.querySelector('.growth__line');
    if (line) {
      var len = line.getTotalLength();
      box.style.setProperty('--len', Math.ceil(len));
    }

    function draw() { box.classList.add('is-drawn'); }

    if (reduceMotion || !('IntersectionObserver' in window)) {
      draw();
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          draw();
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    io.observe(box);
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
      { label: 'AI', x0: 2, x1: 30, y0: 34, y1: 63, cols: 3, tools: ['Claude', 'Claude Code', 'Claude Cowork', 'Claude Design', 'ChatGPT', 'Codex'] },
      { label: 'App builders', x0: 30, x1: 52, y0: 34, y1: 63, cols: 2, tools: ['Lovable', 'Bolt', 'Replit'] },
      { label: 'CRM & MOPs', x0: 52, x1: 75, y0: 34, y1: 63, cols: 2, tools: ['HubSpot', 'Salesforce', 'Marketo'] },
      { label: 'Website builders', x0: 75, x1: 98, y0: 34, y1: 63, cols: 2, tools: ['Webflow', 'Squarespace', 'WordPress'] },
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
})();
