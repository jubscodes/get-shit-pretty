# Logo Directions

> Phase: identity | Brand: get-shit-pretty | Generated: 2026-03-08

---

## Direction 1: The Living Mark (Recommended)

### Concept

The GSP logo IS the interface. The brand mark is functional -- it reflects pipeline state. Two Unicode diamonds represent the dual-diamond methodology (branding + project). As phases complete, diamonds transition from empty to filled. No other dev tool has a logo that doubles as a progress indicator.

This is the Teenage Engineering principle made typographic: engineering elevated to aesthetic. The logo doesn't represent the tool. It IS the tool.

### Strategic Rationale

- **Creator archetype:** The mark is itself a crafted system -- rules-based, modular, alive. The Creator builds systems that evolve.
- **Magician archetype:** The state transitions are transformation made visible. Empty to filled. Nothing to shipped.
- **Positioning:** "Design journey for the terminal" -- the logo literally journeys through states.
- **Culture:** "Constraints as creative fuel" -- Unicode characters as logo primitives. The terminal constraint becomes the creative medium.

### Primary Lockup

```
  /gsp: ◇◇
```

JetBrains Mono, regular weight. The slash command users already type. Terminal-native. Code-native. The colon is structural -- it mirrors command syntax.

### Living Diamond States

```
  ◇◇   starting (nothing done)
  ◈◇   branding in progress
  ◆◇   branding complete, project ahead
  ◆◈   project in progress
  ◆◆   everything shipped
```

### Variations

| Variant | Form | Use Case |
|---------|------|----------|
| Full lockup | `/gsp: ◇◇` | Primary brand mark. Hero, header, splash. |
| State-aware | `/gsp: ◆◈` | Terminal output, CLI statusline, progress. |
| Symbol only | `◇◇` | Favicon, avatar, small contexts, app icon. |
| Wordmark only | `/gsp:` | Terminal prompts, inline docs, code comments. |
| Extended | `/gsp:pretty` | Hero marketing, tagline moments, launch. |

### ASCII Fallback

```
  /gsp: <>  <>
```

For environments without Unicode support. Angle brackets preserve the diamond shape.

### Clear Space

Minimum clear space equals the width of one diamond character on all sides. In pixel terms: 1em at the rendered font size.

```
  ┌─────────────────────┐
  │                     │
  │   /gsp: ◇◇         │
  │                     │
  └─────────────────────┘
       ↑ 1em padding
```

### Minimum Size

- Full lockup: 120px wide minimum (ensures colon and diamonds remain legible)
- Symbol only: 16px minimum (favicon size)
- Wordmark only: 80px wide minimum

### Usage Rules

1. Always render in JetBrains Mono. No substitutions.
2. Diamond states must reflect actual pipeline state -- never use a filled diamond for decoration.
3. On dark backgrounds: text-primary (#E0E0E0) or white. On rare light contexts: true black.
4. Never add effects: no shadows, no gradients, no outlines, no glow.
5. The colon in `/gsp:` is not optional. It is syntactic, not decorative.
6. Burnt orange (#FF6B35) may be used for the diamonds only when showing accent emphasis. Default is monochrome.

---

## Direction 2: The Minimal Slash

### Concept

The command syntax alone carries the brand. `/gsp:` is the wordmark -- full stop. Diamonds exist as a separate accent element, used for ornamentation and state indication but not part of the primary mark. The restraint is the statement.

### Strategic Rationale

- **Vercel influence:** Type-as-identity. The word IS the brand. No symbol needed.
- **Precision attribute:** The most minimal possible mark. Nothing extraneous.
- **Terminal-native:** `/gsp:` is literally what you type. The brand is the command.

### Primary Mark

```
  /gsp:
```

JetBrains Mono, medium weight. The slash is integral -- it signals "command," "path," "action."

### Accent Element (Separate)

```
  ◇◇     (used independently as pattern, texture, divider)
```

Diamonds appear in layouts, documentation headers, section breaks -- but not locked to the wordmark.

### Variations

| Variant | Form | Use Case |
|---------|------|----------|
| Primary | `/gsp:` | All primary brand contexts |
| Extended | `/gsp:pretty` | Hero, marketing, tagline |
| Accent pair | `◇◇` | Decorative, pattern, section dividers |
| Monochrome | `/gsp:` in single color | Dark/light surface adaptations |

### Clear Space and Size

- Clear space: 1.5x the height of the slash character on all sides
- Minimum size: 80px wide
- The slash must never be cropped

### Usage Rules

1. The diamonds never attach to the wordmark in this direction.
2. Diamonds used as accent can be any state (filled, half, empty) for decorative purposes.
3. Weight stays at medium -- never bold, never light.

---

## Direction 3: The Diamond System

### Concept

The dual diamonds lead. `◇◇` is the primary mark. `/gsp:` becomes a secondary descriptor that accompanies the symbol when context demands it. For contexts where a compact, ownable symbol must do the work -- app icons, social avatars, merch, the favicon line.

### Strategic Rationale

- **Dual-diamond methodology:** The symbol IS the methodology diagram, compressed to two characters. Branding diamond + project diamond.
- **Anthropic influence:** One symbolic detail carries the whole story. The two diamonds hold the entire product narrative.
- **Scalability:** Symbols travel further than wordmarks. The diamonds work at 16px and at 160px.

### Primary Mark

```
  ◇◇
```

Rendered in JetBrains Mono or as a custom vector. Optical spacing between diamonds equals 0.25em.

### Lockup (Secondary)

```
  ◇◇
  /gsp:
```

Stacked. Symbol above, wordmark below. Or horizontal: `◇◇ /gsp:`

### Variations

| Variant | Form | Use Case |
|---------|------|----------|
| Symbol primary | `◇◇` | Avatar, favicon, app icon, merch |
| Stacked lockup | `◇◇` over `/gsp:` | Documentation headers, splash screens |
| Horizontal lockup | `◇◇ /gsp:` | Inline references, footer |
| State-aware | `◆◇`, `◆◆` etc. | Status, progress, badges |

### Clear Space and Size

- Clear space: 1x diamond width on all sides
- Minimum size: 14px (single diamond must remain recognizable)

### Usage Rules

1. When the symbol leads, `/gsp:` is always smaller or secondary in hierarchy.
2. The two diamonds must always appear as a pair. Never use a single diamond as the brand mark.
3. Custom vector versions must match JetBrains Mono diamond geometry exactly.

---

## Recommendation

**Direction 1: The Living Mark** is the recommended primary system. It is the most complete expression of the brand strategy -- functional, modular, and unprecedented. Directions 2 and 3 serve as contextual subsets within Direction 1's system:

- Use Direction 2's minimal approach for terminal output and inline documentation
- Use Direction 3's symbol-forward approach for avatars and compact contexts
- Use Direction 1's full system as the canonical brand mark

The living mark is not three directions competing. It is one system with three focal distances.

---

## Related

- [Color System](./color-system.md)
- [Typography](./typography.md)
- [Brand Applications](./brand-applications.md)
