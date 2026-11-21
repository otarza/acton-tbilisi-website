# Deploy: GitHub → Cloudflare Pages

## One-time setup
1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → choose this repository.
2. Build settings: Framework preset **Astro**, build command `npm run build`, output directory `dist`.
   Environment variable `NODE_VERSION` = `22`.
3. Production branch: `main`. Save and deploy. The site is at `https://<project>.pages.dev`.
4. Add form secrets (see `docs/BACKEND.md`).
5. Custom domain: Pages project → **Custom domains** → add the school's domain, follow the DNS steps.
   Then set `SITE_URL` (env var) or edit `site` in `astro.config.mjs`, and update `public/robots.txt`.

## Every change gets a preview
- Each push to a branch / pull request gets its own URL (`https://<hash>.<project>.pages.dev`), posted on the PR
  by the Cloudflare GitHub app. Review there before merging.
- Previews show placeholder content with a yellow "ნიმუში" outline, and are marked `noindex`.
- Merging into `main` publishes to the live site within ~1 minute. Roll back from the Cloudflare dashboard
  (Deployments → … → Rollback) if needed.

## GitHub checks
`.github/workflows/ci.yml` runs `npm run check` and `npm run build` on every PR. Recommended:
Settings → Branches → protect `main`: require a pull request and the **CI** check to pass.

## Costs
Cloudflare Pages free plan: unlimited sites/bandwidth, 500 builds/month, Functions 100k requests/day.
Google Sheets/Apps Script: free. GitHub: free. No card needed anywhere.
