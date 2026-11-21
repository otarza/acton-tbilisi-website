---
description: Add a photo to the site with alt text and consent status
argument-hint: "[file path] [where to use it]"
---
Photo task: $ARGUMENTS

1. Photos of enrolled children are covered by the photo clause in the school's enrolment contract → `consent: signed`.
   If the photo shows other identifiable children (visitors, siblings, trial week), ask whether written consent
   exists and record `consent: signed | pending | none-needed`.
2. Copy the file to `src/assets/photos/<lowercase-dashed-name>.jpg` (resize to max 2000px wide if bigger).
3. Add an entry to `src/content/photos.yaml`: id, file, Georgian alt text describing the scene (no child names), consent, source.
4. Use the id where requested (e.g. `photo:` / `cover:` fields).
5. Run `npm run check && npm run build` and report.
