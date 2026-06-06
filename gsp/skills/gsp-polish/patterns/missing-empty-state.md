---
name: missing-empty-state
tier: flag-only
severity: medium
category: states
brand-override:
  mute-when: []
references:
  - https://www.nngroup.com/articles/empty-state-interface-design/
  - https://ui.shadcn.com/docs/components/card
---

# Symptom

A list or table renders nothing when its source array is empty. User sees a blank region — no illustration, no helpful CTA, no explanation of how to add the first item.

# Detection

Scope: `.tsx`, `.jsx`.

AST: find every `.map(` call producing JSX. For each, check whether the same component has:
- A `length === 0` conditional referencing the same array
- A `!array.length` short-circuit
- A `array?.length` check returning fallback JSX

If NONE of these guard the empty case, fire.

```bash
# Conservative grep — finds .map() calls
grep -nE '\.map\(\s*\([^)]*\)\s*=>' "$file"
# Then per-finding: check the surrounding component for empty-guards
grep -nE '(length === 0|length == 0|!.{1,20}\.length|\.length\s*\?)' "$file"
```

If a file has `.map()` calls and the component has no length-zero branches at all, flag every `.map()` in the component.

# Why this is flag-only

The empty state requires:
- Brand-appropriate microcopy ("No invoices yet" vs "Nothing to see here" vs "Get started by adding your first invoice")
- An optional illustration / icon
- A CTA matching the user's mental model
- Layout that doesn't shift when content arrives

None of these are mechanically derivable. Surface and let a human (or `gsp-brand-strategy`) write it.

# Fix (manual scaffold)

Polish suggests the scaffold; user fills in the content:

**Before:**
```tsx
<ul>
  {invoices.map(inv => <InvoiceRow key={inv.id} invoice={inv} />)}
</ul>
```

**After:**
```tsx
{invoices.length === 0 ? (
  <EmptyState
    icon={<FileText />}
    title="{your-empty-title}"
    description="{why-empty-and-what-to-do}"
    action={<Button>{your-cta}</Button>}
  />
) : (
  <ul>
    {invoices.map(inv => <InvoiceRow key={inv.id} invoice={inv} />)}
  </ul>
)}
```

Polish reports findings as:

```
- {file}:{line} — .map() over `{arrayName}` with no empty-state guard
  component: {nearest enclosing function/component name}
  suggestion: add EmptyState with brand-appropriate copy
```

# Edge cases (do not fire)

- **Map over enum / static array** — `["a", "b", "c"].map(...)` — never empty, no need for empty state
- **Map inside another conditional that already guards length** — pattern shouldn't fire if `{condition && array.map(...)}` and `condition` checks array presence
- **Map nested inside a parent component that handles its own empty state** — heuristic only catches the immediate scope; some false positives expected here. User can flag with `data-polish-ignore` on a wrapper.
- **Map inside a Storybook file** — already excluded

# Heuristic for severity

If the map renders into a `<main>` or top-level page container, severity = medium. If nested deep in a card/sidebar/widget, severity = low. If the array is fed by a useQuery / SWR (async, likely empty on first load), severity = medium.
