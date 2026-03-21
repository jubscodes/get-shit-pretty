# The Project Researcher

**Category:** Project Research
**Use when:** Deep research into UX patterns, competitor experiences, technical approaches, accessibility strategies, and reference specs for a specific project

---

## Prompt

Act as a Senior UX Researcher and Technical Analyst. Research [PROJECT_TYPE] deeply — UX patterns, competitor experiences, technical approaches, accessibility strategies, and reference specs for execution.

**UX patterns research:**
Find established UX patterns for [PROJECT_TYPE] products. Search for current best practices, case studies, and pattern libraries. Cover navigation, interaction, information architecture, onboarding, and empty state patterns. Every pattern must have a source.

**Competitor UX analysis:**
Identify 3-5 competitor or adjacent products solving similar problems. Analyze their UX deeply — not features lists, but specific interactions, flows, and design decisions. What works, what doesn't, what's unique. Find opportunity gaps.

**Technical research:**
Investigate [TECH_STACK]-specific patterns for building [PROJECT_TYPE]. Component composition, state management, performance optimization, animation approaches. Focus on patterns proven in production, not theoretical.

**Accessibility research:**
Research accessibility patterns specific to [PROJECT_TYPE]. Keyboard navigation maps, screen reader flows, focus management for complex interactions (modals, drawers, dynamic content). Find WCAG criteria most relevant to this product type.

**Content strategy:**
Study microcopy conventions for [PROJECT_TYPE] — button labels, error messages, empty states, tooltips. Research information density and terminology conventions.

**Reference specs collection:**
Find and collect specs that execution phases will need:
- API documentation for integrations
- Component library API references ([TECH_STACK]-specific)
- Platform guidelines relevant to this product
- Accessibility implementation guides
- Third-party service documentation
For each: include source URL, key takeaways, and how it applies to this project.

**Synthesis:**
Distill all research into adopt/adapt/avoid recommendations tied to specific findings.

---

## Variables

- `[PROJECT_TYPE]` — What's being built (dashboard, e-commerce, social app, SaaS, etc.)
- `[TECH_STACK]` — Implementation technology (React + Tailwind, React Native, etc.)
- `[PLATFORM]` — Target platforms (web, iOS, Android)
- `[BRAND_DISCOVERY]` — Brand-level competitive audit and trends (to build on, not duplicate)
- `[SCOPE]` — Project scope from brief/scope.md

## Expected Output

- UX patterns with sources and applicability assessment
- Competitor UX deep-dives with specific interaction analysis
- Stack-specific technical patterns and architecture recommendations
- Accessibility patterns with implementation guidance
- Content strategy conventions
- Reference specs with URLs and key takeaways
- Synthesized adopt/adapt/avoid recommendations
