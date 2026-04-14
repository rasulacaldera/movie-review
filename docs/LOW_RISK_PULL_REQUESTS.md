# Low-Risk Pull Requests

Describes when a PR may be merged without manual review using the `low-risk-change` label.

## When a PR Is Low Risk

A PR may be treated as **low risk** only if it does **not** change:

- Authentication or authorization logic
- Secrets, encryption, or security settings
- Database schemas, migrations, or data models
- Business-critical logic (e.g. review scoring, rating aggregation, user reputation)
- Integrations with third-party systems or external APIs (TMDB, auth providers, email services)

And is limited to:

- UI text, layout, or styling
- Documentation, comments, or code formatting
- Claude Code agent configuration (`.claude/` directory)
- BDD feature specs (`specs/` directory)
- Other configuration or code explicitly documented as low risk and easy to revert

If unsure, do **not** use `low-risk-change` — request a normal review instead.

## How the Flow Works

1. Create a PR and link it to the relevant issue.
2. Describe the change and briefly state why it is low risk.
3. CI runs automatically; the `low-risk-change` label is applied only if qualifying criteria are met.
4. The PR can be merged **without review** only if:
   - The `low-risk-change` label is present
   - All required CI checks are green
   - The target branch is protected

PRs that do not meet these conditions must follow the normal review and approval process.

## Firefighting

For urgent fixes that cannot wait for review, use the `firefighting` label instead. Unlike `low-risk-change`, this can be applied manually and bypasses the approval check. Use responsibly and only for genuine emergencies.

## Label Validity

The `low-risk-change` label is only valid for the specific diff that was evaluated. Any new commit pushed after the label was applied invalidates it and requires re-evaluation.
