/**
 * Offline checks for the /magicare password gate. No network, no Vercel.
 * Exercises the middleware and the login function directly, and checks that
 * no other plan page's session opens /magicare, or the reverse.
 *
 *   npm run magicare:test
 */

import assert from 'node:assert/strict';
import middleware from '../middleware.js';
import login from '../api/magicare-auth.js';
import { gate } from '../api/_lib/magicare-gate.js';
import { gate as payloadGate } from '../api/_lib/payload-gate.js';
import { gate as nucleusGate } from '../api/_lib/nucleus-gate.js';

const PASSWORD = 'magicare test password';
const PAYLOAD_PASSWORD = 'payload test password';
const NUCLEUS_PASSWORD = 'nucleus test password';
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

console.log('magicare gate');

delete process.env.MAGICARE_PAGE_PASSWORD;
process.env.PAYLOAD_PAGE_PASSWORD = PAYLOAD_PASSWORD;
process.env.NUCLEUS_PAGE_PASSWORD = NUCLEUS_PASSWORD;

await test('fails closed when the password is not configured', async () => {
  const cookie = `${gate.COOKIE_NAME}=${await gate.signSession('anything')}`;
  const res = await middleware(req('/magicare', { cookie }));
  assert.equal(res.status, 401);
  assert.ok(!passes(res));
});

await test('login refuses when the password is not configured', async () => {
  const res = await callLogin({ body: { password: '' } });
  assert.equal(res.statusCode, 503);
  assert.equal(res.headers['set-cookie'], undefined);
});

process.env.MAGICARE_PAGE_PASSWORD = PASSWORD;

await test('page request without a cookie gets the Magicare password screen', async () => {
  const res = await middleware(req('/magicare'));
  assert.equal(res.status, 401);
  const html = await res.text();
  assert.match(html, /<form method="post" action="\/api\/magicare-auth">/);
  assert.match(html, /Magicare: Three Ideas/);
  assert.match(html, /noindex, nofollow/);
  assert.doesNotMatch(html, /Payload|Nucleus/);
  assert.doesNotMatch(html, /benchmark|scorecard|Daniel/i, 'no page copy on the gate');
  assert.equal(res.headers.get('x-robots-tag'), 'noindex, nofollow');
});

await test('every file under /magicare is blocked without a cookie', async () => {
  for (const path of ['/magicare/', '/magicare/index.html', '/magicare/brand/x.png']) {
    const res = await middleware(req(path, { accept: '*/*' }));
    assert.equal(res.status, 401, path);
    assert.ok(!passes(res), path);
  }
});

await test('Payload and Nucleus sessions do not open /magicare', async () => {
  for (const [g, pw] of [[payloadGate, PAYLOAD_PASSWORD], [nucleusGate, NUCLEUS_PASSWORD]]) {
    const cookie = `${g.COOKIE_NAME}=${await g.signSession(pw)}`;
    assert.equal((await middleware(req('/magicare', { cookie }))).status, 401, g.path);
  }
});

await test('a Magicare session does not open /payload or /nucleus', async () => {
  const cookie = `${gate.COOKIE_NAME}=${await gate.signSession(PASSWORD)}`;
  for (const path of ['/payload', '/nucleus']) {
    assert.equal((await middleware(req(path, { cookie }))).status, 401, path);
  }
});

await test('wrong password redirects back with an error and no cookie', async () => {
  const res = await callLogin({ body: { password: 'nope' }, ip: '198.51.100.2' });
  assert.equal(res.statusCode, 303);
  assert.equal(res.headers.location, '/magicare?error=1');
  assert.equal(res.headers['set-cookie'], undefined);
});

await test('right password sets a scoped browser-session cookie and opens the page', async () => {
  const res = await callLogin({ body: `password=${encodeURIComponent(PASSWORD)}`, ip: '198.51.100.3' });
  assert.equal(res.statusCode, 303);
  assert.equal(res.headers.location, '/magicare');
  const cookie = res.headers['set-cookie'];
  assert.match(cookie, /^magicare_plan_session=/);
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /Secure/);
  assert.match(cookie, /Path=\/magicare;/);
  assert.doesNotMatch(cookie, /Max-Age|Expires/i);
  assert.ok(!cookie.includes(encodeURIComponent(PASSWORD)), 'never stores the password');
  const value = cookie.split(';')[0];
  for (const path of ['/magicare', '/magicare/index.html']) {
    const ok = await middleware(req(path, { cookie: value }));
    assert.ok(passes(ok), path);
    assert.equal(ok.headers.get('cache-control'), 'private, no-store');
  }
});

await test('error flag shows the retry message', async () => {
  const html = await (await middleware(req('/magicare?error=1'))).text();
  assert.match(html, /did not work/);
});

await test('repeated guesses get throttled', async () => {
  let last;
  for (let i = 0; i < 12; i++) last = await callLogin({ body: { password: PASSWORD }, ip: '198.51.100.9' });
  assert.equal(last.headers['set-cookie'], undefined);
  assert.equal(last.headers.location, '/magicare?error=1');
});

console.log(`\n${passed} passed`);
