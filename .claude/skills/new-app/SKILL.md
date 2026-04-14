---
name: new-app
description: "Start a new application in the monorepo. Runs a structured discovery conversation, then iterates on APP_SPEC.md, BDD feature files, and ADRs. Does NOT scaffold code — that comes after the spec is approved."
user-invocable: true
argument-hint: "[app name or description]"
---

# New App — Discovery to Spec

You are a product and architecture collaborator. Your job is to understand the new application deeply before writing a single file.

Do not scaffold code. Do not create directories. By the end of this skill, the deliverables are:
- `specs/<AppName>/APP_SPEC.md`
- `specs/<AppName>/features/<domain>/<feature>.feature` (first set, iterated with the user)
- `docs/<AppName>/adr/` (key architectural decisions)
- `docs/<AppName>/DOMAIN_GUIDE.md` (domain model distilled from the conversation)

---

## Phase 1: Discovery

Ask the user the following questions. Do not dump them all at once — ask 2-3 at a time, wait for answers, then continue. Adapt based on what they tell you.

**App identity:**
- What is the app called? What does it do in one sentence?
- Who are the actors? (Who uses it, and in what roles?)
- What problem does it solve that isn't already solved by an existing tool?

**Domain model:**
- What are the core entities? (The nouns — what does the app manage?)
- What are the key actions? (The verbs — what do actors do with those entities?)
- Are there any invariants or business rules that are non-negotiable?

**Boundaries:**
- What is explicitly OUT of scope for this app?
- Are there external systems to integrate with? (Payment providers, auth, email, etc.)
- What's the delivery phase plan — what's Sprint 1 vs later?

**Technical preferences:**
- Any constraints on the tech stack, or should we follow the monorepo defaults (Node/Express/TypeScript + React/Vite)?
- Any infrastructure requirements (cloud provider, specific DBs, third-party services)?

Take notes as the user answers. Build a mental model of the domain before moving on.

---

## Phase 2: Challenge

Before writing anything, invoke **devils-advocate** with the concept as gathered from the conversation.

Pass the summary of what you've learned: actors, domain model, key invariants, integration points, and anything that felt ambiguous or risky.

Ask devils-advocate to challenge:
- Domain model completeness (missing entities? conflated concepts?)
- Invariant gaps (what business rules hasn't the user thought of?)
- Integration risks (what could go wrong with external systems?)
- Scope creep vectors (what will inevitably get added to Sprint 1?)

Present the devil's advocate findings to the user. Ask them to respond to each challenge. Update your understanding based on their answers.

---

## Phase 3: Write APP_SPEC.md

Once the user has responded to the challenges and you have a clear picture, write `specs/<AppName>/APP_SPEC.md`.

Follow this structure:

```markdown
# <AppName> — Application Specification

## Overview
[One paragraph. What it does, who it's for, what problem it solves.]

## Actors
[Table: Actor | Description | Key Capabilities]

## Domain Model
[Core entities with their key fields and relationships. Note invariants.]

## Business Rules
[Non-negotiable rules as a numbered or bulleted list.]

## Tech Stack
[Table: Layer | Technology | Notes — follow monorepo defaults unless user specified otherwise]

## System Architecture
[ASCII diagram or prose: browser → API → DB, any external integrations]

## API Surface
[High-level list of endpoint groups, not full OpenAPI]

## Integration Points
[External systems, webhooks, auth provider, payment provider, etc.]

## Non-Functional Requirements
[Performance, security, availability — only what was explicitly discussed]

## Phased Delivery
[Sprint 1: core, Sprint 2+: extensions. Be honest about what's realistic.]
```

Show the draft to the user. Iterate until they are satisfied.

---

## Phase 4: Identify Feature Domains

From the APP_SPEC, extract the feature domains. These become the subdirectory structure under `specs/<AppName>/features/`.

Present the proposed domain list to the user. Example:
```
specs/<AppName>/features/
  auth/
  movies/
  reviews/
  watchlist/
  ...
```

Ask: "Does this cover everything? Any domains missing or that should be merged?"

Get explicit approval before moving on.

---

## Phase 5: Write Feature Files (iterative)

Work through each domain one at a time. For each domain:

1. Draft the `.feature` file using Gherkin (`Feature`, `Scenario`, `Given/When/Then`)
2. Tag scenarios with `@unit` or `@integration`
3. Keep each scenario focused on a single invariant or behaviour
4. Show the draft to the user and ask: "Anything missing? Any scenario that feels wrong?"
5. Iterate until approved, then move to the next domain

Do not move to the next domain until the current one is approved.

---

## Phase 6: Write ADRs

After the feature files are drafted, identify the key architectural decisions. Write one ADR per decision to `docs/<AppName>/adr/`.

Follow the template at `docs/adr/TEMPLATE.md`. Each ADR needs:
- Context (why is this a decision?)
- Decision (what did we choose?)
- Consequences (trade-offs)
- Enforcement (how will this be upheld in code/CI?)

Typical ADRs for a new app:
- Monorepo tooling (or confirm it inherits from monorepo defaults — short ADR)
- Tech stack (if any deviations from defaults)
- Auth approach
- Any domain-specific data or consistency decisions
- External integration choices

Show each ADR to the user for approval before writing the next.

---

## Phase 7: Write DOMAIN_GUIDE.md

Distil everything learned into `docs/<AppName>/DOMAIN_GUIDE.md`. This is the reference document agents and developers read before working on the app.

Structure:
- Core entities (table: entity | key fields | invariants)
- Business rules (numbered list)
- Terminology (any domain-specific words with precise definitions)
- Common mistakes to avoid (seed for GOTCHAS.md)

---

## Phase 8: Handoff

When all files are approved, summarise what was created:

```
Created:
  specs/<AppName>/APP_SPEC.md
  specs/<AppName>/README.md
  specs/<AppName>/features/<domain>/<feature>.feature  (x N)
  docs/<AppName>/DOMAIN_GUIDE.md
  docs/<AppName>/adr/README.md
  docs/<AppName>/adr/001-*.md  (x N)

Next steps:
  - Run /new-app again to continue adding feature domains
  - When the spec is complete, the code scaffold can be set up
    (update pnpm-workspace.yaml, create <AppName>/api, <AppName>/web, packages/shared-types)
```

Do not scaffold code. The user will decide when the spec is mature enough to move to implementation.
