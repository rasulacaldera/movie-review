# /worktree

Create a git worktree for parallel implementation work.

## Usage

```
/worktree #<issue-number>
/worktree feat/<slug>
```

## Steps

1. **Get the branch name:**
   - For an issue: `gh issue view <number>` — use `issue<number>/<slug>` format
   - For a feature: use `feat/<slug>` format

2. **Create the worktree:**
   ```bash
   git worktree add ../<branch-name> -b <branch-name>
   ```

3. **Navigate:**
   ```bash
   cd ../<branch-name>
   ```

4. **Install dependencies** (if needed):
   ```bash
   cd MovieReviewApp/api && npm install
   cd ../web && npm install
   ```

## Cleanup

When done with a worktree:
```bash
git worktree remove ../<branch-name>
git branch -d <branch-name>
```
