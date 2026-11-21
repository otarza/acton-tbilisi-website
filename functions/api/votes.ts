/** GET /api/votes?q=24 — vote counts for a weekly question, cached at the edge for 5 minutes. */
import { callSheets, json, type Ctx } from '../_lib/sheets';

export const onRequestGet = async ({ request, env, waitUntil }: Ctx) => {
  const q = Number(new URL(request.url).searchParams.get('q'));
  if (!Number.isInteger(q) || q < 1) return json({ counts: [] }, 400);

  const cache = (caches as unknown as { default: Cache }).default;
  const key = new Request(new URL(`/api/votes?q=${q}`, request.url).toString());
  const hit = await cache.match(key);
  if (hit) return hit;

  const result = await callSheets(env, { type: 'tally', question: q });
  if (!result.ok || result.mock) return json({ counts: [] }, result.mock ? 200 : 502);
  const res = json({ counts: result.data?.counts ?? [] }, 200, { 'cache-control': 'public, max-age=300' });
  waitUntil(cache.put(key, res.clone()));
  return res;
};
