/**
 * Offline checks for the /nucleus password gate. No network, no Vercel.
 * Exercises the middleware and the login function directly, and checks that
 * the /payload and /nucleus sessions cannot open each other's page.
 *
 *   npm run nucleus:test
 */

import assert from 'node:assert/strict';
import middleware from '../middleware.js';
import login from '../api/nucleus-auth.js';
import { gate } from '../api/_lib/nucleus-gate.js';
import { gate as payloadGate } from '../api/_lib/payload-gate.js';

const PASSWORD = 'nucleus test password';
const PAYLOAD_PASSWORD = 'payload test password';
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

async function callLogin({ method = 'POST', body, ip = '198.51.100.1' } = {}) {
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

console.log('nucleus gate');

delete process.env.NUCLEUS_PAGE_PASSWORD;
process.env.PAYLOAD_PAGE_PASSWORD = PAYLOAD_PASSWORD;

await test('fails closed when the password is not configured', async () => {
  const cookie = `${gate.COOKIE_NAME}=${await gate.signSession('anything')}`;
  const res = await middleware(req('/nucleus', { cookie }));
  assert.equal(res.status, 401);
  assert.ok(!passes(res));
});

await test('login refuses when the password is not configured', async () => {
  const res = await callLogin({ body: { password: '' } });
  assert.equal(res.statusCode, 503);
  assert.equal(res.headers['set-cookie'], undefined);
});

process.env.NUCLEUS_PAGE_PASSWORD = PASSWORD;

await test('page request without a cookie gets the Nucleus password screen', async () => {
  const res = await middleware(req('/nucleus'));
  assert.equal(res.status, 401);
  const html = await res.text();
  assert.match(html, /<form method="post" action="\/api\/nucleus-auth">/);
  assert.match(html, /Nucleus Security/);
  assert.match(html, /noindex, nofollow/);
  assert.doesNotMatch(html, /Payload/);
  assert.doesNotMatch(html, /What I heard|Tier 1|Aviation/, 'no page copy on the gate');
  assert.equal(res.headers.get('x-robots-tag'), 'noindex, nofollow');
});

await test('every file under /nucleus is blocked without a cookie', async () => {
  for (const path of ['/nucleus/', '/nucleus/index.html', '/nucleus/nucleus.css', '/nucleus/nucleus.js']) {
    const res = await middleware(req(path, { accept: '*/*' }));
    assert.equal(res.status, 401, path);
    assert.ok(!passes(res), path);
  }
});

await test('the logo folder stays public for the password screen', async () => {
  assert.ok(passes(await middleware(req('/nucleus/brand/nucleus-logo.png', { accept: 'image/*' }))));
});

await test('nothing outside the logo folder is public', async () => {
  for (const path of ['/nucleus/brandx.png', '/nucleus/brand', '/payload/brand/../../nucleus/nucleus.css']) {
    const res = await middleware(req(path, { accept: 'image/*' }));
    assert.equal(res.status, 401, path);
  }
});

await test('a Payload session does not open /nucleus', async () => {
  const cookie = `${payloadGate.COOKIE_NAME}=${await payloadGate.signSession(PAYLOAD_PASSWORD)}`;
  assert.equal((await middleware(req('/nucleus', { cookie }))).status, 401);
});

await test('a Nucleus session does not open /payload', async () => {
  const cookie = `${gate.COOKIE_NAME}=${await gate.signSession(PASSWORD)}`;
  assert.equal((await middleware(req('/payload', { cookie }))).status, 401);
});

await test('a Payload-format cookie signed with the Nucleus password is rejected', async () => {
  const cookie = `${gate.COOKIE_NAME}=${await payloadGate.signSession(PASSWORD)}`;
  assert.equal((await middleware(req('/nucleus', { cookie }))).status, 401);
});

await test('wrong password redirects back with an error and no cookie', async () => {
  const res = await callLogin({ body: { password: 'nope' }, ip: '198.51.100.2' });
  assert.equal(res.statusCode, 303);
  assert.equal(res.headers.location, '/nucleus?error=1');
  assert.equal(res.headers['set-cookie'], undefined);
});

await test('right password sets a scoped browser-session cookie and opens the page', async () => {
  const res = await callLogin({ body: `password=${encodeURIComponent(PASSWORD)}`, ip: '198.51.100.3' });
  assert.equal(res.statusCode, 303);
  assert.equal(res.headers.location, '/nucleus');
  const cookie = res.headers['set-cookie'];
  assert.match(cookie, /^nucleus_plan_session=/);
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /Secure/);
  assert.match(cookie, /Path=\/nucleus;/);
  assert.doesNotMatch(cookie, /Max-Age|Expires/i);
  assert.ok(!cookie.includes(encodeURIComponent(PASSWORD)), 'never stores the password');
  const value = cookie.split(';')[0];
  for (const path of ['/nucleus', '/nucleus/nucleus.css', '/nucleus/nucleus.js']) {
    const ok = await middleware(req(path, { cookie: value }));
    assert.ok(passes(ok), path);
    assert.equal(ok.headers.get('cache-control'), 'private, no-store');
  }
});

await test('error flag shows the retry message', async () => {
  const html = await (await middleware(req('/nucleus?error=1'))).text();
  assert.match(html, /did not work/);
});

await test('repeated guesses get throttled', async () => {
  let last;
  for (let i = 0; i < 12; i++) last = await callLogin({ body: { password: PASSWORD }, ip: '198.51.100.9' });
  assert.equal(last.headers['set-cookie'], undefined);
  assert.equal(last.headers.location, '/nucleus?error=1');
});

await test('login only accepts POST', async () => {
  assert.equal((await callLogin({ method: 'GET' })).statusCode, 405);
});

console.log(`\n${passed} passed`);
