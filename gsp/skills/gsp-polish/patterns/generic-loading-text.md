---
name: generic-loading-text
tier: flag-only
severity: medium
category: states
brand-override:
  mute-when:
    - "constraints.always includes 'text-loading-indicators'"
references:
  - https://ui.shadcn.com/docs/components/skeleton
  - https://www.nngroup.com/articles/progress-indicators/
---

# Symptom

`<div>Loading...</div>` or `<p>Loading</p>` rendered while data fetches. Causes content jump when data arrives (text disappears, real content takes its place at different dimensions).

# Detection

Scope: `.tsx`, `.jsx`.

Grep for JSX text children matching:

```regex
>Loading\.{0,3}<|>Loading<|>Fetching\.{0,3}<|>Please wait\.{0,3}<
```

Also flag isolated `<Spinner />`, `<Loader />`, `<LoadingSpinner />` NOT wrapped in a skeleton-shaped container (no sibling `<Skeleton>` or shape-matching div).

```bash
grep -nE '>(Loading|Fetching|Please wait)\.{0,3}<' "$file"
grep -nE '<(Spinner|Loader|LoadingSpinner)( /| ?>)' "$file"
```

# Why this is flag-only

The right replacement is a skeleton block sized to the eventual content — but the polisher can't see what the content will look like. Suggesting a skeleton shape would be guessing.

# Fix (manual)

Replace with shadcn `<Skeleton>` shaped like the loaded content:

**Before:**
```tsx
{isLoading ? <div>Loading...</div> : <UserCard user={user} />}
```

**After:**
```tsx
{isLoading ? (
  <div className="space-y-2">
    <Skeleton className="h-4 w-1/3" />
    <Skeleton className="h-3 w-2/3" />
    <Skeleton className="h-3 w-1/2" />
  </div>
) : (
  <UserCard user={user} />
)}
```

Polish reports findings as:

```
- {file}:{line} — "Loading..." text indicator
  surrounding JSX: {opening tag of nearest sibling component}
  suggestion: replace with <Skeleton /> shaped like {component-name}
```

# Edge cases (do not fire)

- **Loading text inside a button** (`<Button>Loading...</Button>`) — button label can legitimately say "Loading" while disabled
- **Inline loading states for very small UI** — a 1-line "Loading..." in a status bar is fine; don't fire unless the loading state lasts >2s OR replaces a non-trivial component
- **Brand explicitly allows text loaders** — `constraints.always: [text-loading-indicators]` mutes

# Heuristic for severity

If the spinner is inside a full-page container (`<main>`, `<section className="min-h-screen">`), severity = high. If inline (small status), severity = low.
