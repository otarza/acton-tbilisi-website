/** POST /api/subscribe — weekly email sign-up (articles page) → Google Sheet tab "Subscribers". */
import { callSheets, clean, json, safeCell, sameOrigin, type Ctx } from '../_lib/sheets';

export const onRequestPost = async ({ request, env }: Ctx) => {
  if (!sameOrigin(request)) return json({ ok: false, error: 'origin' }, 403);
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return json({ ok: false, error: 'bad-json' }, 400); }
  if (clean(body.website, 200) || Number(body.elapsedMs ?? 9999) < 1500) return json({ ok: true }); // spam traps
  const email = clean(body.email, 120).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ ok: false, error: 'invalid' }, 422);
  const result = await callSheets(env, { type: 'subscribe', email: safeCell(email), page: clean(body.page, 120) });
  return result.ok ? json({ ok: true, mock: result.mock }) : json({ ok: false, error: 'upstream' }, 502);
};
