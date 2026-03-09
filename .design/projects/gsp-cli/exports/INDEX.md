# GSP Design Exports

> Load this file first, then load only the chunks needed for your task.

## Usage

This file is the entry point for coding agents consuming GSP design output.

1. Read this file to find chunk paths for your task
2. Load only the chunks relevant to your current screen or component
3. Each chunk is self-contained — follow `## Related` links for cross-references

## Quick Reference

- Building a screen? → Screens table → load screen chunk + referenced components
- Need a component spec? → Components table (in brand system)
- Need color/type/spacing? → Foundations table (in brand system)
- Need implementation details? → Specs table

## Design System (Brand-Level)

<!-- BEGIN:system -->
### Foundations

| Foundation | File | Tokens |
|------------|------|--------|
| Color System | `system/foundations/color-system.md` | accent, text-primary, text-secondary, text-tertiary, success, warning, error, info |
| Typography | `system/foundations/typography.md` | H1, H2, H3, Body, Secondary |
| Spacing | `system/foundations/spacing.md` | indent-1, indent-2, space-1, space-2, space-3 |
| Content Patterns | `system/foundations/content-patterns.md` | status message format, tone calibration |

### Components

| Component | File | States | Variants |
|-----------|------|--------|----------|
| Banner | `system/components/banner.md` | default | install splash |
| Brand Mark | `system/components/brand-mark.md` | fresh, active, complete | standalone, inline |
| Pipeline Flow | `system/components/pipeline-flow.md` | per-phase states | horizontal, vertical compact |
| Phase Block | `system/components/phase-block.md` | complete, active, critical | — |
| Progress Bar | `system/components/progress-bar.md` | empty, partial, full | bar+label, percentage-only |
| Status Message | `system/components/status-message.md` | success, error, warning, info | — |
| Tree | `system/components/tree.md` | — | — |
| Summary Box | `system/components/summary-box.md` | — | with brand mark, plain |
| Divider | `system/components/divider.md` | — | plain, labeled |
| Key-Value | `system/components/key-value.md` | — | — |
| Table | `system/components/table.md` | — | plain, status-annotated |
<!-- END:system -->

## Screens

<!-- BEGIN:screens -->
| # | Screen | File | Components Used |
|---|--------|------|-----------------|
| 1 | Onboarding Splash | [screen-01-onboarding-splash.md](../design/screen-01-onboarding-splash.md) | Banner, Brand Mark, Status Message, Tree |
| 2 | Help Reference | [screen-02-help-reference.md](../design/screen-02-help-reference.md) | Brand Mark, Divider, Key-Value, Tree |
| 3 | Progress Dashboard | [screen-03-progress-dashboard.md](../design/screen-03-progress-dashboard.md) | Brand Mark, Pipeline Flow, Progress Bar, Table, Divider, Key-Value |
| 4 | Start Greeting | [screen-04-start-greeting.md](../design/screen-04-start-greeting.md) | Brand Mark, Pipeline Flow, Status Message, Summary Box |
| 5 | Phase Transitions | [screen-05-phase-transitions.md](../design/screen-05-phase-transitions.md) | Phase Block, Status Message, Tree, Divider |

### Shared

| Section | File |
|---------|------|
| Personas | [personas.md](../design/shared/personas.md) |
| Information Architecture | [information-architecture.md](../design/shared/information-architecture.md) |
| Component Plan | [component-plan.md](../design/shared/component-plan.md) |
<!-- END:screens -->

## Brief

<!-- BEGIN:brief -->
| Section | File |
|---------|------|
| Scope | [scope.md](../brief/scope.md) |
| Target Adaptations | [target-adaptations.md](../brief/target-adaptations.md) |
| Gap Analysis | [gap-analysis.md](../brief/gap-analysis.md) |
| File References | [file-references.md](../brief/file-references.md) |
<!-- END:brief -->

## Research

<!-- BEGIN:research -->
| Section | File |
|---------|------|
| UX Patterns | [ux-patterns.md](../research/ux-patterns.md) |
| Competitor UX | [competitor-ux.md](../research/competitor-ux.md) |
| Technical Research | [technical-research.md](../research/technical-research.md) |
| Accessibility Patterns | [accessibility-patterns.md](../research/accessibility-patterns.md) |
| Content Strategy | [content-strategy.md](../research/content-strategy.md) |
| Reference Specs | [reference-specs.md](../research/reference-specs.md) |
| Recommendations | [recommendations.md](../research/recommendations.md) |
<!-- END:research -->

## Implementation Specs

<!-- BEGIN:specs -->
| Section | File | Scope |
|---------|------|-------|
| Implementation Guide | [CODE.md](../build/CODE.md) | All 5 screens — change order, code blocks, testing checklist |
| Color System | [color-system.js](../build/components/color-system.js) | getColorTier, getColors, 4-tier constants (install.js) |
| Banner | [banner.js](../build/components/banner.js) | printBanner with sparkle field + density ramp (install.js) |
| Status Message | [status-message.js](../build/components/status-message.js) | statusSuccess, statusSkipped, statusWarning, statusInfo helpers (install.js) |
| File Tree | [file-tree.js](../build/components/file-tree.js) | printFileTree box-drawing helper (install.js) |
| Phase Transition Template | [phase-transition-template.md](../build/components/phase-transition-template.md) | Completion output template + values table for 12 phase commands |
<!-- END:specs -->

## Critique

<!-- BEGIN:critique -->
| Section | File |
|---------|------|
| Critique | [critique.md](../critique/critique.md) |
| Prioritized Fixes | [prioritized-fixes.md](../critique/prioritized-fixes.md) |
| Alternative Directions | [alternative-directions.md](../critique/alternative-directions.md) |
| Strengths | [strengths.md](../critique/strengths.md) |
| Accessibility Audit | [accessibility-audit.md](../critique/accessibility-audit.md) |
| Accessibility Fixes | [accessibility-fixes.md](../critique/accessibility-fixes.md) |
<!-- END:critique -->

## Review

<!-- BEGIN:review -->
| Section | File |
|---------|------|
| Acceptance Report | [acceptance-report.md](../review/acceptance-report.md) |
| Issues | [issues.md](../review/issues.md) |
<!-- END:review -->
