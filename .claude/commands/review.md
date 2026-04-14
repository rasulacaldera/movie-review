# Review

Perform a comprehensive code review based on change content.

## Workflow

1. **Analyze changes**: Run `git diff main...HEAD --name-only` to see what files changed

2. **Route to reviewers**:
   - Always invoke **reviewer** for all code changes (SOLID, CUPID, clean code, architecture)
   - If the changes touch auth, user data, or external API integrations, flag these explicitly for security attention

3. **Post-review**:
   - Check if any ADRs in `docs/<AppName>/adr/` need updating based on the changes
   - Verify PR description is still accurate and update if needed

## Notes

- reviewer focuses on: SOLID, CUPID, clean code, architecture, TDD completeness, doc alignment
- For test files (`.unit.test.ts`, `.int.test.ts`): check pyramid placement, test naming (no "should"), nested describe/when structure
