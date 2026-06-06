---
name: internal-a-not-link
tier: safe-auto
severity: medium
category: nextjs
brand-override:
  mute-when: []  # no brand reason to use raw <a> for internal nav
preconditions:
  - "package.json contains 'next' in dependencies"
references:
  - https://nextjs.org/docs/app/api-reference/components/link
---

# Symptom

`<a href="/dashboard">` used for internal routes in a Next.js app. Loses prefetch, full page reload on click, no client-side navigation.

# Detection

Scope: `.tsx`, `.jsx` files in a Next.js project (precondition).

Grep for `<a href="/...">` where:
- href starts with `/` (internal route, not `/_next/` or absolute external)
- href does NOT start with `/api/` (API routes legitimately use raw `<a>` for downloads)
- the element is not preceded by an `<a download` attribute
- the element does not have `target="_blank"` (external opens)

```bash
grep -nE '<a href="/[^/"]' "$file" \
  | grep -v -E '(target="_blank"|/api/|download)'
```

# Fix

Rewrite as Next.js `<Link>`. Add the import if not present.

**Before:**
```tsx
<a href="/dashboard" className="text-foreground hover:underline">
  Dashboard
</a>
```

**After:**
```tsx
import Link from "next/link";

<Link href="/dashboard" className="text-foreground hover:underline">
  Dashboard
</Link>
```

The Edit operation must:
1. If `import Link from "next/link"` is not already in the file's imports, add it (alphabetical with other "next/" imports)
2. Replace `<a href="..."` with `<Link href="..."`
3. Replace closing `</a>` with `</Link>` (only the matching one — use line-aware matching)

# Why

`next/link` enables:
- **Prefetch** on viewport entry — perceived performance jump
- **Client-side navigation** — no full reload, preserves state, preserves scroll
- **Automatic route checking** — TypeScript can catch bad hrefs

The fix is mechanical and universally beneficial for internal routes.

# Edge cases (do not fire)

- **External links** — `target="_blank"` already present → leave alone
- **Download links** — `download` attribute present → leave alone
- **Anchor scrolls** — href starts with `#` → not an internal route, leave alone
- **API routes** — `/api/*` paths often serve files; leave as `<a>`
- **mailto: / tel:** — not `/`-prefixed; not caught by detection
- **Dynamic href from props** — `<a href={url}>` — can't know if internal/external statically; skip
