# /refocus

You have drifted from the BDD workflow. Stop what you're doing and realign.

## Immediate Actions

1. **Stop coding.** Do not write another line of code.

2. **Check for a feature file:**
   ```
   ls specs/
   ```
   Find the feature file for what you were implementing.

3. **If no feature file exists:**
   Run `/plan <feature description>` to create one first.

4. **If a feature file exists:**
   Read it completely. Extract the acceptance criteria. Confirm you were implementing against them.

5. **Re-anchor:**
   State explicitly: "I am implementing [feature]. The acceptance criteria are: [list from feature file]."

6. **Resume with TDD:**
   Write a failing test before any code.

## Why This Matters

Specs are the contract between intent and implementation. Code without a spec is speculation.
