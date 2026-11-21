#!/usr/bin/env node
/**
 * Create a new content file from a template.
 *   npm run new:article -- "slug-in-latin" "სათაური" author-file-name
 *   npm run new:question -- "კითხვის ტექსტი?"
 *   npm run new:faq -- "slug-in-latin" "კითხვა?" learning
 */
import { writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const [kind, ...rest] = process.argv.slice(2);
const lang = process.env.LANG_CODE || 'ka';
const today = new Date().toISOString().slice(0, 10);
const q = (s) => JSON.stringify(s ?? '');
const slugOk = (s) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s || '');

function write(path, body) {
  if (existsSync(path)) { console.error(`Already exists: ${path}`); process.exit(1); }
  writeFileSync(path, body);
  console.log(`Created ${path.replace(ROOT, '')}`);
}

if (kind === 'article') {
  const [slug, title = 'სათაური', author = ''] = rest;
  if (!slugOk(slug)) { console.error('Usage: npm run new:article -- my-article-slug "სათაური" salome-davituliani  (slug: latin lowercase, dashes; author: file name in src/content/team/ka/)'); process.exit(1); }
  const team = readdirSync(join(ROOT, `src/content/team/${lang}`)).map((f) => f.replace(/\.md$/, ''));
  if (author && !team.includes(author)) { console.error(`Unknown author "${author}". Choose one of: ${team.join(', ')}`); process.exit(1); }
  write(join(ROOT, `src/content/articles/${lang}/${slug}.md`), `---
title: ${q(title)}
# titleAccent: "სიტყვები სათაურიდან"   # optional: these words of the title get the highlight bar
description: "ერთი-ორი წინადადება: რაზეა ეს სტატია (ჩანს სიაში და Google-ში)."
date: ${today}
author: ${author || 'salome-davituliani'}   # file name in src/content/team/${lang}/ (${team.join(', ')})
topics: [method]      # 1-3 of: method, life, quests, clubs, parents, acton
cover: market-stall   # photo id from src/content/photos.yaml
# coverCaption: "ფოტოს წარწერა"
summary:              # "short version" box, 1-4 points (optional, delete if not needed)
  - "პირველი მთავარი აზრი."
draft: true           # set to false to publish
---

პირველი აბზაცი.

## პირველი ნაწილი

ტექსტი… (each "## " heading becomes an entry in the table of contents)
`);
} else if (kind === 'question') {
  const [question = 'კითხვა?'] = rest;
  const dir = join(ROOT, `src/content/questions/${lang}`);
  const max = Math.max(0, ...readdirSync(dir).map((f) => parseInt(f, 10)).filter(Number.isFinite));
  const n = max + 1;
  const monday = new Date(); monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7));
  write(join(dir, `${String(n).padStart(3, '0')}.md`), `---
number: ${n}
week: ${monday.toISOString().slice(0, 10)}
topic: people          # fairness | science | money | people
question: ${q(question)}
options: ["დიახ", "არა", "დამოკიდებულია"]
# conclusion: "ბავშვების დასკვნა — დაამატეთ პარასკევს"
# studios: "8–11 წლის სტუდია"
---
`);
} else if (kind === 'faq') {
  const [slug, question = 'კითხვა?', category = 'learning'] = rest;
  if (!slugOk(slug)) { console.error('Usage: npm run new:faq -- my-question-slug "კითხვა?" learning'); process.exit(1); }
  write(join(ROOT, `src/content/faq/${lang}/${slug}.md`), `---
question: ${q(question)}
category: ${category}   # learning | status | daily | price | enrollment
order: 100
keywords: []          # words parents might type, helps the assistant find this answer
# showOnHome: true
# handoff: true       # the assistant tells people to talk to a human about this
---

პასუხი…
`);
} else {
  console.error('Usage: node scripts/new.mjs article|question|faq ...');
  process.exit(1);
}
