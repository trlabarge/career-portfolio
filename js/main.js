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

  /* --- Tool-stack constellation ----------------------------------------- */
  (function constellation() {
    var wrap = document.querySelector('.stack__canvas-wrap');
    if (!wrap) return;
    var canvas = wrap.querySelector('.stack__canvas');
    var nodes = Array.prototype.slice.call(wrap.querySelectorAll('.stack__node'));
    if (!canvas || !nodes.length) return;
    var ctx = canvas.getContext('2d');

    // Base positions in percentages, plus a drift phase per node.
    var pts = nodes.map(function (el) {
      return {
        el: el,
        bx: parseFloat(el.getAttribute('data-x')),
        by: parseFloat(el.getAttribute('data-y')),
        phase: Math.random() * Math.PI * 2,
        amp: 6 + Math.random() * 6,
        x: 0,
        y: 0
      };
    });

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0;

    function resize() {
      var rect = wrap.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function place(t) {
      pts.forEach(function (p) {
        var dx = reduceMotion ? 0 : Math.cos(t / 2600 + p.phase) * p.amp;
        var dy = reduceMotion ? 0 : Math.sin(t / 3100 + p.phase) * p.amp;
        p.x = (p.bx / 100) * w + dx;
        p.y = (p.by / 100) * h + dy;
        p.el.style.left = p.x + 'px';
        p.el.style.top = p.y + 'px';
      });
    }

    function drawLines() {
      ctx.clearRect(0, 0, w, h);
      for (var a = 0; a < pts.length; a++) {
        for (var b = a + 1; b < pts.length; b++) {
          var dx = pts[a].x - pts[b].x;
          var dy = pts[a].y - pts[b].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var maxD = 230;
          if (dist < maxD) {
            var alpha = (1 - dist / maxD) * 0.5;
            ctx.strokeStyle = 'rgba(220, 229, 218, ' + alpha.toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pts[a].x, pts[a].y);
            ctx.lineTo(pts[b].x, pts[b].y);
            ctx.stroke();
          }
        }
      }
      // node glow dots
      pts.forEach(function (p) {
        ctx.fillStyle = 'rgba(201, 160, 81, 0.9)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    var running = false;
    var raf = null;
    function frame(t) {
      place(t);
      drawLines();
      raf = window.requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      running = true;
      if (reduceMotion) {
        place(0);
        drawLines();
      } else {
        raf = window.requestAnimationFrame(frame);
      }
    }
    function stop() {
      running = false;
      if (raf) window.cancelAnimationFrame(raf);
    }

    resize();
    place(0);
    drawLines();

    window.addEventListener('resize', function () {
      resize();
      place(performance.now());
      drawLines();
    }, { passive: true });

    // Only animate while the section is on screen.
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) start();
          else stop();
        });
      }, { threshold: 0.05 });
      io.observe(wrap);
    } else {
      start();
    }
  })();
})();
