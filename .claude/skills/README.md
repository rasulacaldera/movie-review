# Skills

Entry points that accept user commands and invoke agents. Skills bridge `/commands` to the agent layer.

## Available Skills

| Skill | Command | Agent | Purpose |
|-------|---------|-------|---------|
| `orchestrate` | `/orchestrate <req>` | (orchestrator mode) | Full plan → code → review loop |
| `implement` | `/implement #123` | (orchestrator mode) | Fetch GitHub issue → orchestrate |
| `code` | `/code <task>` | coder | Implement with TDD |
| `review` | `/review [focus]` | reviewer | Quality gate (SOLID + CUPID) |
| `challenge` | `/challenge <proposal>` | devils-advocate | Stress-test proposals |
| `sherpa` | `/sherpa <question>` | repo-sherpa | Docs/DX/meta-layer |
| `plan` | `/plan <feature>` | (self-contained) | Create BDD feature file |
| `drive-pr` | `/drive-pr [--once]` | (self-contained) | Fix CI failures + review comments |
| `test-review` | `/test-review <path>` | test-reviewer | Test pyramid, naming, BDD alignment |
| `browser-test` | `/browser-test [port] [feature]` | (orchestrator mode) | Interactive browser verification |
| `create-issue` | `/create-issue <description>` | (self-contained) | Create structured GitHub issue |
| `learn` | `/learn <mistake>` | (self-contained) | Capture mistake in AGENTS.md/GOTCHAS.md |
| `new-app` | `/new-app [name]` | devils-advocate | Discovery conversation → APP_SPEC, feature files, ADRs |

## Skill Structure

Each skill lives in its own directory with a `SKILL.md` file:

```
.claude/skills/
└── code/
    └── SKILL.md    ← skill definition
```

**Key frontmatter properties:**

```yaml
---
name: code
description: "..."       # Shown in skill picker
context: fork            # Creates isolated context (omit for orchestrator skills)
agent: coder             # Agent to invoke (omit for self-contained skills)
user-invocable: true     # Shown as /code command
argument-hint: "[...]"   # Shown in autocomplete
---
```

## Commands vs Skills

| Type | Location | Behavior | Use for |
|------|----------|----------|---------|
| Commands | `.claude/commands/` | Same thread, simple instructions | Utilities, refocus, setup steps |
| Skills | `.claude/skills/` | Can fork context and invoke agents | Delegation, orchestration |
