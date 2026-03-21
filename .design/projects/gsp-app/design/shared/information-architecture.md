# Information Architecture

> Phase: design | Project: gsp-app | Generated: 2026-03-19

---

## Site Map

```
/                       Landing page (entry point)
/changelog              Changelog list (reverse-chronological)
/changelog/[slug]       Individual post
```

Three routes. No nesting beyond changelog. No auth, no search, no settings.

---

## Content Hierarchy per Page

### / (Landing)

1. **Hero** — What is this? (headline + value prop + install CTA)
2. **What is GSP** — How does it work? (prose + terminal demonstration)
3. **Pipeline** — What is the process? (visual methodology)
4. **Features** — What can it do? (capability cards)
5. **Meta Signal** — Proof it works (whisper, not shout)
6. **CTA Footer** — Ready? Install it (repeated install command)

Each section answers one question. The visitor scrolls through a funnel: awareness, understanding, conviction, action.

### /changelog (List)

1. **Page title** — "Changelog" (H1)
2. **Post entries** — Reverse-chronological stack, newest first
3. **Each entry:** Date overline, H2 title, excerpt, tags

### /changelog/[slug] (Post)

1. **Post header** — Title (H1), date, tags
2. **Post body** — MDX-rendered prose, code blocks, images
3. **Back link** — Return to changelog list

---

## SEO Considerations

- `/` — Title: "Get Shit Pretty -- Design engineering for the terminal"
- `/changelog` — Title: "Changelog -- Get Shit Pretty"
- `/changelog/[slug]` — Title: "{Post Title} -- Get Shit Pretty"
- Open Graph image: dynamic per page using `next/og` ImageResponse
- Canonical URLs. No duplicate content risk with only 3 route patterns
- Structured data: `SoftwareApplication` on landing, `BlogPosting` on changelog posts

---

## Related

- [Navigation](./navigation.md)
- [Personas](./personas.md)
- [Screen 01: Landing](../screen-01-landing.md)
- [Screen 02: Changelog List](../screen-02-changelog-list.md)
- [Screen 03: Changelog Post](../screen-03-changelog-post.md)
