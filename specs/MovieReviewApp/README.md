# MovieReviewApp — Feature Specifications

Feature files for the movie review application. These are the requirements source of truth.

## Domain Areas

Feature files are organized by domain:

```
features/
├── auth/           # Authentication and user registration
├── movies/         # Movie catalog, search, details
├── reviews/        # User reviews, ratings
├── watchlist/      # Personal watchlist management
└── ...             # Additional domains as defined in APP_SPEC.md
```

## Getting Started

If `APP_SPEC.md` does not exist yet, run `/new-app MovieReviewApp` to begin the discovery process.

If it exists, check the feature files before implementing anything:
```
ls specs/MovieReviewApp/features/
```
