# Acton Academy Tbilisi — website

ექტონის აკადემია · საბურთალო. Learner-driven school for children aged 5–14.

**Stack:** [Astro](https://astro.build) (static) · Markdown/YAML content collections · Cloudflare Pages (+ Functions) ·
Google Sheets via Apps Script for form data · no database, no paid services.

| I want to… | Read |
| --- | --- |
| Edit text with an AI agent or on GitHub (Georgian guide) | [docs/EDITING-GUIDE.ka.md](docs/EDITING-GUIDE.ka.md) |
| Let an AI agent work on this repo | [AGENTS.md](AGENTS.md) (Claude Code also reads [CLAUDE.md](CLAUDE.md)) |
| Understand every content file and field | [docs/CONTENT.md](docs/CONTENT.md) |
| Colours, type, components | [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) · live at `/design-system` |
| Set up form storage (Google Sheets) | [docs/BACKEND.md](docs/BACKEND.md) |
| Deploy / previews / domain | [docs/DEPLOY.md](docs/DEPLOY.md) |
| The FAQ assistant | [docs/ASSISTANT.md](docs/ASSISTANT.md) |
| Add English later | [docs/I18N.md](docs/I18N.md) |
| See what is still placeholder | [docs/OPEN-QUESTIONS.md](docs/OPEN-QUESTIONS.md) · `npm run placeholders` |

## Quick start
```bash
nvm use            # Node 22
npm install
npm run dev        # http://localhost:4321
npm run check      # types + content checks (CI runs this)
npm run build      # static site in dist/
npm run dev:full   # with the Cloudflare form functions, http://localhost:8788
```

## Pages
`/` homepage (10 sections from design S5) · `/about` · `/faq` (FAQ + question-of-the-week archive) · `/blog` ·
`/design-system` (internal style guide).

## How changes flow
branch → pull request → CI (check + build) + Cloudflare preview URL → review → merge to `main` → live in ~1 min.

> **Note:** most current content is placeholder text from the design phase and is marked `placeholder: true`.
> Confirm it with the school before launch (see docs/OPEN-QUESTIONS.md).
