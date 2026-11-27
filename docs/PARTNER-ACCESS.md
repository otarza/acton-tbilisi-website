# Contributions from partners (for the repo owner)

The repository is public and anyone can contribute: no invitations, no collaborator list. A contributor's
agent pushes their change to **their own fork** (created automatically by `scripts/assistant/flow.mjs` the first
time) and opens a pull request against `otarza/acton-tbilisi-website`. Nothing reaches the live site until an
approver merges it. Partners follow [SETUP.ka.md](SETUP.ka.md); this page is the owner's side.

## One-time settings
1. **Protect `main`** (Settings → Rules → Rulesets → New branch ruleset, target `main`):
   - Require a pull request before merging, **1 approval**, **Require review from Code Owners**,
     dismiss stale approvals on new pushes.
   - Require status checks: **check** (the CI job).
   - Block force pushes and deletions. Bypass list: only the owner.
2. **Approvers**: GitHub logins in `.github/CODEOWNERS`. Today only `@otarza`.
3. **Checks on fork PRs** (Settings → Actions → General → "Approval for running fork pull request workflows"):
   GitHub asks a maintainer to click **Approve and run** for first-time contributors. Keep that on (it stops
   strangers running code in CI); after a contributor's first merged PR their checks run automatically.

## Reviewing a proposal
Open the PR, read the Georgian description and the file list (content changes are in `src/content/`), wait for
the green **check**, and merge. Changes outside `src/content/` (components, `functions/`, `google/`, scripts,
`.claude/`, `.github/`) deserve a closer look, especially from someone you don't know. The agent marks design
changes with „⚠️ დიზაინის ცვლილება“ in the title. "Allow edits by maintainers" is on by default, so you can push
small fixes to a contributor's branch before merging.

## How the loop works
contributor chats with agent → `flow.mjs begin` creates `edit/<date>-<topic>` from the latest `main` → edits →
local preview → `flow.mjs publish` runs check + build, pushes to their fork, opens a PR here (Georgian
description) → CI → approver merges → live in ~1 minute. Maintainers with write access push branches here directly.
The agent is told never to merge or push to `main`, but the **ruleset is the real guarantee**.

## Developers on this repo
The Claude Code greeting runs on every session. Turn it off for yourself in `.claude/settings.local.json`:
`{ "env": { "ACTON_ASSISTANT": "off" } }` (git-ignored).
