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
| 11 | Photo consent for the 6 current photos (taken from Facebook) | `photos.yaml` |
| 12 | Story timeline dates | `about.yaml` story |
| 13 | Safety claims (card entry, first aid, background checks…) | `about.yaml` safety |
| 14 | Data retention + privacy text, contact email for data requests | `about.yaml` privacy |
| 15 | IALDS certificate PDF to link | `public/docs/`, `about.yaml` accreditation link |
| 16 | Videos: real clips + YouTube ids | `home.yaml` videos |
| 17 | Weekly question archive: real questions/conclusions, or start fresh from №1 | `questions/ka/` |
| 18 | Real logo file (SVG) | `src/components/ui/Logo.astro`, `public/favicon.svg` |
| 19 | Production domain | `astro.config.mjs`, `public/robots.txt` |
