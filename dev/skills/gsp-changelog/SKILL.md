---
name: gsp-changelog
description: Maintain CHANGELOG.md from git history — update Unreleased section, promote to versioned release, or rebuild from scratch. Follows Keep a Changelog format.
allowed-tools:
  - Read
  - Edit
  - Bash
  - Grep
  - Glob
argument-hint: "[update|release|rebuild] default: update"
disable-model-invocation: true
---
<context>
Dev tool for maintaining CHANGELOG.md. Follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format with six section types: Added, Changed, Deprecated, Removed, Fixed, Security.

The project uses conventional-ish commit prefixes that map to changelog sections:

| Commit prefix | Changelog section | Notes |
|---------------|-------------------|-------|
| `feat:` | **Added** | New features and capabilities |
| `fix:` | **Fixed** | Bug fixes |
| `refactor:` | **Changed** | Restructuring, renames, migrations |
| `docs:` | *(omit)* | Documentation-only changes — skip unless user-facing |
| `chore:` | *(omit)* | Internal maintenance — skip unless notable |
| `perf:` | **Changed** | Performance improvements |
| `deprecate:` | **Deprecated** | Features marked for removal |
| `security:` | **Security** | Vulnerability fixes |
| No prefix | **Changed** | Default bucket for untagged commits |

CHANGELOG.md structure:
```markdown
# Changelog

All notable changes to get-shit-pretty are documented here.

## [Unreleased]

### Added
- ...

## [X.Y.Z] — YYYY-MM-DD

### Added
- ...
```

Key rules:
- `[Unreleased]` section always sits at the top, accumulating changes until release
- Empty sections are **omitted** — don't include `### Fixed` if nothing was fixed
- Each entry is a single bullet: concise, human-readable, no commit hashes
- Group related commits into one entry (e.g. 5 refactor commits about skills → one "Refactored from commands to skills-only architecture" entry)
- The changelog is for *users* — internal plumbing details (CI, dev scripts, test changes) are omitted unless they affect the user experience
</context>

<objective>
Maintain CHANGELOG.md so it's always release-ready. Three modes:

- **update** (default) — scan commits since last release, update the `[Unreleased]` section
- **release** — promote `[Unreleased]` to a versioned section using the current VERSION
- **rebuild** — regenerate the full changelog from git history (destructive, confirm first)
</objective>

<process>

## Step 0: Parse mode

`$ARGUMENTS`:
- **`update`** or empty — update the Unreleased section from recent commits
- **`release`** — promote Unreleased to versioned release
- **`rebuild`** — regenerate full changelog from git tags and history

## Mode: update

### Step 1: Find the boundary

Determine what's already in the changelog vs what's new:

```bash
# Get the last versioned release from CHANGELOG.md
grep -oP '## \[(\d+\.\d+\.\d+)\]' CHANGELOG.md | head -1 | grep -oP '\d+\.\d+\.\d+'
```

This is the "last released version." All commits after the tag or date for this version are candidates.

```bash
# Get commits since last release
# Try tag first, fall back to date from CHANGELOG.md
git log --oneline v${LAST_VERSION}..HEAD --no-merges 2>/dev/null || \
git log --oneline --since="${LAST_RELEASE_DATE}" --no-merges
```

### Step 2: Categorize commits

Read each commit message. Map to changelog sections using the prefix table above. Skip:
- `docs:` commits (unless they document a user-facing feature)
- `chore:` commits (unless they affect user experience — e.g. "chore: add CHANGELOG.md" is notable)
- Merge commits
- Commits that are purely internal (test infrastructure, CI, dev scripts)

Group related commits into single entries. For example:
- 3 commits about "refactor commands to skills" → one entry: "Refactored from commands to skills-only architecture"
- 2 commits about "OpenCode installer" → one entry: "Added OpenCode, Gemini CLI, and Codex CLI installer support"

### Step 3: Write Unreleased section

If `[Unreleased]` section exists in CHANGELOG.md, replace its content.
If it doesn't exist, insert it after the header and before the first versioned section.

Only include sections that have entries. Order: Added, Changed, Deprecated, Removed, Fixed, Security.

### Step 4: Show diff

Show the user what changed in the Unreleased section. Don't just silently write — present the entries for review before editing.

Wait for confirmation, then apply the edit.

## Mode: release

### Step 1: Read current state

```bash
cat VERSION
```

Read the `[Unreleased]` section from CHANGELOG.md. If empty or missing, tell the user to run `update` first.

### Step 2: Promote

Replace `## [Unreleased]` with `## [X.Y.Z] — YYYY-MM-DD` (using VERSION and today's date).

Insert a fresh empty `## [Unreleased]` section above it.

### Step 3: Show result

Display the new versioned section. Remind the user to verify VERSION matches their intended release.

## Mode: rebuild

### Step 1: Confirm

This is destructive — it rewrites the entire CHANGELOG.md. Use AskUserQuestion to confirm.

### Step 2: Walk git history

```bash
# Get all version tags, sorted
git tag -l 'v*' --sort=-version:refname
```

For each version range (tag to tag), categorize commits and build sections. Use the same grouping logic as `update` mode.

Build the full changelog from newest to oldest, with an `[Unreleased]` section at the top for any commits after the latest tag.

### Step 3: Write

Write the complete CHANGELOG.md. Show a summary of what was generated (version count, entry count per version).

## Important notes

- **User-facing only** — the changelog is for npm consumers, not maintainers. Internal dev tool changes, test infrastructure, and CI don't belong unless they affect the published package.
- **Concise entries** — one line per feature/change. No commit hashes, no author attribution.
- **Group aggressively** — 10 commits about the same feature = 1 changelog entry.
- **Present tense or past tense consistently** — match the existing style (currently past participle: "Added X", "Refactored Y").
- **Don't invent** — only document what the commits actually did. If a commit message is unclear, read the diff.
- **Preserve manually-written entries** — in `update` mode, don't overwrite entries that were hand-written in Unreleased. Merge new entries with existing ones.

</process>
