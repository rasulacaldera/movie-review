---
name: plan
description: "Create a BDD feature file in specs/ for a new feature. Use before /code — specs are the requirements source of truth."
user-invocable: true
argument-hint: "[feature description or area]"
---

# Feature Planning

Create a BDD feature file for: $ARGUMENTS

## Steps

### 1. Check for Existing Spec

```
ls specs/
```

Search `specs/` for any existing feature file that covers this area. If one exists, extend it rather than creating a duplicate.

### 2. Understand the Domain

Read `AGENTS.md` for monorepo context. For app-specific domain knowledge, read:
- `docs/<AppName>/DOMAIN_GUIDE.md` — domain model, business rules, invariants
- `docs/<AppName>/GOTCHAS.md` — common mistakes to avoid in scenarios

### 3. Write the Feature File

Create `specs/<AppName>/features/<area>/<feature-name>.feature`:

```gherkin
Feature: <Feature Name>
  As a <role>
  I want <capability>
  So that <benefit>

  @integration
  Scenario: <Happy path scenario title>
    Given <precondition>
    When <action>
    Then <expected outcome>

  @integration
  Scenario: <Edge case title>
    Given <precondition>
    When <action>
    Then <expected outcome>

  @unit
  Scenario: <Pure logic scenario>
    Given <input>
    When <operation>
    Then <output>
```

### 4. Tag Guidelines

| Tag | Use when |
|-----|----------|
| `@unit` | Pure logic, transformations, no I/O |
| `@integration` | Component rendering, API calls, DB queries |
| `@regression` | Bug fix scenario (alongside @unit or @integration) |

### 5. Quality Check

Before returning:
- [ ] Scenarios describe behavior from the user's perspective, not implementation details
- [ ] Each scenario tests ONE invariant
- [ ] Tags are applied correctly per the test pyramid
- [ ] Acceptance criteria are unambiguous and testable
- [ ] Domain concepts use correct terminology from the domain guide

Return the feature file path and a summary of the acceptance criteria.
