/** POST /api/feedback — "was this article helpful? yes/no" → Google Sheet tab "Article feedback". */
import { callSheets, clean, json, sameOrigin, type Ctx } from '../_lib/sheets';

export const onRequestPost = async ({ request, env }: Ctx) => {
  if (!sameOrigin(request)) return json({ ok: false }, 403);
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return json({ ok: false }, 400); }
  const article = clean(body.article, 120);
  const helpful = body.helpful === true ? 'yes' : body.helpful === false ? 'no' : '';
  if (!/^[a-z0-9-]+$/.test(article) || !helpful) return json({ ok: false }, 422);
  const result = await callSheets(env, { type: 'feedback', article, helpful });
  return json({ ok: result.ok }, result.ok ? 200 : 502);
};
