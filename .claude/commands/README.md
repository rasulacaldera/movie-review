# Commands

Simple slash commands that provide instructions to Claude without spawning agents or forking context.

## Commands vs Skills

| Aspect | Commands | Skills |
|--------|----------|--------|
| Location | `.claude/commands/` | `.claude/skills/` |
| Invocation | `/command` | `/skill` |
| Context | Same thread | Can fork (`context: fork`) |
| Agents | Reference by name | Invoke via `agent:` frontmatter |
| Complexity | 1-5 lines, simple instructions | Workflows, may spawn agents |

**Rule of thumb**: If it just tells Claude what to do, it's a command. If it spawns an agent or runs a multi-step workflow, it's a skill.

## Available Commands

| Command | Purpose |
|---------|---------|
| `/onboard` | Orientation via repo-sherpa + code review |
| `/refocus` | Compact context and realign with BDD workflow |
| `/worktree` | Create git worktree with proper setup |
| `/review` | Quick review invocation (same thread) |
| `/sherpa` | Quick sherpa invocation (same thread) |
| `/test-review` | Quick test-reviewer invocation (same thread) |
| `/learn` | Capture a mistake in AGENTS.md or GOTCHAS.md |
| `/new-app` | Discovery conversation → APP_SPEC, feature files, ADRs for a new app |

Note: `/review`, `/sherpa`, and `/test-review` commands run in the same thread. The corresponding skills (`skills/review/`, `skills/sherpa/`, `skills/test-review/`) use `context: fork` for isolated agent runs — prefer skills when you need clean separation or are delegating from an orchestrator.

## Writing Commands

Commands should be 1-5 lines of instructions. If a command invokes an agent, reference it by name — the agent has its own instructions.

## Related

- `.claude/skills/` — For workflows that spawn agents
- `.claude/agents/` — Agent definitions
