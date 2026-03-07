# Deliverable Review

## Project: {PROJECT_NAME}
**Date:** {DATE}
**Reviewer:** GSP Deliverable Reviewer

---

> This phase validates built deliverables against design intent. Produces acceptance chunks + INDEX.md in the `review/` directory.

## Chunk Mapping

### Review Chunks (`review/`)

| Chunk File | Content |
|-----------|---------|
| `acceptance-report.md` | Overall pass/fail, implementation checklist, token audit, screen coverage |
| `issues.md` | Issues found — deviations from design, missing implementations, token violations |

## Content Reference

Each chunk follows the format in `references/chunk-format.md`. Below is the structural reference for what each chunk should contain:

### acceptance-report.md
- **Overall verdict:** Pass / Conditional Pass / Fail
- **Implementation checklist:** per-screen implementation status (complete, partial, missing)
- **Token audit:** design token usage compliance (correct tokens used, magic numbers found, missing tokens)
- **Screen coverage:** designed screens vs built screens
- **Component coverage:** designed components vs implemented components
- **Accessibility compliance:** WCAG 2.2 AA checks on built code (contrast, ARIA, keyboard, focus)
- **Responsive verification:** breakpoint behavior matches design intent

### issues.md
- Issues table: Issue, Severity (Critical/Major/Minor), Screen/Component, Expected, Actual, Remediation
- **Critical:** blocks acceptance — must fix before shipping
- **Major:** significant deviation from design intent
- **Minor:** polish items, minor inconsistencies
- Links to design chunks: `../design/screen-{NN}-{name}.md`
- Links to build output: `../build/components/{name}`
- Links to brand system: `{BRAND_PATH}/system/components/{name}.md`
