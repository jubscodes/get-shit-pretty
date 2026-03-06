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
Command Reference (v0.5.0 — Dual Diamond)
═══════════════════════════════════════

GETTING STARTED
  /gsp:new             Smart entry — start a brand or project
  /gsp:help            Show this command reference
  /gsp:progress        Check progress — "How pretty are we?"
  /gsp:doctor          Diagnose health across brands + projects

BRANDING DIAMOND (5 phases)
  /gsp:brand-discover  Phase 1 — Competitive audit, personas, SWOT, trends
  /gsp:brand-strategy  Phase 2 — Brand Prism, archetypes, Golden Circle, positioning
  /gsp:brand-verbal    Phase 3 — Voice, tone spectrum, messaging, naming
  /gsp:brand-identity  Phase 4 — Logo system, color, typography, imagery
  /gsp:brand-system    Phase 5 — Design system foundations + tokens

PROJECT DIAMOND (6 phases)
  /gsp:brief           Phase 1 — Project scoping, adaptations, gap analysis
  /gsp:research        Phase 2 — UX patterns, competitor UX, technical research, reference specs
  /gsp:design          Phase 3 — UI/UX screens & interaction flows
  /gsp:critique        Phase 4 — Design critique + accessibility audit
  /gsp:build           Phase 5 — Design-to-code translation
  /gsp:review          Phase 6 — Deliverable validation + acceptance

OPTIONAL
  /gsp:launch          Marketing campaign assets (on request)

E2E FLOW (11 phases + optional)
  brand-discover → brand-strategy → brand-verbal → brand-identity → brand-system → brief → research → design → critique → build → review
  |_________________ branding diamond __________________|  |_____________ project diamond ___________________|
  Optional: launch (after review)

WORKFLOW
  Treat each project as a bounded issue (or set of issues) and a PR.
  Ship small, ship complete. Break large projects into focused deliverables.

ALIASES (backwards compatible)
  /gsp:new-project     → redirects to /gsp:new
  /gsp:brand           → redirects to /gsp:brand-identity
  /gsp:discover        → redirects to /gsp:brand-discover
  /gsp:strategy        → redirects to /gsp:brand-strategy
  /gsp:verbal          → redirects to /gsp:brand-verbal
  /gsp:identity        → redirects to /gsp:brand-identity
  /gsp:system          → redirects to /gsp:brand-system
  /gsp:spec            → redirects to /gsp:brief
  /gsp:plan            → redirects to /gsp:brief

DIRECTORY STRUCTURE
  .design/
  ├── branding/
  │   └── {brand-name}/
  │       ├── BRIEF.md              Brand brief
  │       ├── STATE.md              Brand progress
  │       ├── config.json           Brand config
  │       ├── discover/             Discovery chunks + INDEX.md
  │       ├── strategy/             Strategy chunks + INDEX.md
  │       ├── verbal/               Verbal chunks + INDEX.md
  │       ├── identity/             Identity chunks + palettes.json + INDEX.md
  │       └── system/               Foundations + components + tokens.json + INDEX.md
  └── projects/
      └── {project-name}/
          ├── BRIEF.md              Project brief
          ├── STATE.md              Project progress
          ├── config.json           Project config
          ├── brand.ref             → brand reference
          ├── brief/                Scope + adaptations + INDEX.md
          ├── research/             UX patterns + competitor UX + tech research + specs + INDEX.md
          ├── design/               Screen chunks + shared/ + INDEX.md
          ├── critique/             Critique + accessibility chunks + INDEX.md
          ├── build/CODE.md         Implementation guide
          ├── build/components/     Code components
          ├── review/               Acceptance report + issues + INDEX.md
          ├── launch/               Campaign chunks + INDEX.md (optional)
          └── exports/INDEX.md      Master chunk index

TIPS
  • Start with /gsp:new — it detects what exists and routes you
  • Multiple brands and projects can coexist
  • Projects reference a brand via brand.ref
  • /gsp:critique loops back if critical issues found
  • /gsp:doctor checks brand drift across projects
  • /gsp:progress shows prettiness across all instances
  • /gsp:launch is optional — run when you need marketing assets
  • Treat projects as issues + PRs — bounded scope = higher quality
```
</process>
</output>
