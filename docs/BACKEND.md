# Backend: forms, votes, newsletter

```
browser ──POST /api/lead──────▶ Cloudflare Pages Function ──HTTPS──▶ Google Apps Script web app ──▶ Google Sheet
        ──POST /api/vote──────▶   (functions/api/*.ts)                 (google/apps-script/Code.gs)     tabs "Leads", "Club signups", "Votes",
        ──GET  /api/votes─────▶   cached 5 min at the edge                                               "Subscribers",
        ──POST /api/subscribe─▶   weekly email sign-up (articles page)                                   "Article feedback"
        ──POST /api/feedback──▶   "was this article helpful?" yes/no                                     (+ optional email)
```

Sending the weekly email itself is not automated: export the "Subscribers" tab into the school's mail tool
(or Gmail) each Friday. Remove a row (or set Status = unsubscribed) when someone asks to unsubscribe.

## Why this setup
You asked for "GC free tier" for form data. We use **Google Sheets + Apps Script**, which is free with any Google
account and needs **no Google Cloud billing account**. Google Cloud Functions / Cloud Run / Firestore also have free
tiers, but they require enabling billing (a card on file), a GCP project and service-account keys: more to manage,
and a mis-configuration can cost money. Sheets is also where school staff can actually read and follow up leads.

The small API layer runs on **Cloudflare Pages Functions** (same repo, same deploy, free: 100,000 requests/day).
It validates input, blocks simple spam (honeypot + timing + same-origin), escapes spreadsheet formulas,
and keeps the Apps Script URL and secret off the public page.

If the school later outgrows Sheets, `functions/_lib/sheets.ts` is the only file to change (e.g. to Cloudflare D1,
Firestore or a CRM).

## What is collected (privacy)
Lead form: parent name, phone, child's age, optional preferred time, which form, which page. **No child name.**
A consent checkbox is required.
Club sign-up (`/clubs#join`, same `/api/lead` endpoint with `type: "club"`): chosen clubs, parent name, phone,
child's age (5–17), our school / other school. **No child name.** Consent checkbox required. Rows go to the
"Club signups" tab (created automatically). Votes: question number + option index only, no personal data.
The privacy text on `/about#privacy` describes this; keep it in sync if you add fields.

## Setup (once, ~10 minutes)
1. In the school's Google account create a Google Sheet, e.g. **"Acton website – forms"**.
2. In the sheet: **Extensions → Apps Script**. Delete the sample code, paste `google/apps-script/Code.gs`, save.
3. **Project Settings (gear) → Script properties → Add**:
   - `SECRET` = a long random string (e.g. from a password generator)
   - `NOTIFY_EMAIL` = optional, gets an email for each new lead
4. **Deploy → New deployment → Select type: Web app**. Execute as **Me**, Who has access **Anyone** → Deploy →
   authorise → copy the **Web app URL** (`https://script.google.com/macros/s/…/exec`).
5. Cloudflare dashboard → **Workers & Pages → acton-tbilisi-website → Settings → Variables and secrets** → add
   for **Production** (and Preview if you want previews to write to the sheet):
   - `SHEETS_WEBHOOK_URL` = the Web app URL
   - `SHEETS_WEBHOOK_SECRET` = the same SECRET (type: Secret)
6. Redeploy (or push any commit). Submit the form on the site; a row appears in the "Leads" tab.

> **Club sign-ups (added 2026-11-24) need a Code.gs redeploy.** Until the new `Code.gs` is pasted into Apps Script
> and deployed as a new version, the old script answers `unknown-type` for `type: "club"` and the form shows its
> error message (with the phone number).

When you change `Code.gs`, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.

## Without configuration
If the two variables are missing (local dev, a new preview), the functions log the payload and answer
`{ ok: true, mock: true }`, so the UI can be tested. Votes then show the fallback `results` from the question file.

## Local testing
`cp .dev.vars.example .dev.vars` (fill in to hit a real sheet, or leave missing for mock mode), then `npm run dev:full`
→ http://localhost:8788.

## Limits
Apps Script: ~20,000 URL calls/day and 30 simultaneous executions on a free account; far above a school site's needs.
Votes are de-duplicated per browser (localStorage), not per person — fine for a fun poll, not for decisions.
Optional hardening: add Cloudflare Turnstile to the lead form if spam appears.
