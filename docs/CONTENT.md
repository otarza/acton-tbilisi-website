# Content model

All content is in `src/content/<collection>/<locale>/`. Locale is `ka` (Georgian) for now.
The schema (field names, types, allowed values) is in `src/content.config.ts`; the build fails with a clear
message if a file doesn't match. Run `npm run check` to validate.

## Shared conventions

| Field / marker | Meaning |
| --- | --- |
| `placeholder: true` | Invented for the design, not yet confirmed by the school. Outlined in yellow ("ნიმუში") on previews. `npm run placeholders` lists them. Remove once confirmed. |
| `[დასაზუსტებელია]` in text | An unconfirmed fact inside a sentence. `npm run check` warns. |
| `photo:` / `cover:` | A photo **id** from `src/content/photos.yaml`, not a file path. |
| `order:` | Sort order, lower first. |
| `label:` | Small label above a heading. Write normal letters; the site renders Georgian capitals (Mtavruli). |
| `title` + `accent` (+ `titleAfter`/`after`) | Heading; `accent` gets the cyan highlight bar. |

**YAML tip:** wrap every text value in double quotes. Georgian sentences often contain `:` or `,`, which
otherwise break YAML (`title: "ფასი: 1000 ₾"`).

## Collections

### `settings/ka.yaml` — site-wide
School name, `logoSubtitle`, `phone`/`phoneHref`, `email`, `address`, `responseTime`, links (`bookingUrl` =
Calendly, `messengerUrl`, `whatsappUrl`, `facebookUrl`, `instagramUrl`), `announcement` (top bar; `enabled`
to hide), `nextExhibition` (`date`, `title` → countdowns on the homepage), `nav` (menu items), `footer`, `seo`.

### `pages/ka/home.yaml` — homepage, in page order
`seo`, `hero`, `marquee`, `honest` (01 quote + 3 values), `studios` (02 heading), `day` (03 schedule),
`progress` (04 portfolio sample, badges), `fit` (05 "for you / not for you" + quiz with 2 audiences × 4
questions × exactly 3 options, best answer first), `videos` (06; add `youtubeId` to make a video play),
`testimonials` (07 heading), `trust` (08 cards), `price` (09), `join` (10 steps + form text), `faqPreview`.

### `pages/ka/about.yaml`
`hero` (+ `stats`), `story.items`, `team` (group names/intros, `investors` list with `isParent`),
`accreditation.cards` (`status`: confirmed | pending | info), `safety.items`, `privacy` (`details` Q&A,
`consentDemo` switches), `cta`.

### `pages/ka/faq.yaml`
`hero`, `categories` (id → Georgian name), `archive` (`title` may contain `{n}`, `topics` id → name), `cta`.

### `faq/ka/<slug>.md` — one question per file
```yaml
question: "რა ღირს სწავლა?"
category: price          # learning | status | daily | price | enrollment
order: 1
showOnHome: true         # optional: show in the homepage FAQ block
chip: "რამდენი ღირს?"     # optional: quick button in the assistant
assistantAnswer: "…"     # optional: shorter answer for the assistant (else first paragraph)
keywords: [ფასი, ღირს]   # words people might type
handoff: false           # true = assistant also says "ask a human"
```
Body (Markdown) = the full answer. URL anchor: `/faq#<slug>`.

### `questions/ka/NNN.md` — question of the week
`number` (unique), `week` (Monday date), `topic` (fairness | science | money | people), `question`,
`options` (2–4, used for voting while current), `results` (optional fallback %), `conclusion` (kids' summary),
`studios`. **The highest number is "this week's" question** on the homepage; all others form the archive.

### `studios/ka/<slug>.md`
`name`, `ageMin`, `ageMax`, `photo`, `color` (teal | blue | red), `points` (3 short facts), `order`. Body = description.
The age buttons on the homepage are generated from the min/max of all studios.

### `team/ka/<slug>.md`
`name`, `group` (founder | guide), `role`, `isParent`, `facts` (badges), `photo` (optional), `order`. Body = bio.
Investors are a simple list in `about.yaml`.

### `testimonials/ka/<slug>.md`
`name`, `role`, `order`, `approved` (the parent approved this exact wording). Body = quote.
`npm run check` refuses `placeholder: false` without `approved: true`.

### `posts/ka/<slug>.md` — blog
`title`, `description`, `date`, `cover` (photo id), `tags`, `author`, `draft`. Body = Markdown.
URL = `/blog/<file name>`. Drafts are visible in `npm run dev` only.

### `photos.yaml` — photo register
```yaml
- id: market-stall
  file: market-stall.jpg          # in src/assets/photos/
  alt: "ბავშვები შაბათის ბაზრობაზე…" # Georgian description, no child names
  consent: pending                 # signed | pending | none-needed
  source: "Facebook, 2026"
```
Every file in `src/assets/photos/` must be listed (the check fails otherwise). Images are resized and converted
to WebP automatically at build time.

## Interface strings
Button labels, form messages, aria labels: `src/i18n/ui.ts`.
