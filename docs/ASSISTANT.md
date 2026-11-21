# The site assistant

Component: `src/components/shared/Assistant.astro` (homepage FAQ block and FAQ page sidebar).

## How it works now (no AI model, no cost)
- Its knowledge base is **only** `src/content/faq/ka/*.md`, built into the page at build time.
- Quick buttons come from FAQ entries with a `chip:` field.
- Typed questions are matched in the browser against `keywords` and the question text, using word stems
  (Georgian endings change a lot). No match → "I don't have an approved answer" + link to a human.
- Every answer shows its source question and links to it. `handoff: true` topics always add "talk to a human".
- Nothing typed is sent anywhere or stored.
- It is labelled "ასისტენტი" and describes itself honestly (it is not called "AI" because it is not one).

To improve answers: add `keywords:` to FAQ files, or add new FAQ entries. That's it.

## Upgrading to a real AI model later (rules that must hold)
The research report (honesty beats AI flash) sets these requirements:
1. Label it clearly as AI ("AI ასისტენტი"), and say it answers only from approved school information.
2. **Retrieval only**: send the user's question plus the approved FAQ texts to the model and instruct it to answer
   only from them, quoting the source; otherwise reply with the hand-off message. Keep `handoff` topics hand-off.
3. Never send names/phone numbers to the model; don't store conversations, or say so in the privacy section.
4. Keep the human link always visible.
Implementation sketch: a new Pages Function `functions/api/ask.ts` using **Cloudflare Workers AI** (free daily
allowance, no extra account) or an LLM API key stored as a Cloudflare secret; the component calls it and falls
back to the current keyword matcher on error. Update `/about#privacy` text in the same PR.
