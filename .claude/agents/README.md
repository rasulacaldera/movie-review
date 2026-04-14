# Agents

Specialized personas with defined workflows and expertise. Each agent runs in an isolated context fork and returns a structured summary to the orchestrator.

## Available Agents

| Agent | Purpose | Model | Invoked via |
|-------|---------|-------|-------------|
| `coder` | TDD implementation, self-verification | Opus | `/code` |
| `reviewer` | SOLID/CUPID/clean code review | Opus | `/review` |
| `devils-advocate` | Stress-test proposals and plans | Opus | `/challenge` |
| `repo-sherpa` | Documentation, DX, meta-layer ownership | Opus | `/sherpa` |
| `pii-reviewer` | PII/secrets security scan | Opus | `/review` (included) |
| `test-reviewer` | Test pyramid, naming, BDD alignment | Opus | `/test-review` |
| `playwright-test-planner` | Plan browser test scenarios by exploring the app | Opus | `/browser-test` |
| `playwright-test-generator` | Generate Playwright test files from a plan | Sonnet | `/browser-test` |
| `playwright-test-healer` | Debug and fix failing Playwright tests | Sonnet | direct |

## How Agents Work

Agents are **not** invoked directly — always through a skill:

```
/code "implement movie search"
    │
    ▼
.claude/skills/code/SKILL.md   (context: fork, agent: coder)
    │
    ▼
.claude/agents/coder.md        (runs in isolated fork)
    │
    ▼
Returns summary to main thread (orchestrator)
```

## Agent Definitions

Each agent definition includes:
- **Frontmatter** — name, description, model, color (for UI)
- **Required workflow** — step-by-step process the agent follows
- **Project standards** — which docs to read before working
- **Output format** — structured return summary
- **Anti-patterns** — what to avoid

## Token-Conscious Principle

Agent definitions only include project-specific context and behavioral overrides. They inherit Claude's knowledge of SOLID, Clean Code, and TDD without needing it spelled out.
