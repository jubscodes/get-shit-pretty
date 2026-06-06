---
name: mask-image-on-scrolling-text
tier: safe-auto
severity: low
category: scroll
brand-override:
  mute-when:
    - "constraints.never includes 'soft-edges'"
    - "constraints.never includes 'fade-masks'"
    - "intensity.variance == 0 AND density == tight"  # hard-edged design language
references:
  - https://tailwindcss.com/docs/mask-image
  - https://web.dev/articles/scroll-behavior
---

# Symptom

A scrollable container clips its content at the edge with a jagged cutoff. The user can see text being "sliced" mid-line, which both reads as cheap and obscures whether there's more content.

# Detection

Scope: `.tsx`, `.jsx` files.

Grep for elements where className contains BOTH:
- `overflow-y-auto` OR `overflow-y-scroll` OR `overflow-auto` OR `overflow-scroll`
- `max-h-` OR `h-[`

AND the className does NOT contain:
- `mask-image`
- `[mask-image:`
- `[mask:` (shorthand)

AND no immediate JSX child has className with `absolute` + `bg-gradient-to-(t|b)` (manual fade overlay).

```bash
grep -nE 'className="[^"]*overflow-y-(auto|scroll|hidden)[^"]*"' "$file" \
  | grep -E '(max-h-|h-\[)' \
  | grep -v -E '(mask-image|\[mask)'
```

# Fix

Add `mask-image` className modifier. The fade size is fixed at 12px (subtle, brand-neutral).

**Before:**
```tsx
<div className="overflow-y-auto max-h-64 space-y-2">
  {items.map(...)}
</div>
```

**After:**
```tsx
<div className="overflow-y-auto max-h-64 space-y-2 [mask-image:linear-gradient(to_bottom,transparent,black_12px,black_calc(100%-12px),transparent)]">
  {items.map(...)}
</div>
```

For horizontal scrolls (`overflow-x-*`), use `to_right` with the same gradient stops.

# Why

A soft fade signals "there's more content" without making the user scroll to confirm. Hard cutoffs read as a rendering bug. The fix is purely additive: removing it leaves the original behavior, so it's safe to auto-apply.

# Edge cases (do not fire)

- **Intentional hard-edge containers** — kanban columns, modals, code blocks. Mute these by adding `data-polish-ignore` to the element OR by setting `constraints.never: [soft-edges]` in STYLE.md.
- **shadcn ScrollArea** — already handles its own indicator. If the element is `<ScrollArea>` from `@/components/ui/scroll-area`, skip.
- **Tab panels with explicit overflow design** — Mute via `data-polish-ignore`.
