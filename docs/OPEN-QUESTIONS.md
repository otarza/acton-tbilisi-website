# Open questions (need the school, not a developer)

Most text came from the design rounds (S4, approved 2026-11-21) and is **invented placeholder** content. Nothing below should go live
unconfirmed. `npm run placeholders` shows the files; this list explains what to ask.

| # | Question | Where it is used |
| --- | --- | --- |
| 1 | **State authorisation (NCEQE)**: do we have it? How do diplomas/transfer work? | `faq/ka/state-authorisation.md`, `about.yaml` accreditation card, assistant |
| 2 | **Naming**: "Acton Academy (ექტონის აკადემია)" vs "American School (ამერიკული სკოლა)"; which name, which domain, which Facebook page? | `settings/ka.yaml` (logoSubtitle, email, social links), footer, testimonial #1 |
| 3 | Prices: 1000 ₾/month confirmed? Registration fee (300 ₾?), sibling discount (10%?), annual payment discount, what's included | `home.yaml` price, `faq/ka/price*.md`, `extra-costs.md`, `payment.md` |
| 4 | Price comparison numbers (other schools) — keep, source, or remove? | `home.yaml` price.comparison |
| 5 | Daily schedule and hours | `home.yaml` day, `faq/ka/hours.md` |
| 6 | Studio ages, group sizes and ratios | `studios/ka/*.md`, `about.yaml` stats/safety |
| 7 | Address (street number) | `settings/ka.yaml` |
| 8 | Open-day and next exhibition dates | `settings/ka.yaml` announcement, nextExhibition |
| 9 | Team: names, roles, bios approved by each person; founders/investors list public? | `team/ka/*.md`, `about.yaml` investors |
| 10 | Parent quotes: real wording + each parent's approval | `testimonials/ka/*.md` (`approved: true`) |
| 11 | ~~Photo consent for the 6 current photos~~ Answered 2026-11-21: the enrolment contract covers public photo use | `photos.yaml` |
| 12 | Story timeline dates | `about.yaml` story |
| 13 | Safety claims (card entry, first aid, background checks…) | `about.yaml` safety |
| 14 | Data retention + privacy text, contact email for data requests | `about.yaml` privacy |
| 15 | IALDS certificate PDF to link | `public/docs/`, `about.yaml` accreditation link |
| 16 | Videos: real clips + YouTube ids | `home.yaml` videos |
| 17 | Weekly question archive: real questions/conclusions, or start fresh from №1 | `questions/ka/` |
| 18 | Real logo file (SVG) | `src/components/ui/Logo.astro`, `public/favicon.svg` |
| 19 | Production domain | `astro.config.mjs`, `public/robots.txt` |
| 20 | Articles: all 8 sample articles (titles, texts, dates) are from the design. Replace with real ones or delete | `articles/ka/` |
| 21 | Which team members write articles, and their author bios (currently `placeholder: true`) | `team/ka/` |
| 22 | Will the school really send a weekly email? If not, set `newsletter.enabled: false` | `pages/ka/articles.yaml` |

## After-school clubs (added 2026-11-24)
Confirmed by Otar: the 10 clubs, ages 5–17, children from other schools welcome, twice a week on weekdays,
16:00–18:00, 150 GEL per club per month, phone 500 50 36 05.
Still placeholder (`placeholder: true`, shown as ნიმუში on previews):
- which weekdays each club meets (`days` in `src/content/clubs/ka/*.md`)
- each club's tagline, description, activities and takeaways (drafted for the design)
- the typical session timeline (`pages/ka/clubs.yaml → club.timeline`)
- each club's guide (name + short bio)
- group size (max children per club)
- trial visit rule ("can my child come once first?")
- photos for the 6 clubs without one (robotics, literature, puppet theatre, hiking, AI and coding, table tennis)
- the Google Apps Script (`google/apps-script/Code.gs`) must be redeployed for club sign-ups to reach the sheet

