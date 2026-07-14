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

    var LOGO_BASE = '/assets/tools-logos/';
    // Tools without a mapped file fall back to a plain text pill.
    // Bolt ships as a dark self-contained tile, so it skips the multiply blend.
    var LOGOS = {
      'Claude Code': LOGO_BASE + 'claude-code.png',
      'Claude Cowork': LOGO_BASE + 'claude-generic.png',
      'Claude Design': LOGO_BASE + 'claude-generic.png',
      'ChatGPT': LOGO_BASE + 'chatgpt.png',
      'Codex': LOGO_BASE + 'codex.png',
      'Lovable': LOGO_BASE + 'lovable.png',
      'Bolt': { src: LOGO_BASE + 'bolt.png', noBlend: true },
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
      'Vercel': LOGO_BASE + 'vercel.svg',
      'Netlify': LOGO_BASE + 'netlify.svg',
      'Canva': LOGO_BASE + 'canva.png',
      'Figma': LOGO_BASE + 'figma.png'
    };

    // Clusters: center in percent of the panel, plus the tools in each.
    var clusters = [
      { label: 'AI', cx: 19, cy: 30, rx: 15, ry: 20, tools: ['Claude Code', 'Claude Cowork', 'Claude Design', 'ChatGPT', 'Codex'] },
      { label: 'App builders', cx: 47, cy: 15, rx: 11, ry: 12, tools: ['Lovable', 'Bolt', 'Replit'] },
      { label: 'CRM & MOPs', cx: 79, cy: 19, rx: 12, ry: 14, tools: ['HubSpot', 'Salesforce', 'Marketo', 'Pardot'] },
      { label: 'Website builders', cx: 54, cy: 48, rx: 12, ry: 13, tools: ['Webflow', 'Squarespace', 'WordPress'] },
      { label: 'SEO & paid', cx: 87, cy: 57, rx: 11, ry: 13, tools: ['GA4', 'Google Ads', 'SEM Rush'] },
      { label: 'Product analytics', cx: 68, cy: 84, rx: 10, ry: 11, tools: ['PostHog', 'Amplitude'] },
      { label: 'Dev & deploy', cx: 33, cy: 80, rx: 11, ry: 12, tools: ['GitHub', 'Vercel', 'Netlify'] },
      { label: 'Design', cx: 9, cy: 65, rx: 10, ry: 11, tools: ['Canva', 'Figma'] }
    ];

    var pts = [];
    var centers = [];

    clusters.forEach(function (c, ci) {
      centers.push({ x: 0, y: 0, bx: c.cx, by: c.cy });

      var label = document.createElement('span');
      label.className = 'stack__group-label';
      label.textContent = c.label;
      var n = c.tools.length;
      var rx = c.rx;
      var ry = c.ry;

      label.setAttribute('data-lx', c.cx);
      label.setAttribute('data-ly', Math.max(4, c.cy - ry - 7));
      nodesHost.appendChild(label);

      c.tools.forEach(function (tool, k) {
        var logo = LOGOS[tool];
        var el = document.createElement('span');
        el.setAttribute('role', 'listitem');
        el.tabIndex = 0;

        if (logo) {
          var src = typeof logo === 'string' ? logo : logo.src;
          var noBlend = typeof logo === 'object' && logo.noBlend;
          el.className = 'stack__node stack__node--logo';
          el.innerHTML =
            '<span class="stack__node-chip' + (noBlend ? ' no-blend' : '') + '">' +
              '<img src="' + src + '" alt="' + tool + ' logo" loading="lazy" decoding="async">' +
            '</span>' +
            '<span class="stack__node-label">' + tool + '</span>';
        } else {
          el.className = 'stack__node stack__node--text';
          el.textContent = tool;
        }
        nodesHost.appendChild(el);

        var bx, by;
        if (n === 1) {
          bx = c.cx; by = c.cy;
        } else {
          // Start at the bottom so no node sits directly under the label.
          var ang = (k / n) * Math.PI * 2 + ci * 0.7 + Math.PI / 2;
          bx = c.cx + Math.cos(ang) * rx;
          by = c.cy + Math.sin(ang) * ry;
        }
        // Keep nodes clear of the panel edges.
        bx = Math.max(8, Math.min(92, bx));
        by = Math.max(9, Math.min(93, by));
        pts.push({
          el: el, cluster: ci, bx: bx, by: by,
          phase: Math.random() * Math.PI * 2,
          amp: 3 + Math.random() * 3,
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

    function resize() {
      var rect = wrap.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mouse.targetX = w / 2; mouse.targetY = h / 2;
      mouse.x = mouse.targetX; mouse.y = mouse.targetY;
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

        var baseX = (p.bx / 100) * w + driftX;
        var baseY = (p.by / 100) * h + driftY;

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
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

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
