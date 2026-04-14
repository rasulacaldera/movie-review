# Feature Specifications

BDD feature files are the **requirements source of truth**. Every feature is specified before implementation begins.

## Structure

```
specs/
└── MovieReviewApp/
    ├── APP_SPEC.md             # Full application specification
    ├── README.md               # App-specific BDD notes
    └── features/               # Feature files by domain area
        ├── movies/
        ├── reviews/
        ├── auth/
        └── ...
```

## Workflow

1. **Spec first**: Run `/plan <feature>` to create a feature file
2. **Challenge**: Run `/challenge` to stress-test the plan
3. **Approve**: User reviews and approves the feature file
4. **Implement**: Run `/code` with the feature file path
5. **Verify**: Run tests + `/browser-test` for visual verification

## Writing Feature Files

Use Gherkin syntax with proper tagging:

```gherkin
Feature: Movie Search
  As a user
  I want to search for movies
  So that I can find movies to review

  @integration
  Scenario: Search by title
    Given the movie "Inception" exists
    When I search for "Inception"
    Then I see "Inception" in the results

  @unit
  Scenario: Normalize search query
    Given a search query "  inception  "
    When the query is normalized
    Then it becomes "inception"
```

## Tags

| Tag | Use when |
|-----|----------|
| `@unit` | Pure logic, transformations, no I/O |
| `@integration` | Component rendering, API calls, DB queries |
| `@regression` | Bug fix scenario (alongside @unit or @integration) |
| `@e2e` | Stable core flow (deprioritized — max 5-10 total) |
