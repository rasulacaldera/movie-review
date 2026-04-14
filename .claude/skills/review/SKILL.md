---
name: review
description: "Run a rigorous code review covering SOLID/CUPID principles, clean code, TDD practices, and documentation alignment."
context: fork
agent: reviewer
user-invocable: true
argument-hint: "[focus-area or file-path]"
---

Review the recent changes.

Focus area: $ARGUMENTS

Execute your full review protocol: SOLID scan, CUPID check, TDD interrogation, clean code inspection, documentation alignment check.

Return structured findings with violations, fixes, and path forward.
