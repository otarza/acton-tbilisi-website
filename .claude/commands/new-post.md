---
description: Write a new blog post from notes, photos or a Facebook post
argument-hint: "[topic or pasted text]"
---
Create a new blog post for the school website about: $ARGUMENTS

1. Read AGENTS.md and docs/CONTENT.md (section "posts").
2. Pick a short latin slug (e.g. `ant-quest-2026`) and run `npm run new:post -- <slug> "<Georgian title>"`.
3. Write the post in warm, plain Georgian (300–600 words): what happened, what the children learned, one quote if
   given. Use `##` subheadings. Do not invent names, numbers or quotes that were not provided.
4. Cover: use an existing photo id from `src/content/photos.yaml`, or ask for a photo (and its consent status).
5. Keep `draft: true` unless the person said to publish.
6. Run `npm run check && npm run build`, then summarise what you created and how to preview it.
