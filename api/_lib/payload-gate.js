/**
 * Shared pieces for the password-protected /payload page.
 *
 * Imported by both the Routing Middleware (/middleware.js, edge runtime) and
 * the login function (/api/payload-auth.js, Node runtime), so everything here
 * uses Web Crypto and plain strings that exist in both.
 *
 * The cookie never holds the password. It holds an issue time and an HMAC of
 * that time keyed by the password, so changing PAYLOAD_PAGE_PASSWORD in Vercel
 * invalidates every existing session at once.
 */

export const COOKIE_NAME = 'payload_plan_session';

/** Hard server-side cap, on top of the cookie being a browser-session cookie. */
export const MAX_AGE_MS = 12 * 60 * 60 * 1000;

/** Files anyone may fetch without a session. The logo only, never plan copy. */
export const PUBLIC_PREFIX = '/payload/brand/';

const encoder = new TextEncoder();

function toBase64Url(bytes) {
  let bin = '';
  for (const b of new Uint8Array(bytes)) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function hmac(secret, message) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return toBase64Url(await crypto.subtle.sign('HMAC', key, encoder.encode(message)));
}

/** Length-independent comparison, so a mismatch does not leak where it differs. */
export function safeEqual(a, b) {
  const x = encoder.encode(String(a));
  const y = encoder.encode(String(b));
  let diff = x.length ^ y.length;
  const len = Math.max(x.length, y.length);
  for (let i = 0; i < len; i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

export async function signSession(secret, now = Date.now()) {
  const issued = String(now);
  return `${issued}.${await hmac(secret, `payload-plan:${issued}`)}`;
}

export async function verifySession(secret, value, now = Date.now()) {
  if (!secret || typeof value !== 'string') return false;
  const dot = value.indexOf('.');
  if (dot < 1) return false;
  const issued = value.slice(0, dot);
  if (!/^\d{10,16}$/.test(issued)) return false;
  const age = now - Number(issued);
  if (age < 0 || age > MAX_AGE_MS) return false;
  return safeEqual(value.slice(dot + 1), await hmac(secret, `payload-plan:${issued}`));
}

export function readCookie(header, name) {
  if (!header) return null;
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) return decodeURIComponent(part.slice(eq + 1).trim());
  }
  return null;
}

/**
 * No Max-Age or Expires, so the browser drops it when it closes. Scoped to
 * /payload so it is never sent with requests for the rest of the portfolio.
 */
export function sessionCookie(value) {
  return `${COOKIE_NAME}=${encodeURIComponent(value)}; Path=/payload; HttpOnly; Secure; SameSite=Lax`;
}

/**
 * The password screen. Self-contained so it needs no file behind the gate.
 * It carries a title and no share image, so a pasted link previews as the
 * plan's name and nothing else.
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
<title>Payload 12-month marketing plan</title>
<meta property="og:title" content="Payload 12-month marketing plan">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="Payload 12-month marketing plan">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='7' fill='%234A6B52'/><text x='16' y='22' font-family='Arial,sans-serif' font-size='15' font-weight='bold' text-anchor='middle' fill='%23FAF9F6'>TL</text></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap">
<style>
:root{--bg:#FAF9F6;--text:#2B2B2B;--muted:#5A5A56;--slate:#2F4760;--slate-dark:#22364B;--slate-tint:#E3E9EF;--gold:#C9A051;--terracotta-dark:#8F5241;--cream:#F2EFE7}
*{box-sizing:border-box}
html,body{height:100%}
body{margin:0;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:1.125rem;line-height:1.6;color:var(--text);background:var(--bg);display:grid;place-items:center;padding:24px}
.gate{width:100%;max-width:480px;background:#fff;border:1px solid #E4E1D8;border-radius:16px;padding:48px 44px;box-shadow:0 30px 60px -30px rgba(34,54,75,.25);position:relative;overflow:hidden}
.gate::before{content:'';position:absolute;inset:0 0 auto;height:6px;background:linear-gradient(90deg,var(--slate-tint),var(--slate) 60%,var(--gold))}
.gate__brand{display:flex;align-items:center;gap:10px;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:1.5rem;letter-spacing:-.02em;color:var(--slate-dark);margin:0 0 28px}
.gate__brand img{height:48px;width:auto;display:block;border-radius:10px}
.gate__eyebrow{font-family:'Space Grotesk',sans-serif;font-size:.8rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin:0 0 10px}
h1{font-family:'Space Grotesk',sans-serif;font-size:2.1rem;line-height:1.1;letter-spacing:-.03em;margin:0 0 28px;color:var(--text)}
label{display:block;font-weight:600;font-size:1rem;margin-bottom:8px}
input{width:100%;font:inherit;padding:14px 16px;border:1.5px solid #CFCBC0;border-radius:10px;background:var(--bg);color:var(--text)}
input:focus-visible{outline:3px solid var(--gold);outline-offset:2px;border-color:var(--slate)}
button{margin-top:18px;width:100%;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:1.1rem;padding:15px 20px;border:0;border-radius:10px;background:var(--slate);color:#fff;cursor:pointer;transition:background .2s}
button:hover{background:var(--slate-dark)}
button:focus-visible{outline:3px solid var(--gold);outline-offset:3px}
.gate__error{margin:0 0 18px;padding:12px 14px;border-radius:8px;background:#F0DED6;color:var(--terracotta-dark);font-size:1rem}
.gate__by{margin:28px 0 0;font-size:.95rem;color:var(--muted)}
.gate__by a{color:inherit}
@media (max-width:520px){.gate{padding:36px 24px}h1{font-size:1.75rem}}
</style>
</head>
<body>
<main class="gate">
<p class="gate__brand"><img src="/payload/brand/payload-logo.png" alt="Payload" onerror="this.replaceWith(document.createTextNode('Payload'))"></p>
<p class="gate__eyebrow">Private</p>
<h1>Payload 12-Month Marketing Plan</h1>
${message}
<form method="post" action="/api/payload-auth">
<label for="password">Password</label>
<input id="password" name="password" type="password" autocomplete="current-password" required autofocus>
<button type="submit">View the plan</button>
</form>
<p class="gate__by">Prepared by <a href="/">Tim LaBarge</a></p>
</main>
</body>
</html>`;
}
