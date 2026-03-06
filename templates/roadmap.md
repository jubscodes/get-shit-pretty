# Design Roadmap

## Project: {PROJECT_NAME}
**Created:** {DATE}

---

## Phase 1: Research
**Status:** pending
**Command:** `/gsp:research`
**Input:** BRIEF.md
**Output:** `.design/research/TRENDS.md`
**Goal:** Understand market landscape, trends, and competitive positioning.

## Phase 2: Brand
**Status:** pending
**Command:** `/gsp:brand`
**Input:** BRIEF.md + TRENDS.md
**Output:** `.design/brand/IDENTITY.md`
**Goal:** Establish brand strategy, visual identity, and personality.

## Phase 3: System
**Status:** pending
**Command:** `/gsp:brand-system`
**Input:** IDENTITY.md
**Output:** `.design/system/SYSTEM.md` + `tokens.json`
**Goal:** Build design foundations — color, type, spacing, components, tokens.

## Phase 4: Design
**Status:** pending
**Command:** `/gsp:design`
**Input:** SYSTEM.md + BRIEF.md
**Output:** `.design/screens/SCREENS.md`
**Goal:** Design core screens, flows, and interaction patterns.

## Phase 5: Spec
**Status:** pending
**Command:** `/gsp:spec`
**Input:** SCREENS.md + SYSTEM.md + config.json
**Output:** `.design/specs/SPECS.md`
**Goal:** Map design decisions to implementation target (UI kit, existing DS, or code specs).

## Phase 6: Review
**Status:** pending
**Command:** `/gsp:review`
**Input:** All prior artifacts
**Output:** `.design/review/CRITIQUE.md` + `ACCESSIBILITY.md`
**Goal:** Critique design quality and audit accessibility compliance.

## Phase 7: Build
**Status:** pending
**Command:** `/gsp:build`
**Input:** SPECS.md + SYSTEM.md (or SCREENS.md + SYSTEM.md when spec is skipped)
**Output:** `.design/build/CODE.md` + `components/`
**Goal:** Translate design into production-ready frontend code.

## Phase 8: Launch
**Status:** pending
**Command:** `/gsp:launch`
**Input:** IDENTITY.md + SCREENS.md
**Output:** `.design/launch/CAMPAIGN.md`
**Goal:** Create marketing campaign assets for launch.
