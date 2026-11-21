#!/usr/bin/env node
/**
 * Create a new content file from a template.
 *   npm run new:post -- "slug-in-latin" "სათაური"
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

if (kind === 'post') {
  const [slug, title = 'სათაური'] = rest;
  if (!slugOk(slug)) { console.error('Usage: npm run new:post -- my-post-slug "სათაური"  (slug: latin lowercase, dashes)'); process.exit(1); }
  write(join(ROOT, `src/content/posts/${lang}/${slug}.md`), `---
title: ${q(title)}
description: "ერთი-ორი წინადადება: რაზეა ეს ჩანაწერი (ჩანს სიაში და Google-ში)."
date: ${today}
cover: market-stall   # photo id from src/content/photos.yaml (optional)
tags: []
author: "სკოლის გუნდი"
draft: true           # set to false to publish
---

პირველი აბზაცი.

## ქვესათაური

ტექსტი…
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
  console.error('Usage: node scripts/new.mjs post|question|faq ...');
  process.exit(1);
}
