---
name: test-review
description: "Review feature files and test files for pyramid placement and quality."
context: fork
agent: test-reviewer
user-invocable: true
argument-hint: "<path>"
---

# Test Review

Review feature files or test files for pyramid placement, naming, BDD structure, and domain alignment.

## Usage

```
/test-review <path>
```

Examples:
```
/test-review specs/MovieReviewApp/features/movies/movie-search.feature
/test-review MovieReviewApp/api/src/domains/movies/
```

## Focus Area

$ARGUMENTS
