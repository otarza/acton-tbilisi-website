/**
 * Shared helpers for Cloudflare Pages Functions.
 * All form data is forwarded to a Google Apps Script web app that writes rows into a Google Sheet
 * (free, no Google Cloud billing account needed). See docs/BACKEND.md and google/apps-script/Code.gs.
 */
export interface Env {
  SHEETS_WEBHOOK_URL?: string;
  SHEETS_WEBHOOK_SECRET?: string;
}

export type Ctx = { request: Request; env: Env; waitUntil: (p: Promise<unknown>) => void };

export const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', ...headers } });

/** Only accept requests from our own pages (same origin) to make abuse a little harder. */
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true; // some privacy browsers drop it; the honeypot + validation still apply
  return new URL(origin).host === new URL(request.url).host;
}

export const clean = (v: unknown, max: number) => String(v ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max);

/** Sheets treats values starting with = + - @ as formulas. Prefix them so a form can't inject one. */
export const safeCell = (v: string) => (/^[=+\-@]/.test(v) ? `'${v}` : v);

export async function callSheets(env: Env, payload: Record<string, unknown>): Promise<{ ok: boolean; mock?: boolean; data?: any }> {
  if (!env.SHEETS_WEBHOOK_URL || !env.SHEETS_WEBHOOK_SECRET) {
    // Not configured (local dev or a fresh preview): pretend it worked so the UI can be tested.
    console.log('[sheets:mock]', JSON.stringify(payload));
    return { ok: true, mock: true };
  }
  const res = await fetch(env.SHEETS_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'content-type': 'text/plain;charset=utf-8' }, // Apps Script reads e.postData.contents
    body: JSON.stringify({ ...payload, secret: env.SHEETS_WEBHOOK_SECRET }),
    redirect: 'follow',
  });
  if (!res.ok) return { ok: false };
  const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
  return { ok: !!data?.ok, data };
}
