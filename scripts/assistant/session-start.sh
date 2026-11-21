#!/bin/sh
# Claude Code SessionStart hook. Works even when Node is not installed yet.
cd "$(dirname "$0")/../.." || exit 0
if command -v node >/dev/null 2>&1; then
  exec node scripts/assistant/hello.mjs --hook
fi
cat <<'JSON'
{"systemMessage":"გამარჯობა! 👋 ეს ექტონის აკადემიის საიტია. მომწერეთ „დამეხმარე“ და ერთად მოვამზადებთ ყველაფერს.","hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"Node.js is NOT installed on this computer. Follow docs/assistant/PLAYBOOK.md, section 'First-time setup'. Whatever the first message is, greet in Georgian and guide them to install Node.js LTS from https://nodejs.org (the macOS .pkg installer), then reopen this conversation."}}
JSON
