# Changelog List

> Phase: design | Project: gsp-app | Generated: 2026-03-19

---

## Purpose

Shows all changelog/blog posts in reverse-chronological order. Communicates momentum and active development. Visitors arrive from nav link, README, or social post about a release.

**Flow position:** Linked from nav on all pages. Also linked from landing page footer.

---

## Layout

Centered content column. Simple stacked entries, not a card grid — matches the monospace-forward aesthetic and works well for text-heavy changelog content.

```
┌─────────────────────────────────────────────────────────┐
│ [Nav]  (sticky, shared)                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│              H1: Changelog                              │
│                                                         │
│  ─────────── separator ───────────                      │
│                                                         │
│  MARCH 2026                                             │
│  v0.5.0 — Design Systems                               │
│  Design system scanning, component inventory,           │
│  and library-aware component strategy...                │
│  [shadcn] [design-system]                               │
│                                                         │
│  ─────────── separator ───────────                      │
│                                                         │
│  MARCH 2026                                             │
│  v0.4.0 — Composable Skills                             │
│  Palette generation, type scale calculation,            │
│  and accessibility auditing as standalone...            │
│  [palette] [typescale] [a11y]                           │
│                                                         │
│  ─────────── separator ───────────                      │
│                                                         │
│  FEBRUARY 2026                                          │
│  Designed by GSP                                        │
│  This site was built using the GSP pipeline.            │
│  The brand you see is the brand GSP generated...        │
│  [meta] [launch]                                        │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ [Footer]  (shared)                                      │
└─────────────────────────────────────────────────────────┘
```

---

## Components

### Page Header

- **H1** — `font-primary font-bold text-h1 text-text-bright tracking-snug`. Content: "Changelog"
- Positioned at top of content column, `pt-16 pb-8` (64px top, 32px bottom)

### Post Entry

Each entry is an `<article>` element:

- **Date overline** — `text-overline font-primary font-bold text-text-muted uppercase tracking-widest`. Formatted as "MONTH YEAR" (e.g., "MARCH 2026")
- **Title** — `<a>` wrapping an `<h2>`. `font-primary font-bold text-h2 text-text-bright tracking-snug hover:text-accent transition-colors duration-fast mt-2`. Links to `/changelog/[slug]`
- **Excerpt** — `font-primary text-body-sm text-text leading-relaxed mt-3 max-w-prose`. 2-3 sentences
- **Tags** — Row of Badge components. `mt-4 flex flex-wrap gap-2`. Each badge: `rounded-full font-primary text-caption tracking-wider bg-surface text-text-muted border border-border px-3 py-1`

### Separators

- Separator between each entry: `bg-border my-8` (32px margin top and bottom)
- No separator before the first entry or after the last

### Content Column

- `max-w-2xl mx-auto px-4 sm:px-6 lg:px-12`
- All content left-aligned within the centered column

---

## States

### Default (with posts)

As described above. Posts render from MDX metadata. Minimum content: 1 post for launch.

### Empty (no posts)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│              H1: Changelog                              │
│                                                         │
│  ─────────── separator ───────────                      │
│                                                         │
│  ◇                                                      │
│  Nothing here yet.                                      │
│  Check back soon — or watch the GitHub repo.            │
│                                                         │
│  [Watch on GitHub →]                                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

- Diamond glyph `◇` in `text-text-muted text-h2`
- Body text in `text-body text-text-muted`
- GitHub link as outline button

### Loading

Static page — no loading state. Content is built at compile time via MDX.

### Error

Static page — no runtime error state. Build errors caught at deploy time.

---

## Interactions

- **Title hover:** Color transitions from `text-bright` to `text-accent` (100ms linear)
- **Title focus:** Focus ring `outline-2 outline-accent outline-offset-2`
- **Badge hover:** No hover effect (badges are not interactive — they are display-only labels)
- **Scroll reveal:** Each entry fades in on scroll (CSS-only, see [micro-interactions.md](./shared/micro-interactions.md))

---

## Accessibility

### VoiceOver Reading Order

1. Skip-to-content link
2. Nav
3. Page title ("Changelog", H1)
4. First post: date, title (link), excerpt, tags
5. Separator (ignored — decorative)
6. Second post: date, title (link), excerpt, tags
7. (repeat for all posts)
8. Footer

### Semantic Structure

```html
<main id="main">
  <h1>Changelog</h1>
  <div role="feed" aria-label="Changelog entries">
    <article aria-labelledby="post-1-title">
      <time datetime="2026-03-19">MARCH 2026</time>
      <h2 id="post-1-title"><a href="/changelog/v0-5-0">...</a></h2>
      <p>...</p>
      <div role="list" aria-label="Tags">
        <span role="listitem">shadcn</span>
        ...
      </div>
    </article>
    <hr aria-hidden="true" />
    ...
  </div>
</main>
```

- `role="feed"` on the post list for assistive tech
- `<time>` with `datetime` attribute for machine-readable dates
- Separators are `aria-hidden="true"` (decorative)
- Tags grouped in `role="list"` for context

### Focus Management

- Only the post title links are focusable (not tags, not dates)
- Tab order: nav links, then post titles in document order, then footer links

---

## Responsive

| Breakpoint | Column width | Padding | Title size |
|------------|-------------|---------|------------|
| Mobile (<640px) | Full width | 16px | H2 at clamp min (~22px) |
| Tablet (640-1023px) | max-w-xl | 24px | H2 mid-range |
| Desktop (1024px+) | max-w-2xl | 48px | H2 at clamp max (~28px) |

Tags wrap naturally with `flex-wrap`. No truncation.

---

## Related

- [Navigation](./shared/navigation.md)
- [Responsive](./shared/responsive.md)
- [Component Plan](./shared/component-plan.md)
- [Screen 01: Landing](./screen-01-landing.md)
- [Screen 03: Changelog Post](./screen-03-changelog-post.md)
