---
name: default-recharts-palette
tier: safe-auto
severity: medium
category: data-viz
brand-override:
  mute-when:
    - "constraints.never includes 'brand-tokens-in-charts'"
preconditions:
  # Pattern only fires if chart tokens exist in globals.css. Otherwise downgrades to propose-diff.
  - "globals.css OR app.css OR styles/globals.css contains --chart-1"
references:
  - https://ui.shadcn.com/docs/components/chart
  - https://recharts.org/en-US/api
---

# Symptom

Charts render with Recharts' default `#8884d8` (purple) and `#82ca9d` (green). Instant "AI app" tell — every AI-built dashboard looks the same.

# Detection

Scope: `.tsx`, `.jsx` files.

Grep for any of:
- `#8884d8` (Recharts default primary)
- `#82ca9d` (Recharts default secondary)
- `stroke="#8884d8"`
- `fill="#8884d8"`
- `stroke="#82ca9d"`
- `fill="#82ca9d"`

Also flag any Recharts component (`<LineChart>`, `<BarChart>`, `<AreaChart>`, `<PieChart>`, `<Line>`, `<Bar>`, `<Area>`, `<Pie>`, `<Cell>`) with NO `stroke=` or `fill=` prop (uses default).

```bash
grep -nE '(#8884d8|#82ca9d)' "$file"
grep -nE '<(Line|Bar|Area|Pie|Cell)(Chart)?( [^>]+)?>' "$file" | grep -v -E '(stroke=|fill=)'
```

# Precondition check (CRITICAL)

Before auto-applying, verify the project has shadcn chart tokens defined:

```bash
grep -lE '\-\-chart-1\s*:' app/globals.css src/globals.css styles/globals.css src/index.css 2>/dev/null
```

If NO file matches → demote this pattern to `propose-diff` for the current run. Auto-applying `var(--chart-1)` when the token is undefined writes broken CSS.

# Fix

Replace hex with shadcn chart token. Cycle through tokens 1-5 in order of appearance.

**Before:**
```tsx
<Line type="monotone" dataKey="revenue" stroke="#8884d8" />
<Line type="monotone" dataKey="cost" stroke="#82ca9d" />
```

**After:**
```tsx
<Line type="monotone" dataKey="revenue" stroke="var(--chart-1)" />
<Line type="monotone" dataKey="cost" stroke="var(--chart-2)" />
```

For unset Recharts components (no `stroke`/`fill`), add `stroke="var(--chart-1)"` to the first, increment for siblings.

# Why

Charts are one of the most visible "AI app" tells. Brand tokens make the chart feel like part of the design system instead of an island.

# Edge cases (do not fire)

- **Visx, D3, Tremor users** — the pattern targets Recharts specifically. Other libs have their own theming model.
- **Demo / fixture files** — paths matching `*.stories.*` are already filtered.
- **Chart in `@/components/ui/chart`** — shadcn's chart primitive. Has its own theming. Skip.
