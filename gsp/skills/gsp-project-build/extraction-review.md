# Extraction Review (Step 5.5)

Components were built in Phase 4, so most reuse is already handled. This is a quick sanity check.

## Automated scan

Run these on the built codebase:

1. **Hardcoded values** — Grep for hardcoded hex colors, `rgb()`, pixel values that should be tokens. Flag any that don't reference CSS variables or Tailwind tokens.
2. **Duplicated patterns** — Grep for identical `className` strings (>3 classes) appearing in 2+ screen files. These are patterns the components phase missed.

## Surface findings

If issues found:

```
  ◆ post-build scan

    Found {N} hardcoded values and {M} duplicated patterns.
    {list if any}

  ──────────────────────────────
```

If no issues: "Post-build scan clean — no hardcoded values or duplicated patterns found."

Use `AskUserQuestion` only if issues were found: "Fix these, or continue to finalize?"
- **Fix** → apply changes inline (mechanical refactors, no agent needed)
- **Continue** → proceed to Step 6

If hardcoded values map to missing brand tokens, suggest: "These token gaps may also exist in the brand. Consider running `/gsp-brand-refine` after build completes."
