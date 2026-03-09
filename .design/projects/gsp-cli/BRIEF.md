# Project Brief

## Project
- **Name:** gsp-cli
- **Type:** CLI terminal UX
- **Date:** 2026-03-08
- **Brand:** get-shit-pretty

## What We're Building
- **Description:** Apply the GSP brand identity to the CLI's core terminal output — the screens and flows users see when running GSP commands. Transform raw terminal text into branded, consistent, delightful output using the design system's tokens, components, and foundations.
- **Platforms:** Terminal (macOS, Linux, Windows via Node.js)
- **Key screens/flows:**
  1. Onboarding splash (`npx get-shit-pretty` / installer output)
  2. `/gsp:help` command reference
  3. `/gsp:progress` prettiness dashboard
  4. `/gsp:start` greeting and routing
  5. Phase transition screens (phase complete → next phase prompt)

## Audience
- **Primary:** Developers using AI coding agents (Claude Code, OpenCode, Gemini, Codex) who want their projects to look good
- **Secondary:** Design-curious developers exploring brand/design systems for the first time

## Goals
- **Business goal:** Make GSP feel polished and professional — the tool that makes things pretty should itself be pretty
- **Design goal:** Apply brand tokens (burnt orange, JetBrains Mono, density ramps, diamond motifs) consistently across all core CLI output
- **Success metrics:** All 5 core screens use brand tokens, consistent component patterns, zero raw/unstyled output in core flows

## Constraints
- **Platform:** Terminal (ANSI escape codes, no GUI)
- **Tech stack:** Node.js (CommonJS), ANSI truecolor + 256 + 16 fallback tiers
- **Timeline:** Ship with v0.4.2
- **Accessibility:** High contrast ratios, graceful degradation for limited-color terminals

## Scope
- **Design scope:** partial
- **Target screens:** Onboarding splash, help, progress, start greeting, phase transitions
- **Codebase type:** existing
- **Implementation target:** code

## Deliverables
- [x] Design system + tokens (already complete via brand)
- [ ] UI/UX screens (5 core screens)
- [ ] Implementation specs
- [ ] Design review
- [ ] Code components (Node.js ANSI output)
- [ ] Marketing assets (not needed)

## Notes
The brand system already defines 15 terminal components with full specs (status-message, phase-block, summary-box, banner, spinner, progress-bar, etc.) and a comprehensive tokens.json with ANSI escape codes. This project is about composing those components into the actual CLI screens — not creating new components, but orchestrating existing ones into cohesive experiences.
