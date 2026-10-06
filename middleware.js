/**
 * Vercel Routing Middleware. Guards everything under /payload and /nucleus.
 *
 * Runs before Vercel's cache and static file serving, so a request without a
 * valid session never reaches a plan's HTML, CSS, or JS. Page requests get
 * the password screen at the same URL. Anything else gets a bare 401.
 *
 * Each page has its own password env var and cookie, so a session for one
 * never opens the other.
 *
 * Fails closed. If a page's password env var is not set, nothing gets through.
 */

import { next } from '@vercel/functions';
import { readCookie } from './api/_lib/plan-gate.js';
import * as payload from './api/_lib/payload-gate.js';
import * as nucleus from './api/_lib/nucleus-gate.js';

export const config = {
  matcher: ['/payload', '/payload/:path*', '/nucleus', '/nucleus/:path*'],
};

const GATES = [payload, nucleus];

const PRIVATE_HEADERS = {
  'Cache-Control': 'private, no-store',
  'X-Robots-Tag': 'noindex, nofollow',
};

function gateFor(pathname) {
  return GATES.find(({ gate }) => pathname === gate.path || pathname.startsWith(`${gate.path}/`));
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const page = gateFor(url.pathname);

  /* The matcher only sends gated paths here, but fail closed regardless. */
  if (!page) {
    return new Response('Not found', { status: 404, headers: PRIVATE_HEADERS });
  }
  const { gate, gateHtml } = page;

  if (gate.PUBLIC_PREFIX && url.pathname.startsWith(gate.PUBLIC_PREFIX)) return next();

  const secret = process.env[gate.envVar];
  const session = readCookie(request.headers.get('cookie'), gate.COOKIE_NAME);
  if (secret && (await gate.verifySession(secret, session))) {
    return next({ headers: PRIVATE_HEADERS });
  }

  const wantsPage =
    request.method === 'GET' &&
    (request.headers.get('accept') || '').includes('text/html');

  if (!wantsPage) {
    return new Response('Unauthorized', {
      status: 401,
      headers: { ...PRIVATE_HEADERS, 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  return new Response(gateHtml({ error: url.searchParams.has('error') }), {
    status: 401,
    headers: { ...PRIVATE_HEADERS, 'Content-Type': 'text/html; charset=utf-8' },
  });
}
