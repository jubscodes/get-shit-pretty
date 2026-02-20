# GSP — Get Shit Pretty

A Claude Code skill system for design workflows. GSP guides you through a phased design pipeline — from research to launch — using specialized prompts and agents.

## Install

```bash
git clone https://github.com/hoffms/get-shit-pretty.git ~/.claude/get-shit-pretty
cd ~/.claude/get-shit-pretty
chmod +x install.sh
./install.sh
```

## Commands

| Command | Description |
|---------|-------------|
| `/gsp:new-project` | Initialize a design brief through guided Q&A |
| `/gsp:research` | Analyze design trends for your industry |
| `/gsp:brand` | Create brand identity (strategy, logo, color, type) |
| `/gsp:system` | Build design system foundations + tokens |
| `/gsp:design` | Design UI/UX screens and flows |
| `/gsp:spec` | Generate Figma-ready specifications |
| `/gsp:review` | Design critique + accessibility audit |
| `/gsp:build` | Translate designs to production code |
| `/gsp:launch` | Create marketing campaign assets |
| `/gsp:progress` | Check project status — "How pretty are we?" |
| `/gsp:help` | Show command reference |

## Pipeline

```
/gsp:new-project → BRIEF.md
       ↓
/gsp:research    → .design/research/TRENDS.md
       ↓
/gsp:brand       → .design/brand/IDENTITY.md
       ↓
/gsp:system      → .design/system/SYSTEM.md + tokens.json
       ↓
/gsp:design      → .design/screens/SCREENS.md
       ↓
/gsp:spec        → .design/specs/FIGMA-SPECS.md
       ↓
/gsp:review      → .design/review/CRITIQUE.md + ACCESSIBILITY.md
       ↓  (loop back if issues found)
/gsp:build       → .design/build/CODE.md + components/
       ↓
/gsp:launch      → .design/launch/CAMPAIGN.md
```

All artifacts live in `.design/` within your project directory.

## Prompts

GSP bundles 9 specialized design prompts:

1. **Design System Architect** — Complete design systems (Apple Principal Designer)
2. **Brand Identity Creator** — Full brand identities (Pentagram Creative Director)
3. **UI/UX Pattern Master** — App UI design (Apple HIG)
4. **Marketing Asset Factory** — Campaign asset libraries
5. **Figma Auto-Layout Expert** — Figma-ready specifications
6. **Design Critique Partner** — Structured critiques (Nielsen's 10)
7. **Design Trend Synthesizer** — Industry trend analysis
8. **Accessibility Auditor** — WCAG 2.2 AA compliance
9. **Design-to-Code Translator** — Design to production code

## Requirements

- [Claude Code](https://claude.ai/claude-code) CLI
- GitHub CLI (`gh`) for repo creation

## License

MIT
