# GSP Prompt Audit Report — v0.5.2 Taste Incorporation

Generated: 2026-03-23
Scope: 6 files modified in the taste incorporation (2 new references, 2 modified agents/prompts, 2 enriched references)
Automated baseline: Skipped (targeted audit of specific changeset, not full corpus)

## Executive summary

- Files analyzed: 6
- Total issues: 19
- Dead weight: 2 instances
- Contradictions: 2 instances
- One-off patches: 1 instance
- Vague directives: 3 instances
- Repetition: 11 instances

The taste incorporation is well-structured overall. The main concern is **repetition between files** — anti-patterns.md, visual-taste.md, prompt 09's craft rubric, and visual-effects.md cover overlapping territory from different angles. Individually each file is solid; the risk is token bloat when multiple references are loaded into the same agent context.

---

## Per-file findings

### `gsp/references/anti-patterns.md` (174 lines)

**Dead weight** (1 item)
- Line ~147: "Use semantic HTML: `nav`, `main`, `article`, `aside`, `section`" — Claude already follows semantic HTML best practices without being told. The Code Quality section in general leans toward standard coding advice that the model handles by default.

**Contradictions** (0 items)
None found. Internal guidance is consistent.

**One-off patches** (1 item)
- Line ~97: "Use `picsum.photos/seed/{name}/800/600` or SVG placeholders" — This reads like a fix for a specific hallucination failure. The broader principle (don't hallucinate URLs) is already covered by "Broken Unsplash URLs" heading, but the specific URL suggestion is a band-aid. If picsum.photos ever changes its API, this becomes wrong. Better: "Use deterministic image services or inline SVG placeholders."

**Vague directives** (0 items)
None. This file is notably specific — every anti-pattern has a concrete "do this instead."

**Repetition** (4 items)
- Line ~107: "Use `cubic-bezier(0.16, 1, 0.3, 1)` or spring physics" — duplicates spring physics guidance in `visual-effects.md` lines ~302-317 (Spring physics defaults section), which provides the same values in more detail.
- Line ~117: "Stagger with `animation-delay` cascade or `staggerChildren`" — duplicates `visual-effects.md` lines ~279-299 (Staggered orchestration section) with less detail.
- Line ~113: "`prefers-reduced-motion` respect" — duplicates the Accessibility section in `visual-effects.md` lines ~458-475 with the same guidance.
- Line ~69: "Generic `box-shadow` with untinted black" / "Tint shadows" — overlaps with visual-taste.md item #4 (Shadow & depth) which scores the same concept.

**Recommendation:** Cut ~10 lines. The Motion section (lines ~106-120) largely restates what visual-effects.md covers in production-ready detail. Consider trimming Motion anti-patterns to just the pattern names with a cross-reference: "See `visual-effects.md` for implementation."

---

### `gsp/references/visual-taste.md` (121 lines)

**Dead weight** (0 items)
Clean — every item is a scorable evaluation criterion.

**Contradictions** (0 items)
None. The scoring system is internally coherent: 1-5 per item, 15 items, /75 total, mapped to 5 sophistication levels. Ranges are contiguous (15-25, 26-40, 41-55, 56-75) with no gaps or overlaps.

**One-off patches** (0 items)
None.

**Vague directives** (2 items)
- Line ~74: Item #15 "Does it feel like a $150k agency build?" — This is the most subjective item. "$150k" is arbitrary and culturally loaded; a $150k budget means different things in different markets. The 1-5 anchors partially save it ("Score 1 if it looks AI-generated" / "Score 5 if someone would ask 'who designed this?'"), but the headline framing could mislead. Consider: "Overall craft impression — does it feel authored?"
- Line ~59: Item #10 "Is there tactile quality?" — "Tactile" applied to a screen is metaphorical. The 1-5 anchors are specific enough (grain, glass refraction, tinted shadows), but the category name could confuse a literal-minded model. Minor.

**Repetition** (3 items)
- Items #1-#9 map almost 1:1 to the 15-point craft rubric in prompt 09 (see cross-file analysis below). Both files exist for different audiences (critic vs builder), but when the critic agent loads both visual-taste.md AND the prompt that spawned it, the model sees overlapping checklists.
- Line ~89: "Swap default fonts for a considered pairing" — restates anti-patterns.md line ~9 (Inter/Roboto as default).
- Line ~106: "Use advanced interactions (spotlight borders, magnetic elements, scroll choreography)" — directly references techniques detailed in visual-effects.md Advanced Interactions section.

**Recommendation:** Net neutral — this file is a scoring rubric, not implementation guidance. The repetition with anti-patterns.md and visual-effects.md is referential (it names concepts those files detail). No cuts needed, but the "How to Improve" section (lines ~85-109) could be shortened to cross-references since the techniques are fully specified elsewhere.

---

### `gsp/agents/gsp-critic.md` (66 lines)

**Dead weight** (1 item)
- Line ~17: "Every criticism must include a concrete fix." — This is then repeated more specifically in the Quality Standards section: "Fixes must be actionable ('Change X to Y' not 'Improve the thing')." The first instance is vague enough to be dead weight given the second exists.

**Contradictions** (1 item)
- Line ~33: The Scoring Guide table (1=catastrophe, 5=no problem) is a direct copy of `nielsen-heuristics.md` lines ~131-139. This isn't a contradiction per se, but the scoring guide inverted direction is potentially confusing: Nielsen's 1=worst while taste's 1=worst too, but Nielsen's 5="no usability problem" vs taste's 5="distinctive/excellent." In Nielsen's framework, 5 means the absence of problems; in taste, 5 means the presence of excellence. The agent sees both scales. This is a subtle conceptual tension — not a hard contradiction, but worth noting that the two /5 scales measure different things (defect absence vs quality presence).

**One-off patches** (0 items)
None.

**Vague directives** (0 items)
Clean. The methodology steps are specific and sequenced.

**Repetition** (1 item)
- Line ~32-39: The entire Scoring Guide table duplicates `nielsen-heuristics.md` lines ~131-139 verbatim. Since the agent loads the reference file, this table is seen twice. The agent already says "see `references/nielsen-heuristics.md`" in step 1.

**Recommendation:** Cut ~8 lines (the duplicated scoring table). The agent already directs to the reference file. The methodology steps reference the right files (nielsen-heuristics.md, visual-taste.md, anti-patterns.md). Post-taste-incorporation, the methodology is well-structured: heuristics + taste + anti-patterns as three distinct evaluation passes.

---

### `gsp/prompts/09-design-to-code-translator.md` (51 lines)

**Dead weight** (0 items)
Clean — the 15-point craft rubric is implementation-focused, not behavioral.

**Contradictions** (1 item)
- Line ~30: Item #15 "Anti-pattern scan — check against `references/anti-patterns.md` before marking complete" — This tells the builder to load and check anti-patterns.md as a final step. But items #1-14 in the same rubric already encode many of the same anti-patterns inline (e.g., #1 "never plain white/dark" = anti-patterns "Random dark sections" + "Flat design with zero texture"; #6 "no Lorem Ipsum, no John Doe" = anti-patterns Content section; #8 "one accent, consistent gray temperature" = anti-patterns Color section). The builder is told to check these things twice — once via the inline rubric, once via the reference file. Not a hard contradiction, but a workflow contradiction: if items 1-14 are sufficient, item 15 is redundant; if item 15 is needed, items 1-14 are incomplete.

**One-off patches** (0 items)
None.

**Vague directives** (1 item)
- Line ~27: Item #7 "Spacing intention — whitespace feels considered, not arbitrary. Optical balance over mathematical equality." — "Optical balance" is professional jargon that a design engineer understands, but it gives the model no concrete threshold. Unlike other items which have specific checks (e.g., "no Lorem Ipsum"), this one relies on subjective judgment. Consider: "Spacing intention — consistent use of spacing scale (4/8px base). Visual grouping through proximity, not just borders."

**Repetition** (3 items)
- Items #1-14 overlap substantially with anti-patterns.md (see cross-file analysis).
- Item #3 "Entrance motion — content animates in on load (staggered fade-up, spring physics)" — duplicates visual-effects.md entrance animations section.
- Item #5 "State polish — hover/focus/active/pressed feel deliberate" — duplicates visual-effects.md hover transitions and button state progression sections.

**Recommendation:** The 15-point rubric serves a different purpose (builder checklist) than anti-patterns.md (things to avoid) and visual-taste.md (critic scoring). The overlap is intentional — different audiences need the same guidance framed differently. However, item #15 creates circular loading. Consider replacing it with: "Cross-check: no anti-patterns from reference file that aren't already covered above." Or remove item 15 entirely since items 1-14 cover the critical anti-patterns.

---

### `gsp/references/visual-effects.md` (476 lines)

**Dead weight** (0 items)
This file is pure implementation recipes — no behavioral instructions.

**Contradictions** (0 items)
The new Advanced Interactions section (lines ~210-455) is consistent with the existing sections. No technique contradicts another.

**One-off patches** (0 items)
None.

**Vague directives** (0 items)
Every recipe includes concrete CSS/JS/TSX code.

**Repetition** (0 items within the file)
The Advanced Interactions section is cleanly additive. No technique duplicates an existing section:
- Spotlight border cards = new (no prior border effect recipe)
- Parallax tilt = new (no prior 3D transform recipe)
- Magnetic buttons = new (complements but doesn't duplicate hover transitions)
- Staggered orchestration = **partial overlap** with existing "Stagger children" in line ~92-96, BUT the new version adds Framer Motion container orchestration and `whileInView`, making it a proper upgrade. The old CSS-only stagger is referenced as a fallback within the new section.
- Spring physics defaults = new dedicated section (spring values were mentioned in hover transitions but never specified)
- Scroll-driven reveals = extends the existing IO pattern (line ~117-124) with native CSS `animation-timeline: view()`. Again, an upgrade not a duplicate.
- Sticky scroll stacking, horizontal scroll, text mask, kinetic marquee, directional hover, liquid glass = all new with no prior equivalent.

The section fits naturally. The "When to use" and "Performance" annotations are a welcome addition that existing sections lack — consider backfilling to older sections for consistency.

**Recommendation:** No cuts. The Advanced Interactions section is the strongest addition in this changeset. Consider adding "When to use" and "Performance" notes to the existing Depth & Shadows, Backgrounds, Motion, and Component Polish sections for structural consistency.

---

### `gsp/references/block-patterns.md` (136 lines)

**Dead weight** (0 items)
Pure structural reference — no behavioral instructions.

**Contradictions** (0 items)
None.

**One-off patches** (0 items)
None.

**Vague directives** (0 items)
Each pattern has specific structural guidance.

**Repetition** (0 items)
The Advanced Compositions section (lines ~95-136) adds 8 new patterns that don't duplicate existing sections:
- Bento 2.0 extends the existing Bento grid (line ~28) but is clearly positioned as an advanced variant with perpetual micro-animations — different enough to justify its own entry.
- Split-screen scroll, curtain reveal, sticky scroll sequence, accordion image slider, mega menu reveal, dynamic island, command palette — all new with no prior equivalent.

Each pattern follows the same format as existing entries (description + responsive note), maintaining file consistency.

**Recommendation:** No cuts. Clean addition.

---

## Cross-file findings

### Anti-patterns.md vs visual-effects.md — contradiction check

**No contradictions found.** The two files are complementary:

- Anti-patterns says "don't use linear easing" → visual-effects provides spring physics as the replacement
- Anti-patterns says "don't animate top/left/width/height" → visual-effects uses only transform and opacity
- Anti-patterns says "don't use `window.addEventListener('scroll')`" → visual-effects uses IntersectionObserver and CSS scroll-driven animations
- Anti-patterns says "avoid custom mouse cursors" → visual-effects never suggests custom cursors (magnetic buttons move the element, not the cursor)

One area of potential tension (not contradiction):
- Anti-patterns line ~71: "Flat design with zero texture — sterile and lifeless. Add subtle noise, grain, or micro-patterns" — could be read as mandating texture on every surface. Visual-effects provides noise/grain recipes. This is fine as long as texture is applied intentionally, not universally. The word "subtle" in anti-patterns saves it.

### Prompt 09 craft rubric vs visual-taste.md checklist — duplication analysis

These two 15-item lists overlap significantly in topic but differ in framing:

| Prompt 09 (Builder) | Visual Taste (Critic) | Overlap? |
|---|---|---|
| 1. Background treatment | 10. Surface texture | Partial — both address surface quality from different angles |
| 2. Shadow depth | 4. Shadow & depth | **High** — same concept, builder says "add shadow transitions," critic scores shadow quality |
| 3. Entrance motion | 5. Motion personality | **High** — same domain, different framing |
| 4. Typography hierarchy | 1. Typography personality | **High** — builder checks hierarchy levels, critic scores personality |
| 5. State polish | 11. State completeness | **High** — near-identical concern |
| 6. Content authenticity | 6. Content authenticity | **Direct duplicate** — same name, same concept |
| 7. Spacing intention | 3. Spacing rhythm | **High** — same concept, different words |
| 8. Color coherence | 2. Color intentionality | **High** — same concept |
| 9. Component personality | 7. Component individuality | **High** — same concept, different words |
| 10. Surface variety | (no direct match) | Unique to builder |
| 11. Icon consistency | 13. Icon consistency | **Direct duplicate** — same name |
| 12. Image direction | 14. Image direction | **Direct duplicate** — same name |
| 13. Responsive craft | 12. Responsive craft | **Direct duplicate** — same name |
| 14. Motion coherence | 5. Motion personality | Partial — coherence vs personality |
| 15. Anti-pattern scan | (no match) | Unique to builder |
| (no match) | 8. Layout confidence | Unique to critic |
| (no match) | 9. Visual coherence | Unique to critic |
| (no match) | 15. Overall impression | Unique to critic |

**Verdict:** 11 of 15 builder items map to a taste item. 4 items are unique to each list. This is **by design** — the builder checks implementation quality, the critic scores aesthetic quality. However, when both are loaded (e.g., if the critic also references the prompt), the model sees the same concepts twice in different vocabulary. This isn't harmful but is worth acknowledging as intentional design debt.

**Recommendation:** These should remain separate. The builder needs a pass/fail checklist; the critic needs a 1-5 scoring rubric. The overlap is structural, not wasteful. However, consider adding a one-line note to each: "Builder checklist — for scoring equivalent, see `visual-taste.md`" and vice versa. This makes the relationship explicit and prevents future maintainers from trying to deduplicate them.

### Anti-patterns.md vs style presets / other references

- `design-trends.md` is an index that points to style preset YAML files. Anti-patterns.md doesn't repeat trend-specific guidance — it addresses universal failures (Inter as default, purple gradients, centered-everything). No overlap with style presets.
- `nielsen-heuristics.md` measures usability; anti-patterns.md addresses visual quality. No overlap.
- `block-patterns.md` describes what to build; anti-patterns.md describes what not to build. Complementary, no overlap.

---

## Summary

| File | Lines | Dead | Contradict | One-off | Vague | Repeat | Suggested cut |
|------|-------|------|-----------|---------|-------|--------|---------------|
| anti-patterns.md | 174 | 1 | 0 | 1 | 0 | 4 | ~10 lines |
| visual-taste.md | 121 | 0 | 0 | 0 | 2 | 3 | 0 (cross-refs only) |
| gsp-critic.md | 66 | 1 | 1 | 0 | 0 | 1 | ~8 lines |
| prompt 09 | 51 | 0 | 1 | 0 | 1 | 3 | ~2 lines |
| visual-effects.md | 476 | 0 | 0 | 0 | 0 | 0 | 0 |
| block-patterns.md | 136 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Total** | **1024** | **2** | **2** | **1** | **3** | **11** | **~20 lines** |

**Total potential reduction: ~20 lines (2% of analyzed corpus)**

---

## Top 5 highest-impact changes

1. **Remove duplicated scoring table from gsp-critic.md** (lines ~32-39) — The agent already loads `nielsen-heuristics.md` which contains this table. Removing it saves 8 lines and eliminates a maintenance burden (two places to update if scoring changes). Impact: high (critic is used every pipeline run).

2. **Trim anti-patterns.md Motion section to cross-references** — The Motion anti-patterns (lines ~106-120) are restated with better detail in visual-effects.md. Replace the 6 motion anti-patterns with 2 lines: the pattern names + "See `visual-effects.md` for correct implementations." Impact: medium (anti-patterns.md is loaded by designer, builder, and critic).

3. **Remove or rework item #15 in prompt 09** — "Anti-pattern scan — check against `references/anti-patterns.md`" creates a circular check since items 1-14 already encode the critical anti-patterns. Either remove it (the builder already knows the anti-patterns from items 1-14) or replace with "Verify no obvious anti-patterns remain beyond items 1-14 above." Impact: medium (prompt 09 is the builder's primary prompt).

4. **Add cross-reference notes between prompt 09 and visual-taste.md** — Make the builder/critic relationship explicit. One line each: "For scoring equivalent, see visual-taste.md" in prompt 09, and "For builder implementation checklist, see prompt 09" in visual-taste.md. Impact: low effort, prevents future accidental deduplication attempts.

5. **Backfill "When to use" and "Performance" notes to visual-effects.md existing sections** — The Advanced Interactions section has these annotations; older sections don't. Adding them would make the file structurally consistent and more useful to the builder. Impact: low priority but improves reference quality.

---

## Overall assessment

The taste incorporation is **clean, well-structured work**. The new references (anti-patterns.md, visual-taste.md) are high-quality additions that fill genuine gaps. The enrichments to visual-effects.md and block-patterns.md are additive without creating conflicts. The main finding is expected overlap between files that serve different audiences (builder vs critic) with the same underlying design knowledge — this is intentional and mostly fine.

The 2 contradictions found are minor (scoring scale semantic tension in gsp-critic.md, circular anti-pattern checking in prompt 09). Neither would cause bad outputs; they're efficiency issues, not correctness issues.

No instances of anti-patterns.md contradicting visual-effects.md recommendations. The two files are properly complementary: one says what to avoid, the other provides what to use instead.
