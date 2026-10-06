/**
 * Shared pieces for the password-protected /nucleus page.
 *
 * The session and cookie logic lives in ./plan-gate.js, shared with /payload.
 * This file holds the Nucleus gate's settings and its password screen.
 * Changing NUCLEUS_PAGE_PASSWORD in Vercel invalidates every session at once.
 */

import { makeGate } from './plan-gate.js';

export const gate = makeGate({
  path: '/nucleus',
  cookieName: 'nucleus_plan_session',
  label: 'nucleus-plan',
  envVar: 'NUCLEUS_PAGE_PASSWORD',
});

/**
 * The password screen. Self-contained so it needs no file behind the gate.
 * It carries a title and no share image, so a pasted link previews as the
 * page's name and nothing else. No Nucleus logo, the page uses the
 * portfolio's own sage accent rather than borrowing their branding.
 */
export function gateHtml({ error = false } = {}) {
  const message = error
    ? '<p class="gate__error" role="alert">That password did not work. Try again.</p>'
    : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Nucleus Security: a starting ABX hypothesis</title>
<meta property="og:title" content="Nucleus Security: a starting ABX hypothesis">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="Nucleus Security: a starting ABX hypothesis">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='7' fill='%234A6B52'/><text x='16' y='22' font-family='Arial,sans-serif' font-size='15' font-weight='bold' text-anchor='middle' fill='%23FAF9F6'>TL</text></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap">
<style>
:root{--bg:#FAF9F6;--text:#2B2B2B;--muted:#5A5A56;--sage:#4A6B52;--sage-dark:#3B5642;--sage-tint:#DCE5DA;--gold:#C9A051;--terracotta-dark:#8F5241}
*{box-sizing:border-box}
html,body{height:100%}
body{margin:0;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:1.125rem;line-height:1.6;color:var(--text);background:var(--bg);display:grid;place-items:center;padding:24px}
.gate{width:100%;max-width:480px;background:#fff;border:1px solid #E4E1D8;border-radius:16px;padding:48px 44px;box-shadow:0 30px 60px -30px rgba(59,86,66,.3);position:relative;overflow:hidden}
.gate::before{content:'';position:absolute;inset:0 0 auto;height:6px;background:linear-gradient(90deg,var(--sage-tint),var(--sage) 60%,var(--gold))}
.gate__mark{display:inline-grid;place-items:center;width:44px;height:44px;border-radius:10px;background:var(--sage);color:var(--bg);font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:1.05rem;margin:0 0 28px}
.gate__eyebrow{font-family:'Space Grotesk',sans-serif;font-size:.8rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin:0 0 10px}
h1{font-family:'Space Grotesk',sans-serif;font-size:2.1rem;line-height:1.1;letter-spacing:-.03em;margin:0 0 28px;color:var(--text)}
label{display:block;font-weight:600;font-size:1rem;margin-bottom:8px}
input{width:100%;font:inherit;padding:14px 16px;border:1.5px solid #CFCBC0;border-radius:10px;background:var(--bg);color:var(--text)}
input:focus-visible{outline:3px solid var(--gold);outline-offset:2px;border-color:var(--sage)}
button{margin-top:18px;width:100%;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:1.1rem;padding:15px 20px;border:0;border-radius:10px;background:var(--sage);color:#fff;cursor:pointer;transition:background .2s}
button:hover{background:var(--sage-dark)}
button:focus-visible{outline:3px solid var(--gold);outline-offset:3px}
.gate__error{margin:0 0 18px;padding:12px 14px;border-radius:8px;background:#F0DED6;color:var(--terracotta-dark);font-size:1rem}
.gate__by{margin:28px 0 0;font-size:.95rem;color:var(--muted)}
.gate__by a{color:inherit}
@media (max-width:520px){.gate{padding:36px 24px}h1{font-size:1.75rem}}
</style>
</head>
<body>
<main class="gate">
<p class="gate__mark" aria-hidden="true">TL</p>
<p class="gate__eyebrow">Private</p>
<h1>Nucleus Security: A Starting ABX Hypothesis</h1>
${message}
<form method="post" action="/api/nucleus-auth">
<label for="password">Password</label>
<input id="password" name="password" type="password" autocomplete="current-password" required autofocus>
<button type="submit">View the page</button>
</form>
<p class="gate__by">Prepared by <a href="/">Tim LaBarge</a></p>
</main>
</body>
</html>`;
}
