---
description: Add this week's question, or add the kids' conclusion to it
argument-hint: "[question] or [conclusion: text]"
---
Weekly question task: $ARGUMENTS

- If this is a NEW question: run `npm run new:question -- "<question>"`, choose `topic`
  (fairness | science | money | people) and 2–4 short `options` in Georgian.
- If this is a CONCLUSION (usually on Friday): open the highest-numbered file in `src/content/questions/ka/`,
  add `conclusion: "…"` and `studios: "…"` exactly as given. Do not rewrite the children's words.
- Run `npm run check && npm run build` and report.
