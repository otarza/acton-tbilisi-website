---
description: Add a photo to the site with alt text and consent status
argument-hint: "[file path] [where to use it]"
---
Photo task: $ARGUMENTS

1. Find the file: a path they gave, or the newest file in `_new-photos/`. Look at it.
2. Consent: photos of enrolled children are covered by the enrolment contract → `signed`. Other identifiable
   children (visitors, siblings, trial week) → ask whether written consent exists; if unsure → `pending`.
   No identifiable children → `none-needed`.
3. Write Georgian alt text describing the scene. Never a child's name.
4. Run `node scripts/assistant/add-photo.mjs <file> <latin-dashed-id> "<alt>" <consent>` (resizes to ≤2000px,
   converts iPhone HEIC, removes location data, registers it in `src/content/photos.yaml`).
5. Use the id where requested (`photo:` / `cover:` fields). Don't delete the original from `_new-photos/`.
6. Run `npm run check` and show it (docs/assistant/PLAYBOOK.md section 6).
