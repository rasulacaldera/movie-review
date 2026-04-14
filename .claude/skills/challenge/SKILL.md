---
name: challenge
description: "Stress-test an architecture proposal, feature plan, or technical decision. Invokes the devils-advocate agent to find weaknesses before you commit."
context: fork
agent: devils-advocate
user-invocable: true
argument-hint: "[proposal, feature file path, or description]"
---

Stress-test the following proposal:

$ARGUMENTS

Execute your full challenge protocol across all 10 dimensions. Return structured findings with verdict and what must be addressed before proceeding.
