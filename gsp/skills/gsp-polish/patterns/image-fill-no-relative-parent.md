---
name: image-fill-no-relative-parent
tier: safe-auto
severity: medium
category: nextjs
brand-override:
  mute-when: []
preconditions:
  - "package.json contains 'next' in dependencies"
references:
  - https://nextjs.org/docs/app/api-reference/components/image#fill
---

# Symptom

`<Image fill />` from `next/image` requires a positioned parent (`relative`, `absolute`, or `fixed`). When the parent is the default `static`, the image collapses to zero height — invisible bug, no error.

# Detection

Scope: `.tsx`, `.jsx` in a Next.js project (precondition).

AST/regex: find every `<Image ...fill...>` (from `next/image`). Walk up the JSX tree to its direct parent element. If parent's className does NOT contain `relative`, `absolute`, or `fixed`, fire.

```bash
# Conservative grep — match Image with fill, then capture preceding <div> opening tag
grep -nB 1 '<Image[^>]*\bfill\b' "$file" \
  | grep -A 1 -E '<(div|section|article|main|aside)' \
  | grep -v -E '(relative|absolute|fixed)'
```

(Real implementation should use JSX AST to reliably find the parent — grep is approximate.)

# Fix

Add `relative` to parent className. If the parent has no className attribute, add one. If the parent has no explicit aspect ratio, prompt the user (downgrade to `propose-diff` for this finding).

**Before:**
```tsx
<div className="w-full">
  <Image src="/hero.jpg" alt="..." fill />
</div>
```

**After:**
```tsx
<div className="w-full relative aspect-[16/9]">
  <Image src="/hero.jpg" alt="..." fill />
</div>
```

Aspect ratio default: `aspect-[16/9]` for hero-like images. **If the user can't predict the aspect ratio, demote to propose-diff** with a comment explaining the choice.

# Why

`fill` makes the image absolutely position itself to fill the parent. Without `relative` (or `absolute`/`fixed`), the parent doesn't constrain the image — it renders at 0×0. This is a silent bug that doesn't fail builds or tests.

# Edge cases (do not fire)

- **Parent already has `relative` / `absolute` / `fixed`** — pattern doesn't fire
- **`fill` is conditional** (`<Image {...(condition ? {fill: true} : {width, height})} />`) — too risky; skip
- **Parent is a known sized component** (e.g., shadcn `<AspectRatio>`) — already provides positioning; skip
- **Parent className uses CVA** — can't statically resolve; demote to flag-only
