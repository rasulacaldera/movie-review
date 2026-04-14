---
name: create-issue
description: "Create a well-structured GitHub issue with a template and labels."
user-invocable: true
argument-hint: "[description of the issue]"
---

# Create GitHub Issue

Create a standardized GitHub issue for: $ARGUMENTS

## Step 0: Validate Arguments

If `$ARGUMENTS` is empty, show usage and stop:

```
Usage: /create-issue <description of the issue>

Examples:
  /create-issue Fee deduction runs twice when game is marked played
  /create-issue Add CSV export for transaction history
  /create-issue Upgrade Drizzle to latest
  /create-issue Add chore assignment bulk import (priority: P1, size: M)

You can include optional metadata in parentheses:
  - priority: P0-P2    — issue priority
  - size: XS/S/M/L/XL  — effort estimate
```

## Step 1: Detect Issue Type

Analyze `$ARGUMENTS` to determine the issue type:

| Type | Signals |
|------|---------|
| **BUG** | "bug", "error", "crash", "broken", "fix", "fails", "500", "throws", "regression", "duplicate", "wrong" |
| **FEAT** | "add", "new", "support", "implement", "enable", "feature" |
| **CHORE** | "upgrade", "refactor", "cleanup", "migrate", "update dependency", "maintenance"; references to `.claude/`, agents, skills, `AGENTS.md` |

If ambiguous, default to **FEAT**.

**Confirm the detected type with the user before proceeding.**

## Step 2: Parse Optional Metadata

Extract from `$ARGUMENTS`:
- **Priority**: P0, P1, or P2
- **Size**: XS, S, M, L, or XL

## Step 3: Create the Issue

Use gh CLI to create the issue. Construct the body using the appropriate template:

**Bug Report body:**
```
## Describe the bug
<description>

## Steps to reproduce
1.
2.

## Expected behavior

## Actual behavior

## Additional context
```

**Feature Request body:**
```
## Problem
<description>

## Proposed solution

## Alternatives considered

## Additional context
```

**Chore body:**
```
## Description
<description>

## Context

## Scope

## Additional context
```

Run:
```bash
gh issue create \
  --title "<title>" \
  --body "<body>" \
  --label "<bug|feature|chore>"
```

**Important:** Never include real member names, real emails, real payment IDs, or any PII in the issue body — issues may be public.

## Step 4: Report

Display the created issue URL and number.

Ask: **Would you like to start implementing this? Run `/implement #<N>` to begin.**
