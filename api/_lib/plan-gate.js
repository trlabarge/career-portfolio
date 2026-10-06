/**
 * Shared machinery for the password-protected plan pages (/payload, /nucleus).
 *
 * Imported by the Routing Middleware (/middleware.js, edge runtime) and the
 * login functions (/api/*-auth.js, Node runtime), so everything here uses Web
 * Crypto and plain strings that exist in both.
 *
 * Each page gets its own gate: its own env var password, its own cookie, and
 * its own HMAC label, so a session for one page never opens another.
 *
 * The cookie never holds the password. It holds an issue time and an HMAC of
 * that time keyed by the password, so changing the env var in Vercel
 * invalidates every existing session for that page at once.
 */

/** Hard server-side cap, on top of the cookie being a browser-session cookie. */
export const MAX_AGE_MS = 12 * 60 * 60 * 1000;

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
 * Builds the session helpers for one page.
 *
 *   path        the page's URL, e.g. '/payload'. Also the cookie Path.
 *   cookieName  the session cookie's name.
 *   label       HMAC prefix. Keep it stable or every session is logged out.
 *   envVar      name of the Vercel env var holding the password.
 *   publicPrefix  optional folder anyone may fetch (a logo for the gate).
 */
export function makeGate({ path, cookieName, label, envVar, publicPrefix = null }) {
  async function signSession(secret, now = Date.now()) {
    const issued = String(now);
    return `${issued}.${await hmac(secret, `${label}:${issued}`)}`;
  }

  async function verifySession(secret, value, now = Date.now()) {
    if (!secret || typeof value !== 'string') return false;
    const dot = value.indexOf('.');
    if (dot < 1) return false;
    const issued = value.slice(0, dot);
    if (!/^\d{10,16}$/.test(issued)) return false;
    const age = now - Number(issued);
    if (age < 0 || age > MAX_AGE_MS) return false;
    return safeEqual(value.slice(dot + 1), await hmac(secret, `${label}:${issued}`));
  }

  /**
   * No Max-Age or Expires, so the browser drops it when it closes. Scoped to
   * the page's path so it is never sent with requests for the rest of the
   * portfolio.
   */
  function sessionCookie(value) {
    return `${cookieName}=${encodeURIComponent(value)}; Path=${path}; HttpOnly; Secure; SameSite=Lax`;
  }

  return {
    path,
    envVar,
    COOKIE_NAME: cookieName,
    PUBLIC_PREFIX: publicPrefix,
    signSession,
    verifySession,
    sessionCookie,
  };
}

/** Per-instance speed bump against guessing, same approach as /api/chat. */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;

function clientKey(req) {
  const fwd = req.headers['x-forwarded-for'];
  return (typeof fwd === 'string' && fwd.split(',')[0].trim()) || 'unknown';
}

function readPassword(body) {
  if (body && typeof body === 'object') return String(body.password ?? '');
  if (typeof body === 'string') return new URLSearchParams(body).get('password') ?? '';
  return '';
}

function redirect(res, location) {
  res.setHeader('Location', location);
  res.setHeader('Cache-Control', 'no-store');
  return res.status(303).end();
}

/**
 * The login function for one gate. A plain form POST, so it works with no
 * JavaScript. On the right password it sets the signed session cookie and
 * sends the visitor to the page, where the middleware lets them through. On
 * the wrong one it sends them back to the password screen with an error flag.
 * Each gate keeps its own attempt counter.
 */
export function makeLoginHandler(gate) {
  const attempts = new Map();

  function tooMany(key) {
    const now = Date.now();
    const seen = (attempts.get(key) || []).filter((t) => now - t < WINDOW_MS);
    seen.push(now);
    attempts.set(key, seen);
    if (attempts.size > 5000) attempts.clear();
    return seen.length > MAX_ATTEMPTS;
  }

  return async function handler(req, res) {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).end();
    }

    const secret = process.env[gate.envVar];
    if (!secret) return res.status(503).send('This page is not configured yet.');

    if (tooMany(clientKey(req))) return redirect(res, `${gate.path}?error=1`);

    if (!safeEqual(readPassword(req.body), secret)) {
      return redirect(res, `${gate.path}?error=1`);
    }

    res.setHeader('Set-Cookie', gate.sessionCookie(await gate.signSession(secret)));
    return redirect(res, gate.path);
  };
}
