# Competitive Audit

> Phase: discover | Brand: get-shit-pretty | Generated: 2026-03-08

---

## Competitor Analysis

### 1. GSD (Get Shit Done)

- **Positioning:** Spec-driven development system for AI coding agents. Meta-prompting, context engineering, state management.
- **Strengths:** Proven at scale (Amazon, Google, Shopify, Webflow). Multi-runtime support. 40+ commands. Strong community.
- **Weaknesses:** No design dimension. Pure execution/delivery focus. No brand thinking.
- **Visual Style:** No distinct brand identity — GitHub-native, documentation-first. Functional, not designed.
- **Relationship:** Philosophical foundation. GSD gets shit done; GSP gets shit pretty. Same energy, complementary scope.

### 2. shadcn/ui + v0 (Vercel)

- **Positioning:** AI-powered component generation. Copy-paste component library (shadcn/ui) plus conversational UI builder (v0).
- **Strengths:** Massive adoption. Beautiful default components. Tight Next.js/Tailwind integration. v0 generates production-ready React code.
- **Weaknesses:** No brand journey. Components are generic until styled. v0 produces isolated screens, not coherent brand systems. No strategy layer.
- **Visual Style:** Clean, minimal, Tailwind-native. Geist font family (Sans + Mono). Dark mode default. Neutral grays.
- **Gap GSP fills:** shadcn gives you components; GSP gives you the brand system that makes those components coherent across your entire product.

### 3. Claude Code / OpenCode / Gemini CLI / Codex (Native AI Capabilities)

- **Positioning:** General-purpose AI coding agents in the terminal.
- **Strengths:** Powerful. Flexible. Can do ad-hoc design asks ("make this look nice"). Claude Code is the most-loved tool at 46%.
- **Weaknesses:** No structured design process. Each prompt is stateless — no brand memory across sessions. Inconsistent visual output.
- **Visual Style:** Terminal-native. No design opinion.
- **Gap GSP fills:** GSP is the design layer that runs inside these runtimes, giving them brand memory and structured process.

### 4. Figma + Figma Make

- **Positioning:** Collaborative design tool evolving into design-to-code pipeline. Figma Make (2025-2026) is their AI play — generating production code from Figma designs.
- **Strengths:** Massive ecosystem. Real-time collaboration. Dev mode. Plugin ecosystem. Figma Make bridges the design-to-code gap from the canvas side.
- **Weaknesses:** GUI-first paradigm — lives in Figma's world, not where code ships. Figma Make generates code from designs, but doesn't generate design from strategy. No brand journey. Still starts with a visual canvas, not a brief. The handoff problem shifts but doesn't disappear.
- **Visual Style:** Playful, colorful, community-driven. Neubrutalist community sections.
- **Gap GSP fills:** Figma Make goes canvas → code. GSP goes brief → brand → design → code, all in the terminal. GSP starts upstream (strategy, brand coherence) and works where AI coding agents already live. Different paradigm: conversational creation vs. visual canvas.

### 5. Linear

- **Positioning:** Project management for product teams. Known for exceptional brand craft.
- **Strengths:** Best-in-class dark mode UI. Aurora gradients. Inter typography. Obsessive attention to micro-interactions. Spring physics animations.
- **Weaknesses:** Not a design tool — it is a project tracker. Brand is aspirational, not a competitor.
- **Visual Style:** Dark-first (#000 base). Desaturated blue brand color. Glassmorphism overlays. Subtle gradients. Inter typeface. Smooth transitions.
- **Relevance to GSP:** Brand reference. Linear proves that developer tools can have extraordinary design craft. GSP should aspire to this level of polish.

### 6. Storybook

- **Positioning:** Frontend workshop for UI component development, testing, and documentation.
- **Strengths:** Industry standard for component docs. Used by Shopify, IBM, Salesforce, GitHub. Auto-generates documentation from stories.
- **Weaknesses:** Downstream tool — documents what already exists. No brand strategy input. No design opinion.
- **Visual Style:** Functional, documentation-focused. Pink/coral accent color. Clean but not particularly opinionated.
- **Gap GSP fills:** GSP works upstream of Storybook — defining brand strategy and design system before components are documented.

## Positioning Map

```
                    STRUCTURED PROCESS
                         |
              GSP        |     Figma + Make
          (brief →       |     (canvas → code,
           brand →       |      structured but
           code, CLI)    |      GUI-first)
                         |
  CODE-ONLY -------------|------------- BRAND-TO-BUILD
                         |
       Claude Code       |     shadcn/ui + v0
       (ad-hoc,          |     (components, no
        stateless)       |      brand journey)
                         |
       GSD               |     Storybook
       (execution,       |     (documentation,
        no design)       |      no strategy)
                         |
                    AD-HOC / UNSTRUCTURED
```

### 7. Omarchy (DHH / 37signals)

- **Positioning:** "Beautiful, Modern & Opinionated Linux." Arch Linux distro with Hyprland tiling WM. Proves terminal-native systems can be aesthetically stunning.
- **Strengths:** Extraordinary brand for a Linux distro — ASCII art screensavers, vibrant theme community (63+ themes), "aesthetics are the point" philosophy. One `colors.toml` propagates across terminal, btop, Chromium, Hyprland, Waybar — system-wide coherence from a single source of truth. Omakase curation ("trust the chef") over infinite choice. Ships with AI coding agents (Claude Code, OpenCode). DHH's audience and credibility.
- **Weaknesses:** Not a design tool — it is an OS distro. Brand influence is environmental (your desktop looks beautiful), not productive (you don't create brands with it). Linux-only.
- **Visual Style:** ASCII art as genuine brand identity. Theme-driven — Tokyo Night, Catppuccin, Gruvbox, etc. Retro-futuristic, Amiga demo scene energy. Square corners, tiling geometry.
- **Relevance to GSP:** Brand inspiration, not competitor. Omarchy proves the audience exists — developers who care deeply about how their terminal looks. The theme system (one config → system-wide coherence) mirrors GSP's token philosophy (one tokens.json → brand coherence). Both say "terminal is a design medium, not a compromise." Omarchy beautifies the environment; GSP beautifies the output.

## White Space

GSP occupies the upper-right quadrant alongside Figma, but from a fundamentally different entry point: **CLI-native, brief-first, conversational.** Figma Make goes canvas → code. GSP goes brief → brand → design → code.

Critically, GSP is not isolated — it can **connect with** Figma and Storybook to produce visual outputs, and it ships production-ready components that are testable in code. This makes GSP an orchestrator that integrates with the existing tool ecosystem rather than replacing it.

The closest threat is the "do nothing" alternative: developers continuing to ask AI for ad-hoc design help. GSP's job is to make the structured alternative so natural that ad-hoc feels inadequate.

---

## Related

- [Market Landscape](./market-landscape.md)
- [SWOT Analysis](./swot-analysis.md)
- [Strategic Recommendations](./strategic-recommendations.md)
