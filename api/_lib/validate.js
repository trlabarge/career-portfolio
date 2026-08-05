/**
 * Request validation for the chat endpoint.
 *
 * Split out from chat.js so it can be exercised without an API key. Everything
 * arriving from the browser is untrusted, so this rebuilds the message list
 * from scratch rather than forwarding what was sent.
 */

export const MAX_MESSAGES = 24;
export const MAX_CHARS_PER_MESSAGE = 2000;
export const MAX_TOTAL_CHARS = 24000;

export function parseMessages(body) {
  if (!body || !Array.isArray(body.messages)) {
    return { error: 'Expected a messages array.' };
  }

  const messages = [];

  for (const m of body.messages.slice(-MAX_MESSAGES)) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant')) continue;
    if (typeof m.content !== 'string') continue;

    const content = m.content.trim().slice(0, MAX_CHARS_PER_MESSAGE);
    if (!content) continue;

    // Rebuilt object. Anything else the caller attached is dropped here.
    messages.push({ role: m.role, content });
  }

  // Drop the oldest turns until the conversation fits the budget. Trimming
  // beats erroring, since a visitor deep in a good conversation should not be
  // told to start over.
  let total = messages.reduce((sum, m) => sum + m.content.length, 0);
  while (messages.length > 1 && total > MAX_TOTAL_CHARS) {
    total -= messages.shift().content.length;
  }

  // The API rejects a history that opens on an assistant turn or ends on
  // anything other than the user, so normalise both ends.
  while (messages.length && messages[0].role !== 'user') messages.shift();

  if (!messages.length) return { error: 'No message to answer.' };
  if (messages[messages.length - 1].role !== 'user') {
    return { error: 'The last message needs to be from you.' };
  }

  return { messages };
}
