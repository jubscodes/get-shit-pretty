# Project Brief

## Project
- **Name:** gsp-app
- **Type:** website
- **Date:** 2026-03-19
- **Brand:** get-shit-pretty-v2

## What We're Building
- **Description:** Marketing website for Get Shit Pretty — a landing page that promotes GSP and doubles as living proof that the system works. Includes a changelog/blog for updates and releases. The meta angle is the trust signal: this site was designed by GSP itself.
- **Platforms:** Web
- **Key screens/flows:** Landing page (hero, features, pipeline visualization, CTA), Changelog/Blog (updates, releases, posts)

## Audience
- **Primary:** Dev — full-stack developer / indie hacker who ships from the terminal. Wants products that look as good as they work.
- **Secondary:** Des — product/brand designer curious about the terminal era. Wants to bridge design thinking to where products ship.

## Goals
- **Business goal:** Drive npm installs and GitHub stars. Establish GSP as the design process for CLI builders.
- **Design goal:** The website itself is the proof. Every visitor should think "I want my product to look this considered" — then install GSP.
- **Success metrics:** npm install conversion from site visits, GitHub star growth, time-on-page for landing, changelog engagement.

## Constraints
- **Platform:** Web (responsive, mobile-first)
- **Tech stack:** Next.js (App Router) + Tailwind v4 + shadcn/ui
- **Timeline:** No hard deadline — quality over speed
- **Accessibility:** WCAG 2.2 AA (default)

## Scope
- **Design scope:** full
- **Target screens:** Landing page, Changelog/Blog
- **Codebase type:** greenfield (new `app/` directory in existing repo)
- **Implementation target:** shadcn

## Deliverables
- [ ] Design system + tokens (shadcn theme from v2 brand)
- [ ] UI/UX screens
- [ ] Implementation specs
- [ ] Design review
- [ ] Code components
- [ ] Marketing assets

## Notes
- The meta pitch: "This website was designed by GSP" is the core trust signal
- Expression palette (lavender, rose, blush) gets to shine on web — this is its native medium
- Content likely markdown-sourced for changelog/blog posts
- The v2 brand's web token mapping (system/components/web/token-mapping.md) feeds directly into shadcn theming
- `app/` folder lives in the root of the get-shit-pretty repo
