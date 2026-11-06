/* SkillBit Marketing Plan. Vanilla, no dependencies.
   1. Sticky tab state and reveal on scroll.
   2. Hero radar. A sweep pings hiring-signal accounts, dots are pushed aside
      by the pointer (spring field from /nucleus), a click sends a ripple.
   3. Two pipeline models (funnel plus sliders) that recompute on every input.
   4. Account tier picker, an ARIA tablist mirrored by the rings (from /nucleus).
   5. Budget rows highlight their segment of the allocation bar.
   The markup ships in its resolved state, so the page reads with no JS. */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SVGNS = 'http://www.w3.org/2000/svg';

  /* ---------- Tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-tab]'));
  var parts = tabs.map(function (t) { return document.getElementById(t.dataset.tab); }).filter(Boolean);
  function setActive() {
    var bar = document.querySelector('.topbar');
    var line = (bar ? bar.offsetHeight : 0) + window.innerHeight * 0.25;
    var current = null;
    parts.forEach(function (p) { if (p.getBoundingClientRect().top <= line) current = p.id; });
    tabs.forEach(function (t) {
      if (t.dataset.tab === current) t.setAttribute('aria-current', 'true');
      else t.removeAttribute('aria-current');
    });
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; setActive(); });
  }, { passive: true });
  window.addEventListener('resize', setActive);
  setActive();

  /* ---------- Reveal ---------- */
  (function reveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- Hero radar ---------- */
  (function radar() {
    var svg = document.querySelector('[data-radar]');
    if (!svg || reduceMotion) return;
    var sweep = svg.querySelector('[data-sweep]');
    var pingLayer = svg.querySelector('[data-pings]');
    var C = 260;
    var PERIOD = 6000;
    var RADIUS = 90;
    var PUSH = 30;

    var pts = Array.prototype.map.call(svg.querySelectorAll('.rd'), function (el) {
      var x = Number(el.getAttribute('cx'));
      var y = Number(el.getAttribute('cy'));
      var a = Math.atan2(x - C, C - y) * 180 / Math.PI;
      if (a < 0) a += 360;
      var tier = el.classList.contains('rd--a') ? 'a' : el.classList.contains('rd--b') ? 'b' : 'c';
      return { el: el, x: x, y: y, a: a, tier: tier, ox: 0, oy: 0, vx: 0, vy: 0, last: 0 };
    });

    function ping(q, now) {
      if (now - q.last < 900) return;
      q.last = now;
      if (q.tier === 'c') {
        q.el.classList.add('is-lit');
        setTimeout(function () { q.el.classList.remove('is-lit'); }, 900);
        return;
      }
      var c = document.createElementNS(SVGNS, 'circle');
      c.setAttribute('class', 'radar__ping radar__ping--' + q.tier);
      c.setAttribute('cx', (q.x + q.ox).toFixed(1));
      c.setAttribute('cy', (q.y + q.oy).toFixed(1));
      c.setAttribute('r', q.tier === 'a' ? 7 : 5.5);
      pingLayer.appendChild(c);
      setTimeout(function () { c.remove(); }, 1700);
    }

    /* Sweep, only while the hero is on screen. */
    var angle = 48;
    var prevT = null;
    var visible = true;
    function frame(t) {
      if (!visible) { prevT = null; return; }
      if (prevT !== null) {
        var dt = Math.min(t - prevT, 100);
        var prev = angle;
        angle = (angle + (dt / PERIOD) * 360) % 360;
        var wrapped = angle < prev;
        pts.forEach(function (q) {
          var hit = wrapped ? (q.a > prev || q.a <= angle) : (q.a > prev && q.a <= angle);
          if (hit) ping(q, t);
        });
        sweep.setAttribute('transform', 'rotate(' + angle.toFixed(2) + ' ' + C + ' ' + C + ')');
      }
      prevT = t;
      requestAnimationFrame(frame);
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        var was = visible;
        visible = entries[0].isIntersecting && !document.hidden;
        if (visible && !was) requestAnimationFrame(frame);
      }).observe(svg);
    }
    document.addEventListener('visibilitychange', function () {
      var was = visible;
      visible = !document.hidden;
      if (visible && !was) requestAnimationFrame(frame);
    });
    requestAnimationFrame(frame);

    /* Spring field, from /nucleus. */
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
    function kick() { if (!running) { running = true; requestAnimationFrame(step); } }
    function step(t) {
      var moving = false;
      pts.forEach(function (q) {
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
            if (d < 34) ping(q, t);
          }
        }
        q.vx = (q.vx + (tx - q.ox) * 0.14) * 0.8;
        q.vy = (q.vy + (ty - q.oy) * 0.14) * 0.8;
        q.ox += q.vx;
        q.oy += q.vy;
        if (Math.abs(q.vx) > 0.02 || Math.abs(q.vy) > 0.02 || Math.abs(q.ox - tx) > 0.05 || Math.abs(q.oy - ty) > 0.05) moving = true;
        q.el.setAttribute('transform', 'translate(' + q.ox.toFixed(2) + ' ' + q.oy.toFixed(2) + ')');
      });
      if (moving) requestAnimationFrame(step);
      else running = false;
    }
    svg.addEventListener('pointermove', function (e) { mouse = toSvg(e); kick(); });
    svg.addEventListener('pointerleave', function () { mouse = null; kick(); });
    svg.addEventListener('pointerdown', function (e) {
      var p = toSvg(e);
      if (!p) return;
      var r = document.createElementNS(SVGNS, 'circle');
      r.setAttribute('class', 'radar__ripple');
      r.setAttribute('cx', p.x.toFixed(1));
      r.setAttribute('cy', p.y.toFixed(1));
      r.setAttribute('r', 200);
      pingLayer.appendChild(r);
      setTimeout(function () { r.remove(); }, 1200);
      var now = performance.now();
      pts.forEach(function (q) {
        var dx = q.x - p.x;
        var dy = q.y - p.y;
        var d = Math.sqrt(dx * dx + dy * dy) || 1;
        if (d < 200) {
          var f = (1 - d / 200) * 14;
          q.vx += (dx / d) * f;
          q.vy += (dy / d) * f;
          (function (q, delay) { setTimeout(function () { ping(q, now + delay); }, delay); })(q, d * 4);
        }
      });
      kick();
    });
  })();

  /* ---------- Formatting ---------- */
  function int(n) { return Math.round(n).toLocaleString('en-US'); }
  function usd(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  function pct(n) { return (Math.round(n * 10) / 10).toLocaleString('en-US') + '%'; }
  function one(n) { return (Math.round(n * 10) / 10).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }); }
  /* Trims float noise before rounding up, so 30 ÷ 3% is 1,000 and not 1,001. */
  function up(n) { return Math.ceil(Math.round(n * 1e6) / 1e6); }
  function ok() { for (var i = 0; i < arguments.length; i++) { if (!(isFinite(arguments[i]) && arguments[i] > 0)) return false; } return true; }
  function fin(n) { return isFinite(n); }
  var NA = 'n/a';
  var FMT = { usd: usd, pct: pct, int: int };
  /* Log scale so 340 accounts and 10 opportunities both read on one funnel. */
  function width(v, max) {
    if (!(v > 0) || !(max > 0)) return 0.04;
    return Math.min(1, 0.12 + 0.88 * Math.log(1 + v) / Math.log(1 + max));
  }

  /* ---------- Part 1: RSAC ---------- */
  function rsac(v) {
    var opps = ok(v.goal, v.deal) ? up(v.goal / v.deal) : NaN;
    var meetings = ok(opps, v.m2o) ? up((opps * 100) / v.m2o) : NaN;
    var dinnerRaw = (v.guests * v.g2m) / 100;
    var dinner = Math.round(dinnerRaw);
    var outreach = fin(meetings) ? Math.max(0, meetings - dinner) : NaN;
    var accounts = fin(outreach) && ok(v.book) ? up((outreach * 100) / v.book) : NaN;
    var cpo = ok(opps) ? v.budget / opps : NaN;
    var max = Math.max(accounts || 0, meetings || 0, 1);
    var used = fin(meetings) ? Math.min(dinner, meetings) : 0;
    return {
      out: {
        accounts: fin(accounts) ? '~' + int(accounts) : NA,
        meetings: fin(meetings) ? int(meetings) : NA,
        outreach: fin(outreach) ? '~' + int(outreach) : NA,
        dinner: '~' + int(dinner),
        opps: fin(opps) ? int(opps) : NA,
        pipeline: usd(v.goal),
        cpo: fin(cpo) ? usd(cpo) : NA,
      },
      formula: {
        accounts: 'outreach meetings ÷ booking rate = ' + (fin(outreach) ? int(outreach) : NA) + ' ÷ ' + pct(v.book),
        meetings: 'opportunities ÷ meeting-to-opportunity rate = ' + (fin(opps) ? int(opps) : NA) + ' ÷ ' + pct(v.m2o),
        dinner: 'guests × guest-to-meeting rate = ' + int(v.guests) + ' × ' + pct(v.g2m) + ' = ' + (Math.round(dinnerRaw * 10) / 10).toLocaleString('en-US'),
        opps: 'pipeline goal ÷ average deal = ' + usd(v.goal) + ' ÷ ' + usd(v.deal),
        cpo: 'budget ÷ opportunities = ' + usd(v.budget) + ' ÷ ' + (fin(opps) ? int(opps) : NA),
      },
      bars: {
        accounts: width(accounts, max),
        meetings: width(meetings, max),
        opps: width(opps, max),
      },
      segs: {
        outreach: fin(meetings) && meetings > 0 ? (meetings - used) / meetings : 1,
        dinner: fin(meetings) && meetings > 0 ? used / meetings : 0,
      },
    };
  }

  /* ---------- Part 2: signal-based outbound ---------- */
  function signal(v, root) {
    var pipeline = v.opps * v.deal;
    var meetings = ok(v.opps, v.m2o) ? up((v.opps * 100) / v.m2o) : NaN;
    var capacity = v.bdrs * v.apw * v.weeks;
    var needed = fin(meetings) && ok(v.rate) ? up((meetings * 100) / v.rate) : NaN;
    var used = fin(needed) && ok(capacity) ? (needed / capacity) * 100 : NaN;
    var over = fin(needed) && needed > capacity;

    var card = root.querySelector('[data-capacity]');
    card.classList.toggle('is-over', over);
    root.querySelector('[data-warn]').hidden = !over;
    root.querySelector('[data-warn-needed]').textContent = fin(needed) ? int(needed) : NA;
    root.querySelector('[data-warn-capacity]').textContent = int(capacity);
    root.querySelector('[data-meter]').style.setProperty('--fill', fin(used) ? Math.max(0, used / 100) : 0);

    var max = Math.max(needed || 0, 1);
    return {
      out: {
        used: fin(used) ? int(used) + '%' : NA,
        needed: fin(needed) ? int(needed) : NA,
        needed2: fin(needed) ? int(needed) : NA,
        capacity: int(capacity),
        meetings: fin(meetings) ? int(meetings) : NA,
        opps: int(v.opps),
        pipeline: usd(pipeline),
        wkAccounts: fin(needed) ? int(needed / v.weeks) : NA,
        wkMeetings: fin(meetings) ? one(meetings / v.weeks) : NA,
        wkOpps: one(v.opps / v.weeks),
      },
      formula: {
        needed: 'meetings ÷ meeting rate = ' + (fin(meetings) ? int(meetings) : NA) + ' ÷ ' + pct(v.rate),
        capacity: 'BDRs × accounts per week × weeks = ' + int(v.bdrs) + ' × ' + int(v.apw) + ' × ' + int(v.weeks),
        meetings: 'opportunities ÷ meeting-to-opportunity rate = ' + int(v.opps) + ' ÷ ' + pct(v.m2o),
        pipeline: 'opportunities × average deal = ' + int(v.opps) + ' × ' + usd(v.deal),
        weekly: 'quarterly totals ÷ ' + int(v.weeks) + ' weeks',
      },
      bars: {
        needed: width(needed, max),
        meetings: width(meetings, max),
        opps: width(v.opps, max),
      },
    };
  }

  var MODELS = { rsac: rsac, signal: signal };

  document.querySelectorAll('[data-model]').forEach(function (root) {
    var model = MODELS[root.dataset.model];
    if (!model) return;
    var form = root.querySelector('form');
    var inputs = Array.prototype.slice.call(root.querySelectorAll('input[name]'));
    var presets = Array.prototype.slice.call(root.querySelectorAll('[data-preset-rate]'));
    var pulseTimer = null;

    function read() {
      var v = {};
      inputs.forEach(function (i) { v[i.name] = Number(i.value); });
      return v;
    }
    function set(sel, text) {
      var el = root.querySelector(sel);
      if (el && el.textContent !== text) el.textContent = text;
    }
    function render(pulse) {
      var v = read();
      inputs.forEach(function (i) { set('[data-show="' + i.name + '"]', (FMT[i.dataset.fmt] || int)(v[i.name])); });
      var r = model(v, root);
      Object.keys(r.out).forEach(function (k) { set('[data-out="' + k + '"]', r.out[k]); });
      Object.keys(r.formula).forEach(function (k) { set('[data-formula="' + k + '"]', r.formula[k]); });
      Object.keys(r.bars).forEach(function (k) {
        var bar = root.querySelector('[data-bar="' + k + '"]');
        if (bar) bar.style.setProperty('--w', r.bars[k].toFixed(3));
      });
      var opps = root.querySelector('[data-bar="opps"]');
      var result = root.querySelector('.funnel__bar--result');
      if (opps && result) result.style.setProperty('--w', opps.style.getPropertyValue('--w'));
      if (r.segs) Object.keys(r.segs).forEach(function (k) {
        var seg = root.querySelector('[data-seg="' + k + '"]');
        if (seg) seg.style.setProperty('--share', r.segs[k].toFixed(3));
      });
      presets.forEach(function (b) { b.setAttribute('aria-pressed', String(Number(b.dataset.presetRate) === v.rate)); });
      if (pulse) {
        root.classList.remove('is-pulse');
        void root.offsetWidth;
        root.classList.add('is-pulse');
        clearTimeout(pulseTimer);
        pulseTimer = setTimeout(function () { root.classList.remove('is-pulse'); }, 400);
      }
    }

    inputs.forEach(function (i) { i.addEventListener('input', function () { render(true); }); });
    form.addEventListener('reset', function () { setTimeout(function () { render(true); }, 0); });
    presets.forEach(function (b) {
      b.addEventListener('click', function () {
        var rate = root.querySelector('input[name="rate"]');
        rate.value = b.dataset.presetRate;
        render(true);
      });
    });
    render(false);
  });

  /* ---------- Account tiers (from /nucleus) ---------- */
  (function tiers() {
    var root = document.querySelector('[data-tiers]');
    if (!root) return;
    var tabsT = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var rings = root.querySelectorAll('[data-tier-ring]');
    function highlight(n) {
      rings.forEach(function (r) { r.classList.toggle('is-active', r.getAttribute('data-tier-ring') === String(n)); });
    }
    function select(i, focus) {
      tabsT.forEach(function (tab, j) {
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
      if (focus) tabsT[i].focus();
    }
    tabsT.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(i, false); });
      tab.addEventListener('keydown', function (e) {
        var n = tabsT.length;
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
      r.addEventListener('click', function () { select(Number(r.getAttribute('data-tier-ring')) - 1, false); });
    });
    highlight(1);
  })();

  /* ---------- Budget rows light their allocation segment ---------- */
  (function alloc() {
    var bar = document.querySelector('[data-alloc]');
    var table = document.querySelector('[data-alloc-table]');
    if (!bar || !table) return;
    function hot(n) {
      bar.classList.toggle('is-focus', n !== null);
      bar.querySelectorAll('[data-seg]').forEach(function (s) { s.classList.toggle('is-hot', s.dataset.seg === n); });
      table.querySelectorAll('[data-row]').forEach(function (r) { r.classList.toggle('is-hot', r.dataset.row === n); });
    }
    table.querySelectorAll('[data-row]').forEach(function (row) {
      row.addEventListener('mouseenter', function () { hot(row.dataset.row); });
      row.addEventListener('mouseleave', function () { hot(null); });
    });
    bar.querySelectorAll('[data-seg]').forEach(function (seg) {
      seg.addEventListener('mouseenter', function () { hot(seg.dataset.seg); });
      seg.addEventListener('mouseleave', function () { hot(null); });
    });
  })();
})();
