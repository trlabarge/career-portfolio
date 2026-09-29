/**
 * Offline checks for the /payload password gate. No network, no Vercel.
 * Exercises the middleware and the login function directly.
 *
 *   npm run payload:test
 */

import assert from 'node:assert/strict';
import middleware from '../middleware.js';
import login from '../api/payload-auth.js';
import { COOKIE_NAME, MAX_AGE_MS, signSession, verifySession } from '../api/_lib/payload-gate.js';

const PASSWORD = 'correct horse battery staple';
let passed = 0;

async function test(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  ok  ${name}`);
  } catch (err) {
    console.error(`  FAIL ${name}\n${err.stack}`);
    process.exitCode = 1;
  }
}

function req(path, { cookie, accept = 'text/html', method = 'GET' } = {}) {
  const headers = new Headers({ accept });
  if (cookie) headers.set('cookie', cookie);
  return new Request(`https://timsmarketing.com${path}`, { method, headers });
}

const passes = (res) => res.headers.get('x-middleware-next') === '1';

/* Minimal stand-in for Vercel's Node request/response helpers. */
async function callLogin({ method = 'POST', body, ip = '203.0.113.1' } = {}) {
  const res = {
    statusCode: 200,
    headers: {},
    body: undefined,
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; return this; },
    status(code) { this.statusCode = code; return this; },
    end() { return this; },
    send(b) { this.body = b; return this; },
  };
  await login({ method, body, headers: { 'x-forwarded-for': ip } }, res);
  return res;
}

console.log('payload gate');

delete process.env.PAYLOAD_PAGE_PASSWORD;

await test('fails closed when the password is not configured', async () => {
  const cookie = `${COOKIE_NAME}=${await signSession('anything')}`;
  const res = await middleware(req('/payload', { cookie }));
  assert.equal(res.status, 401);
  assert.ok(!passes(res));
});

await test('login refuses when the password is not configured', async () => {
  const res = await callLogin({ body: { password: '' } });
  assert.equal(res.statusCode, 503);
  assert.equal(res.headers['set-cookie'], undefined);
});

process.env.PAYLOAD_PAGE_PASSWORD = PASSWORD;

await test('page request without a cookie gets the password screen', async () => {
  const res = await middleware(req('/payload'));
  assert.equal(res.status, 401);
  const html = await res.text();
  assert.match(html, /<form method="post" action="\/api\/payload-auth">/);
  assert.match(html, /noindex, nofollow/);
  assert.doesNotMatch(html, /Build the Engine|Must-have/, 'no plan copy on the gate');
  assert.equal(res.headers.get('cache-control'), 'private, no-store');
});

await test('every file under /payload is blocked without a cookie', async () => {
  for (const path of ['/payload/', '/payload/index.html', '/payload/payload.css', '/payload/payload.js']) {
    const res = await middleware(req(path, { accept: '*/*' }));
    assert.equal(res.status, 401, path);
    assert.ok(!passes(res), path);
  }
});

await test('the logo folder stays public for the password screen', async () => {
  assert.ok(passes(await middleware(req('/payload/brand/payload-logo.svg', { accept: 'image/*' }))));
});

await test('error flag shows the retry message', async () => {
  const html = await (await middleware(req('/payload?error=1'))).text();
  assert.match(html, /did not work/);
});

await test('a valid session passes through with private headers', async () => {
  const cookie = `other=1; ${COOKIE_NAME}=${encodeURIComponent(await signSession(PASSWORD))}`;
  for (const path of ['/payload', '/payload/payload.css']) {
    const res = await middleware(req(path, { cookie }));
    assert.ok(passes(res), path);
    assert.equal(res.headers.get('cache-control'), 'private, no-store');
  }
});

await test('a session signed with an old password is rejected', async () => {
  const cookie = `${COOKIE_NAME}=${await signSession('old password')}`;
  assert.equal((await middleware(req('/payload', { cookie }))).status, 401);
});

await test('a tampered or expired session is rejected', async () => {
  const good = await signSession(PASSWORD);
  const [ts, mac] = good.split('.');
  assert.equal(await verifySession(PASSWORD, `${Number(ts) + 1}.${mac}`), false);
  assert.equal(await verifySession(PASSWORD, `${ts}.${mac.slice(0, -1)}x`), false);
  assert.equal(await verifySession(PASSWORD, 'garbage'), false);
  const stale = await signSession(PASSWORD, Date.now() - MAX_AGE_MS - 1000);
  assert.equal(await verifySession(PASSWORD, stale), false);
});

await test('wrong password redirects back with an error and no cookie', async () => {
  const res = await callLogin({ body: { password: 'nope' }, ip: '203.0.113.2' });
  assert.equal(res.statusCode, 303);
  assert.equal(res.headers.location, '/payload?error=1');
  assert.equal(res.headers['set-cookie'], undefined);
});

await test('right password sets a browser-session cookie and redirects', async () => {
  const res = await callLogin({ body: `password=${encodeURIComponent(PASSWORD)}`, ip: '203.0.113.3' });
  assert.equal(res.statusCode, 303);
  assert.equal(res.headers.location, '/payload');
  const cookie = res.headers['set-cookie'];
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /Secure/);
  assert.match(cookie, /SameSite=Lax/);
  assert.match(cookie, /Path=\/payload/);
  assert.doesNotMatch(cookie, /Max-Age|Expires/i, 'must end with the browser session');
  assert.ok(!cookie.includes(encodeURIComponent(PASSWORD)), 'never stores the password');
  const value = cookie.split(';')[0];
  assert.ok(passes(await middleware(req('/payload', { cookie: value }))));
});

await test('repeated guesses get throttled', async () => {
  let last;
  for (let i = 0; i < 12; i++) last = await callLogin({ body: { password: PASSWORD }, ip: '203.0.113.9' });
  assert.equal(last.headers['set-cookie'], undefined);
  assert.equal(last.headers.location, '/payload?error=1');
});

await test('login only accepts POST', async () => {
  assert.equal((await callLogin({ method: 'GET' })).statusCode, 405);
});

console.log(`\n${passed} passed`);
