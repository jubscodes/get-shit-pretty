# Conventions
> Design System Analysis | Generated: 2026-03-18

## Naming Patterns

| Convention | Value |
|------------|-------|
| Skills | `gsp-{kebab-case}/SKILL.md` directories |
| Agents | `gsp-{kebab-case}.md` files |
| Prompts | `{NN}-{kebab-case}.md` (zero-padded number prefix) |
| Scripts | `kebab-case.js` or `kebab-case.sh` |
| Templates | Category directories with descriptive filenames |
| References | `kebab-case.md` |
| Dev skills | Same as skills, under `dev/skills/` |
| Tests | `{name}.test.js` |

## Export Style

| Pattern | Usage |
|---------|-------|
| Default exports | Not used — no ES modules |
| Named exports | Not used — scripts are standalone executables, not importable modules |
| Barrel files | Not used |
| CommonJS require | `bin/install.js` uses `require()` for `fs`, `path`, `os`, `readline`, `child_process` and `../package.json` |

## Styling Approach

| Aspect | Value |
|--------|-------|
| Primary method | ANSI escape codes via JavaScript string constants |
| Class merging | N/A — terminal output |
| Component styling | Color tier objects (`TRUECOLOR`, `COLOR256`, `COLOR16`, `NOCOLOR`) with semantic keys |
| Responsive approach | `process.stdout.columns` for terminal width detection; sparkle field and `center()` adapt to width |

## Import Aliases

| Alias | Maps to |
|-------|---------|
| N/A | No import aliases — CommonJS `require()` with relative paths only |

Skill cross-references use `${CLAUDE_SKILL_DIR}/../../` to resolve shared files (prompts, templates, references) relative to the runtime root.

## File Organization

**Pattern:** Role-based directories

```
gsp/                          # Source of truth for all runtimes
  skills/                     # 26 skill directories (SKILL.md each)
    gsp-{name}/SKILL.md
  agents/                     # 14 agent definitions
    gsp-{name}.md
  prompts/                    # 12 system prompts (numbered)
  templates/                  # Config, state, and scan templates
    branding/
    projects/
    system/
  references/                 # 13 shared reference docs
  hooks/                      # Plugin hooks (hooks.json)
bin/                          # Executable entry point (install.js)
scripts/                      # Runtime hook scripts
dev/                          # Dev-only tools (never installed)
  scripts/                    # Test suite
  skills/                     # Dev skills
  tests/                      # Unit + integration tests
.claude-plugin/               # Plugin manifest
.design/                      # Design artifacts (gitignored except branding)
  branding/                   # Brand system output
  system/                     # This scan output
```

## Where to Add

| Type | Location | Naming | Example |
|------|----------|--------|---------|
| Skill | `gsp/skills/gsp-{name}/` | `SKILL.md` with YAML frontmatter | `gsp/skills/gsp-contrast/SKILL.md` |
| Agent | `gsp/agents/` | `gsp-{name}.md` | `gsp/agents/gsp-contrast-checker.md` |
| Prompt | `gsp/prompts/` | `{NN}-{name}.md` (next available number) | `gsp/prompts/13-contrast-analyzer.md` |
| Template | `gsp/templates/{category}/` | Descriptive filename | `gsp/templates/system/CONTRAST.md` |
| Reference | `gsp/references/` | `{kebab-case}.md` | `gsp/references/contrast-ratios.md` |
| Script | `scripts/` | `kebab-case.js` or `.sh` | `scripts/contrast-check.js` |
| Dev tool | `dev/skills/gsp-{name}/` or `dev/scripts/` | Same conventions as source | `dev/skills/gsp-contrast-test/SKILL.md` |
| Test | `dev/tests/` | `{name}.test.js` | `dev/tests/contrast.test.js` |
