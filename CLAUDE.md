# CLAUDE.md

All project instructions for AI agents are in **AGENTS.md** — read it first. It is the single source of truth,
so other agents (Codex, Cursor, Copilot, Gemini…) get the same rules.

@AGENTS.md

## Claude Code specifics

- A SessionStart hook (`.claude/settings.json` → `scripts/assistant/session-start.sh`) shows a Georgian welcome
  and gives you the computer's status. Act on it as docs/assistant/PLAYBOOK.md says, on the first reply.
- Slash commands live in `.claude/commands/` (type `/`): `/start`, `/preview`, `/publish`, `/status`, `/undo`,
  `/new-article`, `/weekly-question`, `/add-faq`, `/edit-content`, `/add-photo`, `/check`, `/placeholders`.
- In the Claude desktop app, show the site in the preview pane (`site` in `.claude/launch.json`).
- Before you say a task is done, run `npm run check && npm run build` and report the result.
- When the person writes in Georgian, answer in Georgian.
