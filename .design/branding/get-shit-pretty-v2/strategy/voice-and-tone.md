# Voice & Tone

> Phase: strategy | Brand: get-shit-pretty | Generated: 2026-03-19

---

## Voice Attributes

GSP's voice has three defining attributes. These are constant -- they apply to every piece of communication, from error messages to conference talks. Tone shifts (see below) adjust the volume on each, but none drops to zero.

### 1. Clear

| | |
|---|---|
| **Means** | Every sentence has a point. Technical concepts land on the first read. No jargon without context. Structured output -- headings, spacing, hierarchy do the work. |
| **Does not mean** | Terse. Dumbed down. Robotic. Stripped of personality. |
| **Example** | "Your type scale has 7 sizes with no consistent ratio. Here's a 1.25 scale from 14px base -- 5 sizes that actually relate to each other." |
| **Anti-example** | "We've identified an inconsistency in the typographic hierarchy of your design system. Consider implementing a modular scale." |

### 2. Warm

| | |
|---|---|
| **Means** | Feels like help, not instruction. Acknowledges the builder's work before suggesting changes. Uses "you" and "your" naturally. Celebrates progress without being performative. |
| **Does not mean** | Soft. Avoidant. Overly enthusiastic. Emoji-heavy. Afraid to say something is wrong. |
| **Example** | "Alright, three palettes that actually work together. Amber on void black reads as confident without trying." |
| **Anti-example** | "Great job! Here are some amazing palettes for you! You're going to love these!" |

### 3. Lighthearted

| | |
|---|---|
| **Means** | Serious about craft, not about itself. The name is the proof -- "get shit pretty" is inherently lighthearted. Personality shows in word choice and rhythm, not in jokes or puns. Comfortable with casual grammar when it reads better. |
| **Does not mean** | Jokey. Irreverent for the sake of it. Sarcastic. Mocking the user or their work. Trying to be funny. |
| **Example** | "That's a wrap. 4 foundations, 12 components, one preview you can actually open. Let's keep going." |
| **Anti-example** | "Boom! Nailed it! Your design system is officially fire." |

## Tone Spectrum

GSP's tone adjusts based on context. The voice stays the same -- clear, warm, lighthearted -- but the balance shifts.

### Scales

| Spectrum | GSP Default | Range |
|----------|-------------|-------|
| Formal <-> Casual | 70% casual | 40% formal (docs) to 85% casual (CLI output) |
| Serious <-> Playful | 60% playful | 80% serious (error handling) to 75% playful (completion messages) |
| Technical <-> Accessible | 55% accessible | 80% technical (design system output) to 80% accessible (README) |
| Reserved <-> Expressive | 60% expressive | 40% expressive (token files) to 80% expressive (marketing) |

### Context Shifts

| Context | Tone adjustment | Example |
|---------|----------------|---------|
| **CLI output** (during a phase) | Peak clarity. Warm but efficient. Progress, not commentary. | `Strategy complete. 5 chunks written to .design/branding/strategy/` |
| **Design rationale** (explaining a choice) | Warm and clear. The Guide speaks here. Show the *why*. | "Amber on void black: warm enough to feel approachable, saturated enough to signal intent. Works as ANSI yellow in terminal." |
| **Error/warning** | Direct and helpful. No jokes. Tell what went wrong, what to do. | "No BRIEF.md found. Run /gsp:start to create one, or add a BRIEF.md to .design/branding/{name}/." |
| **Phase completion** | Warmest moment. Celebrate with specifics, not superlatives. | "That's a wrap. 4 foundations, 12 components, one preview you can actually open." |
| **README / documentation** | Clear above all. Accessible. The entry point -- warmth invites, clarity converts. | "GSP walks you through the full brand-to-build journey inside your terminal." |
| **Marketing / social** | Most expressive. Lighthearted leads. Personality at full volume. | "Your product works. Does it look like it works? That's a different question." |
| **Commit messages / changelogs** | Driest. Clear, factual. Light personality in descriptions, not titles. | "feat: add /gsp:palette composable skill" |

## Do / Don't Chart

| Do | Don't |
|----|-------|
| "Your spacing is off. Here -- 8px base, 1.5 scale." | "Your spacing lacks consistency across breakpoints." |
| "Three palettes that actually work together." | "We've generated three harmonious palette options for your consideration." |
| "See the difference? That's what breathing room looks like." | "Notice how the increased whitespace improves visual hierarchy." |
| "Let's keep going." | "Shall we proceed to the next phase?" |
| "Works in monochrome. Color is additive." | "Our design system prioritizes a monochromatic foundation." |
| "That's a wrap." | "Phase complete! Great work!" |
| "Bold type on void black reads as confident without trying." | "The typographic treatment leverages contrast to convey authority." |
| Say what something does and why it matters. | Describe what something is in abstract terms. |
| Use contractions. Write how you'd say it. | Write in a way nobody would ever speak. |
| Name the specific thing -- "8px," "1.25 ratio," "amber #E5A00D." | Use vague descriptors -- "generous spacing," "warm palette," "clean typography." |

## Style Rules

### Grammar and Mechanics

- **Contractions:** Always. "It's," "you'll," "that's," "don't." Writing without contractions sounds corporate.
- **Sentence case:** For headings, buttons, labels. Not Title Case, not ALL CAPS (except the acronym GSP).
- **Oxford comma:** Yes.
- **Em dashes:** Use them -- they add rhythm and act as parentheticals without the formality of parentheses.
- **Periods in lists:** If the list item is a full sentence, use a period. If it's a fragment, no period.
- **Exclamation marks:** Rare. One per page maximum. Never in error messages. Never doubled.
- **Emoji:** Not in CLI output, documentation, or brand communications. Only in informal community contexts (Discord, GitHub discussions) and only when the community sets the tone.

### Naming and Capitalization

- **GSP:** Always uppercase. Never "gsp" in prose (acceptable in code/CLI contexts like `gsp:start`).
- **get-shit-pretty:** Lowercase with hyphens when used as the full package/product name.
- **Skill names:** Lowercase with colon prefix in code context: `/gsp:palette`, `/gsp:start`. In prose, use "the palette skill" or "the start command."
- **Phase names:** Lowercase: discover, strategy, identity, system. Not capitalized unless starting a sentence.

### Numbers and Units

- Spell out one through nine. Use numerals for 10+.
- Always use numerals for measurements: 8px, 1.5 scale, 4px radius.
- Use "px" not "pixels" in technical contexts.

## Nomenclature

Standard terms for GSP concepts. Use these consistently.

| Term | Usage | Not |
|------|-------|-----|
| **builder** | The person using GSP. Shared identity for dev and design audiences. | user, customer, developer (unless specifically addressing devs) |
| **companion** | What GSP is. Design companion. | tool, platform, framework, suite |
| **skill** | A GSP command that produces output. `/gsp:palette` is a skill. | command, function, module, plugin |
| **phase** | A stage in the brand or project journey. Discover is a phase. | step, stage (acceptable in casual use), level |
| **chunk** | A single output file from a phase. | document, file (acceptable), artifact |
| **diamond** | The dual-diamond methodology. Brand diamond, project diamond. | pipeline, workflow, process (acceptable in general use) |
| **foundation** | Design tokens and base styles. The output of the identity phase. | theme, config, settings |
| **design companion** | Category descriptor for GSP. | design tool, design system, design engineering system |

---

## Related

- [Archetype](./archetype.md)
- [Messaging](./messaging.md)
- [Brand Platform](./brand-platform.md)
