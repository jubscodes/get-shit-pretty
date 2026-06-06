---
name: raw-hex-colors-outside-tokens
tier: flag-only
severity: high
category: tokens
brand-override:
  mute-when:
    - "constraints.always includes 'raw-hex-allowed'"
references:
  - https://tailwindcss.com/docs/customizing-colors
  - https://ui.shadcn.com/docs/theming
---

# Symptom

Raw hex values appear in className arbitrary values (`bg-[#3b82f6]`), `style={{ color: "#fff" }}`, or inline color props. Bypasses the token system — the design system can't theme these.

# Detection

Scope: `.tsx`, `.jsx`, `.mdx`, CSS files.

Grep for hex literals OUTSIDE of:
- The token definition file (`globals.css`, `tailwind.config.{ts,js}`, `styles/tokens.css`)
- Comments (`// #ff0000` is fine)
- String literals that are clearly not colors (e.g., hashes, IDs — but unlikely to look like `#xxx` or `#xxxxxx`)

```bash
# Find 3-char and 6-char hex literals
grep -nE '#[0-9a-fA-F]{3,8}(\b|;|\)|"|\s)' "$file" \
  | grep -v -E '^[^:]+:\s*//' \
  | grep -vE '(globals\.css|tailwind\.config|tokens\.css)'
```

Exclusions:
- Comments (`//`, `/* */`, `<!-- -->`)
- Lines containing `font-feature-settings`, `id=`, `aria-`, `href=` (likely IDs, not colors)
- Lines defining the token itself (a hex inside `--something: #...;` in the canonical token files)
- shadcn/Recharts known-bad hexes — those are caught by `default-recharts-palette` specifically; this pattern catches everything else

# Why this is flag-only

A literal `#3b82f6` could be:
- A color that should use `var(--primary)` — token swap
- A color with no matching token — needs a new token added to the system
- A one-off intentional value (debugging, fixture data) — user's call

Polish can't decide without knowing the token system. Surface and let user choose:
1. Swap to existing token (if a near-match exists in `STYLE.md` tokens)
2. Promote to a new token in `globals.css`
3. Mark as intentional with `// polish-ignore: intentional-raw-hex`

# Fix (manual, brand-aware)

If `STYLE.md` is available, polish includes the closest matching tokens in the finding:

```
- {file}:{line} — raw hex `#3b82f6` in className "bg-[#3b82f6]"
  closest tokens (from STYLE.md):
    - var(--primary)        #2563eb  (Δ 4.2)
    - var(--accent)         #4f46e5  (Δ 18.1)
  suggestion: replace with `bg-primary` or define a new token
```

`Δ` is OKLCH lightness distance — closer = better match.

# Why this matters

Raw hex outside tokens is the #1 "AI generated" tell after default Recharts colors. The brand token system becomes worthless if call sites bypass it. Every raw hex is a brand violation.

# Edge cases (do not fire)

- **Hex inside `globals.css` / `tokens.css`** — that IS the token definition
- **Hex in a comment** — `// TODO: replace #ff0000` is fine
- **Hex in a non-color context** — `id="#main"` (CSS selector), `href="#top"` (anchor link) — these are excluded
- **Brand explicitly allows raw hex** — `constraints.always: [raw-hex-allowed]` mutes (rare but real for some brand systems)
- **Hex inside a test/story fixture file** — already excluded by scope
