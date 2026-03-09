# Gap Analysis

> Phase: brief | Project: gsp-cli | Generated: 2026-03-08

---

## Existing vs. Required

### bin/install.js (Screen 1)

| Aspect | Current | Required | Gap |
|--------|---------|----------|-----|
| Splash art | Paint-splatter gradient (inline) | Banner component (sparkle + ramp + mark) | **Rewrite** — replace inline art with spec-compliant Banner |
| Colors | Hardcoded ANSI (cyan, green, yellow, magenta) | Brand tokens (accent, text-primary/secondary/tertiary) | **Replace** — swap color constants |
| Progress | `console.log` with emoji prefixes | Status Message component with brand symbols | **Adapt** — wrap existing logs in Status Message format |
| File listing | Flat text list | Tree component with box-drawing chars | **Add** — post-install file tree |
| Width handling | None | Terminal width detection + responsive | **Add** — `process.stdout.columns` |

### commands/gsp/help.md (Screen 2)

| Aspect | Current | Required | Gap |
|--------|---------|----------|-----|
| Header | `🎨 GSP — Get Shit Pretty` with emoji | Brand Mark + title with accent | **Replace** |
| Sections | `GETTING STARTED`, `BRANDING`, etc. in caps | H2 bold headings with Dividers | **Restyle** |
| Commands | Indented text list | Key-Value with consistent alignment | **Reformat** |
| Directory tree | Indented text with `├──` | Tree component with brand colors | **Restyle** |

### commands/gsp/progress.md (Screen 3)

| Aspect | Current | Required | Gap |
|--------|---------|----------|-----|
| Status symbols | ✅/⬜/🔄/⏭️ emoji | ◆/◇/◈ diamond system | **Replace** |
| Pipeline view | None | Pipeline Flow component | **Add** |
| Progress bars | `████░░░░` generic | Progress Bar with brand tokens | **Restyle** |
| Layout | Flat text blocks | Labeled Dividers + Key-Value | **Restructure** |

### commands/gsp/start.md (Screen 4)

| Aspect | Current | Required | Gap |
|--------|---------|----------|-----|
| Greeting | `🎨 GSP — Get Shit Pretty` text | Brand Mark component | **Replace** |
| State display | Text list of brands/projects | Pipeline Flow + Summary Box | **Add** |
| Routing | AskUserQuestion (working) | Keep as-is | **None** |

### Phase commands (Screen 5)

| Aspect | Current | Required | Gap |
|--------|---------|----------|-----|
| Completion output | Text: "Run /gsp:next" | Phase Block with file tree + routing | **Add** |
| Status updates | None | Status Message during execution | **Add** (agent guidance) |
| Transition | Plain text | Divider + next command in accent | **Add** |

---

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Agent ANSI rendering inconsistency | Medium | Provide exact escape code strings, test across Claude/OpenCode/Gemini |
| Terminal emoji vs Unicode diamonds | Low | Diamonds (◆◈◇) are standard Unicode, well-supported in monospace |
| install.js backwards compat | Low | Only visual changes, no functional changes to installer logic |
| Command file size bloat | Low | Output templates add ~20 lines per command, acceptable |
