# Mode: `--statement`

Generate a WCAG conformance statement from prior audit results. Inline, no agent. Loaded on demand by `gsp-accessibility/SKILL.md` when invoked with `--statement`.

## Read prior audits

Read whichever of these exist:
- `{PROJECT_PATH}/critique/accessibility-audit.md` (design audit)
- `{PROJECT_PATH}/critique/accessibility-token-audit.md` (token audit)
- `{PROJECT_PATH}/review/accessibility-audit.md` (code audit)

If none exist, tell the user to run an audit first (`/gsp-accessibility` with no flags will pick the right mode from project state) and stop.

## Generate statement

Write `{PROJECT_PATH}/exports/accessibility-statement.md`:

```markdown
# Accessibility Statement

> Project: {name} | Generated: {DATE}

---

## Conformance Status

**Target:** {level}
**Status:** {Partially Conformant / Fully Conformant}

This {project description} has been evaluated against {level} standards.

## Scope

{Brief description of what was audited — design, code, or both}

## Known Limitations

{List from audit findings — critical/major issues not yet resolved}

- {Issue}: {brief description} — {planned resolution or workaround}

## Testing Methodology

- Design audit: WCAG 2.2 checklist review of all screens
- Token audit: Automated contrast ratio verification of all semantic color pairs
- Code audit: Manual and grep-based review of ARIA, keyboard, semantic HTML
- Tools used: {list from testing methodology}

## Feedback

If you encounter accessibility barriers, please contact:

- **Email:** [placeholder@example.com]
- **Response time:** [X business days]

## Assessment Date

Last reviewed: {DATE}
```

## Completion

Display result and use `AskUserQuestion`:
- **View statement** — "read the accessibility statement"
- **Done** — "that's all for now"
