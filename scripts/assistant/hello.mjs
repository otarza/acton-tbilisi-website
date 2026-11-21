#!/usr/bin/env node
/**
 * Status check for the AI assistant that helps school staff edit the site.
 *   npm run hello            human-readable report (Georgian)
 *   node scripts/assistant/hello.mjs --json   machine-readable
 *   node scripts/assistant/hello.mjs --hook   Claude Code SessionStart hook output
 * It never changes anything. The agent reads it to know what to say first.
 */
import { execSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { createConnection } from 'node:net';
import { join } from 'node:path';

const ROOT = new URL('../..', import.meta.url).pathname;
const args = process.argv.slice(2);
// Developers can silence the greeting: set ACTON_ASSISTANT=off (e.g. in .claude/settings.local.json "env").
if (args.includes('--hook') && process.env.ACTON_ASSISTANT === 'off') process.exit(0);
const sh = (cmd) => {
  try { return execSync(cmd, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'], timeout: 8000 }).toString().trim(); }
  catch { return null; }
};
const portOpen = (port) => new Promise((res) => {
  const s = createConnection({ port, host: '127.0.0.1' });
  s.setTimeout(500);
  s.on('connect', () => { s.destroy(); res(true); });
  s.on('error', () => res(false));
  s.on('timeout', () => { s.destroy(); res(false); });
});

const nodeMajor = Number(process.versions.node.split('.')[0]);
const status = {
  node: process.versions.node,
  nodeOk: nodeMajor >= 22,
  depsInstalled: existsSync(join(ROOT, 'node_modules/astro')),
  git: !!sh('git --version'),
  gitName: sh('git config user.name'),
  gitEmail: sh('git config user.email'),
  gh: !!sh('gh --version'),
  ghLoggedIn: sh('gh auth status') !== null,
  branch: sh('git rev-parse --abbrev-ref HEAD'),
  changedFiles: (sh('git status --porcelain') || '').split('\n').filter(Boolean).map((l) => l.slice(3)),
  unpushed: Number(sh('git rev-list --count @{u}..HEAD') ?? -1), // -1 = branch not on GitHub yet
  behindMain: Number(sh('git fetch -q origin main && git rev-list --count HEAD..origin/main') ?? 0),
  openPRs: [],
  newPhotos: existsSync(join(ROOT, '_new-photos'))
    ? readdirSync(join(ROOT, '_new-photos')).filter((f) => /\.(jpe?g|png|webp|heic)$/i.test(f)) : [],
  previewRunning: null,
};
for (const p of [4321, 4322]) if (await portOpen(p)) { status.previewRunning = `http://localhost:${p}`; break; }
if (status.ghLoggedIn) {
  const raw = sh('gh pr list --author "@me" --state open --json number,title,url,headRefName');
  try { status.openPRs = JSON.parse(raw || '[]'); } catch {}
}
const onMain = status.branch === 'main';
const inProgress = !onMain && status.branch && status.branch !== 'HEAD';

const problems = [];
if (!status.nodeOk) problems.push(`Node ${status.node} is too old (need 22+). Guide install: https://nodejs.org (LTS .pkg).`);
if (!status.depsInstalled) problems.push('Dependencies missing: run `npm install` yourself (say "ვამზადებ პროექტს, 1-2 წუთი").');
if (!status.git) problems.push('git missing: macOS will offer "Install Command Line Developer Tools" if they run `git --version` in Terminal.');
if (!status.gitName || !status.gitEmail) problems.push('git name/email not set: ask their name + the email of their GitHub account, then set with git config --global.');
if (!status.gh) problems.push('GitHub CLI missing: `brew install gh` if Homebrew exists, else https://cli.github.com (macOS .pkg).');
else if (!status.ghLoggedIn) problems.push('Not signed in to GitHub: run `gh auth login --web --git-protocol https` and tell them to copy the 8-letter code into the browser page that opens.');

if (args.includes('--json')) { console.log(JSON.stringify({ ...status, problems }, null, 2)); process.exit(0); }

const ka = [];
ka.push(problems.length ? `⚙️  მოსამზადებელია (${problems.length}):` : '✅ ყველაფერი მზადაა.');
problems.forEach((p) => ka.push(`   - ${p}`));
if (inProgress) ka.push(`✏️  მიმდინარე ცვლილება: ${status.branch} (${status.changedFiles.length} შეუნახავი ფაილი)`);
else if (status.changedFiles.length) ka.push(`⚠️  ${status.changedFiles.length} შეცვლილი ფაილი მთავარ ვერსიაზე (main): ${status.changedFiles.slice(0, 5).join(', ')}`);
if (status.openPRs.length) ka.push(`📬 გამოსაქვეყნებლად გაგზავნილი: ${status.openPRs.map((p) => `#${p.number} ${p.title}`).join('; ')}`);
if (status.newPhotos.length) ka.push(`🖼  ახალი ფოტოები _new-photos-ში: ${status.newPhotos.join(', ')}`);
ka.push(status.previewRunning ? `👀 ლოკალური ნახვა ჩართულია: ${status.previewRunning}` : '👀 ლოკალური ნახვა გამორთულია');

if (!args.includes('--hook')) { console.log(ka.join('\n')); process.exit(0); }

// Claude Code SessionStart hook: a short banner for the person + context for the agent.
const banner = [
  'გამარჯობა! 👋 ეს ექტონის აკადემიის საიტია.',
  'მომწერეთ ჩვეულებრივად, ქართულად, რისი გაკეთება გინდათ, ან უბრალოდ „დამეხმარე“.',
].join('\n');
const context = `
<acton-assistant-status>
${JSON.stringify({ ...status, problems }, null, 1)}
</acton-assistant-status>
You are the website assistant for school staff (non-developers). Follow docs/assistant/PLAYBOOK.md.
Whatever the person's first message is (even "hi"), reply first with the greeting from the playbook,
adapted to this status: fix or guide the setup problems above first, mention unfinished work
${inProgress ? `(branch "${status.branch}" is an unfinished change: offer to continue, publish or drop it)` : ''}
${status.openPRs.length ? '(open proposals exist: offer to check their status)' : ''}, then show the menu.
Speak Georgian unless they write in another language. No git words.`;
console.log(JSON.stringify({
  systemMessage: banner,
  hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: context },
}));
