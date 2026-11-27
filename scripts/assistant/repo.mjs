/**
 * Where proposals go, and how a contributor's copy (fork) is found. Shared by flow.mjs and hello.mjs.
 *
 * Model: anyone can contribute. The school's repository (UPSTREAM) is public; contributors don't need to be
 * invited. Their changes are pushed to their own fork on GitHub (created automatically the first time) and sent
 * as a pull request to UPSTREAM. The owner (or anyone with write access) pushes branches to UPSTREAM directly.
 */
import { execSync } from 'node:child_process';

export const UPSTREAM = process.env.ACTON_UPSTREAM || 'otarza/acton-tbilisi-website';
const ROOT = new URL('../..', import.meta.url).pathname;
const run = (c) => execSync(c, { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();
const tryRun = (c) => { try { return run(c); } catch { return null; } };
const slugOf = (url) => (url || '').replace(/\.git$/, '').match(/github\.com[:/]([^/]+\/[^/]+)$/)?.[1] || null;

/** Name of the git remote that points at the school's repository (adds "upstream" if the folder was cloned from a fork). */
export function upstreamRemote() {
  for (const name of (tryRun('git remote') || '').split('\n').filter(Boolean)) {
    if (slugOf(tryRun(`git remote get-url ${name}`))?.toLowerCase() === UPSTREAM.toLowerCase()) return name;
  }
  run(`git remote add upstream https://github.com/${UPSTREAM}.git`);
  return 'upstream';
}

export const me = () => tryRun('gh api user -q .login');

/** Can this GitHub user push branches straight to UPSTREAM? */
export function canPushUpstream() {
  return tryRun(`gh api repos/${UPSTREAM} -q .permissions.push`) === 'true';
}

/** Remote to push proposals to: UPSTREAM for maintainers, otherwise the person's fork (created on first use). */
export function pushTarget() {
  const login = me();
  if (!login) throw new Error('Not signed in to GitHub. Run: gh auth login --web --git-protocol https');
  if (canPushUpstream()) return { remote: upstreamRemote(), head: (b) => b, login };
  let fork = tryRun(`gh api "repos/${UPSTREAM}/forks?per_page=100" --paginate -q '.[] | select(.owner.login=="${login}") | .full_name'`);
  if (!fork) {
    run(`gh repo fork ${UPSTREAM} --clone=false --remote=false --default-branch-only`);
    for (let i = 0; i < 10 && !fork; i++) {
      execSync('sleep 2');
      fork = tryRun(`gh api "repos/${UPSTREAM}/forks?per_page=100" --paginate -q '.[] | select(.owner.login=="${login}") | .full_name'`);
    }
    if (!fork) throw new Error('Could not create your copy of the project on GitHub. Try again in a minute.');
  }
  fork = fork.split('\n')[0];
  const url = `https://github.com/${fork}.git`;
  const existing = tryRun('git remote get-url mine');
  if (!existing) run(`git remote add mine ${url}`);
  else if (existing !== url) run(`git remote set-url mine ${url}`);
  return { remote: 'mine', head: (b) => `${login}:${b}`, login, fork };
}
