# Mode: `--validate <yml-path>`

Pre-emit gate for `gsp-brand-guidelines` (and any caller that needs a yes/no contrast verdict on a brand `.yml` without project context). Loaded on demand by `gsp-accessibility/SKILL.md` when invoked with `--validate`.

**Differs from `--tokens`:** no project resolution, no chunk file. Verdict is carried by exit code + stdout; an append-only audit log is written next to the validated `.yml` so post-hoc reviewers can confirm the gate ran. Use when you need a hard PASS/FAIL gate before downstream emission.

## Inputs

- `<yml-path>` — absolute or relative path to a brand `.yml` preset (e.g. `.design/branding/{brand}/patterns/{brand-name}.yml`)
- `--level AA|AAA` — optional conformance override (default: AA)

## Checks (subset of `--tokens`, contrast-only)

Reuse the contrast logic from the `--tokens` mode (sections 4.1, 4.2, 4.3):

1. **Contrast pairs** — every semantic foreground/background pair from the `.yml`. Flag failures: normal text < 4.5:1 (AA) or < 7:1 (AAA), large text < 3:1 (AA) or < 4.5:1 (AAA), non-text < 3:1
2. **Interactive states** — hover/active/focus/disabled pairs. Disabled states still need 3:1 non-text contrast
3. **Focus ring** — `--ring` token vs adjacent backgrounds, ≥ 3:1
4. **Dark mode** — if `dark_mode.color` exists, re-verify all pairs

Skip the `--tokens` extras (touch targets, typography minimums) — those are not contrast gates.

## Output

**On pass** — print one line to stdout, exit 0:

```
✓ /gsp-accessibility --validate {yml-name} — N pairs checked, all WCAG 2.2 {level} compliant
```

**On fail** — print failing pairs + exit 1:

```
✗ /gsp-accessibility --validate {yml-name} — {M} contrast failure(s) (WCAG 2.2 {level})

  Failures:
    {token-pair}      ratio {N.N}:1   required {required}:1   ({use-case})
    {token-pair}      ratio {N.N}:1   required {required}:1   ({use-case})
    ...

  Fix via: /gsp-brand-refine "{token-name} contrast"
```

## Audit log (both verdicts)

After printing the stdout verdict, append an entry to `<dirname of yml-path>/wcag-validate.log` so the gate is auditable post-hoc (compliance claims need a trail). Create the file if it doesn't exist.

Entry format:

```
─── {ISO 8601 timestamp} ─── WCAG 2.2 {level} ─── {PASS|FAIL} ───
yml: {yml-name}
pairs checked: {N}

| Pair | FG | BG | Ratio | Required | Result |
|------|----|----|-------|----------|--------|
| {semantic name} | {fg hex} | {bg hex} | {ratio}:1 | {threshold}:1 | PASS/FAIL |
...
```

One block per invocation; newest at the bottom. The log is the only file write in this mode — no chunks, no STATE.md updates. Stop here; no AskUserQuestion routing.
