# GSP Design Exports

> Load this file first, then load only the chunks needed for your task.

## Usage

This file is the entry point for coding agents consuming GSP design output.

1. Read this file to find chunk paths for your task
2. Load only the chunks relevant to your current screen or component
3. Do not load monolith files (SYSTEM.md, SCREENS.md, SPECS.md) unless chunks are unavailable
4. Each chunk is self-contained — follow `## Related` links for cross-references

## Quick Reference

- Building a screen? → Screens table → load screen chunk + referenced components
- Need a component spec? → Components table
- Need color/type/spacing? → Foundations table
- Need implementation details? → Specs table

## Design System

<!-- BEGIN:system -->
| Section | Chunk | Lines |
|---------|-------|-------|
| _(populated by /gsp:system)_ | | |

### Foundations

| Foundation | File | Tokens |
|------------|------|--------|
| | | |

### Components

| Component | File | States | Variants |
|-----------|------|--------|----------|
| | | | |
<!-- END:system -->

## Screens

<!-- BEGIN:screens -->
| # | Screen | File | Components Used |
|---|--------|------|-----------------|
| _(populated by /gsp:design)_ | | | |

### Shared

| Section | File |
|---------|------|
| | |
<!-- END:screens -->

## Implementation Specs

<!-- BEGIN:specs -->
| Section | File |
|---------|------|
| _(populated by /gsp:spec)_ | | |
<!-- END:specs -->

## Review Fixes

<!-- BEGIN:review -->
| Section | File |
|---------|------|
| _(populated by /gsp:review)_ | |
<!-- END:review -->
