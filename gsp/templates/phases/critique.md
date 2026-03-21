# Design Critique

## Project: {PROJECT_NAME}
**Date:** {DATE}
**Reviewer:** GSP Design Critic + Accessibility Auditor

---

> This phase produces 6 chunks + INDEX.md in the `critique/` directory (4 from critic, 2 from auditor).

## Chunk Mapping

### Critic Chunks

| Chunk File | Content |
|-----------|---------|
| `critique.md` | Nielsen's 10 heuristics scored 1-5, overall score X/50, visual hierarchy, typography & color, usability |
| `prioritized-fixes.md` | Critical / Important / Polish fix lists with specific remediation |
| `alternative-directions.md` | 2 redesign approaches with descriptions |
| `strengths.md` | Specific design strengths to preserve |

### Auditor Chunks

| Chunk File | Content |
|-----------|---------|
| `accessibility-audit.md` | WCAG 2.2 AA checklist (Perceivable, Operable, Understandable, Robust, Mobile, Cognitive), conformance summary, statement draft |
| `accessibility-fixes.md` | Violations table — issue, severity (Critical/Major), WCAG criterion, remediation steps |

## Content Reference

Each chunk follows the format in `references/chunk-format.md`. Below is the structural reference for what each chunk should contain:

### critique.md
- **Heuristics evaluation:** 10 heuristics table (Heuristic, Score 1-5, Notes)
- **Overall score:** X/50
- **Visual hierarchy:** assessment
- **Typography & color:** assessment
- **Usability:** assessment
- **Strategic alignment:** assessment

### prioritized-fixes.md
- **Critical (Must Fix):** numbered list with specific remediation per screen/component
- **Important (High Priority):** numbered list
- **Polish (If Time Allows):** numbered list
- Links to `critique.md` and `accessibility-fixes.md`

### alternative-directions.md
- 2 redesign approaches each with: name, description, trade-offs

### strengths.md
- Specific strengths to preserve
- What's working well and why

### accessibility-audit.md
- **Perceivable:** alt text, captions, color contrast (4.5:1 text, 3:1 large), text resizable
- **Operable:** keyboard access, focus indicators, skip navigation, motion alternatives
- **Understandable:** language declared, clear errors, contextual help
- **Robust:** valid markup, ARIA roles correct
- **Mobile:** orientation, touch targets (44x44pt), reachable UI
- **Cognitive:** reading level, consistent navigation, no flashing, no time limits
- **Summary:** total pass/fail/not-applicable counts, overall conformance level
- **Accessibility statement:** draft

### accessibility-fixes.md
- Violations table: Issue, Severity (Critical/Major/Minor), WCAG Criterion, Remediation
- Only Critical and Major severity items get detailed remediation steps
- Links to `prioritized-fixes.md` (from critic agent)
- References specific screens: `../design/screen-{NN}-{name}.md`
