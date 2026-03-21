# Logo Directions

> Phase: identity | Brand: get-shit-pretty | Generated: 2026-03-19

---

## Design Principles

The GSP logo must be **ASCII-native first**. This is not a graphic logo adapted to monospace -- it is a mark conceived in the terminal, that can optionally be rendered graphically. Every direction must pass three tests:

1. **Monochrome test:** Readable with no color at all
2. **Terminal test:** Renders correctly in monospace at 80-column width
3. **Favicon test:** Recognizable at 16x16 pixels

Strategic grounding: The Creator archetype demands precision in every character. The Guide archetype demands approachability -- the mark should feel like an invitation, not a gatekeep.

---

## Direction 1: The Slash Mark

### Concept

The forward slash is GSP's native punctuation -- every skill invocation begins with `/gsp:`. The Slash Mark takes this literal interaction pattern and elevates it into an identity. Two forward slashes framing the letterform, creating a mark that is simultaneously a logo and a valid terminal gesture.

### Strategic Rationale

- **Creator:** The slash is the builder's most common character -- paths, commands, divisions. Using it as the logo says "I was born in the terminal."
- **Guide:** The slash-colon pattern (`/gsp:`) is how the tool greets you. The logo IS the interaction.
- **Positioning:** No competitor uses their invocation syntax as their identity. This is unique to CLI-native tools.

### ASCII Rendering

```
Primary mark (horizontal):

  /gsp

Inline CLI mark:

  /gsp:

Icon mark (stacked, for avatars and favicons):

  /g
  /s
  /p

Framed mark (for headers and display):

  ┌─────────┐
  │  /gsp   │
  └─────────┘
```

### Variations

| Variation | Use Case | Rendering |
|-----------|----------|-----------|
| **Primary** | README headers, documentation | `/gsp` in JetBrains Mono 700 |
| **Inline** | CLI output, terminal prompts | `/gsp:` with trailing colon |
| **Icon** | Favicon, GitHub avatar, npm | Stacked `/g /s /p` or single `/` in amber |
| **Wordmark** | Marketing, display | `get-shit-pretty` in Instrument Sans 700, `/gsp` above in mono |

### Clear Space

Minimum clear space equals the width of one monospace character on all sides. In graphic contexts, this translates to 1x the height of the slash character.

### Minimum Size

- Icon mark: 16px (favicon)
- Primary mark: 14px (inline text)
- Wordmark: 24px (display)

### Usage Rules

- The slash is always a forward slash, never backslash
- In terminal contexts, always use the inline form with colon: `/gsp:`
- The slash must remain the same weight as the letterforms -- never bolded separately
- In color contexts, the slash renders in amber (#E5A00D), letters in text color (#E8E8E8)

---

## Direction 2: The Diamond Grid

### Concept

A 2x2 grid of diamond characters (using Unicode lozenge/diamond forms) representing GSP's four-phase brand diamond: discover, strategy, identity, system. One diamond is filled (amber) -- the active phase. The rest are outlined. The grid rotates which diamond is filled depending on context, but the default state fills the bottom-right (system -- the destination).

### Strategic Rationale

- **Creator:** The grid is a system -- four phases, four quadrants, structured and intentional. The Creator builds grids.
- **Guide:** The filled diamond shows "you are here" -- wayfinding through the design process.
- **Positioning:** GSP's dual-diamond methodology is its core differentiator. Making the diamond the logo embeds the process into the identity.

### ASCII Rendering

```
Default state (system phase highlighted):

  ◇ ◇
  ◇ ◆

All phases (brand journey complete):

  ◆ ◆
  ◆ ◆

With label:

  ◇ ◇
  ◇ ◆  gsp

Progress indication (identity phase):

  ◆ ◆
  ◆ ◇

Minimal (single diamond):

  ◆
```

### Variations

| Variation | Use Case | Rendering |
|-----------|----------|-----------|
| **Primary** | Brand mark with wordmark | 2x2 grid + `gsp` to the right |
| **Icon** | Favicon, avatar | Single filled diamond `◆` |
| **Progress** | CLI phase output | Grid with active phase filled |
| **Inline** | Terminal text | `◆ gsp` single diamond + name |

### Clear Space

One diamond-width on all sides. The grid has no internal padding beyond standard character spacing.

### Minimum Size

- Single diamond icon: 12px
- Full grid: 24px
- Grid with wordmark: 32px

### Usage Rules

- Default state always fills bottom-right diamond (system phase)
- In progress contexts, fill diamonds left-to-right, top-to-bottom as phases complete
- The diamond character must be `◆` (U+25C6) filled or `◇` (U+25C7) outlined -- no substitutes
- In color, filled diamonds are amber (#E5A00D), outlined diamonds are muted (#6B6B6B)

---

## Direction 3: The Cursor Bracket

### Concept

A terminal cursor (block or underscore) bracketed by angle characters, creating a mark that looks like a command prompt waiting for input. The cursor blinks in animated contexts. It represents the moment before creation -- GSP is what happens when the cursor starts moving.

### Strategic Rationale

- **Creator:** The blinking cursor is the universal symbol of potential creation. Every piece of software begins here.
- **Guide:** The bracket frames say "we're ready when you are" -- patient, present, not pushing.
- **Positioning:** The cursor is developer-native imagery that no design tool has claimed. Figma uses a pen. Vercel uses a triangle. GSP uses the cursor.

### ASCII Rendering

```
Primary mark:

  > _  gsp

Prompt style:

  gsp > _

Bracketed (for display):

  [ > _ ]  gsp

Active state (cursor filled):

  > █  gsp

Minimal:

  > _
```

### Variations

| Variation | Use Case | Rendering |
|-----------|----------|-----------|
| **Primary** | README, documentation | `> _  gsp` prompt with name |
| **Prompt** | CLI output headers | `gsp > _` name-first |
| **Bracketed** | Display, marketing | `[ > _ ]` framed mark |
| **Icon** | Favicon, avatar | `> _` or `>_` condensed |
| **Animated** | Web, social | Blinking cursor block |

### Clear Space

Width of two monospace characters on all sides. The space between the cursor and the wordmark is exactly two characters.

### Minimum Size

- Icon: 16px
- Primary: 14px
- Bracketed: 20px

### Usage Rules

- The cursor character in static contexts is underscore `_`, in active/animated contexts is block `█`
- The angle bracket `>` is always a greater-than sign, never a guillemet or arrow
- In color, the cursor renders in amber (#E5A00D), bracket and text in primary text color
- Animation: 530ms blink interval (standard terminal cursor rate), opacity toggle not scale

---

## Recommendation

**Direction 1 (The Slash Mark)** is the strongest candidate. Rationale:

- It is the simplest to render across every medium -- pure ASCII, no Unicode dependencies
- It IS the product interaction (`/gsp:`) -- the logo and the UX are the same thing
- It scales from favicon (a single `/`) to billboard (`/gsp` at 160px Instrument Sans)
- It differentiates immediately -- no other dev tool uses its invocation syntax as its logo
- The Creator's precision shows in the economy of the mark. The Guide's warmth shows in the familiarity -- you already know this mark from using the tool.

Direction 2 (Diamond Grid) is the strongest secondary system for phase indicators and progress visualization. Direction 3 (Cursor Bracket) works well for loading states and animated contexts.

A combined system could use the Slash Mark as the primary logo and the Diamond Grid as a supporting system element for phase navigation.

---

## Related

- [Color System](./color-system.md)
- [Typography](./typography.md)
- [Brand Applications](./brand-applications.md)
