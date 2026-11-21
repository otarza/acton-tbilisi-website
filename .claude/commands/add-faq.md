---
description: Add or update a frequently asked question (also feeds the site assistant)
argument-hint: "[question and answer]"
---
FAQ task: $ARGUMENTS

1. Search `src/content/faq/ka/` first; update an existing entry instead of duplicating.
2. New entry: `npm run new:faq -- <slug> "<question>" <category>` (learning | status | daily | price | enrollment).
3. Answer only with facts the person gave. Add 3–6 `keywords:` parents might type (Georgian word stems).
   Set `handoff: true` if the topic is sensitive (special needs, complaints, legal status).
4. If the answer confirms a placeholder, remove `placeholder: true`.
5. Run `npm run check && npm run build` and report.
