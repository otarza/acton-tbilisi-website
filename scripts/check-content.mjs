#!/usr/bin/env node
/**
 * Content checks that the Astro schema can't do on its own. Runs in CI on every pull request.
 *   node scripts/check-content.mjs                → errors fail the run, warnings are printed
 *   node scripts/check-content.mjs --placeholders → list every piece of unconfirmed placeholder content
 *   node scripts/check-content.mjs --strict       → also fail on warnings (use before launch)
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse } from 'yaml';

const ROOT = new URL('..', import.meta.url).pathname;
const CONTENT = join(ROOT, 'src/content');
const PHOTOS_DIR = join(ROOT, 'src/assets/photos');
const args = new Set(process.argv.slice(2));
const errors = [];
const warnings = [];
const placeholders = [];

const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const rel = (p) => relative(ROOT, p);

function readData(file) {
  const text = readFileSync(file, 'utf8');
  if (file.endsWith('.md')) {
    const m = text.match(/^---\n([\s\S]*?)\n---/);
    if (!m) { errors.push(`${rel(file)}: missing frontmatter (--- block at the top)`); return { data: null, text }; }
    try { return { data: parse(m[1]), text }; } catch (e) { errors.push(`${rel(file)}: frontmatter is not valid YAML: ${e.message.split('\n')[0]}. Tip: put text in "double quotes".`); return { data: null, text }; }
  }
  try { return { data: parse(text), text }; } catch (e) { errors.push(`${rel(file)}: not valid YAML: ${e.message.split('\n')[0]}. Tip: put text in "double quotes".`); return { data: null, text }; }
}

/* ---- Photo register ---- */
const register = readData(join(CONTENT, 'photos.yaml')).data ?? [];
const photoIds = new Set(register.map((p) => p.id));
for (const p of register) {
  if (!existsSync(join(PHOTOS_DIR, p.file))) errors.push(`photos.yaml: "${p.id}" points to missing file src/assets/photos/${p.file}`);
  if (p.consent === 'pending') warnings.push(`photo "${p.id}" has consent: pending — get written parental consent before launch (law №3144)`);
  if (!p.alt || p.alt.length < 8) errors.push(`photos.yaml: "${p.id}" needs a real alt text (describe the photo in Georgian)`);
}
for (const f of existsSync(PHOTOS_DIR) ? readdirSync(PHOTOS_DIR) : []) {
  if (/\.(jpe?g|png|webp|avif)$/i.test(f) && !register.some((p) => p.file === f)) errors.push(`src/assets/photos/${f} is not listed in src/content/photos.yaml`);
}

/* ---- All content files ---- */
const numbers = new Map();
const TOPICS = ['method', 'life', 'quests', 'clubs', 'parents', 'acton']; // keep in sync with ARTICLE_TOPICS in src/content.config.ts
for (const file of walk(CONTENT)) {
  if (!/\.(md|ya?ml)$/.test(file) || file.endsWith('photos.yaml')) continue;
  const { data, text } = readData(file);
  if (!data) continue;

  // photo references anywhere in the data
  const refs = [...JSON.stringify(data).matchAll(/"(?:photo|cover)":"([^"]+)"/g)].map((m) => m[1]);
  for (const r of refs) if (!photoIds.has(r)) errors.push(`${rel(file)}: photo "${r}" is not in src/content/photos.yaml`);

  // placeholders: `placeholder: true` anywhere + [დასაზუსტებელია] markers + [№]-style gaps
  const count = (text.match(/placeholder: true/g) || []).length;
  if (count) placeholders.push(`${rel(file)} (${count}×)`);
  if (text.includes('[დასაზუსტებელია]')) warnings.push(`${rel(file)}: contains [დასაზუსტებელია] (unconfirmed fact)`);
  if (/\[№\]/.test(text)) warnings.push(`${rel(file)}: contains an unfilled [№]`);

  // weekly questions: unique numbers per locale
  const m = rel(file).match(/^src\/content\/questions\/(\w+)\//);
  if (m && data.number != null) {
    const key = `${m[1]}:${data.number}`;
    if (numbers.has(key)) errors.push(`${rel(file)}: question number ${data.number} is also used by ${numbers.get(key)}`);
    numbers.set(key, rel(file));
  }

  // articles: author must be a team file, topics from the fixed list
  const am = rel(file).match(/^src\/content\/articles\/(\w+)\//);
  if (am) {
    if (!data.author || !existsSync(join(CONTENT, 'team', am[1], `${data.author}.md`))) {
      errors.push(`${rel(file)}: author "${data.author}" is not a file in src/content/team/${am[1]}/ (write the file name without .md, e.g. salome-davituliani)`);
    }
    for (const tp of data.topics ?? []) if (!TOPICS.includes(tp)) errors.push(`${rel(file)}: topic "${tp}" is not one of: ${TOPICS.join(', ')}`);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*\.md$/.test(file.split('/').pop())) errors.push(`${rel(file)}: file name must be latin lowercase with dashes (it becomes the URL)`);
    if (data.titleAccent && !String(data.title).includes(data.titleAccent)) errors.push(`${rel(file)}: titleAccent "${data.titleAccent}" must be a part of the title`);
  }

  // testimonials need approval before they leave placeholder state
  if (rel(file).startsWith('src/content/testimonials/') && data.placeholder === false && data.approved !== true) {
    errors.push(`${rel(file)}: placeholder is false but approved is not true — a parent must approve the exact quote`);
  }
}

if (args.has('--placeholders')) {
  console.log(`\nFiles with placeholder content (${placeholders.length}):\n  ` + placeholders.join('\n  '));
  console.log('\nRemove "placeholder: true" from a block once the school confirms it. Full list of open questions: docs/OPEN-QUESTIONS.md\n');
}
for (const w of warnings) console.warn(`⚠  ${w}`);
for (const e of errors) console.error(`✖  ${e}`);
console.log(`\ncheck-content: ${errors.length} error(s), ${warnings.length} warning(s), ${placeholders.length} file(s) with placeholders.`);
if (errors.length || (args.has('--strict') && (warnings.length || placeholders.length))) process.exit(1);
