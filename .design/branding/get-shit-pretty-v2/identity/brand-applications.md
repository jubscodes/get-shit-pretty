# Brand Applications

> Phase: identity | Brand: get-shit-pretty | Generated: 2026-03-19

---

## Terminal Output (Primary Touchpoint)

The CLI is where most users encounter GSP. Every terminal interaction is a brand moment.

### Phase Output

```
◆ Strategy complete

  5 chunks written to .design/branding/strategy/
  ├── archetype.md
  ├── positioning.md
  ├── brand-platform.md
  ├── voice-and-tone.md
  └── messaging.md

  That's a wrap. Let's keep going.
```

- Phase header: `◆` diamond in amber + phase name in bold (JetBrains Mono 700)
- File listing: tree-drawing characters, muted color for paths
- Completion message: warm, specific, in primary text color
- No exclamation marks. No emoji. Specifics over superlatives.

### Progress Indicators

```
  ◆ ◆ ◇ ◇  identity
  ━━━━━━━━━━━━━━━━━━━━░░░░░░░░  68%
```

- Diamond grid shows phase progress (filled = complete)
- Progress bar: block characters, amber fill, muted empty
- Percentage in muted color, right-aligned

### Error States

```
  Error: no BRIEF.md found

  Run /gsp:start to create one, or add a BRIEF.md
  to .design/branding/{name}/.
```

- "Error:" label in error red (#E54D42), no exclamation
- Explanation in primary text, clear next step
- The Guide helps you fix it, does not just report it

---

## GitHub README

### Structure

1. `/gsp` logo mark in monospace (no image file dependency)
2. One-line description in JetBrains Mono
3. Terminal screenshot showing real output (dark, cropped, amber highlights)
4. Installation as a code block
5. Skill listing as a clean table

### Visual Treatment

- No badges wall at the top. One or two essential badges (npm version, license) placed after the description, not before.
- Section headers in `##` (rendered as JetBrains Mono bold by GitHub)
- Code blocks with real GSP output, not pseudocode
- Diamond characters for list markers where appropriate
- The README itself demonstrates GSP's design quality -- spacing, hierarchy, restraint

---

## npm Package Page

### Design Direction

- Package name: `get-shit-pretty` in monospace
- Description: the positioning statement, one sentence
- Keywords: intentional, reflecting actual search terms
- README renders from GitHub -- same visual treatment
- No banner image. The terminal output IS the visual.

---

## Social Media (dev Twitter / Bluesky)

### Card Format

```
┌────────────────────────────────────┐
│                                    │
│  Your product works.               │
│  Does it look like it works?       │
│                                    │
│  /gsp                              │
│                                    │
└────────────────────────────────────┘
```

- Dark background (Void #050505)
- Instrument Sans 700 for the headline text (40-56px)
- `/gsp` mark in amber, bottom-left
- JetBrains Mono for supporting text
- Single amber accent element maximum per card
- No gradients, no effects, no stock images

### Post Voice

- Lighthearted leads on social. Personality at full volume.
- Show real output. "Here's what `/gsp:palette` generates from a single hex value."
- Short threads with terminal screenshots over long text posts

---

## Conference Slides

### Slide Template

- Background: Void black (#050505)
- Headlines: Instrument Sans 700, 72-160px, bright white (#FAFAFA)
- Supporting text: JetBrains Mono 400, 24-32px, text color (#E8E8E8)
- Accent: amber for one element per slide maximum
- Code slides: full-screen terminal output, JetBrains Mono 20-24px
- Aspect ratio: 16:9
- No slide transitions. Instant cut.

### Title Slide

```
  get-shit-pretty

  The design process
  for your terminal.

  /gsp                          ◆
```

- Product name in Instrument Sans 700, bright white
- Tagline in JetBrains Mono 400, text color
- Mark and diamond in amber, bottom corners

---

## Documentation Site

### Visual Direction

- Dark mode default, light mode available
- Navigation: left sidebar, JetBrains Mono, hierarchical with diamond markers
- Content area: max-width 720px for monospace readability (approx. 80 characters)
- Code blocks: slightly elevated surface (#111111), 1px border (#1E1E1E), 2px radius
- Headings: JetBrains Mono 700 (not Instrument Sans -- docs stay monospace)
- Dot grid texture on page background at 0.02 opacity
- Search: prominent, monospace input, amber focus ring

### Page Hierarchy

```
  /gsp docs

  ◆ Getting started
  ├── Installation
  ├── First brand
  └── Configuration

  ◇ Skills reference
  ├── /gsp:start
  ├── /gsp:palette
  └── ...
```

---

## Related

- [Logo Directions](./logo-directions.md)
- [Color System](./color-system.md)
- [Typography](./typography.md)
- [Imagery Style](./imagery-style.md)
