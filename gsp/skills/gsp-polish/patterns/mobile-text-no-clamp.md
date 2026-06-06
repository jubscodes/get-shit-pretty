---
name: mobile-text-no-clamp
tier: safe-auto
severity: low
category: typography
brand-override:
  mute-when:
    - "constraints.never includes 'fluid-type'"
    - "typography.scale == 'static'"  # brand explicitly uses fixed sizes
references:
  - https://web.dev/articles/css-text-wrap-balance
  - https://tailwindcss.com/docs/font-size
---

# Symptom

Hero/heading uses a fixed `text-6xl` (or larger) with no responsive scale, no `text-balance`, no `text-pretty`. Wraps awkwardly on mobile, orphans on desktop.

# Detection

Scope: `.tsx`, `.jsx`, `.mdx`.

AST/regex: any `<h1>`, `<h2>`, `<h3>` (or shadcn `<Heading>`) where the merged className contains `text-{5xl|6xl|7xl|8xl|9xl}` AND does NOT contain any of:
- `sm:text-` OR `md:text-` OR `lg:text-` (responsive ramp)
- `clamp(`
- `text-balance`
- `text-pretty`

```bash
grep -nE '<h[1-3]( [^>]+)?>' "$file" | grep -E 'text-(5xl|6xl|7xl|8xl|9xl)' \
  | grep -v -E '(sm:text-|md:text-|lg:text-|clamp\(|text-balance|text-pretty)'
```

# Fix

Add a responsive ramp and `text-balance`. The ramp drops one step on each breakpoint going down.

**Before:**
```tsx
<h1 className="text-6xl font-bold">{title}</h1>
```

**After:**
```tsx
<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance">{title}</h1>
```

Ramp mapping:
- `text-9xl` → `text-6xl md:text-7xl lg:text-9xl`
- `text-8xl` → `text-5xl md:text-6xl lg:text-8xl`
- `text-7xl` → `text-5xl md:text-6xl lg:text-7xl`
- `text-6xl` → `text-4xl md:text-5xl lg:text-6xl`
- `text-5xl` → `text-3xl md:text-4xl lg:text-5xl`

Always append `text-balance` if not present.

# Why

Fixed large text breaks on mobile. The fix is mechanical: drop one step per breakpoint going down, and `text-balance` is universally beneficial (no downsides).

# Edge cases (do not fire)

- **Brand declares `typography.scale: static`** — some brands intentionally use one size and let layout breathe. Mute via brand override.
- **Headings inside a fixed-width container** (e.g., `<aside className="w-64">`) — responsive ramp may overshoot. Check parent width; if narrow, drop one extra step (`text-3xl` instead of `text-4xl`).
- **Element has `text-balance` or `text-pretty` already** — skip.
