# Mode: `--check #FG #BG`

Quick contrast lookup for an ad-hoc color pair. Display-only — no files written, no AskUserQuestion routing. Loaded on demand by `gsp-accessibility/SKILL.md` when invoked with `--check`.

## Inputs

Two hex color values from `$ARGUMENTS`. Optional `--level AAA` flag.

## Calculation

Convert hex to relative luminance (sRGB linearization), then:

```
ratio = (L_lighter + 0.05) / (L_darker + 0.05)
```

## Display

```
  /gsp-accessibility — contrast check
  ═══════════════════════════════════════

  Foreground: {FG_HEX}   Background: {BG_HEX}

  WCAG 2.x Contrast Ratio: {ratio}:1

  │ Use Case           │ Required │ Result │
  │─────────────────────│──────────│────────│
  │ Normal text (AA)    │ 4.5:1    │ PASS/FAIL │
  │ Normal text (AAA)   │ 7:1      │ PASS/FAIL │
  │ Large text (AA)     │ 3:1      │ PASS/FAIL │
  │ Large text (AAA)    │ 4.5:1    │ PASS/FAIL │
  │ UI components (AA)  │ 3:1      │ PASS/FAIL │

  ─────────────────────────────────────
```

Stop here. No files written. No routing.
