# Website builder mode

The same assistant has two modes. **Content manager** (PLAYBOOK.md) changes words, articles, photos.
**Website builder** (this file) improves the site itself: a new homepage section, a new page, a better layout,
a small interactive feature. Contributors are still non-developers, so the PLAYBOOK's way of talking applies
(Georgian, no technical words, one question at a time, show don't tell).

Switch to this mode when the request changes **how the site looks or works**, not just what it says:
„დავამატოთ ახალი სექცია…“, „გალერეის გვერდი გვინდა“, „ღილაკი უფრო თვალსაჩინო იყოს“, „რუკა დაამატე“,
„მობილურზე მენიუ არ მომწონს“, „მინდა საიტი გავაუმჯობესო“.

## 1. Understand the idea (at most 3 questions)
- Who is it for and what should they see or do? (parents deciding, current families, children, partners)
- Which page, and where on it?
- Is there an example they like (a link or a screenshot)?

Check first whether the site already has it (search `src/pages`, `src/components`, `/design-system`). Often the
answer is a content change or reusing an existing block; say so and switch to the content manager.

## 2. Size it and say so
| Size | Examples | What you do |
| --- | --- | --- |
| **Small** | spacing, order of sections, show/hide a block, a new button, a reworded label | Build it. |
| **Medium** | a new homepage section or page made from existing components, a new content type (e.g. events list) | Describe the plan in 3–5 plain Georgian lines (what appears where, which text they will be able to edit), get a yes, build it. |
| **Large** | new forms or data collection, anything in `functions/` or `google/`, new libraries, third-party embeds or trackers, AI features, design system changes (colours, fonts, the S4 look), removing pages | Write the plan, tell them it needs Otar's agreement before building („ეს დიდი ცვლილებაა, ჯობს ჯერ Otar-ს ვკითხოთ“). If they still want it, prepare it, and put „⚠️ საჭიროებს შეთანხმებას“ in the proposal. |

## 3. Build rules (non-negotiable)
- **Keep the approved S4 design** (docs/DESIGN-SYSTEM.md, live at `/design-system`): tokens from
  `src/styles/tokens.css` only, existing utility classes and components first, `SectionHeading` for headings,
  `<Caps>` instead of CSS uppercase, never white text on cyan, cyan highlight bars carry navy text.
- **Every visible word lives in `src/content/`** (extend the schema in `src/content.config.ts` and document the field
  in docs/CONTENT.md), so the content manager can edit it later. Interface words in `src/i18n/ui.ts`.
- Mobile first: check at 390px wide, no horizontal scroll, 48px touch targets, real buttons, keyboard focus,
  Georgian alt text, `prefers-reduced-motion`. The page must make sense without JavaScript.
- Plain Astro + a small inline `<script>` found via a `data-*` attribute. **No new npm packages, external scripts,
  embeds, fonts, cookies or analytics** without Otar: the site is about children and must stay private and fast.
- Don't touch `.github/`, `.claude/`, `scripts/`, `functions/`, `google/`, `astro.config.mjs`, `public/_headers`
  or `package.json` unless the plan was agreed as Large.
- Never break existing pages: a new section is added, old ones keep working.

## 4. Show it
Start the local site (PLAYBOOK section 6) and give the exact link. Ask them to look on a narrow window too.
Iterate in small steps: „ასე? უფრო დიდი? სხვა ადგილას?“ Offer two options when a design choice is unclear,
both built from existing styles.

## 5. Finish properly
1. `npm run check && npm run build` pass.
2. Update the docs that describe what you added: docs/CONTENT.md (new fields), docs/DESIGN-SYSTEM.md and
   `/design-system` (new reusable component), AGENTS.md "Where things are" (new page or folder).
3. Publish with `flow.mjs publish "Add <thing>"` and a body in Georgian with: what visitors will see, which page,
   which text is editable and in which file, how you checked it (desktop and phone), and the size (Small/Medium/Large).
   Prefix the title with „✨“ for builder changes so the approver knows to look at the design.
4. Tell them the approver will look at the design too, so it may take a little longer than a text change.

## Ideas list
If they ask „რა შეიძლება გავაუმჯობესოთ?“, offer 3 ideas that fit the school, sized, e.g.: an events/open-days
list editable from `src/content/`, a photo gallery page from `photos.yaml`, a "what a day looks like" photo strip,
a printable one-page info sheet, English version (docs/I18N.md, Large). Read docs/OPEN-QUESTIONS.md first:
missing real content often helps more than new features, and say so.
