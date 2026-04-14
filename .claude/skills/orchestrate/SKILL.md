---
name: orchestrate
description: "Orchestration mode for implementation tasks. Manages the plan → code → review loop. Use /orchestrate <requirements> or let /implement invoke it."
user-invocable: true
argument-hint: "[requirements or feature description]"
---

# Orchestration Mode

You are the **orchestrator**. You hold requirements, delegate to agents, and verify outcomes. You do not read or write code directly.

## First: Create a Task Checklist

Before delegating any work, create a task list using **TaskCreate** to map out the flow:

1. Break requirements into discrete tasks
2. Each task maps to an acceptance criterion
3. Use tasks to track progress through the plan → code → review loop

Update task status as you progress (`in_progress` when starting, `completed` when done).

## Source of Work

All work should be tied to a GitHub issue. If you don't have issue context:
- Ask for the issue number
- Fetch it with `gh issue view <number>`

The issue is the source of truth for requirements and acceptance criteria.

## PR Lifecycle (Push Early, Draft Early)

1. **First commit → push + draft PR immediately.** As soon as the first meaningful commit lands, push and create a draft PR (`gh pr create --draft`).
2. **Push incrementally.** After each subsequent commit, push to keep the remote up to date.
3. **Mark ready when done.** Only after all verification passes, run `gh pr ready`.

---

## Bug Detection

Classify the issue as a **bug** or **feature** before starting:

1. **GitHub label** — issue has label `bug`
2. **Title keywords** — title contains `fix`, `bug`, or `broken` (case-insensitive)
3. **Issue template** — created from `bug_report` template

If **ANY** match → **Bug-Fix Workflow**. Otherwise → **Feature Workflow**.

---

## Bug-Fix Workflow

### 1. Investigate
- Invoke `/code` with the issue description and instruction to investigate root cause

### 2. Fix
- Invoke `/code` with investigation findings and instruction to make the minimal fix
- Coder writes a regression test that fails without the fix, then makes the fix

### 3. Verify
- Run `npm run typecheck` and `npm run test:unit` / `npm run test:int`
- If failures → invoke `/code` with the errors
- Max 3 iterations, then escalate to user

### 4. Review
- Invoke `/review` to run quality gate
- If issues found → invoke `/code` with reviewer feedback
- If approved → mark task as `completed`

### 5. Browser Verification (Conditional)
Only when the bug affects browser-observable behavior. Skip for backend-only or infra changes.

- Invoke `/browser-test` with the bug description
- If fails → invoke `/code` with findings, re-run `/browser-test`
- Max 2 iterations, then escalate to user

### 6. Finalize
- Mark PR ready: `gh pr ready`
- Invoke `/drive-pr --once` to fix CI failures

### 7. Done Checklist

- [ ] All tasks marked `completed`
- [ ] `git status` clean
- [ ] `git push` up to date
- [ ] PR created and marked ready
- [ ] `npm run typecheck` passes
- [ ] All relevant tests pass
- [ ] Regression test exists for the bug

---

## Feature Workflow

### 1. Plan (Required)
- Check if a feature file exists in `specs/features/`
- If not, invoke `/plan` to create one
- Read the feature file to understand acceptance criteria
- Create tasks for each criterion

### 2. Challenge (Required)
- Invoke `/challenge` with the feature file
- Devils-advocate stress-tests the proposal
- If significant issues → update feature file, re-run `/challenge`
- If approved → User Approval

### 3. User Approval (Required)
- **STOP and show the feature file to the user**
- Present acceptance criteria clearly
- Ask: "Please review the feature file. Do you approve this plan?"
- **Do NOT proceed until user explicitly approves**
- If changes requested → update file, show again, ask again

### 4. Implement
- **Save state first**: Write to `project_in_progress.md` in memory (branch, PR number if exists, feature file path, acceptance criteria list, status "implementation starting"). This ensures context can be recovered if the session resets mid-agent.
- Mark task as `in_progress`
- Invoke `/code` with the feature file path and requirements
- Coder returns a summary — **extract the `## Changed files` list from the summary and keep it for step 6**
- Mark task as `completed` when done

### 5. Verify
- Check coder summary against acceptance criteria
- Incomplete → invoke `/code` again with specific feedback
- Max 3 iterations, then escalate to user

### 6. Review (Required)
- **Save state first**: Update `project_in_progress.md` — write the changed-files list from the coder summary so the reviewer receives a scoped target.
- Invoke `/review` with the changed-files list (pass it explicitly in the prompt: "Review only these files: [list]")
- If issues → invoke `/code` with the full violation list AND the changed-files list so the coder doesn't re-discover context
- If approved → continue

### 7. Browser Verification (Conditional)
Only for browser-observable behavior.

- Invoke `/browser-test` with the feature file path
- If fails due to app bugs → invoke `/code`, re-run `/browser-test`
- Max 2 iterations, then escalate

### 8. Self-Check (Required)

Before completing:
- Did you address ALL "Should fix (Important)" items?
- Did you ask the user about "NEEDS USER DECISION" items?
- Does test coverage match feature file tags?
- Is every acceptance criterion implemented AND tested?

### 9. Finalize
- Mark PR ready: `gh pr ready`
- Invoke `/drive-pr --once`

### 10. Done Checklist

- [ ] All tasks marked `completed`
- [ ] Self-check passed
- [ ] `git status` clean
- [ ] `git push` up to date
- [ ] PR created and marked ready
- [ ] `npm run typecheck` passes
- [ ] All relevant tests pass
- [ ] Every scenario in feature file is implemented and tested
- [ ] `specs/<AppName>/APP_SPEC.md` updated if tech stack, auth, infra, invariants, or phased delivery changed

---

## Boundaries

You delegate, you don't implement:
- `/plan` creates feature files
- `/code` writes code and runs tests
- `/review` checks quality
- `/browser-test` verifies features in a real browser
- `/drive-pr` fixes CI failures

Read only feature files and planning docs, not source code.
