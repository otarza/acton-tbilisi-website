#!/usr/bin/env node
/**
 * Safe, plain-language wrappers around git + GitHub for the staff assistant.
 * The agent runs these so staff never need git words. Nothing here pushes to main or deletes work.
 * Contributors don't need an invite: proposals go from their fork to the school's repository (see repo.mjs).
 *
 *   node scripts/assistant/flow.mjs begin [short-latin-name]   start a new change (fresh copy of the live site)
 *   node scripts/assistant/flow.mjs changes                     what is changed but not yet sent
 *   node scripts/assistant/flow.mjs publish "Title" [--body-file f.md]
 *                                                              check, save, send for review (opens/updates a PR)
 *   node scripts/assistant/flow.mjs proposals                   my open proposals + their review/preview state
 *   node scripts/assistant/flow.mjs set-aside                   undo unsent changes, but keep a copy (git stash)
 *   node scripts/assistant/flow.mjs bring-back                  restore the last set-aside copy
 *   node scripts/assistant/flow.mjs done                        after approval: back to the live version, up to date
 */
import { execSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { UPSTREAM, upstreamRemote, pushTarget } from './repo.mjs';

const ROOT = new URL('../..', import.meta.url).pathname;
const [cmd, ...rest] = process.argv.slice(2);
const run = (c, opts = {}) => execSync(c, { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], ...opts }).toString().trim();
const tryRun = (c) => { try { return run(c); } catch { return null; } };
const say = (...l) => console.log(l.join('\n'));
const fail = (msg) => { console.error(`✖ ${msg}`); process.exit(1); };
const q = (s) => `'${String(s).replace(/'/g, `'\\''`)}'`;

let UP; const up = () => (UP ||= upstreamRemote());
const branch = () => run('git rev-parse --abbrev-ref HEAD');
const dirty = () => run('git status --porcelain').split('\n').filter(Boolean);
const today = () => new Date().toISOString().slice(0, 10);
const slugify = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
const newBranchName = (hint) => {
  const base = `edit/${today()}-${slugify(hint) || new Date().toTimeString().slice(0, 5).replace(':', '')}`;
  let name = base, i = 2;
  while (tryRun(`git rev-parse --verify --quiet ${q(name)}`) !== null) name = `${base}-${i++}`;
  return name;
};

function begin(hint) {
  const b = branch();
  if (b !== 'main') {
    say(`Already working on a change: ${b} (${dirty().length} changed files).`,
      'Ask the person: continue this one, send it for review first, or set it aside?');
    return b;
  }
  const name = newBranchName(hint);
  if (dirty().length) {
    // Changes were made on main by mistake: carry them into the new change instead of losing them.
    run(`git switch -c ${q(name)}`);
    say(`Started change ${name} (kept ${dirty().length} edits that were already made).`);
  } else {
    run(`git fetch -q ${up()} main`);
    run(`git switch -c ${q(name)} ${up()}/main`);
    say(`Started change ${name} from the latest live version.`);
  }
  return name;
}

function changes() {
  const files = dirty();
  const b = branch();
  const committed = b === 'main' ? [] : (tryRun(`git diff --name-only ${up()}/main...HEAD`) || '').split('\n').filter(Boolean);
  say(`Change: ${b}`, files.length ? `Not saved yet (${files.length}):` : 'Nothing unsaved.', ...files.map((f) => `  ${f}`));
  if (committed.length) say(`Already saved in this change (${committed.length}):`, ...committed.map((f) => `  ${f}`));
}

function checks() {
  for (const c of ['npm run check', 'npm run build']) {
    const r = spawnSync(c, { cwd: ROOT, shell: true, encoding: 'utf8' });
    if (r.status !== 0) {
      const out = `${r.stdout}\n${r.stderr}`.split('\n').filter((l) => /error|✖|failed|Error/i.test(l)).slice(0, 15).join('\n');
      fail(`"${c}" failed. Fix it before sending (explain in plain words):\n${out}`);
    }
  }
}

function publish(title, bodyFile) {
  if (!title) fail('Usage: publish "Short title of the change" [--body-file path]');
  if (tryRun('gh auth status') === null) fail('Not signed in to GitHub. Run: gh auth login --web --git-protocol https');
  if (branch() === 'main') begin(title);
  const b = branch();
  checks();
  if (dirty().length) {
    run('git add -A');
    run(`git commit -q -m ${q(title)}`);
  }
  run(`git fetch -q ${up()} main`);
  if (!tryRun(`git log --oneline ${up()}/main..HEAD`)) fail('There is nothing new to send.');
  const target = pushTarget();
  run(`git push -q -u ${target.remote} ${q(b)}`);
  const existing = tryRun(`gh pr list --repo ${UPSTREAM} --head ${q(b)} --author "@me" --state open --json url -q '.[0].url'`);
  if (existing) { say(`Updated the proposal: ${existing}`); return; }
  const files = run(`git diff --name-only ${up()}/main...HEAD`).split('\n').filter(Boolean);
  const body = bodyFile ? readFileSync(bodyFile, 'utf8') : `## რა შეიცვალა\n${title}\n\n## ფაილები\n${files.map((f) => `- \`${f}\``).join('\n')}\n`;
  const footer = `\n\n---\n✅ \`npm run check\` და \`npm run build\` გაიარა.\nგამოქვეყნება: დამმტკიცებელი დააჭერს **Merge**-ს.\n`;
  const url = run(`gh pr create --repo ${UPSTREAM} --base main --head ${q(target.head(b))} --title ${q(title)} --body ${q(body + footer)}`);
  say(`Sent for review: ${url}`);
}

function proposals() {
  const raw = tryRun(`gh pr list --repo ${UPSTREAM} --author "@me" --state all --limit 10 --json number,title,url,state,reviewDecision,headRefName,statusCheckRollup,comments`);
  if (raw === null) fail('Could not read proposals (signed in to GitHub?)');
  const prs = JSON.parse(raw);
  if (!prs.length) return say('No proposals yet.');
  for (const p of prs) {
    const checksState = (p.statusCheckRollup || []).map((c) => c.conclusion || c.state).join(',') || 'none';
    const preview = (JSON.stringify(p.comments || []).match(/https:\/\/[a-z0-9-]+\.[a-z0-9-]+\.pages\.dev/) || [])[0] || '';
    say(`#${p.number} [${p.state}${p.reviewDecision ? ' / ' + p.reviewDecision : ''}] ${p.title}`,
      `   ${p.url}  checks: ${checksState}${preview ? `  preview: ${preview}` : ''}`);
  }
}

function setAside() {
  if (!dirty().length) return say('Nothing to set aside.');
  run(`git stash push -u -m ${q(`set aside ${new Date().toISOString()} on ${branch()}`)}`);
  say('Unsent changes removed from the site and kept as a copy (restore with: bring-back).');
}

function bringBack() {
  if (!tryRun('git stash list')) return say('No set-aside copy found.');
  run('git stash pop');
  say('Restored the last set-aside changes.');
}

function done() {
  if (dirty().length) fail('There are unsent changes. Send them (publish) or set them aside first.');
  run(`git fetch -q ${up()} main`);
  run('git switch -q main');
  run(`git merge -q --ff-only ${up()}/main`);
  say('Back on the latest live version. Ready for the next change.');
}

const bodyIdx = rest.indexOf('--body-file');
const bodyFile = bodyIdx >= 0 ? rest.splice(bodyIdx, 2)[1] : undefined;
try {
  ({ begin: () => begin(rest[0]), changes, publish: () => publish(rest.join(' ').trim(), bodyFile), proposals,
     'set-aside': setAside, 'bring-back': bringBack, done }[cmd] || (() => fail(`Unknown command "${cmd}". See the top of scripts/assistant/flow.mjs`)))();
} catch (e) {
  fail(`${e.message.split('\n')[0]}\n${e.stderr?.toString() || ''}`.trim());
}
