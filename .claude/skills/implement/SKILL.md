---
name: implement
description: "Fetch a GitHub issue and invoke /orchestrate. Use /implement #123 to start implementation from an issue."
user-invocable: true
argument-hint: "#<issue-number>"
---

Fetch the GitHub issue and invoke orchestration mode.

## Steps

1. Fetch the issue: `gh issue view $ARGUMENTS`
2. Read the full issue — title, body, labels, acceptance criteria
3. Classify as bug or feature (see orchestrate skill for detection rules)
4. Invoke `/orchestrate` with the full issue context

Pass the complete issue content (title + body + labels) as requirements to `/orchestrate`.
