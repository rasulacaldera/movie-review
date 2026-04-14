---
name: drive-pr
description: "Drive a PR to mergeable state — fix CI failures and address review comments. Use /drive-pr or /drive-pr --once to run one pass."
user-invocable: true
argument-hint: "[--once to run a single pass]"
---

# Drive PR to Mergeable State

Drive the current PR to a green, mergeable state.

## Steps

### 1. Check Current State

```bash
gh pr status
gh pr checks
gh pr view --comments
```

### 2. Fix CI Failures

For each failing check:
1. Read the error output: `gh run view <run-id> --log-failed`
2. Identify root cause
3. Fix the issue
4. Push the fix

### 3. Address Review Comments

For each unresolved review comment:
1. Read the comment carefully
2. If it's a "must fix" — implement the fix
3. If it requires a decision — surface to user with context
4. Mark resolved after fixing

### 4. Verify

After all fixes:
- `npm run typecheck` passes
- `npm run test:unit` passes
- `npm run test:int` passes
- Push all changes

### 5. Loop or Stop

- If `--once` was passed: stop after one pass and report status
- Otherwise: loop until all checks are green and comments resolved

## Report

```
## PR Status
- CI: [green/failing — list failures]
- Review comments: [resolved/N outstanding]
- Blockers: [any items requiring user decision]
```
