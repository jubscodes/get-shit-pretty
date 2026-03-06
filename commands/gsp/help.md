---
name: gsp:help
description: Show GSP command reference
---
<objective>
Display the complete GSP command reference.

Output ONLY the reference content below. Do NOT add:
- Project-specific analysis
- File context or git status
- Next-step suggestions
- Any commentary beyond the reference
</objective>

<process>
Output the following reference exactly:

```
🎨 GSP — Get Shit Pretty
Command Reference (v0.4.0 — Dual Diamond)
═══════════════════════════════════════

GETTING STARTED
  /gsp:new             Smart entry — start a brand or project
  /gsp:help            Show this command reference
  /gsp:progress        Check progress — "How pretty are we?"
  /gsp:doctor          Diagnose health across brands + projects

BRANDING DIAMOND (4 phases)
  /gsp:discover        Phase 1 — Competitive audit, personas, SWOT, trends
  /gsp:strategy        Phase 2 — Brand Prism, archetypes, Golden Circle, positioning
  /gsp:verbal          Phase 3 — Voice, tone spectrum, messaging, naming
  /gsp:identity        Phase 4 — Logo system, color, typography, imagery

PROJECT DIAMOND (6 phases)
  /gsp:system          Phase 1 — Design system foundations + tokens
  /gsp:design          Phase 2 — UI/UX screens & interaction flows
  /gsp:spec            Phase 3 — Implementation specifications
  /gsp:review          Phase 4 — Design critique + accessibility audit
  /gsp:build           Phase 5 — Design-to-code translation
  /gsp:launch          Phase 6 — Marketing campaign assets

E2E FLOW (10 phases)
  discover → strategy → verbal → identity → system → design → spec → review → build → launch
  |________ branding diamond ________|  |_____________ project diamond ______________|

ALIASES (backwards compatible)
  /gsp:new-project     → redirects to /gsp:new
  /gsp:research        → redirects to /gsp:discover
  /gsp:brand           → redirects to /gsp:identity

DIRECTORY STRUCTURE
  .design/
  ├── branding/
  │   └── {brand-name}/
  │       ├── BRIEF.md              Brand brief
  │       ├── STATE.md              Brand progress
  │       ├── config.json           Brand config
  │       ├── discover/DISCOVER.md  Discovery research
  │       ├── strategy/STRATEGY.md  Brand strategy
  │       ├── verbal/VERBAL.md      Verbal identity
  │       ├── identity/IDENTITY.md  Visual identity
  │       ├── identity/palettes.json OKLCH color palettes
  │       └── exports/              Chunked exports
  └── projects/
      └── {project-name}/
          ├── BRIEF.md              Project brief
          ├── STATE.md              Project progress
          ├── config.json           Project config
          ├── brand.ref             → brand reference
          ├── system/SYSTEM.md      Design system
          ├── system/tokens.json    Design tokens
          ├── screens/SCREENS.md    UI/UX screens
          ├── specs/SPECS.md        Implementation specs
          ├── review/CRITIQUE.md    Design critique
          ├── review/ACCESSIBILITY.md WCAG audit
          ├── build/CODE.md         Implementation guide
          ├── build/components/     Code components
          ├── launch/CAMPAIGN.md    Marketing assets
          └── exports/              Chunked exports

TIPS
  • Start with /gsp:new — it detects what exists and routes you
  • Multiple brands and projects can coexist
  • Projects reference a brand via brand.ref
  • /gsp:review loops back if critical issues found
  • /gsp:doctor checks brand drift across projects
  • /gsp:progress shows prettiness across all instances
```
</process>
