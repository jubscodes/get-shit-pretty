# QA Review

## Project: {PROJECT_NAME}
**Date:** {DATE}
**Reviewer:** GSP QA Reviewer

---

> This phase validates actual codebase implementation against design intent. The reviewer reads real source files, runs `git diff`, and cross-references BUILD-LOG.md to verify the build delivered what was designed.

## Chunk Mapping

### Review Chunks (`review/`)

| Chunk File | Content |
|-----------|---------|
| `acceptance-report.md` | Overall pass/fail, implementation checklist with codebase file paths, token audit, screen coverage |
| `issues.md` | Issues found — deviations from design, missing implementations, token violations. References actual codebase paths. |

## Content Reference

Each chunk follows the format in `references/chunk-format.md`. Below is the structural reference for what each chunk should contain:

### acceptance-report.md
- **Overall verdict:** Pass / Conditional Pass / Fail
- **Implementation checklist:** per-screen implementation status (complete, partial, missing) with codebase file paths
- **Token audit:** design token usage compliance in actual source code (correct tokens used, magic numbers found, missing tokens)
- **Screen coverage:** designed screens vs implemented screens in codebase
- **Component coverage:** designed components vs implemented components (codebase paths)
- **Accessibility compliance:** WCAG 2.2 AA checks on actual source code (contrast, ARIA, keyboard, focus)
- **Responsive verification:** breakpoint behavior matches design intent

### issues.md
- Issues table: Issue, Severity (Critical/Major/Minor), File Path, Line, Expected, Actual, Remediation
- **Critical:** blocks acceptance — must fix before shipping
- **Major:** significant deviation from design intent
- **Minor:** polish items, minor inconsistencies
- Links to design chunks: `../design/screen-{NN}-{name}.md`
- Links to actual codebase files: `{path/to/file}:{line}`
- Links to brand system: `{BRAND_PATH}/system/components/{name}.md`
