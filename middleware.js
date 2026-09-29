/**
 * Vercel Routing Middleware. Guards everything under /payload.
 *
 * Runs before Vercel's cache and static file serving, so a request without a
 * valid session never reaches the plan's HTML, CSS, or JS. Page requests get
 * the password screen at the same URL. Anything else gets a bare 401.
 *
 * Fails closed. If PAYLOAD_PAGE_PASSWORD is not set, nothing gets through.
 */

import { next } from '@vercel/functions';
import {
  COOKIE_NAME,
  PUBLIC_PREFIX,
  gateHtml,
  readCookie,
  verifySession,
} from './api/_lib/payload-gate.js';

export const config = {
  matcher: ['/payload', '/payload/:path*'],
};

const PRIVATE_HEADERS = {
  'Cache-Control': 'private, no-store',
  'X-Robots-Tag': 'noindex, nofollow',
};

export default async function middleware(request) {
  const url = new URL(request.url);

  if (url.pathname.startsWith(PUBLIC_PREFIX)) return next();

  const secret = process.env.PAYLOAD_PAGE_PASSWORD;
  const session = readCookie(request.headers.get('cookie'), COOKIE_NAME);
  if (secret && (await verifySession(secret, session))) {
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
