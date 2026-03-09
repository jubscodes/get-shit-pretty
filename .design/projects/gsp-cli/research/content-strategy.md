# Content Strategy

> Phase: research | Project: gsp-cli | Generated: 2026-03-08

---

## Brand Voice in Terminal Context

GSP's brand voice is the "Warm Mentor" -- direct, respectful of time, celebrates progress without noise. The content-patterns.md foundation spec already defines this well. This research chunk focuses on how to apply it across the 5 screens.

### Tone Calibration by Screen

| Screen | Moment | Tone | Why |
|--------|--------|------|-----|
| 1. Onboarding | First impression | Confident + warm | User just installed; reward the decision |
| 2. Help | Reference lookup | Neutral + clear | User is task-oriented; get out of the way |
| 3. Progress | Status check | Honest + encouraging | User wants truth, not cheerleading |
| 4. Start | Session entry | Welcoming + efficient | User is returning; re-orient quickly |
| 5. Transitions | Phase completion | Celebratory + directional | User accomplished something; honor it, then point forward |

---

## Messaging Patterns for Phase Transitions (Screen 5)

### Completion Messages

Each phase transition needs a completion line that feels earned, not generic. Avoid identical copy across all 12 phases.

**Pattern: Phase-specific verb + artifact count**

```
  ◆ strategy complete — 6 chunks written
  ◆ identity complete — visual system defined
  ◆ build complete — 4 screens implemented
```

The verb or summary should reflect what the phase actually produced, not just "X files written" every time.

### Next Step Routing

The AskUserQuestion replaces plain text routing. But the question framing matters:

**Avoid:** "What would you like to do next?"  (too open, creates decision paralysis)
**Prefer:** "Ready for {next-phase}?" with options: [Continue to {next}] [View progress] [Done for now]

This is a guided choice, not an open question. Three options maximum. The happy path (continue) is first.

---

## Progress Communication (Screen 3)

### Honesty Over Optimism

Progress dashboards should report accurately, not cheerfully. "40% complete (2/5 phases)" is better than "Great progress!" Users read dashboards for truth.

**Pattern: Quantitative first, qualitative second**

```
  ████████░░░░░░░░ 40% (2/5 phases)
```

The progress bar gives the gestalt. The percentage gives precision. The fraction gives context. No adjectives needed.

### Pending vs. Skipped vs. Not Started

The diamond system handles state, but the copy around it should clarify:
- `◇ identity` -- not started (no qualifier needed)
- `◆ research` -- complete
- `◈ strategy` -- in progress
- `⏭ verbal (skipped)` -- explicitly called out if a phase was marked skipped

Skipped phases should use a distinct indicator, not blend into "pending."

---

## Help Reference Copy (Screen 2)

### Command Descriptions

Current descriptions are good: concise, action-oriented. Key principles:

1. **Start with a verb:** "Show all commands," "Scope what you're building," "Check project health"
2. **Avoid jargon in descriptions:** "Define who you are" is better than "Run brand strategy discovery phase"
3. **Include the hook:** "How pretty are we?" for `/gsp:progress` is memorable. More of this.
4. **Consistent length:** Keep descriptions to 5-8 words. Alignment matters visually.

### Section Headers

Current: ALL CAPS labels ("GETTING STARTED", "BRANDING"). The brand system uses H2 formatting (bold + primary color). The content should also shift from shouting caps to title case with brand formatting:

```
Getting Started          (not: GETTING STARTED)
Branding                 (not: BRANDING (define who you are))
```

Move the parenthetical descriptions to a subtitle line or drop them -- the command descriptions already explain each section.

---

## Onboarding Copy (Screen 1)

### Tagline Rotation

The current install.js has 8 rotating taglines. These are strong:

- "opinionated design systems, packaged for agents."
- "stop shipping defaults. start shipping taste."
- "because 'looks like AI made it' is becoming a genre."

**Keep:** Tagline rotation adds personality without noise. Each tagline is <60 characters and self-contained.

### Status Messages During Install

Current: emoji-prefixed console.log statements. Target: Status Message component format.

**Pattern: Past tense for completed actions**

```
  ✓ commands installed — 22 files
  ✓ agents installed — 8 files
  ✓ statusline configured
  ✗ opencode config not found — skipped
```

Note: failures are not errors in this context. A runtime not being installed is expected and should use a neutral tone, not error styling.

---

## Conciseness Principles

### Terminal output density guidelines

1. **One idea per line.** A status message should communicate one thing.
2. **No filler words.** "Successfully installed" becomes "installed." The checkmark already says "success."
3. **Numbers over adjectives.** "22 files" over "many files." "3.2s" over "quickly."
4. **Abbreviate when clear.** "3/5 phases" over "3 out of 5 phases complete."
5. **Punctuation is structure.** Em dashes for asides. Periods for statements. No exclamation marks in status output (the Banner is the one exception).

### Information Density by Screen

| Screen | Density | Reason |
|--------|---------|--------|
| 1 | Low | Celebratory moment, breathe |
| 2 | High | Reference material, pack it in |
| 3 | Medium | Dashboard, scannable but complete |
| 4 | Low | Session start, orient fast |
| 5 | Low | Transition, one idea: "done, here's next" |

---

## Related

- [UX Patterns](./ux-patterns.md) -- interaction patterns these messages support
- [Accessibility Patterns](./accessibility-patterns.md) -- constraints on messaging
- [Recommendations](./recommendations.md) -- content guidelines synthesis
