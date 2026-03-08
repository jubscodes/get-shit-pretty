# Typography

> Phase: identity | Brand: get-shit-pretty | Generated: 2026-03-08

---

## Design Philosophy

The type system says: this was built in a terminal. Monospace IS the identity -- not a secondary treatment, not "also available in mono." JetBrains Mono leads. Inter provides warmth for extended reading. The pairing mirrors the brand personality: precise (mono) and warm (sans).

---

## Primary: JetBrains Mono

**License:** SIL Open Font License 1.1 (free, open source)
**Source:** [jetbrains.com/lp/mono](https://www.jetbrains.com/lp/mono/)

**Why JetBrains Mono:** Terminal-native identity demands a monospace typeface designed for code. JetBrains Mono has increased x-height for readability, distinctive letterforms that prevent ambiguity (l/1/I, 0/O), and ligature support for code contexts. It is the typeface of the medium GSP lives in. Shared family DNA with jubs.studio -- both use JetBrains Mono as primary, establishing ecosystem typographic coherence.

**Available weights:**

| Weight | Value | Use |
|--------|-------|-----|
| Regular | 400 | Body code, inline references, terminal output |
| Medium | 500 | Labels, navigation, secondary headings |
| Bold | 700 | Primary headings, brand name, emphasis |
| ExtraBold | 800 | Display/hero (sparingly) |

**Use cases:** Headings (all levels), brand name (`/gsp:`), navigation, labels, code blocks, terminal output, data tables, the logo itself.

---

## Secondary: Inter

**License:** SIL Open Font License 1.1 (free, open source)
**Source:** [rsms.me/inter](https://rsms.me/inter/)

**Why Inter:** The warmth complement to monospace precision. Inter's humanist proportions and optical sizing features make it excellent for extended reading -- documentation, descriptions, marketing copy. Where jubs.studio pairs JetBrains Mono with Space Grotesk's geometric edge, GSP pairs with Inter's warmth. Same monospace anchor, different personality through the secondary face. The voice attribute "warm (not soft)" maps directly to Inter's character: readable, approachable, never decorative.

**Available weights:**

| Weight | Value | Use |
|--------|-------|-----|
| Regular | 400 | Body text, descriptions, documentation |
| Medium | 500 | Emphasized body, subheadings in long-form |
| SemiBold | 600 | Section titles in documentation |
| Bold | 700 | Marketing headlines (when mono feels too technical) |

**Use cases:** Body paragraphs, documentation prose, marketing descriptions, form labels, tooltips, long-form content.

---

## Type Scale

Base size: 16px. Scale ratio: 1.25 (Major Third).

| Level | Font | Size | Weight | Line Height | Tracking | Use |
|-------|------|------|--------|-------------|----------|-----|
| Display XL | JetBrains Mono | 72px / 4.5rem | 800 | 1.0 | -0.02em | Hero headlines, splash |
| Display | JetBrains Mono | 48px / 3rem | 700 | 1.05 | -0.02em | Page titles, marketing |
| H1 | JetBrains Mono | 36px / 2.25rem | 700 | 1.15 | -0.01em | Primary section headings |
| H2 | JetBrains Mono | 28px / 1.75rem | 700 | 1.2 | -0.01em | Sub-section headings |
| H3 | JetBrains Mono | 22px / 1.375rem | 500 | 1.3 | 0 | Component headings |
| H4 | JetBrains Mono | 18px / 1.125rem | 500 | 1.4 | 0 | Minor headings, labels |
| Body LG | Inter | 18px / 1.125rem | 400 | 1.6 | 0 | Lead paragraphs, intros |
| Body | Inter | 16px / 1rem | 400 | 1.6 | 0 | Default body text |
| Body SM | Inter | 14px / 0.875rem | 400 | 1.5 | 0.01em | Secondary descriptions |
| Caption | Inter | 12px / 0.75rem | 500 | 1.4 | 0.02em | Metadata, timestamps |
| Code | JetBrains Mono | 14px / 0.875rem | 400 | 1.6 | 0 | Inline code, code blocks |
| Code SM | JetBrains Mono | 12px / 0.75rem | 400 | 1.5 | 0 | Terminal output, dense data |

---

## Responsive Behavior

| Breakpoint | Scale Adjustment | Notes |
|------------|-----------------|-------|
| >= 1280px (desktop) | Base scale as defined | Full type scale |
| 768-1279px (tablet) | Display sizes reduce by 25% | Display XL: 54px, Display: 36px |
| < 768px (mobile) | Display sizes reduce by 40%, body unchanged | Display XL: 43px, Display: 29px |

Body text (16px) does not shrink below mobile. Readability over density.

---

## Ecosystem Type Comparison

| Brand | Primary (Mono) | Secondary (Sans) | Personality Through Type |
|-------|---------------|-------------------|------------------------|
| jubs.studio | JetBrains Mono | Space Grotesk | Geometric edge. Cyberpunk precision. |
| GSP | JetBrains Mono | Inter | Warm precision. Mentor energy. |
| cyphercn | JetBrains Mono | (mono-only) | Pure terminal. Utilitarian. |

Shared anchor (JetBrains Mono) = family. Different secondary = individual personality.

---

## Usage Rules

1. **Headings are always JetBrains Mono.** No exceptions. The monospace identity must be consistent at every heading level.
2. **Body text defaults to Inter.** Switch to JetBrains Mono only for code, data, or terminal-context content.
3. **Never use more than two type families** in a single layout. The system is JetBrains Mono + Inter. No third typeface.
4. **Negative tracking on display sizes only.** Body text and smaller uses zero or positive tracking.
5. **Line height decreases as size increases.** Display text is tight (1.0-1.05). Body text breathes (1.5-1.6).
6. **The brand name `/gsp:` is always JetBrains Mono,** regardless of surrounding text context.

---

## Related

- [Color System](./color-system.md)
- [Logo Directions](./logo-directions.md)
- [Brand Applications](./brand-applications.md)
