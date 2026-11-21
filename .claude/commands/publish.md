---
description: გაგზავნა — check and send the current change for approval
argument-hint: "[short description]"
---
Follow docs/assistant/PLAYBOOK.md section 4, step 4. Summarise the change in Georgian for the proposal body
(what changed, which page, what is still unconfirmed), write it to a temp file, then run
`node scripts/assistant/flow.mjs publish "<short English title>" --body-file <file>`. $ARGUMENTS
Give the person the link and explain that the approver publishes it. Never merge.
