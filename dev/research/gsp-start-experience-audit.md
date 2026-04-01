# gsp-start Experience Audit

**Date:** 2026-03-30

## Current Experience — Pros & Cons

### What works well

| Pro | Detail |
|-----|--------|
| Clear visual language | Diamond symbols (◆◈◇), pipeline flow, summary box — immediately communicates state |
| Adaptive greeting | Different greetings for fresh/legacy/brands-only/brands+projects — meets users where they are |
| One question at a time | Follows the UX rule, doesn't overwhelm |
| Inference over interrogation | States assumptions and lets users correct — feels like talking to a design lead, not filling a form |
| Persona synthesis | Q12 builds a real persona from prior answers instead of asking "who's your target user?" abstractly |
| Brand personality as options | Q13 gives concrete directions with WHY, not just labels — helps non-designers choose |
| E2E flag | Brand → project auto-transition avoids "now what?" moments |
| Quick flow | Style presets let users skip branding entirely — good escape hatch for speed |

### What doesn't work

| Con | Detail | Impact |
|-----|--------|--------|
| **Background agent at greeting** | Spawns gsp-design-system immediately — 20-40 API calls before user sees anything | Rate limit hit on greeting |
| **Blind to repo assets** | Asks "share your brand materials" but never scans for logos, fonts, colors already in the codebase | User has to manually point out things sitting right there |
| **Skill is too fat** | 380 lines, 5 flows (fresh/legacy/brand/project/quick), questioning framework, all in one skill | Hard to maintain, burns entire rate budget in one invocation |
| **15-18 questions before any output** | Brand flow asks Q1-Q18 before writing BRIEF.md — long stretch with no tangible artifact | User might feel like nothing is happening |
| **No intermediate saves** | If session crashes mid-questioning, all answers are lost | Wasted effort on rate limit or disconnect |
| **execution_context overhead** | Was loading questioning.md (now inlined — fixed), but other pipeline skills still have 2-4 refs each | Cumulative rate limit exhaustion |
| **Consumes STACK.md it didn't produce** | Step 4 line 275 consumes `.design/system/STACK.md` but relies on background agent to have written it — race condition | May present empty/missing data |
| **WebSearch/WebFetch in allowed-tools** | Listed but never used in the process — unnecessary permission surface | Confusing, may trigger unexpected behavior |
| **Templates read at end** | 4 branding + 5 project templates read only at artifact-writing time — fine, but all at once | Burst of reads at the end |
| **Quick flow invokes /gsp-style** | Another skill invocation mid-flow — additional loading cost | Adds to session budget |

### Structural issues

| Issue | Detail |
|-------|--------|
| **Greeter + brief-gatherer + router in one** | Three distinct responsibilities in one 380-line skill |
| **Brand and project flows are independent** | They share questioning principles but have completely different question sequences — could be separate skills |
| **Migration logic in greeting** | `system/ → patterns/` rename lives in Step 1a — a greeting skill shouldn't own data migration |
| **CHANGELOG creation in greeting** | Creates `.design/CHANGELOG.md` if missing — not a greeting concern |

---

## Proposals

### Proposal 1: Lightweight gsp-start (thin greeter + router)

**What changes:**
- gsp-start becomes ~80-100 lines: scan `.design/`, quick `package.json` read, greet, route
- Remove: background agent, migration logic, CHANGELOG creation, all questioning flows
- Remove: WebSearch, WebFetch, Agent from allowed-tools
- Keep: the visual language (diamonds, summary box, pipeline flow)
- Add: lightweight inline codebase check (read `package.json` + glob for components)
- Add: quick scan for brand-relevant assets (logo files, fonts, color vars in CSS)

**Where questioning goes:**
- Brand questioning → first steps of `/gsp-brand-research` (it already reads BRIEF.md — if none exists, it gathers the brief first)
- Project questioning → already exists as `/gsp-project-brief`
- Quick flow → stays in gsp-start (it's routing logic, not deep questioning)

**Pros:**
- Ultra-fast greeting — 3-5 API calls max (glob + read package.json + AskUserQuestion)
- Rate budget preserved for actual pipeline work
- Each skill owns its own questioning — single responsibility
- Migration/changelog logic moves to `/gsp-doctor` where it belongs

**Cons:**
- Brand flow needs a home — either new skill or folded into brand-research
- User sees more skill transitions (greeting → brief → research vs. one continuous flow)
- Quick flow still lives in gsp-start (mixed responsibility)

### Proposal 2: gsp-start as smart context detector

**What changes:**
- gsp-start scans both `.design/` AND the codebase for context signals
- Lightweight inline checks (no agents): package.json, logo files, font files, color definitions, README
- Presents everything it found: "You have a Next.js project with Tailwind, I found a logo at `public/logo.svg`, and colors defined in `globals.css`"
- Routes with that context pre-loaded — passes findings to the next skill via brief artifacts
- Still doesn't do deep questioning — just detects and routes

**Where questioning goes:** Same as Proposal 1.

**Pros:**
- Solves the "blind to repo assets" problem
- User immediately sees that the tool understands their project
- Lightweight — reads are cheap, no agents
- Better first impression than the current greeting

**Cons:**
- More scanning logic in gsp-start (but inline, not agent-based)
- Asset detection is fuzzy — where do you stop? (logos, fonts, favicons, og-images, color tokens...)
- Risk of false positives ("found logo.svg" but it's a placeholder)

### Proposal 3: gsp-start as concierge (Proposal 1 + 2 combined)

**What changes:**
- Thin greeter that reads `.design/` state AND does lightweight codebase/asset detection
- Presents a concierge-style summary: what exists, what's detected, what's possible
- Routes to the right skill with context pre-loaded
- No questioning, no agents, no templates, no migrations

**Greeting for a fresh start with existing codebase:**
```
  /gsp- ◇◇
  fresh start

  ┌──────────────────────────────────────────┐
  │  framework     Next.js 14               │
  │  styling       Tailwind + shadcn/ui     │
  │  assets        logo.svg, 2 font files   │
  │  colors        12 vars in globals.css   │
  │  type          existing codebase        │
  └──────────────────────────────────────────┘
```

**Greeting for continuing work:**
```
  acme-corp
  ◆ discover ─── ◆ strategy ─── ◈ identity ─── ◇ guidelines

  continue to identity?
```

**Where questioning goes:** Same as Proposals 1 & 2.

**Pros:**
- Best first impression — shows the user you understand their project immediately
- Ultra-light on API calls (5-8 inline reads, zero agents)
- Clean separation: gsp-start detects + routes, downstream skills question + create
- Solves rate limit AND blind-to-assets AND fat-skill problems simultaneously

**Cons:**
- Brand questioning needs a clear new home
- Asset detection scope needs to be defined (what's worth detecting?)
- Quick flow might need its own skill if gsp-start is purely detect+route

---

## Recommendation

**Proposal 3 (concierge)** — it solves all three problems at once:
1. Rate limit → no agents, no execution_context, minimal reads
2. Blind to assets → inline detection of logos, fonts, colors
3. Fat skill → questioning moves to consuming skills

**Migration path:**
1. Strip gsp-start to greeter + router + inline detection
2. Move brand questioning to brand-research (or new gsp-brand-brief)
3. Move migration/changelog to gsp-doctor
4. Remove WebSearch, WebFetch, Agent from allowed-tools
5. Define asset detection scope (logo, fonts, color definitions — stop there)

## Open Questions

- Should brand questioning become a new `gsp-brand-brief` skill, or fold into the first steps of `gsp-brand-research`?
- Should quick flow stay in gsp-start or become its own skill?
- What codebase assets are worth detecting? (logo, fonts, colors — what else?)
- Should gsp-start pass detected context to downstream skills via a file (e.g. `.design/system/DETECTED.md`) or inline in the skill invocation?
