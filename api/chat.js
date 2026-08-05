/**
 * Timbot chat endpoint.
 *
 * Streams a reply from Claude over SSE. The API key stays here and never
 * reaches the browser. The whole grounding corpus is sent as one static,
 * cached system block, so there is no retrieval step and nothing to go stale
 * against the site.
 */

import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from './_lib/knowledge.js';
import { parseMessages } from './_lib/validate.js';

const MODEL = 'claude-opus-5';

/** Thinking is on by default on this model and counts toward max_tokens. */
const MAX_TOKENS = 3000;

/**
 * Best-effort rate limiting. This is per serverless instance, so it is a speed
 * bump rather than a wall. Swap in Vercel KV or Upstash before this URL gets
 * any real traffic.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 40;
const hits = new Map();

function rateLimited(key) {
  const now = Date.now();
  const seen = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  seen.push(now);
  hits.set(key, seen);

  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (!times.some((t) => now - t < WINDOW_MS)) hits.delete(k);
    }
  }
  return seen.length > MAX_REQUESTS_PER_WINDOW;
}

function clientKey(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length) return fwd.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

function send(res, payload) {
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Use POST.' });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: 'Timbot is not configured yet.' });
  }
  if (rateLimited(clientKey(req))) {
    return res
      .status(429)
      .json({ error: "You've hit the limit for now. Try again in a few minutes." });
  }

  const parsed = parseMessages(req.body);
  if (parsed.error) return res.status(400).json({ error: parsed.error });

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  const client = new Anthropic();

  try {
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      // Medium rather than low. Low is faster and noticeably flatter, and a
      // persona bot that sounds bored is worse than one that takes an extra
      // beat. Thinking stays on, which is the default here and avoids the
      // tag-leak behaviour this model shows when thinking is disabled.
      output_config: { effort: 'medium' },
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: parsed.messages,
    });

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta' &&
        event.delta.text
      ) {
        send(res, { type: 'text', text: event.delta.text });
      }
    }

    const final = await stream.finalMessage();

    if (final.stop_reason === 'refusal') {
      send(res, {
        type: 'text',
        text: "I'm not going to take that one. Ask me something about Tim's work instead.",
      });
    }

    send(res, { type: 'done' });
    res.end();
  } catch (err) {
    console.error('[timbot]', err?.status || '', err?.message || err);

    const message =
      err?.status === 429
        ? "Timbot is busy at the moment. Give it a minute and try again."
        : "Something went wrong on my end. Try again, or email Tim at trlabarge@gmail.com.";

    if (res.headersSent) {
      send(res, { type: 'error', message });
      send(res, { type: 'done' });
      res.end();
    } else {
      res.status(500).json({ error: message });
    }
  }
}
