/** POST /api/vote — one vote on the weekly question → Google Sheet tab "Votes". */
import { callSheets, json, sameOrigin, type Ctx } from '../_lib/sheets';

export const onRequestPost = async ({ request, env }: Ctx) => {
  if (!sameOrigin(request)) return json({ ok: false }, 403);
  let body: { question?: unknown; option?: unknown };
  try { body = await request.json(); } catch { return json({ ok: false }, 400); }
  const question = Number(body.question);
  const option = Number(body.option);
  if (!Number.isInteger(question) || question < 1 || question > 9999 || !Number.isInteger(option) || option < 0 || option > 3) {
    return json({ ok: false }, 422);
  }
  const result = await callSheets(env, { type: 'vote', question, option });
  return json({ ok: result.ok }, result.ok ? 200 : 502);
};
