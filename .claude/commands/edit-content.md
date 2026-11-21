---
description: Change any text, price, date or contact detail on the site
argument-hint: "[what to change]"
---
Content change: $ARGUMENTS

1. Find where the text lives: search `src/content/` (all visible text is there; interface words in `src/i18n/ui.ts`).
2. Make the smallest edit. Keep YAML values in "double quotes".
3. If the new value is confirmed by the school, remove `placeholder: true` from that block and update
   `docs/OPEN-QUESTIONS.md` if it was listed there.
4. If the same fact appears in several places (e.g. price is in home.yaml AND faq/ka/price.md), update all of them —
   search for the old value.
5. Run `npm run check && npm run build`, then list every file you changed.
