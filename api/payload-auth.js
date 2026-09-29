/**
 * Login for the /payload page.
 *
 * A plain form POST, so it works with no JavaScript. On the right password it
 * sets a signed, HttpOnly, browser-session cookie and sends the visitor to
 * /payload, where the middleware lets them through. On the wrong one it sends
 * them back to the password screen with an error flag.
 */

import { safeEqual, sessionCookie, signSession } from './_lib/payload-gate.js';

/** Per-instance speed bump against guessing, same approach as /api/chat. */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const attempts = new Map();

function tooMany(key) {
  const now = Date.now();
  const seen = (attempts.get(key) || []).filter((t) => now - t < WINDOW_MS);
  seen.push(now);
  attempts.set(key, seen);
  if (attempts.size > 5000) attempts.clear();
  return seen.length > MAX_ATTEMPTS;
}

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  const secret = process.env.PAYLOAD_PAGE_PASSWORD;
  if (!secret) return res.status(503).send('This page is not configured yet.');

  if (tooMany(clientKey(req))) return redirect(res, '/payload?error=1');

  if (!safeEqual(readPassword(req.body), secret)) {
    return redirect(res, '/payload?error=1');
  }

  res.setHeader('Set-Cookie', sessionCookie(await signSession(secret)));
  return redirect(res, '/payload');
}
