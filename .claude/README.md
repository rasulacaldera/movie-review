# Claude Code Orchestration System

This document explains how Claude Code agents and skills work together in this repository.

## Architecture Overview

```
User Request
     │
     ▼
┌─────────────────────────────────────────────────────────────────────┐
│  MAIN THREAD (Orchestrator)                                         │
│  - Holds requirements                                               │
│  - Delegates code work to agents                                    │
│  - Verifies outcomes                                                │
│  - Does NOT read/write code directly                                │
└─────────────────────────────────────────────────────────────────────┘
     │                         │                         │
     │ /code                   │ /review                 │ /browser-test
     ▼                         ▼                         ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────┐
│  CODER AGENT     │  │  REVIEWER AGENT  │  │  BROWSER VERIFICATION    │
│  (context: fork) │  │  (context: fork) │  │  (interactive)           │
│  - TDD workflow  │  │  - SOLID/CUPID   │  │  - Drives real browser   │
│  - Returns       │  │  - Returns       │  │  - Screenshots + report  │
│    summary       │  │    findings      │  │  - No test files         │
└──────────────────┘  └──────────────────┘  └──────────────────────────┘
```

## Directory Structure

```
.claude/
├── agents/             # Agent definitions (personas with workflows)
│   ├── coder.md        # TDD implementation agent
│   ├── reviewer.md     # SOLID/CUPID/clean code reviewer
│   ├── repo-sherpa.md  # Meta-layer ownership (docs, agents, DX)
│   └── devils-advocate.md  # Stress-test proposals and plans
├── skills/             # Skills (entry points that invoke agents)
│   ├── orchestrate/    # /orchestrate <requirements>
│   ├── implement/      # /implement #123 (invokes /orchestrate)
│   ├── code/           # Delegates to coder agent
│   ├── review/         # Delegates to reviewer agent
│   ├── challenge/      # Delegates to devils-advocate
│   ├── sherpa/         # Delegates to repo-sherpa
│   ├── plan/           # Creates feature files
│   └── drive-pr/       # Fix CI failures + address review comments
└── commands/           # Slash commands (non-agent utilities)
    ├── refocus.md      # /refocus — realign with BDD workflow
    └── worktree.md     # /worktree — create git worktree
```

## Concepts

### Agents (.claude/agents/)

Agents are **specialized personas** with defined workflows and expertise. They run in isolated context forks and return structured summaries.

| Agent | Purpose | Model |
|-------|---------|-------|
| `coder` | TDD implementation, self-verification | Opus |
| `reviewer` | SOLID/CUPID/Clean Code review | Opus |
| `devils-advocate` | Stress-test proposals, plans, architecture | Opus |
| `repo-sherpa` | Documentation, DX, meta-layer | Opus |

Agents are invoked **only through skills**, never directly.

### Skills (.claude/skills/)

Skills are **entry points** that:
1. Accept user commands (`/code`, `/review`, `/sherpa`)
2. Invoke agents via `context: fork` + `agent: <name>`
3. Pass arguments to the agent

**Key frontmatter properties:**
```yaml
---
name: code
context: fork        # Creates isolated context
agent: coder         # Agent to invoke
user-invocable: true # Can be triggered with /code
---
```

### The Delegation Pattern

```
/code "implement login"
    │
    ▼
skills/code/SKILL.md
    │ context: fork
    │ agent: coder
    ▼
agents/coder.md (runs in fork)
    │
    ▼
Returns summary to main thread
```

## Orchestration Workflow

When implementing features, the main thread becomes an **orchestrator** that manages the loop:

### Activation (Opt-In)

Orchestration mode is explicit:
1. `/orchestrate <requirements>` - Direct entry with any requirements
2. `/implement #123` - Entry point for GitHub issues (invokes `/orchestrate`)

### The Loop

```
┌─────────────────────────────────────────────────────────┐
│ 1. PLAN                                                 │
│    - Check for feature file in specs/features/         │
│    - If missing → /plan to create one                   │
│    - Read feature file for acceptance criteria          │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ 2. CHALLENGE                                            │
│    - /challenge stress-tests the feature plan          │
│    - Finds hidden assumptions, failure modes            │
│    - Issues? → update feature file, re-challenge        │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ 3. USER APPROVAL                                        │
│    - Show feature file to user                          │
│    - STOP — do not proceed without explicit approval    │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ 4. IMPLEMENT                                            │
│    - /code with feature file and requirements           │
│    - Coder implements with TDD, returns summary         │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ 5. VERIFY                                               │
│    - Check summary against acceptance criteria          │
│    - Incomplete? → /code again with feedback            │
│    - Max 3 iterations, then escalate                    │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ 6. REVIEW                                               │
│    - /review for quality gate                           │
│    - Issues? → /code with reviewer feedback             │
│    - Approved? → Continue                               │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ 7. BROWSER VERIFICATION (conditional)                   │
│    - Only for browser-observable behavior               │
│    - /browser-test → screenshots + report               │
│    - Fail? → /code with findings, re-verify             │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ 8. COMPLETE                                             │
│    - Report summary to user (code + verification)       │
└─────────────────────────────────────────────────────────┘
```

## Role Hierarchy

```
ORCHESTRATOR (main thread)
│
├── /plan  ──────► (self-contained skill)
│                  - Feature file creation
│                  - Acceptance criteria
│
├── /code  ──────► CODER AGENT
│                  - Implementation work
│                  - TDD workflow
│                  - Test execution
│
├── /review ─────► REVIEWER AGENT
│                  - Quality gate (SOLID + CUPID)
│                  - Clean code inspection
│
├── /challenge ──► DEVILS-ADVOCATE
│                  - Stress-test proposals and plans
│                  - Find hidden assumptions
│                  - Failure mode analysis
│
├── /browser-test ► BROWSER VERIFICATION (interactive)
│                  - Drives real browser via Playwright MCP
│                  - Screenshots + report
│
└── /sherpa ─────► REPO-SHERPA
                   - Documentation
                   - DX improvements
                   - Meta-layer ownership
```

## Quick Reference

| Command | Agent | Purpose |
|---------|-------|---------|
| `/orchestrate <req>` | (orchestrator mode) | Enter orchestration mode |
| `/implement #123` | (orchestrator mode) | Fetch issue → invoke `/orchestrate` |
| `/plan <feature>` | Plan (built-in) | Create feature file |
| `/code <task>` | coder | Implement with TDD |
| `/review <focus>` | reviewer | Quality review |
| `/challenge <proposal>` | devils-advocate | Stress-test proposals |
| `/browser-test [port] [feature]` | (interactive) | Verify feature in real browser |
| `/sherpa <question>` | repo-sherpa | Docs/DX/meta-layer |

## Token-Conscious Principle

Agents inherit Claude's knowledge of standard practices (SOLID, Clean Code, TDD). Agent definitions only include:
- Project-specific context
- File references to project standards
- Behavioral overrides (tone, output format)
