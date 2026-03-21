# Competitive Audit

> Phase: discover | Brand: get-shit-pretty | Generated: 2026-03-18

---

## Positioning Map

GSP has no direct competitor. The audit maps adjacent players across two axes:

- **X-axis: Pieces vs Process** -- Does the tool give you components/output (pieces) or guide you through decisions (process)?
- **Y-axis: Designer-Native vs Developer-Native** -- Where does the tool live and who does it speak to?

```
                    PROCESS (guided journey)
                         |
                         |
              Figma      |      GSP
              (design    |      (design engineering
               process,  |       process, CLI-native)
               GUI)      |
                         |
  DESIGNER ──────────────┼────────────────── DEVELOPER
   NATIVE                |                    NATIVE
                         |
              Storybook  |      shadcn/ui
              (component |      (component library,
               docs,     |       copy-paste)
               browser)  |
                         |
                    PIECES (output/components)
```

GSP occupies the **upper-right quadrant** alone. This is the white space.

## Competitor Analysis

### shadcn/ui

| Attribute | Assessment |
|-----------|------------|
| **Positioning** | "The foundation for your design system" -- component library, not a process |
| **Visual Language** | Neutral by design. Black/white base, clean borders, Tailwind-native. Deliberately unstyled to avoid the "every shadcn app looks the same" critique. |
| **Typography** | Inter (body), Geist Mono (code). The default stack of 2024-2025. |
| **Color** | CSS variables, HSL-based theming. Zinc/Slate neutrals as defaults. |
| **Brand Personality** | Pragmatic, understated, deliberately invisible. The anti-brand brand. |
| **Strengths** | Massive adoption. Ecosystem of themes and extensions. Copy-paste model gives ownership. |
| **Weaknesses** | No design guidance. No brand process. Gives you bricks, not architecture. Shadcn Create attempts to address this but is still about initial setup, not ongoing coherence. |
| **Threat to GSP** | Low direct threat. GSP is upstream -- it can output tokens that feed shadcn projects. |

### Figma

| Attribute | Assessment |
|-----------|------------|
| **Positioning** | "How the world designs" -- the design tool, expanding to all product builders |
| **Visual Language** | Refreshed in 2024: vibrant primitives, custom Figma Sans (by Grilli Type), playful but professional. Moved beyond vector vernacular to "design language as language, not system." |
| **Color** | Bold, saturated palette. Purple-blue primary, expanded accent range. |
| **Brand Personality** | Inclusive, energetic, collaborative. Expanding audience without diluting. |
| **Strengths** | Category leader. Custom typeface signals investment. Community ecosystem. |
| **Weaknesses** | GUI-only. Cannot meet developers in the terminal. Plugin ecosystem doesn't extend to CLI workflows. |
| **Threat to GSP** | Low -- different medium entirely. GSP references Figma as admired, not competitive. |

### Storybook

| Attribute | Assessment |
|-----------|------------|
| **Positioning** | "Frontend workshop for UI development" -- component documentation and testing |
| **Visual Language** | Pink primary (#FF4785), clean interface, developer-friendly docs aesthetic. |
| **Color** | Hot pink accent on white/dark backgrounds. Bold but single-note. |
| **Brand Personality** | Friendly, technical, open-source community energy. |
| **Strengths** | Standard for component documentation. Broad framework support. Strong docs-as-brand approach. |
| **Weaknesses** | Browser-based. Documents components but doesn't guide design decisions. No brand process. |
| **Threat to GSP** | Minimal. GSP's design system output could feed into Storybook documentation. |

### v0 (Vercel)

| Attribute | Assessment |
|-----------|------------|
| **Positioning** | "Build with AI" -- generative UI from prompts |
| **Visual Language** | Inherits Vercel's monochrome confidence. Geist typeface family. Black/white with subtle gradients. |
| **Color** | Pure black (#000), pure white (#FFF), occasional blue accent. Monochrome as identity. |
| **Brand Personality** | Sleek, confident, premium. The Apple of developer tools. |
| **Strengths** | Backed by Vercel ecosystem. Strong design DNA from Geist system. Fast iteration on AI capabilities. |
| **Weaknesses** | Output-focused -- generates components, not brand systems. Persistent bias toward Vercel aesthetic in generated code. Framework-locked (React/Next.js). |
| **Threat to GSP** | Moderate for attention. V0 solves a different problem (generate a page) but competes for the "AI + design" narrative. |

### Cursor

| Attribute | Assessment |
|-----------|------------|
| **Positioning** | "The AI Code Editor" -- IDE with deep AI integration |
| **Visual Language** | VS Code fork aesthetic. Dark mode default, blue accents, standard IDE chrome. |
| **Color** | Deep navy background, blue-purple highlights. Professional but unremarkable. |
| **Brand Personality** | Technical, capable, productivity-focused. |
| **Strengths** | Strong AI integration. Growing 35% over nine months. IDE-native workflow. |
| **Weaknesses** | No design guidance at all. Pure code tool. Visual identity is forgettable. |
| **Threat to GSP** | None direct. Cursor is a host environment, not a competitor. |

### Omarchy (Cultural Reference)

| Attribute | Assessment |
|-----------|------------|
| **Positioning** | "A beautiful system is a motivating system" -- opinionated Arch Linux distribution |
| **Visual Language** | Terminal-native beauty. ASCII art as genuine brand identity. 17 curated themes. Ghostty terminal. |
| **Brand Personality** | Opinionated, aesthetic-first, "productivity is downstream from motivation." |
| **Relevance to GSP** | Cultural proof point. Omarchy proved that CLI users care deeply about aesthetics and that terminal beauty is a real brand value. GSP should reference this energy without copying the retro-Linux aesthetic. |

## Visual Language Comparison

| Brand | Primary Font | Mono Font | Dark BG | Accent | Radius | Voice |
|-------|-------------|-----------|---------|--------|--------|-------|
| shadcn/ui | Inter | Geist Mono | Zinc #09090B | Neutral | 8px | Invisible |
| Figma | Figma Sans | Figma Mono | N/A (light-first) | Multicolor | 8-12px | Playful |
| Vercel/v0 | Geist Sans | Geist Mono | #000000 | None (mono) | 6px | Confident |
| Linear | Inter | Mono | Warm gray | Purple glow | 6px | Professional |
| Storybook | Nunito Sans | Mono | #1A1A2E | Pink #FF4785 | 4px | Friendly |
| **GSP (opportunity)** | ? | Monospace-first | Deep black | ? | Sharp | Irreverent |

## White Space Analysis

The competitive landscape reveals three clear gaps GSP can own:

1. **Process in the terminal.** Every adjacent tool is either a GUI process tool (Figma) or a CLI output tool (shadcn, v0). Nobody guides design decisions inside the terminal.

2. **Monospace-first brand identity.** Vercel uses Geist Sans as primary and Geist Mono as secondary. Linear uses Inter. shadcn uses Inter. Nobody leads with monospace as the primary brand typeface. GSP should -- it signals terminal-native credibility.

3. **Irreverence as a brand value.** The developer tool space is dominated by two tones: corporate-clean (Vercel, Linear) or friendly-approachable (Figma, Storybook). Nobody is confidently irreverent. Teenage Engineering does this in hardware; nobody does it in developer tools. GSP's "swears at the desk but ships pixel-perfect" positioning is unoccupied.

---

## Related

- [Market Landscape](./market-landscape.md)
- [Mood Board Direction](./mood-board-direction.md)
