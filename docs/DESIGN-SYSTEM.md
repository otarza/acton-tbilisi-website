# Design system (S4 · bright)

Live reference: **`/design-system`** on any build (not linked from the site, not indexed).
Origin: design round 8 ("S4, all suggestions applied"), approved by the school on 2026-11-21. Source mocks:
`Home4`, `About4`, `Faq4`, `Mobile4` on the design canvas. All future work builds on this design.

The look in one line: **bright cyan `#00C0FF` hero bands with a giant faint "?" shape, heavy navy display type
(Noto Sans Georgian 900), cyan `#7AFDFF` highlight bars behind key words, pill buttons, big rounded cards.**

## Tokens — `src/styles/tokens.css`
Use the CSS variables, never raw hex in components.

| Group | Tokens |
| --- | --- |
| Brand | `--color-navy` #0B1F4A (primary), `--color-navy-2` (hover), `--color-cyan` #00C0FF (hero/CTA bands, lines), `--color-hl` #7AFDFF (highlight bars, accents on navy), `--color-blue` #2F6DCB (labels, links, progress, join box), `--color-blue-dark` (links), `--color-trail` (dashed trails) |
| Text | `--color-ink` body, `--color-muted` captions, `--color-on-dark` body on navy |
| Surfaces | `--color-bg-sky` #EEF6FD alternate sections and soft cards, `--color-bg-ice` callouts, `--color-line`, `--color-line-dashed`, `--color-track`, `--color-qmark` |
| Signals | yellow, green, red (+ `-bright`), teal (+ `-bright`), gold + `--tag-*-bg/fg` pairs |
| Type | one family: `--font-sans` Noto Sans Georgian; display weight `--weight-display` 900; `--text-h1-home`, `--text-h1`, `--text-h2` fluid |
| Shape | radius sm 14 / control 16 / card 26 / big 28 / box 36 / pill 999; `--tap` 48px; `--section-y` 96px (56px mobile); `--wrap` 1200px |

Fonts are self-hosted via `@fontsource` (Georgian + Latin subsets only), no Google Fonts request.

## Rules
- **No CSS uppercase on Georgian.** Use `<Caps text="…">` (converts to Mtavruli characters).
- **No white text on cyan** (2.1:1). On `.bg-cyan` everything is navy; highlight bars become white there automatically.
- **Highlight bars carry navy text**, always. `#7AFDFF` text is fine on navy but not on `--color-blue`
  (about 4.2:1), so small text inside the blue "join" box is white (deliberate deviation from the S4 mock).
- Headings: `.display` (900). Accent words: `.hl` highlight bar (SectionHeading's `accent` prop does this for you).
  `.accent` is only for small blue words such as dates.
- Giant "?" shapes: `.qmark-band` on the container + `<span class="qmark" aria-hidden="true">?</span>`
  (`.qmark--big` on the homepage). Every page top has one (BaseLayout).
- Big hero headings are capped by their column width (`9.4cqi`) so long Georgian words never overflow.
- Touch targets ≥ 48px; visible focus ring (cyan-highlight on navy); `prefers-reduced-motion` disables animation.
- Mobile first; test at 390px. Sticky bottom action bar on phones (`MobileActionBar`).

## Global utility classes — `src/styles/global.css`
Layout `.wrap .sec .stack .row .grid-auto` (tune with `--stack-gap`, `--row-gap`, `--min`, `--grid-gap`);
backgrounds `.bg-cyan .bg-sky .bg-navy` (+ `.qmark-band`, `.qmark`); type `.display .h1 .h2 .h3 .hl .lead .muted .small .xs .accent .strong-navy`;
`.card` + `--sky --outline --float --dashed --glass` (glass = on navy); `.bar` progress; `.av` avatar; `.tag` + colour; `.badge` dashed circle;
`.choice` (pill toggle using `aria-pressed`/`aria-selected`), `.chip` (big answer pill), `.opt` (quiz answer);
`.acc` accordion around `<details>`; `.prose` for Markdown.

## Components
| Folder | Components |
| --- | --- |
| `ui/` | `Button` (variant primary/light/ghost/soft/hl, size sm/md/lg), `SectionHeading` (label + h1/h2 + highlighted accent), `SectionLabel` (navy number circle), `Caps`, `Photo` (by register id, responsive), `Logo` (placeholder shield, white on cyan; swap SVG for real logo) |
| `layout/` | `AnnouncementBar`, `Header` (desktop nav + mobile menu), `Footer`, `MobileActionBar` (book / Messenger / call + bottom-sheet form) |
| `shared/` | `LeadForm`, `WeeklyQuestion` (voting), `Assistant`, `Countdown`, `PageHero` (cyan band hero), `CtaBand` (cyan band), `PostCard` |
| `home/` | One component per homepage section, numbered 01–10 like the design |
| `about/` | `TeamExplorer`, `ConsentDemo` |

Interactive components use a small inline `<script>`; each finds its root by a `data-*` attribute.

## Replacing the logo
Put the real logo SVG in `src/assets/` and swap the inline SVG in `src/components/ui/Logo.astro` and
`public/favicon.svg`. Keep the shield white on cyan and navy text.
