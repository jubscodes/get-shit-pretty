# GSP Design Exports

> Load this file first, then load only the chunks needed for your task.

## Usage

This file is the entry point for coding agents consuming GSP design output.

1. Read this file to find chunk paths for your task
2. Load only the chunks relevant to your current screen or component
3. Each chunk is self-contained — follow `## Related` links for cross-references

## Quick Reference

- Building a screen? → Design table → load screen chunk + referenced components
- Need a component spec? → Components table (in brand system)
- Need color/type/spacing? → Foundations table (in brand system)
- Need project scope? → Brief table
- Need UX patterns or reference specs? → Research table

## Design System (Brand-Level)

<!-- BEGIN:system -->
| Section | Chunk | Lines |
|---------|-------|-------|
| _(populated by /gsp:brand-system — lives in brand directory)_ | | |

### Foundations

| Foundation | File | Tokens |
|------------|------|--------|
| | | |

### Components

| Component | File | States | Variants |
|-----------|------|--------|----------|
| | | | |
<!-- END:system -->

## Project Brief

<!-- BEGIN:brief -->
| Section | File |
|---------|------|
| Scope | [scope.md](../brief/scope.md) |
| Target Adaptations | [target-adaptations.md](../brief/target-adaptations.md) |
| Install Manifest | [install-manifest.md](../brief/install-manifest.md) |
<!-- END:brief -->

## Project Research

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

## Design

<!-- BEGIN:design -->
### Screens

| # | Screen | File | Components Used |
|---|--------|------|-----------------|
| 01 | Landing Page | [screen-01-landing.md](../design/screen-01-landing.md) | Button, Card, Badge, Separator, PipelineViz, TerminalMock, InstallCommand, AtmosphericBg |
| 02 | Changelog List | [screen-02-changelog-list.md](../design/screen-02-changelog-list.md) | Badge, Separator |
| 03 | Changelog Post | [screen-03-changelog-post.md](../design/screen-03-changelog-post.md) | Badge, Scroll Area, PostLayout |

### Shared

| Section | File |
|---------|------|
| Personas | [personas.md](../design/shared/personas.md) |
| Information Architecture | [information-architecture.md](../design/shared/information-architecture.md) |
| Navigation | [navigation.md](../design/shared/navigation.md) |
| Micro-interactions | [micro-interactions.md](../design/shared/micro-interactions.md) |
| Responsive | [responsive.md](../design/shared/responsive.md) |
| Component Plan | [component-plan.md](../design/shared/component-plan.md) |
<!-- END:design -->

## Design Critique

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

## Build

<!-- BEGIN:build -->
| Section | File |
|---------|------|
| Build Log | [BUILD-LOG.md](../build/BUILD-LOG.md) |
<!-- END:build -->

## QA Review

<!-- BEGIN:review -->
| Section | File |
|---------|------|
| _(populated by /gsp:project-review)_ | |
<!-- END:review -->

## Launch Campaign (Optional)

<!-- BEGIN:launch -->
| Section | File |
|---------|------|
| _(populated by /gsp:launch — optional)_ | |
<!-- END:launch -->
