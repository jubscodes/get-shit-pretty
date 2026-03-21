# Changelog Post

> Phase: design | Project: gsp-app | Generated: 2026-03-19

---

## Purpose

Individual blog/changelog post. Displays MDX-rendered content in a comfortable reading column. Showcases the full type scale in use. The first post ("Designed by GSP") doubles as a meta-demonstration of the brand system.

**Flow position:** Reached from changelog list (title link) or direct URL.

---

## Layout

Centered reading column. No sidebar. No previous/next navigation (keep it simple for launch scope).

```
┌─────────────────────────────────────────────────────────┐
│ [Nav]  (sticky, shared)                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ← Back to Changelog                                    │
│                                                         │
│  OVERLINE: MARCH 2026                                   │
│                                                         │
│  H1: Designed by GSP                                    │
│                                                         │
│  [meta] [launch]                                        │
│                                                         │
│  ─────────── separator ───────────                      │
│                                                         │
│  Body text: This site was built using the same          │
│  GSP pipeline it documents. Every color, every          │
│  type choice, every spacing decision traces to          │
│  the brand system...                                    │
│                                                         │
│  H2: The process                                        │
│                                                         │
│  Body text continues...                                 │
│                                                         │
│  ┌─────────────────────────────────────────────┐        │
│  │ $ gsp brand-strategy                        │        │
│  │                                              │        │
│  │  Archetype: Creator + Guide                  │        │
│  │  Voice: Clear, Warm, Lighthearted            │        │
│  └─────────────────────────────────────────────┘        │
│                                                         │
│  H3: Subsection heading                                 │
│                                                         │
│  Body text with a blockquote:                           │
│  ┃ "Design decisions, not design debt."                 │
│                                                         │
│  Another paragraph, maybe a list:                       │
│  • Item one                                             │
│  • Item two                                             │
│  • Item three                                           │
│                                                         │
│  ─────────── separator ───────────                      │
│                                                         │
│  ← Back to Changelog                                    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ [Footer]  (shared)                                      │
└─────────────────────────────────────────────────────────┘
```

---

## Components

### Post Header

- **Back link** — `font-primary text-body-sm text-text-muted hover:text-accent transition-colors duration-fast`. Arrow prefix "< Back to Changelog". Links to `/changelog`
- **Date overline** — `text-overline font-primary font-bold text-text-muted uppercase tracking-widest mt-8`
- **Title** — `font-primary font-bold text-h1 text-text-bright tracking-snug mt-2`
- **Tags** — Row of Badge components. `mt-4 flex flex-wrap gap-2`. Same styling as changelog list

### Separator

- Below tags, above body: `bg-border my-8`

### PostLayout (prose body)

Custom component wrapping MDX-rendered content. Applies consistent typography:

| Element | Styling |
|---------|---------|
| `<h2>` | `font-primary font-bold text-h2 text-text-bright tracking-snug mt-12 mb-4` |
| `<h3>` | `font-primary font-medium text-h3 text-text-bright mt-8 mb-3` |
| `<p>` | `font-primary text-body text-text leading-loose mb-6` |
| `<a>` | `text-accent hover:text-accent-hover underline underline-offset-4 decoration-accent-dim hover:decoration-accent` |
| `<strong>` | `font-medium text-text-bright` |
| `<em>` | `italic` |
| `<ul>` | `list-disc pl-6 mb-6 space-y-2` |
| `<ol>` | `list-decimal pl-6 mb-6 space-y-2` |
| `<li>` | `font-primary text-body text-text leading-loose` |
| `<blockquote>` | `border-l-2 border-expression-mauve pl-4 ml-0 text-text-muted italic` (expression mauve per target-adaptations) |
| `<code>` (inline) | `font-mono text-body-sm bg-surface px-1.5 py-0.5 rounded-sm border border-border` |
| `<pre>` | Code block — see below |
| `<hr>` | `bg-border h-px my-8 border-0` |
| `<img>` | `rounded-md border border-border my-8` (rare — brand is typographic) |

### Code Blocks

Terminal-style. No border radius (square edges). Shiki server-rendered syntax highlighting.

```
┌─────────────────────────────────────────────────────────┐
│ $ gsp brand-strategy                                    │
│                                                         │
│  Archetype: Creator + Guide                             │
│  Voice: Clear, Warm, Lighthearted                       │
│                                                         │
│  ◆ strategy complete                                    │
└─────────────────────────────────────────────────────────┘
```

- Container: `bg-surface border border-border rounded-none p-4 font-mono text-body-sm leading-loose overflow-x-auto my-8`
- Wrapped in Scroll Area component for horizontal overflow
- Syntax theme: monochrome base (`text-text`) with amber for keywords (`text-accent`), muted for comments (`text-text-muted`), bright for strings (`text-text-bright`)

### Post Footer

- Separator: `bg-border my-8`
- Back link (repeated): same as header back link

---

## States

### Default

Post renders with all MDX content. Title, metadata, prose, code blocks all visible.

### Loading

Static page — no loading state. Content compiled at build time.

### 404 (post not found)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ◇                                                      │
│                                                         │
│  H1: Post not found                                     │
│                                                         │
│  Body: This changelog entry doesn't exist               │
│  or may have been moved.                                │
│                                                         │
│  [← Back to Changelog]                                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

- Diamond `◇` in `text-text-muted text-display-2` (large, decorative)
- H1 in `text-h1 text-text-bright`
- Body in `text-body text-text-muted`
- Back link as outlined button

Uses Next.js `not-found.tsx` within the changelog route group.

---

## Interactions

- **Back link hover:** Color transition `text-muted -> text-accent` (100ms)
- **Inline link hover:** Decoration transitions from `accent-dim` to `accent` (100ms)
- **Code block:** Horizontal scroll via Scroll Area on overflow. No copy button on prose code blocks (only on InstallCommand)
- **Scroll reveal:** Minimal — post content appears immediately. No staggered reveal on prose (would be annoying for reading)

---

## Accessibility

### VoiceOver Reading Order

1. Skip-to-content link
2. Nav
3. Back link ("Back to Changelog")
4. Date
5. Title (H1)
6. Tags
7. Prose body in document order (headings, paragraphs, lists, code blocks)
8. Bottom back link
9. Footer

### Semantic Structure

```html
<main id="main">
  <nav aria-label="Breadcrumb">
    <a href="/changelog">← Back to Changelog</a>
  </nav>
  <article aria-labelledby="post-title">
    <header>
      <time datetime="2026-03-19">MARCH 2026</time>
      <h1 id="post-title">Designed by GSP</h1>
      <div role="list" aria-label="Tags">...</div>
    </header>
    <hr aria-hidden="true" />
    <div class="prose">
      <!-- MDX rendered content -->
    </div>
  </article>
  <nav aria-label="Breadcrumb">
    <a href="/changelog">← Back to Changelog</a>
  </nav>
</main>
```

- `<article>` with `aria-labelledby` for the post title
- `<time>` with `datetime` attribute
- Code blocks receive `role="code"` from Shiki. Long code blocks are scrollable with `tabindex="0"` so keyboard users can scroll

### Focus Management

- Tab order: nav, back link, inline links in prose, bottom back link, footer
- Code blocks with overflow: focusable (`tabindex="0"`) for keyboard scrolling, with `aria-label="Code example, scrollable"`

---

## Typography Showcase

This screen uses the full type scale:

| Level | Token | Usage |
|-------|-------|-------|
| H1 | `--text-h1` | Post title |
| H2 | `--text-h2` | Section headings in body |
| H3 | `--text-h3` | Subsection headings |
| Body | `--text-body` | Paragraph text |
| Body-sm | `--text-body-sm` | Back link, code blocks |
| Caption | `--text-caption` | Badge text |
| Overline | `--text-overline` | Date |
| Code | `--font-mono` | Inline code, code blocks |

---

## Responsive

| Breakpoint | Column width | Padding | Code blocks |
|------------|-------------|---------|-------------|
| Mobile (<640px) | Full width | 16px | Horizontal scroll, full-bleed optional |
| Tablet (640-1023px) | max-w-xl | 24px | Contained within column |
| Desktop (1024px+) | max-w-2xl | 48px | Contained within column |

On mobile, code blocks may optionally break out of the content column to use full viewport width (negative margin technique) for better readability. This is a build-time decision.

---

## Related

- [Navigation](./shared/navigation.md)
- [Responsive](./shared/responsive.md)
- [Component Plan](./shared/component-plan.md)
- [Screen 01: Landing](./screen-01-landing.md)
- [Screen 02: Changelog List](./screen-02-changelog-list.md)
