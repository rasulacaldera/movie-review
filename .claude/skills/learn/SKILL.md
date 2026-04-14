---
name: learn
description: "Learn from mistakes by updating AGENTS.md. Use when a mistake was made that should be prevented in future sessions."
user-invocable: true
argument-hint: "[description of the mistake and correct behavior]"
---

# Learn from Mistakes

You made a mistake. Good — this is an opportunity to prevent it from happening again.

## Process

### 1. Analyze the Mistake

Identify:
- **What went wrong**: The specific action or omission
- **Why it happened**: The reasoning or assumption that led to the mistake
- **Correct behavior**: What should have been done instead

### 2. Formulate the Lesson

Create a concise entry for `AGENTS.md`:
- **Common Mistake**: Brief description of the anti-pattern (what NOT to do)
- **Correct Behavior**: Clear instruction of what TO do instead

The lesson should be:
- Actionable (tells you exactly what to do)
- Specific (not vague platitudes)
- Generalizable (applies beyond this one instance)

### 3. Find the Right Section

Read `AGENTS.md` and identify which section the lesson belongs in:
- **General**: Cross-cutting concerns, workflow issues, process mistakes
- **TypeScript**: Language-specific patterns
- **Orchestration Model**: Agent/skill workflow issues
- Or create a new section if none fits

For app-specific mistakes (domain logic, ORM, auth, etc.), also check `docs/<AppName>/GOTCHAS.md` — the lesson may belong there instead.

### 4. Update the Right File

Add a new row to the appropriate table in `AGENTS.md` or `docs/<AppName>/GOTCHAS.md`:

```markdown
| <Common Mistake> | <Correct Behavior> |
```

### 5. Confirm the Update

Read back the updated section to verify the entry is clear and correctly formatted.

## Arguments

$ARGUMENTS
