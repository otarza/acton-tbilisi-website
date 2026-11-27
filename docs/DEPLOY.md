# Deploy: GitHub → Cloudflare Pages

The live site is **https://actonsaburtalo.edu.ge** (and `www.`), served by the Cloudflare Pages project
`acton-tbilisi-website` (also at `https://acton-tbilisi-website.pages.dev`).

## How it is set up (done 2026-11-21)
- **Domain:** `actonsaburtalo.edu.ge` is registered at Grena (my.grena.ge → დომენები). Its nameservers point to
  Cloudflare (`coco.ns.cloudflare.com`, `salvador.ns.cloudflare.com`), so all DNS is managed in Cloudflare
  (Free plan zone). Grena is only the registrar now; renew the domain there (next: 2027-11-17).
- **Pages project:** Workers & Pages → `acton-tbilisi-website`, connected to GitHub `otarza/acton-tbilisi-website`
  through the "Cloudflare Workers and Pages" GitHub app (installed on this one repository only).
  - Framework preset **Astro**, build command `npm run build`, output directory `dist`.
  - Production branch `main`.
  - Build variables: `NODE_VERSION` = `22`, `SITE_URL` = `https://actonsaburtalo.edu.ge`.
- **Custom domains:** Pages project → Custom domains → `actonsaburtalo.edu.ge` and `www.actonsaburtalo.edu.ge`
  (Cloudflare created the CNAME records to `acton-tbilisi-website.pages.dev` itself).

## Still to do
- **Form secrets:** the forms (`/api/lead`, `/api/subscribe`, `/api/feedback`, `/api/vote`) need the Google Apps
  Script webhook. Until it is set, the forms still say "thank you" but **submissions are only logged and then
  lost** (`functions/_lib/sheets.ts` mock mode), so set it before announcing the site. When it exists, follow `docs/BACKEND.md` and add
  `SHEETS_WEBHOOK_URL` and `SHEETS_WEBHOOK_SECRET` under Pages project → Settings → Variables and secrets,
  for **Production only**. Keep real secrets out of the Preview environment: previews can run code from
  outside contributors (see below).

## Every change gets a preview
- **Branches in this repository** (and PRs from them): Cloudflare builds each push and posts the preview URL
  on the PR (`https://<hash>.acton-tbilisi-website.pages.dev`, plus `https://<branch>.acton-tbilisi-website.pages.dev`).
- **Pull requests from forks:** Cloudflare's GitHub app does not build these, so two GitHub Actions do it:
  - `fork-preview-build.yml` builds the fork's code on `pull_request`, with no secrets and read-only access.
  - `fork-preview-deploy.yml` runs from `main` after that build, uploads the result with Wrangler and comments
    `https://pr-<number>.acton-tbilisi-website.pages.dev` on the PR. It needs the repository secret
    `CLOUDFLARE_API_TOKEN` (a Cloudflare API token with only **Account → Cloudflare Pages: Edit**) and the
    repository variable `CLOUDFLARE_ACCOUNT_ID`.
  - GitHub asks a maintainer to approve workflow runs for first-time contributors; approve after a quick look.
- Previews show placeholder content with a yellow "ნიმუში" outline, and `public/_headers` marks every
  `*.pages.dev` address `noindex`, so only the real domain is indexed.
- Merging into `main` publishes to the live site within a minute or two. Roll back from the Cloudflare
  dashboard (Deployments → … → Rollback) if needed.

## GitHub checks
`.github/workflows/ci.yml` runs `npm run check` and `npm run build` on every PR. Recommended:
Settings → Branches → protect `main`: require a pull request and the **CI** check to pass.

## Costs
Cloudflare Free plan (zone and Pages): unlimited sites and bandwidth, 500 builds a month, Functions 100k
requests a day. Domain at Grena: 30 GEL a year. Google Sheets and Apps Script: free. GitHub: free.
