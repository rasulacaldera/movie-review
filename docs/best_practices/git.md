# Git & GitHub

## Commit Conventions

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

| Type | When |
|------|------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or updating tests |
| `docs` | Documentation only |
| `chore` | Tooling, config, dependencies |

Examples:
```
feat(movies): add movie search by title
fix(reviews): prevent duplicate review for same movie
refactor(ratings): extract average rating into repository method
```

## Branch Naming

| Branch Type | Format | Example |
|-------------|--------|---------|
| Issue-linked | `issue<number>/<slug>` | `issue42/movie-search` |
| Feature | `feat/<slug>` | `feat/review-moderation` |
| Bugfix | `fix/<slug>` | `fix/duplicate-review` |
| Refactor | `refactor/<slug>` | `refactor/rating-aggregation` |

**Rules:**
- Slugs: lowercase, hyphen-separated, max 40 characters
- Issue-linked branches: always use `issue<number>/` prefix (no hyphen after "issue")
- Issue number prefix enables easy lookup: `git branch | grep issue42`

## Pull Requests

- Link PRs to issues: `Closes #N` in PR body
- PR title follows the same Conventional Commits format
- Create as draft immediately after first commit (`gh pr create --draft`)
- Mark ready only after all checks pass and verification is done

## Worktrees

For parallel work on multiple issues without stashing or switching branches:

```bash
# Create a worktree for issue 42
git worktree add .worktrees/issue42-movie-search -b issue42/movie-search

# Navigate to it
cd .worktrees/issue42-movie-search

# Install dependencies
cd MovieReviewApp/api && npm install
cd ../web && npm install
```

Worktrees directory (`.worktrees/`) should be gitignored.

```bash
# Cleanup after merging
git worktree remove .worktrees/issue42-movie-search
git branch -d issue42/movie-search
```

## Issues

When creating issues on GitHub:
- Add a clear title following Conventional Commits format
- Include acceptance criteria in the body
- Label appropriately (`feature`, `bug`, `refactor`, `docs`)
- Link to the relevant area of `specs/<AppName>/` if a feature file exists

## `.gitignore` Essentials

```
# Dependencies
node_modules/

# Build output
dist/
build/

# Environment
.env
.env.local
.env.*.local

# Worktrees
.worktrees/

# OS
.DS_Store
```
