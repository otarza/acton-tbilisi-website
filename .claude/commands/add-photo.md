---
description: Add a photo to the site with alt text and consent status
argument-hint: "[file path] [where to use it]"
---
Photo task: $ARGUMENTS

1. Ask (if not stated): does written parental consent exist for every identifiable child? Record the answer as
   `consent: signed | pending | none-needed`. Never mark `signed` without the person confirming it.
2. Copy the file to `src/assets/photos/<lowercase-dashed-name>.jpg` (resize to max 2000px wide if bigger).
3. Add an entry to `src/content/photos.yaml`: id, file, Georgian alt text describing the scene (no child names), consent, source.
4. Use the id where requested (e.g. `photo:` / `cover:` fields).
5. Run `npm run check && npm run build` and report.
