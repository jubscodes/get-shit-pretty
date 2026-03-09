# Design Principles

> Phase: system | Brand: get-shit-pretty | Generated: 2026-03-08

---

Five principles for designing GSP terminal output. Each traces to the brand platform and guides every decision about what appears on screen.

---

## 1. The Terminal is the Medium

Every design decision honors the terminal as a first-class creative medium, not a limitation to work around. Monospace is the typeface. Box-drawing is the illustration style. ANSI codes are the color model. ASCII art is genuine brand expression.

**Traces to:** "Constraints as creative fuel" (brand value), Creator archetype (craft within constraints), Teenage Engineering principle.

**Do:**
- Use Unicode box-drawing characters for structure
- Treat ASCII art as a deliberate brand artifact
- Design for 80-column terminals as the primary canvas
- Test output rendering in multiple terminal emulators

**Don't:**
- Apologize for terminal constraints ("sorry, this would look better in a GUI")
- Use ASCII approximations (`+`, `-`, `|`) when Unicode is available
- Design terminal output as a lesser version of a web UI
- Output HTML, markdown, or rich text that the terminal cannot render

---

## 2. Signal, Not Noise

Every line of output earns its place. Color is reserved for meaning. Formatting is reserved for hierarchy. Silence is a valid design choice. If the user does not need to see it, do not print it.

**Traces to:** "Precise (not cold)" (voice attribute), "Craft over speed" (brand value), Vercel-level copy density.

**Do:**
- Use one status symbol and one short sentence for routine updates
- Reserve color for semantic meaning (success, error, warning, accent)
- Hide stack traces and verbose details behind `--verbose`
- Let blank lines do the work of separating sections

**Don't:**
- Print progress updates for operations that take less than 100ms
- Use color decoratively (rainbow text, gradient effects, color for fun)
- Print the same information twice in different formats
- Add filler text ("Loading...", "Please wait...", "Processing your request...")

---

## 3. State is Truthful

The living diamond mark, progress indicators, and status symbols must reflect actual system state. A filled diamond means the phase is complete. A checkmark means the file was written. A spinner means work is happening right now. Never lie about state for aesthetic reasons.

**Traces to:** "Coherence over novelty" (brand value), Magician archetype (transformation is real, not illusory), "Builder empowerment" (trust through honesty).

**Do:**
- Update the brand mark diamond state only when a phase genuinely completes
- Show the real file count, line count, and duration
- Display errors immediately when they occur
- Let the spinner run only while work is actually happening

**Don't:**
- Show fake progress bars that do not track real work
- Display a filled diamond for an incomplete phase
- Add artificial delays to make operations feel more substantial
- Hide errors behind optimistic messaging

---

## 4. Craft the Details

The spacing between a tree branch and a filename. The alignment of key-value pairs. The number of blank lines before a phase header. These details are not incidental -- they are the brand. A misaligned column is a brand violation.

**Traces to:** "Enduring craft" (brand essence), Creator archetype (perfectionism as positive force), "one symbolic detail carries the whole narrative" (Anthropic influence).

**Do:**
- Right-pad keys to the longest key in a group
- Use consistent 2-space indentation increments
- Maintain exact vertical rhythm (1 blank line between groups, 2 between sections)
- Test output alignment at multiple terminal widths

**Don't:**
- Mix indentation levels (2-space and 4-space) in the same output block
- Leave trailing whitespace or blank lines at end of output
- Truncate content without indicating truncation (`...`)
- Allow columns to misalign when data length varies

---

## 5. Reveal, Don't Dump

Output unfolds progressively. The user watches transformation happen in real time -- each sub-task completing, each file appearing in the tree. This is the Magician's principle: the journey of creation is as valuable as the result.

**Traces to:** "Design as journey" (brand value), Magician archetype (transformation made visible), "before/after is where the Magician lives."

**Do:**
- Stream sub-task completions as they happen
- Show the brand mark at the start, let diamond states update with the pipeline
- Use the phase completion block (diamond + file tree) as a satisfying punctuation mark
- End sessions with a summary that shows the full transformation (what was nothing is now a system)

**Don't:**
- Buffer all output and dump it at the end
- Print a wall of text without progressive structure
- Skip the completion summary (the user needs the punctuation mark)
- Rush past milestone moments (install splash, phase completion, final ship)

---

## Quick Reference

| Principle | One-line Test |
|-----------|--------------|
| Terminal is the Medium | Would this decision change if we moved to a GUI? If yes, we are not honoring the medium. |
| Signal, Not Noise | Can I remove this line and lose no meaning? If yes, remove it. |
| State is Truthful | Does this indicator reflect actual system state right now? |
| Craft the Details | Is every character in its correct column? |
| Reveal, Don't Dump | Does the user see transformation unfolding, or a wall of text? |

---

## Related

- [Color System](./foundations/color-system.md) — signal-first color usage
- [Content Patterns](./foundations/content-patterns.md) — structured output that embodies these principles
- [Motion](./foundations/motion.md) — progressive reveal implementation
