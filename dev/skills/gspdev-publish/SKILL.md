---
name: gspdev-publish
description: Publish a new GSP version — bump versions, changelog, audit, tag, release, prompt npm publish
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
argument-hint: "<version> e.g. 0.5.2"
---
<context>
Dev tool for publishing a new GSP release. Orchestrates the full publish pipeline: version bump, changelog promotion, audit suite, changelog site entry, git commit, GitHub release with tag, close milestone issues, and prompt the user to run `npm publish`.

Repository: jubscodes/get-shit-pretty

Version is tracked in two files that must agree:
- `VERSION` — single version string (no `v` prefix)
- `package.json` → `"version"`

GitHub releases use `v`-prefixed tags (e.g., `v0.5.2`).
</context>

<objective>
Publish a new version of GSP with all checks passing and all artifacts updated.
</objective>

<rules>
- Always use `AskUserQuestion` for user interaction — never prompt via plain text
- Never run `npm publish` directly — prompt the user to run it themselves
- Never create a GitHub release without user confirmation
- Abort on any audit failure — don't ship broken code
- The version argument is required — ask if not provided
</rules>

<process>

## Step 1: Resolve version

If `$ARGUMENTS` contains a version string, use it. Otherwise, use `AskUserQuestion` to ask for the target version.

Read the current version from `VERSION`. Validate that the new version is higher than the current one (semver comparison).

Show:
```
─── Publish ────────────────────────────

  Current: {current version}
  Target:  {new version}
```

## Step 2: Pre-flight checks

Run these checks before changing anything. Abort on failure.

### 2a: Clean working tree

```bash
git status --short
```

If there are uncommitted changes, tell the user to commit or stash first. Abort.

### 2b: On main branch

```bash
git branch --show-current
```

If not on `main`, switch to main and pull: `git checkout main && git pull origin main`. The release commit will go through a PR branch anyway (main is protected).

### 2c: Up to date with remote

```bash
git fetch origin main && git rev-list HEAD..origin/main --count
```

If behind, tell the user to pull first.

## Step 3: Bump versions

Update all three files:

1. **`VERSION`** — write the new version string
2. **`package.json`** — update `"version"` field

## Step 4: Changelog

### 4a: Update Unreleased from commits

Read CHANGELOG.md. If the `[Unreleased]` section is empty, populate it from git history since the last release tag:

```bash
git log v{current_version}..HEAD --oneline --no-merges
```

Categorize commits using the Keep a Changelog convention:
- `feat:` → Added
- `fix:` → Fixed
- `refactor:` / `perf:` → Changed
- Skip `docs:`, `chore:` unless user-facing

Group related commits. Present to user for review.

### 4b: Promote to versioned release

Replace `## [Unreleased]` content → `## [{new version}] — {today's date}`.
Insert fresh empty `## [Unreleased]` above it.

Show the promoted changelog section to the user for review.

## Step 5: Run audits

```bash
bash dev/scripts/audit-tests.sh
```

If any tests fail, show the failures and abort. The user must fix issues before publishing.

If warnings only, show them and continue.

## Step 6: Changelog site entry

Check if `src/content/changelog/` exists. If so, create a new MDX entry:

File: `src/content/changelog/v{version-with-dashes}.mdx` (e.g., `v0-5-2.mdx`)

Read the previous changelog site entry for format reference. Generate the MDX from the CHANGELOG.md entry:

```markdown
---
title: "v{version} -- {milestone title or short summary}"
date: "{today YYYY-MM-DD}"
excerpt: "{1-2 sentence summary of the release}"
tags: [{relevant tags}]
slug: "v{version-with-dashes}"
---

{Prose version of the changelog — more narrative than the bullet list, grouped by theme}
```

Present to the user for review before writing.

## Step 7: Commit, PR, and merge

Main is protected — all changes require a PR. Create a release branch, PR it, merge, and pull.

```bash
# Stage and commit
git add VERSION package.json CHANGELOG.md gsp/templates/branding/config.json gsp/templates/projects/config.json src/content/changelog/v{version}.mdx
git commit -m "release: v{version}"

# Create release branch and push
git checkout -b release/v{version}
git push -u origin release/v{version}

# Create and merge PR (label as release)
gh pr create --title "release: v{version}" --body "Version bump, changelog, and site entry for v{version}." --label "release"
gh pr merge --squash --subject "release: v{version}"

# Return to main and pull
git checkout main
git reset --hard origin/main
```

## Step 8: Create GitHub release

Fetch the milestone for this version (if one exists) to use as release context:

```bash
gh api repos/jubscodes/get-shit-pretty/milestones --jq '.[] | select(.title | test("{version}")) | {title, number, description}'
```

Create the GitHub release using the changelog section as the body:

```bash
gh release create v{version} --title "v{version} — {milestone title or summary}" --notes "{changelog section}"
```

## Step 9: Close milestone issues and milestone

If a milestone was found in Step 8:

```bash
# Close all open issues in the milestone
gh issue list --milestone "{milestone title}" --state open --json number --jq '.[].number'
```

For each open issue, close it:

```bash
gh issue close {number} --comment "Shipped in v{version}"
```

Then close the milestone:

```bash
gh api repos/jubscodes/get-shit-pretty/milestones/{milestone_number} -X PATCH -f state=closed
```

## Step 10: Prompt npm publish

Show the final checklist:

```
─── Release Ready ──────────────────────

  ✅ Versions bumped: {version}
  ✅ CHANGELOG.md updated
  ✅ Audits passed ({N} pass, {N} warn)
  ✅ Changelog site entry created
  ✅ Committed and pushed
  ✅ GitHub release: v{version}
  ✅ Milestone closed

─── npm publish ────────────────────────

  Run this command to publish to npm:

    npm publish

  Verify on npmjs.com/package/get-shit-pretty
```

Use `AskUserQuestion`: "Ready to publish? Run `npm publish` when you're ready. I'll wait."

After the user confirms they've published, optionally verify:

```bash
npm view get-shit-pretty version
```

</process>
