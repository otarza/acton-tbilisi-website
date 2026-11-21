# Design system (S5 · calm navy)

Live reference: **`/design-system`** on any build (not linked from the site, not indexed).
Origin: design round 9 ("S5"), El Salvador-inspired calm version: navy `#0C2A50`, white, Noto Serif Georgian headings.

## Tokens — `src/styles/tokens.css`
Use the CSS variables, never raw hex in components.

| Group | Tokens |
| --- | --- |
| Brand | `--color-navy` (primary), `--color-navy-2`, `--color-blue` (accent words), `--color-blue-dark` (links), `--color-blue-soft` (accent on navy), `--color-cyan` (logo, lines only) |
| Text | `--color-ink` body, `--color-muted` captions, `--color-on-dark` body on navy |
| Surfaces | `--color-bg-mist` heroes, `--color-bg-paper` alternate sections, `--color-bg-blue` price, `--color-bg-ice` callouts, `--color-line`, `--color-track` |
| Signals | yellow, green, red, teal, gold + `--tag-*-bg/fg` pairs |
| Type | `--font-sans` Noto Sans Georgian, `--font-serif` Noto Serif Georgian (headings), sizes `--text-*`, `--text-h1/h2` fluid |
| Shape | radius button 6 / control 8 / card 12, `--tap` 48px, `--section-y` 112px (56px mobile), `--wrap` 1200px |

Fonts are self-hosted via `@fontsource` (Georgian + Latin subsets only), no Google Fonts request.

## Rules
- **No CSS uppercase on Georgian.** Use `<Caps text="…">` (converts to Mtavruli characters).
- **No white text on cyan** (2.1:1). Cyan is for the logo, timeline lines, focus accents.
- Headings: `.display` (serif). Accent part: `.accent` (blue; light blue on navy automatically).
- Touch targets ≥ 48px; visible focus ring; `prefers-reduced-motion` disables animation.
- Mobile first; test at 390px. Sticky bottom action bar on phones (`MobileActionBar`).
- Deliberate deviation from the S5 mock: the "join" block is navy instead of `#2F6DCB`, because light-blue
  accent text on `#2F6DCB` fails contrast.

## Global utility classes — `src/styles/global.css`
Layout `.wrap .sec .stack .row .grid-auto` (tune with `--stack-gap`, `--row-gap`, `--min`, `--grid-gap`);
backgrounds `.bg-mist .bg-paper .bg-navy`; type `.display .h1 .h2 .h3 .lead .muted .small .xs .accent .strong-navy`;
`.card` + `--paper --outline --float --dashed`; `.bar` progress; `.av` avatar; `.tag` + colour;
`.choice` (toggle button using `aria-pressed`); `.acc` accordion around `<details>`; `.prose` for Markdown.

## Components
| Folder | Components |
| --- | --- |
| `ui/` | `Button` (variant primary/light/ghost/soft, size sm/md/lg), `SectionHeading` (label + h1/h2 + accent), `SectionLabel`, `Caps`, `Photo` (by register id, responsive), `Logo` (placeholder shield; swap SVG for real logo) |
| `layout/` | `AnnouncementBar`, `Header` (desktop nav + mobile menu), `Footer`, `MobileActionBar` (book / Messenger / call + bottom-sheet form) |
| `shared/` | `LeadForm`, `WeeklyQuestion` (voting), `Assistant`, `Countdown`, `PageHero`, `CtaBand`, `PostCard` |
| `home/` | One component per homepage section, numbered 01–10 like the design |
| `about/` | `TeamExplorer`, `ConsentDemo` |

Interactive components use a small inline `<script>`; each finds its root by a `data-*` attribute.

## Replacing the logo
Put the real logo SVG in `src/assets/` and swap the inline SVG in `src/components/ui/Logo.astro` and
`public/favicon.svg`. Keep the navy/cyan contrast rules.
