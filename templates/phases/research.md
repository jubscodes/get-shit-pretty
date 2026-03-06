# Project Research

## Project: {PROJECT_NAME}
**Brand:** {BRAND_NAME}
**Date:** {DATE}

---

> This phase produces deep research chunks + INDEX.md in the `research/` directory. Research is project-specific — focused on UX patterns, competitor experiences, technical approaches, and accessibility strategies for what this project is building.

## Chunk Mapping

### Research Chunks (`research/`)

| Chunk File | Content |
|-----------|---------|
| `ux-patterns.md` | UX patterns and best practices for this product type |
| `competitor-ux.md` | Competitor UX analysis — how others solve similar problems |
| `technical-research.md` | Technical approach research — framework patterns, architecture decisions, integration strategies |
| `accessibility-patterns.md` | Accessibility patterns and strategies specific to this product type |
| `content-strategy.md` | Content patterns, microcopy conventions, information density for this product type |
| `reference-specs.md` | Collected specs, docs, and implementation references for execution |
| `recommendations.md` | Synthesized recommendations — what to adopt, adapt, or avoid |

## Content Reference

Each chunk follows the format in `references/chunk-format.md`. Below is the structural reference for what each chunk should contain:

### ux-patterns.md
- **Product type patterns:** established UX patterns for this category (e.g., dashboard, e-commerce, social, SaaS)
- **Navigation patterns:** proven navigation approaches for this use case
- **Interaction patterns:** common interaction models, gestures, affordances
- **Information architecture:** how similar products organize content
- **Onboarding patterns:** first-run experience approaches
- **Empty state patterns:** how to handle no-content states
- Sources and examples for each pattern

### competitor-ux.md
- **Competitor audit:** 3-5 competitor products analyzed
- Per competitor: product, strengths, weaknesses, unique patterns, screenshots/descriptions
- **Pattern comparison matrix:** feature × competitor showing approach differences
- **Opportunity gaps:** things competitors do poorly or don't do at all
- **Best-in-class examples:** specific UX moments worth studying

### technical-research.md
- **Framework patterns:** relevant patterns for the tech stack (React patterns, RN patterns, etc.)
- **Component architecture:** proven component composition approaches for this product type
- **State management:** recommended patterns for the complexity level
- **Performance considerations:** lazy loading, virtualization, caching strategies
- **Animation patterns:** motion design approaches appropriate for the platform
- **Integration patterns:** API consumption, real-time data, offline support

### accessibility-patterns.md
- **Product-specific a11y:** accessibility considerations unique to this product type
- **Keyboard navigation map:** how keyboard users should navigate this type of product
- **Screen reader flow:** optimal reading order and announcements
- **Focus management:** complex focus patterns (modals, drawers, dynamic content)
- **Touch accessibility:** mobile-specific considerations
- **Cognitive load:** reducing complexity for users with cognitive disabilities

### content-strategy.md
- **Microcopy conventions:** button labels, error messages, empty states, tooltips for this product type
- **Information density:** appropriate content density per screen type
- **Terminology:** domain-specific language considerations
- **Tone adaptation:** how brand voice adapts to different UI contexts (errors, success, onboarding)

### reference-specs.md
- **API specs:** relevant API documentation, endpoints, data shapes for integrations
- **Component library docs:** framework-specific component API references (shadcn docs, RN Reusables docs, etc.)
- **Design token specs:** relevant token format specs, CSS custom property references
- **Platform guidelines:** Apple HIG sections, Material Design sections, or platform-specific docs relevant to this project
- **Accessibility specs:** WCAG criteria most relevant to this product type, with implementation guidance
- **Third-party docs:** documentation for any third-party services, SDKs, or libraries the project will use
- Each reference should include: source URL, key takeaways, how it applies to this project

### recommendations.md
- **Adopt:** patterns to use directly (with sources)
- **Adapt:** patterns to modify for this project's needs
- **Avoid:** anti-patterns and common mistakes for this product type
- **Key decisions:** recommended approach for major UX decisions
- Links to specific patterns in other research chunks
