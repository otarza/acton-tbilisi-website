# Giving partners access (for the repo owner)

What has to be true before non-developers can safely edit the site through their AI agents.
Partners follow [SETUP.ka.md](SETUP.ka.md); this page is the owner's side.

## Before the first invite
1. **Make the repository private** (Settings → General → Danger zone → Change visibility). It contains photos of
   children and unconfirmed content. Cloudflare Pages and CI keep working for private repos.
2. **Connect Cloudflare Pages** (docs/DEPLOY.md). Without it, proposals get no preview link and partners can only
   see changes on their own computer.
3. **Protect `main`** (Settings → Rules → Rulesets → New branch ruleset, target `main`):
   - Require a pull request before merging, **1 approval**, **Require review from Code Owners**,
     dismiss stale approvals on new pushes.
   - Require status checks: **check** (the CI job).
   - Block force pushes and deletions.
   - Bypass list: only the owner (so you can still fix emergencies).
4. **Approvers**: put their GitHub logins in `.github/CODEOWNERS`. Today it is only `@otarza`.
5. **Forms**: create the Google Sheet + Apps Script and add the two Cloudflare secrets (docs/BACKEND.md),
   otherwise lead forms on the live site only log in mock mode.

## For each partner
1. Ask for their GitHub username.
2. Settings → Collaborators → **Add people** → role **Write** (they can propose; with the ruleset they cannot
   publish without approval).
3. Send them `docs/SETUP.ka.md` (or the GitHub link to it).
4. Optional: ask them to try one small change with you on a call (e.g. a typo) to see the whole loop once.

## How the loop works
partner chats with agent → `flow.mjs begin` creates `edit/<date>-<topic>` → edits in `src/content/` →
local preview → `flow.mjs publish` runs check + build, pushes, opens a PR (Georgian description) →
CI + Cloudflare preview → approver reviews on GitHub and merges → live in ~1 minute.
The agent is told never to merge or push to `main` (AGENTS.md, docs/assistant/PLAYBOOK.md, and deny rules in
`.claude/settings.json`), but the **branch ruleset is the real guarantee**: instructions can be ignored by an agent,
GitHub rules cannot.

## Removing access
Settings → Collaborators → Remove. Their open proposals stay and can be closed.

## Developers on this repo
The Claude Code greeting runs on every session. Turn it off for yourself in `.claude/settings.local.json`:
`{ "env": { "ACTON_ASSISTANT": "off" } }` (git-ignored).
