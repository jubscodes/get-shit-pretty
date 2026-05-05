# Token Mapping → theme-css.js

> **Superseded in v0.8.0.** The static mapping table has been replaced by a deterministic script.

GSP presets use shadcn/ui-native token names directly. The `.yml` token keys match shadcn CSS variable names 1:1 — no translation layer is needed.

## Generating CSS from a preset

```bash
node gsp/skills/gsp-brand-guidelines/bin/theme-css.js gsp/skills/gsp-style/styles/professional.yml --stdout
```

Output is `:root { }` + `.dark { }` blocks ready to paste into `globals.css`.

## How it works

- Hex `#RRGGBB` values → converted to OKLCH (full color math: sRGB → linear → XYZ → OKLab → OKLCh)
- Values containing `oklch(` → passed through as-is (handles alpha variants)
- All other values (font stacks, shadows, etc.) → passed through verbatim
- `--radius` derived from `shape.border-radius-lg`
- `--chart-1` through `--chart-5` derived from palette colors
- Sidebar vars written from explicit `color.sidebar-*` tokens in the `.yml`

## Token structure

See `${CLAUDE_SKILL_DIR}/../gsp-style/style-preset-schema.md` for the full `.yml` schema — all shadcn variables are first-class token keys.
