# Style Contract

## Brand: _style-neubrutalism
**Style:** neubrutalism | **Generated:** 2026-03-26

> The style contract is the single source of truth for how this brand looks and feels. Designer and builder agents consume this document — not raw tokens, not prose descriptions.

---

## Intensity

| Dial | Value | Meaning |
|------|-------|---------|
| Variance | 8 | Asymmetric layouts, sticker rotations, deliberate chaos |
| Motion | 5 | Snappy mechanical interactions, not cinematic |
| Density | 6 | Visually dense — textures, borders, layered elements |

---

## Philosophy

Digital punk rebellion against polished SaaS. Thick borders and hard-offset shadows give every element physical weight — like stickers slapped on a bulletin board. The screen is a collage, not a glass surface. Bright, unapologetic color blocks create visual energy. If it doesn't have a border, it doesn't exist.

---

## Patterns

### Card
| Property | Rule |
|----------|------|
| border | 3px solid #000000 |
| shadow | 4px 4px 0px 0px #000000 to 6px 6px 0px 0px #000000 |
| radius | rounded-none |
| background | #FFFFFF |
| header | colored background (#C4B5FD or #FFD93D) with border-b-4 separator |

### Button (primary)
| Property | Rule |
|----------|------|
| background | #FF6B6B (accent) |
| border | 3px solid #000000 |
| shadow | 2px 2px 0px 0px #000000 |
| text | uppercase, weight 700, tracking-wide |
| radius | rounded-none |

### Button (secondary)
| Property | Rule |
|----------|------|
| background | #FFD700 (secondary) |
| border | 3px solid #000000 |
| shadow | 2px 2px 0px 0px #000000 |
| text | uppercase, weight 700, tracking-wide |
| radius | rounded-none |

### Input
| Property | Rule |
|----------|------|
| border | 3px solid #000000 |
| radius | rounded-none |
| background | #FFFFFF |
| focus | background fills #FFD700, shadow appears, no ring/outline |
| height | h-14 to h-20 |

### Badge
| Property | Rule |
|----------|------|
| shape | rounded-full OR rounded-none with 3px border |
| text | font-black text-sm uppercase tracking-widest |
| decoration | rotate-1 to rotate-3, absolute positioned over parent |

### Navigation
| Property | Rule |
|----------|------|
| logo | bordered box with accent background, uppercase text |
| links | bold uppercase, hover adds border + background + shadow |
| mobile | hamburger as bordered square with hard shadow |

### Layout
| Property | Rule |
|----------|------|
| archetype | **sticker-collage** |
| max-width | max-w-7xl |
| section-spacing | py-16 to py-32 |
| grid-gap | gap-8 to gap-12 |
| surfaces | halftone dots, grid lines, or noise overlay — never flat |
| asymmetry | 60/40 splits, offset columns, staggered grids |
| decoration | rotated sticker elements, overlapping shapes, large background text at low opacity |

---

## Constraints

### Never
- backdrop-filter or blur — conflicts with flat, structural aesthetic
- gradient backgrounds — solid color blocks only
- box-shadow with blur > 0 — all shadows must be hard-offset (x y 0px 0px)
- border-radius between 1px and 9998px — binary: rounded-none or rounded-full
- subtle grays (#333, #666, #999) — pure black or a saturated color
- ease-in-out easing — mechanical feel requires linear or ease-out only
- large empty whitespace — fill with texture, patterns, or decorative elements
- opacity/transparency on surfaces — except texture overlays at low opacity

### Always
- hard-offset shadows (x y 0px 0px) on every elevated element
- visible border-4 border-black on every interactive surface
- uppercase on headings, labels, and buttons
- high contrast — WCAG AA minimum, no subtle gray text
- slight rotation (rotate-1 to rotate-3) on at least some containers per section
- texture overlay (halftone, grid, or noise) on section backgrounds

---

## Effects

**Interaction vocabulary:** press-down, lift-shadow, snap-rotate, snap-fill

### Hover
| Element | Technique | Description |
|---------|-----------|-------------|
| card | lift-shadow | -translate-y-1, shadow deepens from md to lg |
| button | snap-fill | background darkens, fast snap transition |
| link | snap-fill | border + background + shadow appear instantly |
| badge | snap-rotate | rotates further on hover (rotate-12) |

### Active
| Element | Technique | Description |
|---------|-----------|-------------|
| button | press-down | translate-x-[2px] translate-y-[2px], shadow-none — mechanical click |

### Focus
| Element | Rule |
|---------|------|
| input | snap-fill — background becomes #FFD700, shadow appears |
| general | ring-2 ring-black ring-offset-2 |

### Transition
duration-100 to duration-200, ease-linear or ease-out

### Ambient
- slow-spin — decorative stars rotate (10s linear infinite)
- pulse — CTA elements pulse at rest
- bounce — attention badges bounce

---

## Bold Bets

1. **Sticker layering** — Elements feel like physical stickers: rotated text blocks with borders and shadows, badges positioned absolutely that overlap content, multiple "layers" created with offset shadows. Use rotate-1/rotate-2/rotate-3 on containers and badges.

2. **Mechanical button physics** — Buttons physically press down on click: translate-x-[2px] translate-y-[2px] covers the shadow completely, creating an arcade-game switch feel. Shadow returns on release. This is the signature interaction — do not soften it.

3. **Texture everywhere** — No background is ever flat. Apply halftone dots (radial-gradient #000 1.5px, transparent 1.5px, 20px repeat), grid lines (linear-gradient rgba(0,0,0,0.1) 1px, transparent 1px, 40px repeat), or noise (SVG feTurbulence filter at low opacity). Sections alternate textures.

4. **Color blocking as rhythm** — Large sections alternate solid backgrounds: cream (#FFF8F0), accent red (#FF6B6B), secondary yellow (#FFD700), muted violet (#C4B5FD), pure black. Each section is a distinct color zone. No gradients — hard color stops only.

5. **Text stroke display type** — Hero headlines use -webkit-text-stroke: 2px black with color: transparent for massive hollow outlined text. Overlay with solid version offset 2-3px for depth. Use Space Grotesk at weight 900, tracking-tighter.

---

## Related

- [tokens.json](./tokens.json) — W3C Design Tokens
- [color-system.md](./foundations/color-system.md)
- [typography.md](./foundations/typography.md)
- [elevation.md](./foundations/elevation.md)
