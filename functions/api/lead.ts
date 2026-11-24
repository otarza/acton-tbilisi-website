/**
 * POST /api/lead — "book a meeting" form → Google Sheet tab "Leads" (+ optional email to the school).
 * With `type: "club"` (the /clubs sign-up form) → tab "Club signups": chosen clubs, child age 5–17, our school / other school.
 */
import { callSheets, clean, json, safeCell, sameOrigin, type Ctx } from '../_lib/sheets';

export const onRequestPost = async ({ request, env }: Ctx) => {
  if (!sameOrigin(request)) return json({ ok: false, error: 'origin' }, 403);
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return json({ ok: false, error: 'bad-json' }, 400); }

  // Spam traps: hidden "website" field must be empty and a human needs >2s to fill the form.
  if (clean(body.website, 200) || Number(body.elapsedMs ?? 9999) < 2000) return json({ ok: true });

  const name = clean(body.name, 80);
  const phone = clean(body.phone, 30);
  const childAge = clean(body.childAge, 3);
  if (!name || !/^[+\d][\d\s()-]{5,}$/.test(phone) || !body.consent) return json({ ok: false, error: 'invalid' }, 422);

  if (body.type === 'club') {
    const clubs = (Array.isArray(body.clubs) ? body.clubs : []).slice(0, 20).map((c) => clean(c, 60)).filter(Boolean);
    const age = Number(childAge);
    if (childAge && !(age >= 5 && age <= 17)) return json({ ok: false, error: 'invalid' }, 422);
    const result = await callSheets(env, {
      type: 'club',
      name: safeCell(name),
      phone: safeCell(phone),
      childAge,
      school: body.school === 'other' ? 'other' : 'ours',
      clubs: safeCell(clubs.join(', ')),
      clubCount: clubs.length,
      source: clean(body.source, 40),
      page: clean(body.page, 120),
    });
    return result.ok ? json({ ok: true, mock: result.mock }) : json({ ok: false, error: 'upstream' }, 502);
  }

  const row = {
    type: 'lead',
    name: safeCell(name),
    phone: safeCell(phone),
    childAge,
    preferredTime: safeCell(clean(body.preferredTime, 80)),
    source: clean(body.source, 40),
    page: clean(body.page, 120),
  };
  const result = await callSheets(env, row);
  return result.ok ? json({ ok: true, mock: result.mock }) : json({ ok: false, error: 'upstream' }, 502);
};
