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
`name`, `group` (founder | guide | contributor), `role`, `isParent`, `facts` (badges), `photo` (optional),
`since` (optional, e.g. "2025 წლიდან", shown on the author page), `order`. Body = bio.
Founders and guides appear in the About page team block. `contributor` = someone who only writes articles (a parent,
an investor). Investors are a simple list in `about.yaml`. The same file feeds the article author card and the
author page `/articles/authors/<file name>`, so bio and photo are edited in one place.

### `testimonials/ka/<slug>.md`
`name`, `role`, `order`, `approved` (the parent approved this exact wording). Body = quote.
`npm run check` refuses `placeholder: false` without `approved: true`.

### `articles/ka/<slug>.md` — articles (სტატიები)
| Field | Meaning |
| --- | --- |
| `title` | Headline. `titleAccent` (optional) = the words of the title that get the highlight bar. |
| `description` | 1–2 sentences: card text, page lead and Google description. |
| `date` | Publication date (YYYY-MM-DD). Lists are newest first. |
| `author` | File name of a team member in `team/ka/` (without `.md`). |
| `topics` | 1–3 of the fixed list: `method` (სწავლის მეთოდი), `life` (სტუდიის ცხოვრება), `quests` (ქვესტები), `clubs` (კლუბები), `parents` (მშობლებს), `acton` (Acton-ის ფილოსოფია). |
| `cover` | Photo id from `photos.yaml`. `coverCaption` optional. The "published with parents' consent" note shows when the photo's consent is `signed`. |
| `summary` | Optional 1–4 points for the "მოკლედ, თუ 30 წამი გაქვთ" box. |
| `readMinutes` | Optional; otherwise counted from the text (words ÷ 130). |
| `draft` | `true` = only visible in `npm run dev`. |

Body = Markdown. Every `## heading` becomes an entry in the table of contents. `> quote` is shown as a navy quote card.
URLs: `/articles/<file name>`; author pages `/articles/authors/<author>`. Old `/blog/...` links redirect (`public/_redirects`).
Page copy (hero, topic labels and colours, newsletter, trial-week CTA, homepage section 08): `pages/ka/articles.yaml`.

### `photos.yaml` — photo register
```yaml
- id: market-stall
  file: market-stall.jpg          # in src/assets/photos/
  alt: "ბავშვები შაბათის ბაზრობაზე…" # Georgian description, no child names
  consent: signed                  # signed | pending | none-needed (enrolled families: signed via the enrolment contract)
  source: "Facebook, 2026"
```
Every file in `src/assets/photos/` must be listed (the check fails otherwise). Images are resized and converted
to WebP automatically at build time.

## Interface strings
Button labels, form messages, aria labels: `src/i18n/ui.ts`.
