# Documentation

## Structure

```
docs/
├── CODING_STANDARDS.md         # Clean code, SOLID + CUPID principles
├── TESTING_PHILOSOPHY.md       # Test hierarchy, BDD workflow
├── LOW_RISK_PULL_REQUESTS.md   # PR sizing guidance
├── adr/                        # Cross-cutting ADR template
│   ├── README.md
│   └── TEMPLATE.md
├── best_practices/             # TypeScript, React, git conventions
├── design/                     # UI component guidelines
└── MovieReviewApp/             # App-specific documentation
    ├── DOMAIN_GUIDE.md         # Domain model, business rules
    ├── GOTCHAS.md              # Common mistakes for this app
    ├── adr/                    # App-specific ADRs
    └── best_practices/         # App-specific patterns
```

## Adding a New App

Create `docs/<AppName>/` with the same structure as `docs/MovieReviewApp/`.
