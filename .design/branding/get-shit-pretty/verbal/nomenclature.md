# Nomenclature

> Phase: verbal | Brand: get-shit-pretty | Generated: 2026-03-08

---

## Product Naming

### The brand name

- **Full:** Get Shit Pretty
- **Abbreviation:** GSP (primary usage in technical contexts)
- **Lowercase:** get-shit-pretty (package name, URLs, file paths)
- **Never:** GetShitPretty, G.S.P., gsp (capitalized in prose: GSP)

### Commands

Pattern: `/gsp:{action}` or `/gsp:{phase}`

- `/gsp:brand-discover` — not `/gsp:discover-brand` (object-first)
- `/gsp:design` — verb for project actions
- `/gsp:doctor` — established CLI convention (borrowed from brew, flutter)
- `/gsp:update` — standard lifecycle command

Rule: commands use kebab-case after the colon. 1-2 words max.

### Agents

Pattern: `gsp-{role}`

- `gsp-designer` — not `gsp-design-agent`
- `gsp-strategist` — human role names, not function descriptions
- `gsp-verbal` — exception: phase name when role name is awkward

Rule: agents are named after what a human in that role would be called.

---

## Feature Naming

### Structural concepts

| Term | Definition | Never call it |
|------|-----------|---------------|
| **Dual-diamond** | The two-pipeline architecture (branding + project) | "double diamond" (that's the generic design framework), "methodology" |
| **Phase** | A stage in the pipeline (e.g., discover, strategy, verbal) | "step," "stage," "module" |
| **Chunk** | A single output file from a phase | "document," "artifact," "deliverable" |
| **Pipeline** | The full sequence of phases | "workflow," "process" (in technical contexts) |
| **Journey** | The full experience of using GSP | "workflow," "process" (in narrative contexts) |

### Phase names (branding pipeline)

discover / strategy / verbal / identity / system

Lowercase always. These are proper GSP terms. In prose: "the strategy phase" not "the Strategy Phase."

### Phase names (project pipeline)

brief / research / design / critique / build / review

Same rules. Lowercase. "The design phase" not "Design Phase."

---

## Terminology Guide

### Use / Don't Use

| Use | Don't use | Why |
|-----|-----------|-----|
| **Builders** | Users, customers | GSP serves people who build things. "Users" is passive |
| **Journey** | Workflow, process | In narrative/marketing. Journey implies transformation (Magician archetype) |
| **Pipeline** | Workflow, process | In technical contexts. Pipeline implies sequence and structure |
| **Design engineering** | Design, development | The discipline GSP represents. Neither design nor dev alone |
| **Brand coherence** | Brand consistency | Coherence implies internal logic. Consistency implies sameness |
| **Ship** | Deploy, launch, release | Builder language. Concrete. Action-oriented |
| **Terminal** | Command line, CLI | Preferred in narrative. "CLI" is OK in technical docs |
| **Craft** | Quality, excellence | Specific. Implies skill + intention. Creator archetype language |
| **Decisions** | Deliverables, assets | GSP produces decisions. Files are just how they're stored |
| **Structured** | Automated, AI-powered | GSP guides, it doesn't automate. The builder makes the decisions |
| **by jubscodes** | A jubs.studio product, from jubs | Ecosystem attribution. jubscodes is the maker identity |

### Words to avoid entirely

| Word | Why | Alternative |
|------|-----|------------|
| Powerful | Empty superlative. Show, don't claim | Describe the specific capability |
| Innovative | Every tool says this. Means nothing | Describe what's actually new |
| Seamless | Nothing is seamless. Be honest | "Without switching tools" |
| Leverage | Corporate jargon | "Use" |
| Solution | What problem does "solution" solve? | Name the specific thing |
| Platform | GSP is a system, not a platform | "System" or "tool" |
| Cutting-edge | Dated way to say modern | Just be modern. Don't announce it |
| Passionate | Show care through craft, not declaration | -- |
| Robust | Means nothing specific | Describe the specific quality |
| Empower | Patronizing | "Give you," "let you," or just show it |

---

## Naming Principles

When naming a new feature, command, or concept in GSP:

1. **Use plain words.** If a 5-letter word works, don't use a 12-letter word.
2. **Borrow from craft, not tech.** "Phase" over "module." "Journey" over "pipeline" (in narrative).
3. **Be literal first.** `/gsp:doctor` checks health. `/gsp:update` updates. No cleverness required.
4. **One word if possible.** Chunk. Phase. Brief. If you need two, use kebab-case.
5. **Test by saying it.** "Run the discover phase" should sound natural out loud.
6. **No acronyms beyond GSP.** Don't create sub-acronyms. They don't scale.

---

## Related

- [Voice Chart](./voice-chart.md)
- [Brand Voice](./brand-voice.md)
- [Messaging Matrix](./messaging-matrix.md)
