---
name: transition-all-everywhere
tier: propose-diff
severity: medium
category: animation
brand-override:
  mute-when:
    - "intensity.motion == 0"  # brand explicitly disables motion
references:
  - https://web.dev/articles/animations-guide
  - https://tailwindcss.com/docs/transition-property
---

# Symptom

`transition-all` animates every CSS property — including layout-affecting properties like `height`, `display`, `padding`. Causes jank, accidental hover-resize wobble, and layout thrash on properties devs didn't intend to animate.

# Detection

Scope: `.tsx`, `.jsx`.

Grep for `transition-all` anywhere in className strings:

```bash
grep -nE 'className="[^"]*\btransition-all\b' "$file"
```

Count per file; flag every instance.

# Fix (per occurrence — contextual)

The right replacement depends on what's actually being animated. Look at sibling pseudo-classes (`hover:`, `focus:`, `active:`, `group-hover:`):

| Sibling classes | Likely intent | Replacement |
|---|---|---|
| `hover:bg-`, `hover:text-`, `hover:border-` | Color change | `transition-colors duration-150 ease-out` |
| `hover:scale-`, `hover:translate-`, `hover:rotate-` | Transform | `transition-transform duration-200 ease-out` |
| `hover:opacity-`, `group-hover:opacity-` | Fade | `transition-opacity duration-200 ease-out` |
| Multiple of the above | Mixed | List explicitly: `transition-[colors,transform] duration-150 ease-out` |

**Before:**
```tsx
<button className="bg-primary text-primary-foreground transition-all hover:bg-primary/90">
```

**After:**
```tsx
<button className="bg-primary text-primary-foreground transition-colors duration-150 ease-out hover:bg-primary/90">
```

# Why this is propose-diff, not safe-auto

The target property has to be inferred from sibling classes. The heuristic is decent but not perfect — a developer may intend to animate a property that doesn't appear in `hover:` (e.g., transform animated via state, or `enter:` from `tw-animate-css`). Apply per finding with user review.

# Why this matters

`transition-all` is correlated with:
- Layout shift on hover (when padding/border changes)
- Janky animations (browser tries to interpolate non-interpolatable properties)
- Hidden perf cost (every paint/composite re-evaluates all transitions)

Picking the specific property is a one-line change that fixes all three.

# Edge cases (do not fire)

- **Element uses `tw-animate-css` enter/exit classes** — animation is library-driven; transition-all may be intentional. Demote to flag-only.
- **Element has `data-state` attributes** (shadcn primitives) — transitions are driven by state changes; user has likely tuned this. Skip.
- **Brand `intensity.motion == 0`** — motion is muted system-wide. Skip.
