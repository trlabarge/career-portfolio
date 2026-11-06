/* SkillBit working session. Vanilla, no dependencies.
   1. Sticky tab state follows whichever part is on screen.
   2. Two assumption calculators that recompute on every input.
   The markup ships with the default results, so the page reads with no JS. */

(function () {
  'use strict';

  /* ---------- Tabs ---------- */
  const tabs = Array.from(document.querySelectorAll('[data-tab]'));
  const parts = tabs.map((t) => document.getElementById(t.dataset.tab)).filter(Boolean);

  function setActive() {
    const bar = document.querySelector('.topbar');
    const line = (bar ? bar.offsetHeight : 0) + window.innerHeight * 0.25;
    let current = null;
    for (const p of parts) if (p.getBoundingClientRect().top <= line) current = p.id;
    tabs.forEach((t) => {
      if (t.dataset.tab === current) t.setAttribute('aria-current', 'true');
      else t.removeAttribute('aria-current');
    });
  }
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; setActive(); });
  }, { passive: true });
  window.addEventListener('resize', setActive);
  setActive();

  /* ---------- Formatting ---------- */
  const int = (n) => Math.round(n).toLocaleString('en-US');
  const usd = (n) => '$' + Math.round(n).toLocaleString('en-US');
  const pct = (n) => (Math.round(n * 10) / 10).toLocaleString('en-US') + '%';
  const one = (n) => (Math.round(n * 10) / 10).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  /* Trims float noise before rounding up, so 30 ÷ 3% is 1,000 and not 1,001. */
  const up = (n) => Math.ceil(Math.round(n * 1e6) / 1e6);
  const NA = 'n/a';
  const ok = (...xs) => xs.every((x) => Number.isFinite(x) && x > 0);

  /* ---------- Part 1: RSAC ---------- */
  function rsac(v) {
    const r = {};
    const opps = ok(v.goal, v.deal) ? up(v.goal / v.deal) : NaN;
    const meetings = ok(opps, v.m2o) ? up((opps * 100) / v.m2o) : NaN;
    const dinnerRaw = (v.guests * v.g2m) / 100;
    const dinner = Number.isFinite(dinnerRaw) ? Math.round(dinnerRaw) : NaN;
    const outreach = Number.isFinite(meetings) && Number.isFinite(dinner) ? Math.max(0, meetings - dinner) : NaN;
    const accounts = Number.isFinite(outreach) && ok(v.book) ? up((outreach * 100) / v.book) : NaN;
    const cpo = ok(opps) && Number.isFinite(v.budget) ? v.budget / opps : NaN;

    r.opps = [Number.isFinite(opps) ? int(opps) : NA, `goal ÷ deal = ${usd(v.goal)} ÷ ${usd(v.deal)}`];
    r.meetings = [Number.isFinite(meetings) ? int(meetings) : NA, `opps ÷ meeting-to-opp rate = ${Number.isFinite(opps) ? int(opps) : NA} ÷ ${pct(v.m2o)}`];
    r.dinner = [Number.isFinite(dinner) ? '~' + int(dinner) : NA, `guests × rate = ${int(v.guests)} × ${pct(v.g2m)} = ${(Math.round(dinnerRaw * 10) / 10).toLocaleString('en-US')}`];
    r.outreach = [Number.isFinite(outreach) ? '~' + int(outreach) : NA, `meetings needed − dinner meetings = ${Number.isFinite(meetings) ? int(meetings) : NA} − ${Number.isFinite(dinner) ? int(dinner) : NA}`];
    r.accounts = [Number.isFinite(accounts) ? '~' + int(accounts) : NA, `outreach meetings ÷ booking rate = ${Number.isFinite(outreach) ? int(outreach) : NA} ÷ ${pct(v.book)}`];
    r.cpo = [Number.isFinite(cpo) ? usd(cpo) : NA, `budget ÷ opps = ${usd(v.budget)} ÷ ${Number.isFinite(opps) ? int(opps) : NA}`];
    return r;
  }

  /* ---------- Part 2: signal-based outbound ---------- */
  function signal(v, root) {
    const r = {};
    const pipeline = v.opps * v.deal;
    const meetings = ok(v.opps, v.m2o) ? up((v.opps * 100) / v.m2o) : NaN;
    const capacity = v.bdrs * v.apw * v.weeks;
    const needed = Number.isFinite(meetings) && ok(v.rate) ? up((meetings * 100) / v.rate) : NaN;
    const used = Number.isFinite(needed) && ok(capacity) ? (needed / capacity) * 100 : NaN;
    const weeks = ok(v.weeks) ? v.weeks : NaN;

    r.pipeline = [Number.isFinite(pipeline) ? usd(pipeline) : NA, `opps × deal = ${int(v.opps)} × ${usd(v.deal)}`];
    r.meetings = [Number.isFinite(meetings) ? int(meetings) : NA, `opps ÷ meeting-to-opp rate = ${int(v.opps)} ÷ ${pct(v.m2o)}`];
    r.capacity = [Number.isFinite(capacity) ? int(capacity) : NA, `BDRs × accounts per week × weeks = ${int(v.bdrs)} × ${int(v.apw)} × ${int(v.weeks)}`];
    r.needed = [Number.isFinite(needed) ? int(needed) : NA, `meetings ÷ meeting rate = ${Number.isFinite(meetings) ? int(meetings) : NA} ÷ ${pct(v.rate)}`];
    r.used = [Number.isFinite(used) ? int(used) + '%' : NA, `accounts needed ÷ capacity = ${Number.isFinite(needed) ? int(needed) : NA} ÷ ${Number.isFinite(capacity) ? int(capacity) : NA}`];
    r.wkAccounts = [Number.isFinite(needed / weeks) ? int(needed / weeks) : NA];
    r.wkMeetings = [Number.isFinite(meetings / weeks) ? one(meetings / weeks) : NA];
    r.wkOpps = [Number.isFinite(v.opps / weeks) ? one(v.opps / weeks) : NA];
    r.weekly = [null, `each quarterly total ÷ ${Number.isFinite(weeks) ? int(weeks) : NA} weeks`];

    /* Capacity warning */
    const over = Number.isFinite(needed) && Number.isFinite(capacity) && needed > capacity;
    const card = root.querySelector('[data-capacity-card]');
    const warn = root.querySelector('[data-warn]');
    const meter = root.querySelector('[data-meter]');
    card.classList.toggle('is-over', over);
    warn.hidden = !over;
    root.querySelector('[data-warn-needed]').textContent = Number.isFinite(needed) ? int(needed) : NA;
    root.querySelector('[data-warn-capacity]').textContent = Number.isFinite(capacity) ? int(capacity) : NA;
    meter.style.setProperty('--fill', Number.isFinite(used) ? Math.max(0, used / 100) : 0);
    return r;
  }

  const MODELS = { rsac, signal };

  document.querySelectorAll('[data-calc]').forEach((root) => {
    const model = MODELS[root.dataset.calc];
    if (!model) return;
    const inputs = Array.from(root.querySelectorAll('input[name]'));
    const defaults = Object.fromEntries(inputs.map((i) => [i.name, i.defaultValue]));

    function read() {
      return Object.fromEntries(inputs.map((i) => [i.name, i.value === '' ? NaN : Number(i.value)]));
    }

    function render() {
      const out = model(read(), root);
      for (const [key, [value, formula]] of Object.entries(out)) {
        const o = root.querySelector(`[data-out="${key}"]`);
        if (o && value != null) o.textContent = value;
        const f = root.querySelector(`[data-formula="${key}"]`);
        if (f && formula != null) f.textContent = formula;
      }
    }

    inputs.forEach((i) => i.addEventListener('input', render));
    const reset = root.querySelector('[data-reset]');
    if (reset) reset.addEventListener('click', () => {
      inputs.forEach((i) => { i.value = defaults[i.name]; });
      render();
    });
    render();
  });
})();
