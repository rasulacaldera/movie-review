---
name: browser-test
description: "Validate a feature works by driving a real browser with Playwright MCP. No test files — just interactive verification against the running dev server."
user-invocable: true
argument-hint: "[port] [feature description or feature-file-path]"
---

# Browser Test — Interactive Feature Validation

You are the **orchestrator**. You do NOT drive the browser yourself. You spawn a focused sub-agent to do the browser work, monitor its progress, and collect results.

## Step 1: Prepare

Parse `$ARGUMENTS` for:
- **Port** (optional): a number (e.g. `3000`) or `:<port>` format. Defaults to `3000` (Vite dev server).
- **Feature** (optional): a description of what to verify, or a path to a `specs/<AppName>/features/*.feature` file

If a feature file path is given, read it and extract the scenarios into a concrete checklist. If a plain description is given, use it directly. If neither is provided, use the **default smoke test**: app loads, landing page renders, navigation works.

### Resolve the feature

If a feature file was given, read it and turn each scenario into a numbered verification step:

```
Feature file: specs/MovieReviewApp/features/movies/movie-search.feature
Scenarios:
  1. Navigate to search → search for "Inception" → verify results appear
  2. Search for nonexistent movie → verify empty state message
```

### Create artifact directory

```
browser-tests/<feature-name>/<YYYY-MM-DD>/screenshots/
```

## Step 2: Determine data seeding needs

Before verification, decide what data the feature requires.

1. Analyze the verification steps — for each, ask: "What data must already exist for this to be testable?"
2. Build a minimal seeding checklist (e.g., "a movie with title Inception", "a user with 3 reviews")
3. Prefer seeding through the UI where practical
4. Fall back to API calls only when UI seeding is impractical

## Step 3: Spawn the browser agent

Use the **Agent tool** to spawn a sub-agent. Give it everything it needs — port, verification steps, seeding checklist, credentials, artifact path. The sub-agent starts with zero context.

```
You are a browser test agent. Your ONLY job is to drive a browser and verify features.

## Your mission
<paste numbered verification steps here>

## Data seeding
Before verifying, create the minimal data the feature needs:
<paste seeding checklist here>

Only create what is listed above.

## Connection
- App URL: http://localhost:<port>
- API URL: http://localhost:3001
- Browser: Chromium (headless) via Playwright MCP tools
- Save screenshots to: <absolute artifact path>/screenshots/

## Auth
- Check .env.example for auth configuration details
- In development, use any dev bypass mechanism configured in the API

## How to interact
- Use browser_snapshot (accessibility tree) to find elements — faster than screenshots
- Use browser_take_screenshot to capture evidence at each key step
- Use browser_wait_for with generous timeouts (dev mode can be slow)
- Number screenshots sequentially: 01-login.png, 02-dashboard.png, etc.

## Guardrails
- You have a maximum of 40 tool calls (seeding + verification). If not finished, report what you verified and what's left.
- Do NOT debug app issues. If something doesn't work, screenshot it, mark it FAIL, and move on.
- Do NOT modify any source files or investigate root causes.
- Do NOT go off-script. Only verify the steps listed above.
- When done, return a markdown summary table: | # | Step | Result | Screenshot |
```

## Step 4: Collect results

When the sub-agent returns:
1. Parse its summary table
2. Write the report to `browser-tests/<feature-name>/<YYYY-MM-DD>/report.md`:

```markdown
# Browser Test: <feature-name>
**Date:** YYYY-MM-DD
**App:** http://localhost:<port>
**Feature file:** <path if applicable>

## Results

| # | Scenario | Result | Screenshot |
|---|----------|--------|------------|
| 1 | <name>   | PASS   | screenshots/01-xxx.png |

## Failures
<details of any failures>

## Notes
<observations>
```

## Step 5: Report

Return the summary table to the user. Note that `browser-tests/` is gitignored — screenshots are local only.

## Rules

- **You are the orchestrator, not the browser driver.** Spawn a sub-agent for all browser work.
- **Never ask the user for anything.** Ports, features, credentials — all resolved automatically.
- **One sub-agent per run.** If it fails or times out, report the failure — don't retry.
- **Don't create permanent test files.** This is interactive verification only. Use `/test-review` after to decide if scenarios should be promoted to `e2e/` test files.
