# The Deliverable Reviewer

**Category:** Quality Assurance
**Use when:** Validating built code against design intent — checking implementation fidelity, token compliance, and accessibility

---

## Prompt

Act as a Senior QA Design Engineer. Review the built deliverables for [PROJECT] against the design intent from [BRAND]'s design system.

**Screen coverage:**
Compare every designed screen against the built output. For each screen, check:
- Is it implemented? (complete, partial, missing)
- Does the layout match the design?
- Are all states handled? (default, empty, loading, error)
- Are interactions implemented as specified?

**Token compliance:**
Audit the built code for design token usage:
- Are design tokens used instead of magic numbers?
- Are the correct tokens referenced? (e.g., `--color-primary` not hardcoded `#3B82F6`)
- Are spacing, typography, and color tokens consistent with the brand system?
- Check for any hardcoded values that should be tokens

**Component fidelity:**
For each implemented component:
- Does it match the design system spec? (states, anatomy, variants)
- Are accessibility attributes present? (ARIA roles, keyboard support, focus management)
- Does responsive behavior match design intent?

**Accessibility verification:**
Check built code for WCAG 2.2 AA compliance:
- Color contrast (4.5:1 text, 3:1 large text, 3:1 UI components)
- Keyboard navigation and focus indicators
- ARIA labels and roles
- Screen reader compatibility
- Touch targets (≥ 44x44pt recommended)

**Critique resolution:**
If critique fixes were provided, verify they were addressed in the build.

---

## Variables

- `[PROJECT]` — The project being reviewed
- `[BRAND]` — The brand whose design system was used
- `[CRITIQUE_FIXES]` — Prioritized fixes from the critique phase (if available)

## Expected Output

- Overall verdict: Pass / Conditional Pass / Fail
- Per-screen implementation checklist
- Token audit summary (compliant / violations found)
- Component coverage report
- Accessibility compliance summary
- Issues list with severity, location, and remediation
