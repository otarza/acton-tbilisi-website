# CLAUDE.md

All project instructions for AI agents are in **AGENTS.md** — read it first. It is the single source of truth,
so other agents (Codex, Cursor, Copilot, Gemini…) get the same rules.

@AGENTS.md

## Claude Code specifics

- Slash commands for common jobs live in `.claude/commands/` (type `/` in Claude Code):
  `/new-post`, `/weekly-question`, `/add-faq`, `/edit-content`, `/add-photo`, `/check`, `/placeholders`.
- Before you say a task is done, run `npm run check && npm run build` and report the result.
- When the person writes in Georgian, answer in Georgian.
