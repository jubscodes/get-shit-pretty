# Brand Roadmap

## Brand: {BRAND_NAME}
**Created:** {DATE}

---

## Phase 0: Audit (optional)
**Status:** skipped
**Command:** `/gsp:brand-audit`
**Input:** Existing brand assets + BRIEF.md
**Output:** `audit/`
**Goal:** Audit existing brand. Assess coherence, market fit, equity. Produce evolution map.
**When:** Run when evolving an existing brand. Skip for new brands.

## Phase 1: Research
**Status:** pending
**Command:** `/gsp:brand-research`
**Input:** BRIEF.md
**Output:** `discover/`
**Goal:** Research market landscape, audience personas, competitive positioning, trends.

## Phase 2: Strategy
**Status:** pending
**Command:** `/gsp:brand-strategy`
**Input:** BRIEF.md + discover/
**Output:** `strategy/`
**Goal:** Define brand positioning — archetype, positioning map, personality, messaging.

## Phases 3-4: Identity (Verbal + Visual)
**Status:** pending
**Command:** `/gsp:brand-identity`
**Input:** BRIEF.md + strategy/
**Output:** `verbal/` + `identity/` + `palettes.json`
**Goal:** Build verbal and visual identity — voice, tone, logo, color, typography.
**Granular re-run:** `/gsp:brand-verbal` (phase 3 only)

## Phase 5: Patterns (Design System)
**Status:** pending
**Command:** `/gsp:brand-patterns`
**Input:** Identity + Strategy + Verbal + BRIEF.md
**Output:** `system/` (foundations, components, tokens.json) + `preview.html`
**Goal:** Build design system, generate brand preview, transition to project diamond.
