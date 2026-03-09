# Brief-Gathering Techniques

## Purpose
Guide brief-gathering conversations — used by `/gsp:start` for both brand briefs and project briefs.

---

## Question Flow

### Phase 1: Context (Who & Why)
Start broad, then narrow.

1. **What** is this project? (app, website, rebrand, campaign)
2. **Who** is it for? (audience demographics, psychographics)
3. **Why** does it exist? (business goal, user need)
4. **What problem** does it solve?

### Phase 2: Brand (Identity & Voice)
5. Is there an **existing brand** to work with?
6. Three words that describe the **brand personality**
7. **Brands you admire** (and why)
8. **Styles to avoid** (and why)

### Phase 3: Scope (What & Where)
9. **Platforms:** Web, iOS, Android, all?
10. **Tech stack** preferences? (React, Swift, Flutter, etc.)
11. **Key screens/pages** needed?
12. **Accessibility level:** WCAG A, AA, or AAA?

### Phase 4: Constraints (Limits & Realities)
13. **Timeline:** When does this need to ship?
14. **Budget:** Any constraints on tools, licensing, assets?
15. **Existing assets:** Logo, brand guide, content, photography?
16. **Team:** Who will implement? (devs, designers, solo)

### Phase 5: Success (How We Know)
17. **What does success look like?** (metrics, feelings, outcomes)
18. **Biggest risk** if we get this wrong?

---

## Questioning Techniques

### Progressive Disclosure
Don't ask all 18 questions at once. Group into 3-4 conversational rounds:
- Round 1: Context + Brand (questions 1-8)
- Round 2: Scope + Constraints (questions 9-16)
- Round 3: Success + Gaps (questions 17-18 + follow-ups)

### Follow-Up Patterns
- **"Tell me more about..."** — When an answer is surface-level
- **"What would that look like?"** — When an answer is abstract
- **"Why is that important?"** — To uncover underlying needs
- **"What if we couldn't do that?"** — To test assumptions

### Inference Over Interrogation
Don't ask what you can infer:
- If they say "fintech app for Gen Z" → infer mobile-first, modern aesthetic
- If they say "enterprise dashboard" → infer data-dense, professional
- State your inferences and let them correct

### Handling Vague Answers
- Use `AskUserQuestion` with 2-3 concrete options instead of open-ended re-asks
- Each option should have a clear **label**, a **description** explaining what it means, and optionally a **preview** showing what it looks like in practice
- Example: instead of "What style do you want?", use `AskUserQuestion` with options like "Minimal & clean" (description: "Lots of white space, restrained palette") vs "Bold & expressive" (description: "Saturated colors, strong typography")
- Reserve prose questions for open-ended exploration where you genuinely don't know the option space

### When to Use `AskUserQuestion` vs Prose
- **Use `AskUserQuestion`** for: picking between defined directions (archetypes, styles, brands), yes/no/which decisions, selecting from existing items (brands, projects), mood/tone/size preferences
- **Use prose** for: open-ended creative input ("tell me about your brand"), gathering context you can't predict ("what problem does this solve?"), follow-up clarifications where the answer space is unbounded
- **Rule of thumb:** if you can write 2-4 meaningful options with descriptions, use `AskUserQuestion`. If you'd be guessing at what the options should be, use prose.

### Knowing When You Have Enough
A brief is complete when you can answer:
- [ ] Who is this for and what do they need?
- [ ] What does the brand feel like?
- [ ] What are we building and on what platforms?
- [ ] What are the hard constraints?
- [ ] How will we measure success?
