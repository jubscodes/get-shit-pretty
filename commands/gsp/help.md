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
Command Reference
═══════════════════════════════════════

PROJECT SETUP
  /gsp:new-project     Initialize design brief through guided Q&A
  /gsp:help            Show this command reference
  /gsp:progress        Check project status — "How pretty are we?"

DESIGN PIPELINE (run in order)
  /gsp:research        Phase 1 — Trend analysis & competitive landscape
  /gsp:brand           Phase 2 — Brand identity (strategy, logo, color, type)
  /gsp:system          Phase 3 — Design system foundations + tokens
  /gsp:design          Phase 4 — UI/UX screens & interaction flows
  /gsp:spec            Phase 5 — Figma-ready specifications
  /gsp:review          Phase 6 — Design critique + accessibility audit
  /gsp:build           Phase 7 — Design-to-code translation
  /gsp:launch          Phase 8 — Marketing campaign assets

PIPELINE FLOW
  new-project → research → brand → system → design → spec → review → build → launch
                                                        ↑                |
                                                        └── loop back ───┘
                                                       (if critical issues)

PROJECT STRUCTURE
  .design/
  ├── BRIEF.md                    Design brief
  ├── ROADMAP.md                  Phase plan
  ├── STATE.md                    Progress tracking
  ├── config.json                 Preferences
  ├── research/TRENDS.md          Trend analysis
  ├── brand/IDENTITY.md           Brand identity
  ├── system/SYSTEM.md            Design system
  ├── system/tokens.json          Design tokens
  ├── screens/SCREENS.md          UI/UX screens
  ├── specs/FIGMA-SPECS.md        Figma specifications
  ├── review/CRITIQUE.md          Design critique
  ├── review/ACCESSIBILITY.md     WCAG audit
  ├── build/CODE.md               Implementation guide
  ├── build/components/           Code components
  └── launch/CAMPAIGN.md          Marketing assets

TIPS
  • Run phases in order — each builds on the previous
  • /gsp:review loops back if critical issues are found
  • /gsp:progress shows your prettiness meter
  • You can skip phases if you already have the artifacts
```
</process>
