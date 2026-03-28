# Design Critique Framework Research

**Date:** 2026-03-27
**Context:** Evaluating GSP's critic agent structure against professional design critique practice.

## Key Frameworks Discovered

### Industry Practice

| Framework | Source | Key Insight |
|-----------|--------|-------------|
| NN/g facilitated critique | [nngroup.com/articles/design-critiques](https://www.nngroup.com/articles/design-critiques/) | Emphasizes facilitation structure over evaluation dimensions — assess whether designs "meet their objectives" |
| Nielsen's 45-min crit | [jakobnielsenphd.substack.com/p/design-crit](https://jakobnielsenphd.substack.com/p/design-crit) | Context → silent feedback → discussion → synthesis. Severity: Blocker > Major > Minor > Cosmetic |
| Google's three-stage model | [design.google/library/reviewing-the-design-review](https://design.google/library/reviewing-the-design-review) | Different dimensions per maturity: Early (problem), Mid (solution), Post (fidelity). Closest to stage-gated critique. |
| Figma internal crits | [figma.com/blog/design-critiques-at-figma](https://www.figma.com/blog/design-critiques-at-figma/) | 30min, 2 topics, different "altitude" levels. Not formal product reviews. |
| Designlab 10-point | [designlab.com/blog/design-critique-checklist-for-ux-designers](https://designlab.com/blog/design-critique-checklist-for-ux-designers) | Objectives, IA, nav, visual/brand, labels, a11y, interactions, responsive, testing evidence, QA |
| UX Magazine 3-layer | [uxmag.com/articles/how-to-evaluate-design-quality](https://uxmag.com/articles/how-to-evaluate-design-quality) | "Observe as a marketer first, as a user second, as a designer last." Marketing → Usability → Design |
| 30-60-90 framework | [kaylaheffernan.com](https://www.kaylaheffernan.com/blog/2019/6/20/using-the-306090-framework-for-design-critique) | Different feedback per stage: 30% concept, 60% structure, 90% polish |
| AuthenticJobs 11 ways | [authenticjobs.com](https://authenticjobs.com/11-ways-to-evaluate-quality-of-design-work/) | Usability, visual appeal, color, consistency, clarity, conceptual strength, relevance, hierarchy, flow, brand, goals |
| IDA judging criteria | [idesignawards.com](https://www.idesignawards.com/judging-criteria/) | Innovation, aesthetics, functionality, ergonomics, durability, impact, utility, ecological, production, emotional quotient |

### Evaluation Ordering Consensus

Sources consistently recommend: **Strategy/goals → Structure/usability → Visual/craft**

- UX Magazine: "Once the first two layers are fine, move to visual"
- Garrett's Elements of UX: Strategy → Scope → Structure → Skeleton → Surface
- Google: Problem validation → Solution effectiveness → Execution quality
- NN/g: "Present behavioral tasks first, aesthetic assessments afterward"

### Nielsen Heuristics Status (2025)

- Unchanged since 1994, updated explanations in 2020. Still the most cited usability framework.
- Known gap: no accessibility coverage — proposed 11th heuristic exists ([uxmag.com](https://uxmag.com/articles/why-we-need-11-usability-heuristics))
- Single evaluators find only 20-51% of problems — multiple evaluators essential
- Not designed for conversational UI, multimodal, wearables ([uxpamagazine.org](https://uxpamagazine.org/nielsens-heuristic-evaluation/))
- Competing: Tog's First Principles, Shneiderman's Eight Golden Rules
- Modern practice: one input into broader expert review, not standalone methodology

### Taste as Evaluation Dimension

- **UX Magazine rejects it:** "Quality is not a matter of taste" — evaluate through personas instead
- **Cornell operationalizes it:** hierarchy, focus, balance, contrast, repetition, style unity — decomposable, not subjective
- **IDA includes it:** "Aesthetics" (artistic merit) + "Emotional Quotient" (satisfaction beyond utility)
- **Rams operationalizes it:** "Aesthetic quality is integral to usefulness" — taste through reduction and restraint
- **Apple:** product reviews "driven by empathy and taste rather than data"
- **Academic (arXiv):** aesthetics assessment depends on "typography, hierarchy, alignment" — decomposable

Consensus: taste is evaluable when decomposed into specific signals, not treated as holistic subjective judgment.

### Anti-Patterns in Critique

- Recognized in practice: documented UI anti-patterns (hide-and-hover, tiny targets, bloated interfaces)
- Active research: "UI design smells" across 7 dimensions — layout, typography, iconography, navigation, communication, color, shape
- Automated detection advancing: UISGPT achieves F1=0.729 using LLMs against Material Design guidelines
- But: no major design team publicly uses anti-pattern checklists in their critique process yet
- GSP's approach is ahead of current practice, aligned with research trajectory

### Dimensions Found Across All Sources

| Dimension | Coverage | GSP Status |
|-----------|----------|------------|
| Strategy/goal alignment | Universal | Core #1 (after reorder) |
| Usability/task completion | Universal | Core #3 (Nielsen-scored) |
| Accessibility | Most sources | Core #4 (WCAG inlined) |
| Brand consistency | Most sources | Core #2 (STYLE.md contract) |
| Visual design/aesthetics | Universal | Core #7 (taste signals) |
| Content/copy quality | Most sources | Core #5 |
| Technical implementation | Most sources | Core #6 (anti-patterns) |
| Information architecture | Designlab, UX Mag, Google | Folded into usability |
| Interaction/motion quality | Designlab, Google | Added to implementation quality |
| Responsiveness | Designlab | Added to implementation quality |
| Innovation/novelty | IDA, AuthenticJobs | Not included — too subjective for automated system |
| Emotional resonance | IDA | Partially in taste signals |
| Environmental/sustainability | IDA, Rams | Not included — out of scope |

## References

- [NN/g Design Critiques](https://www.nngroup.com/articles/design-critiques/)
- [Jakob Nielsen on Design Crit](https://jakobnielsenphd.substack.com/p/design-crit)
- [Google Design Review](https://design.google/library/reviewing-the-design-review)
- [Improving Design Reviews at Google (Research)](https://research.google/pubs/improving-design-reviews-at-google/)
- [Figma Design Critiques](https://www.figma.com/blog/design-critiques-at-figma/)
- [Designlab 10-Point Checklist](https://designlab.com/blog/design-critique-checklist-for-ux-designers)
- [UX Magazine: How to Evaluate Design Quality](https://uxmag.com/articles/how-to-evaluate-design-quality)
- [11 Ways to Evaluate Design Quality](https://authenticjobs.com/11-ways-to-evaluate-quality-of-design-work/)
- [IDA Judging Criteria](https://www.idesignawards.com/judging-criteria/)
- [NN/g Expert Reviews](https://www.nngroup.com/articles/ux-expert-reviews/)
- [NN/g Testing Visual Design](https://www.nngroup.com/articles/testing-visual-design/)
- [Nielsen's Heuristic Evaluation: Limitations](https://uxpamagazine.org/nielsens-heuristic-evaluation/)
- [Why We Need 11 Usability Heuristics](https://uxmag.com/articles/why-we-need-11-usability-heuristics)
- [NN/g 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)
- [Dieter Rams' 10 Principles](https://designmuseum.org/discover-design/all-stories/what-is-good-design-a-quick-look-at-dieter-rams-ten-principles)
- [Cornell Visual Design Evaluation](http://char.txa.cornell.edu/MEDIA/EVALUATI/evaluati.htm)
- [UI Anti-Patterns](https://ui-patterns.com/blog/User-Interface-AntiPatterns)
- [UISGPT: Automated UI Design Smell Detection](https://www.mdpi.com/2079-9292/13/16/3127)
- [Apple Product Development (IxDF)](https://ixdf.org/literature/article/apple-s-product-development-process-inside-the-world-s-greatest-design-organization)
- [Design Quality Assessment with VLMs (arXiv)](https://arxiv.org/html/2603.01083)
- [30-60-90 Framework](https://www.kaylaheffernan.com/blog/2019/6/20/using-the-306090-framework-for-design-critique)
- [Brand Standards Audit](https://brandauditors.com/blog/brand-standards-audit/)
- [Design System Audit (DOOR3)](https://www.door3.com/blog/design-system-audit)
- [Accessibility Heuristics (Deque)](https://www.deque.com/blog/supporting-the-design-phase-with-accessibility-heuristics-evaluations/)
