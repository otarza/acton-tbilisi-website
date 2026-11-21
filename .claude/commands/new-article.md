---
description: Write a new article (სტატია) from notes, photos or a Facebook post
argument-hint: "[topic or pasted text] [author]"
---
Create a new article for the school website about: $ARGUMENTS

1. Read AGENTS.md and docs/CONTENT.md (section "articles").
2. Find the author: a file name in `src/content/team/ka/` (e.g. `salome-davituliani`). If the writer is not there
   yet (a parent, an investor), first add them as a team file with `group: contributor` (ask for their role and a
   one-line bio; never invent one, use `placeholder: true` if missing).
3. Pick a short latin slug (e.g. `ant-quest-2026`) and run
   `npm run new:article -- <slug> "<Georgian title>" <author>`.
4. Fill in: `description` (1–2 sentences), `topics` (1–3 of: method, life, quests, clubs, parents, acton),
   `cover` (an existing photo id from `src/content/photos.yaml`, or add the photo first with /add-photo),
   optional `titleAccent` (words of the title that get the highlight bar) and `summary` (1–4 short points).
5. Write the text in warm, plain Georgian (300–900 words): what happened, what the children learned, one quote if
   given. Use `##` subheadings: each becomes an entry in the table of contents. Do not invent names, numbers or
   quotes that were not provided. Never write a child's full name.
6. Keep `draft: true` unless the person said to publish.
7. Run `npm run check && npm run build`, then summarise what you created and how to preview it
   (`npm run dev` → http://localhost:4321/articles/<slug>).
