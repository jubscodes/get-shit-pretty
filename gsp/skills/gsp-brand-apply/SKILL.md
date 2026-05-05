---
name: gsp-brand-apply
description: Install a brand theme into a shadcn codebase — use when: apply the brand to the code, install the theme, switch to brand X, refresh the theme
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
---
<context>
The universal theme-install primitive. Reads a `{brand}.theme.json` (registry:theme) artifact and installs it into a shadcn codebase via `shadcn apply --only theme`. Surgical — only cssVars (and optionally fonts) change; components are untouched.

Spawns an ephemeral localhost HTTP server (`serve-preset.js`, colocated in this skill's `bin/`) because shadcn CLI's `--preset` flag accepts HTTP URLs only (`file://` and bare paths are rejected).

Called explicitly by the user, or invoked by `/gsp-brand-guidelines` (after generation, with consent) and `/gsp-brand-refine` (after token regen).
</context>

<objective>
Install a brand's `{brand}.theme.json` into a target shadcn project's `globals.css`.

**Input:** brand name (positional arg) + optional `--target <path>`
**Output:** Updated CSS file (path declared in `{target}/components.json` → `tailwind.css`) — cssVars only — plus log entry in `{BRAND_PATH}/STATE.md`
**Agent:** None — inline Bash
</objective>

<rules>
- Always use `AskUserQuestion` for user-facing questions — never raw text prompts
- One decision per question — never batch multiple questions in a single message
</rules>

<process>
## Step 0: Resolve brand

Parse the user's argument:
- If a brand name was passed (e.g. `/gsp-brand-apply lyra`) → `BRAND={arg}`.
- If no name was given → scan `.design/branding/` for brand directories.
  - If exactly one → use it.
  - If multiple → use `AskUserQuestion`: "Which brand should I apply?" — list names as options.
  - If zero → error: "No brand found. Run `/gsp-brand-guidelines` first." Stop.

Set `BRAND_PATH=.design/branding/{BRAND}`.
Set `THEME_JSON={BRAND_PATH}/patterns/{BRAND}.theme.json`.

If `THEME_JSON` does not exist → error: "Brand '{BRAND}' has no theme.json. Run `/gsp-brand-guidelines {BRAND}` to generate it." Stop.

## Step 0.5: Pre-flight — preserve user work

`shadcn apply --only theme` is not strictly cssVars-only. Its preflight may also bump dependency versions in `package.json` (notably `shadcn` itself and `@base-ui/react`), regenerate `package-lock.json`, and rewrite `components.json`. We don't suppress this — there's no upstream flag (see issue tracker) — but we refuse to run when those files have uncommitted work, so the user can review the dep changes via `git diff` afterward.

If `{TARGET}` is inside a git repository, run:

```bash
git -C {TARGET} diff --quiet -- package.json package-lock.json components.json 2>/dev/null
```

If the exit code is non-zero (uncommitted changes exist in any of those three files), use `AskUserQuestion`:

- Question: "`{TARGET}` has uncommitted changes in `package.json`, `package-lock.json`, or `components.json`. `shadcn apply` may modify these (preflight bumps versions). Continue anyway?"
- Options:
  - A: "Cancel — I'll commit/stash first"
  - B: "Proceed anyway — I accept potential conflicts with my pending work"

If A → exit cleanly. If B → continue.

If `{TARGET}` is not a git repo, skip this check silently — there's nothing to compare against.

## Step 1: Resolve target

Parse `--target` flag if present.

If no flag:
- Read project config at `.design/projects/*/config.json` and find `app_path`.
  - If exactly one project config → use that `app_path`.
  - If multiple → use `AskUserQuestion`: "Which project's codebase?" — list project names + paths.
  - If zero project configs → error: "No project found. Pass `--target <path>` explicitly." Stop.

Set `TARGET={app_path}` (default `.` if empty).

Verify `{TARGET}/components.json` exists. If not → error: "{TARGET} is not a shadcn project (no components.json). Run `/gsp-scaffold` first." Stop.

## Step 2: Detect currently-installed brand (informational)

Resolve the CSS path: read `{TARGET}/components.json` and extract the value at `.tailwind.css` (a relative path from `{TARGET}`). Open `{TARGET}/{cssPath}`. Look for OKLCH cssVars in `:root`. Compare the `--background` light value against `.design/branding/*/patterns/*.theme.json` files in the workspace.

- If a match is found → `CURRENT={matched-brand-name}`.
- If file exists but no match → `CURRENT="custom or shadcn defaults"`.
- If file missing → `CURRENT="(none — fresh project)"`.

This is informational only — surfaced in the confirmation message in Step 3.

## Step 2.5: Detect custom token indirection

Scan the cssVars sections of `{TARGET}/{cssPath}` (`:root` and `.dark` blocks) for declarations of the form `--<name>: var(--<other>);` — these are custom indirection layers (e.g. `--background: var(--brand-bg);`).

`shadcn apply --only theme` will REPLACE those `var()` references with literal OKLCH values from the theme.json. The custom indirection is lost — the upstream tokens (e.g. `--brand-bg`) remain defined elsewhere in the file, but the shadcn cssVars no longer reference them.

If any `var(--*)` declarations are found in the cssVars blocks, use `AskUserQuestion`:
- Question: "`{cssPath}` has **{N} cssVar(s) using `var(--*)` indirection** (e.g. `{first-example}`). `shadcn apply` will replace these with literal OKLCH values, breaking the indirection layer. Continue?"
- Options:
  - A: "Yes, replace with literal values"
  - B: "No, cancel — preserve the indirection"

If B → append `- {ISO-8601 timestamp}: apply cancelled — would have broken indirection in {cssPath}` to `{BRAND_PATH}/STATE.md` under `## Apply log`. Output "Apply cancelled — preserve your indirection layer manually if needed." Exit cleanly.
If A → continue.

If no `var(--*)` indirection is found, skip this confirmation silently.

## Step 3: Confirm (when overwriting a different installed brand)

If `CURRENT` is a recognized brand name AND it differs from `BRAND`:

Use `AskUserQuestion`:
- Question: "Currently installed: **{CURRENT}**. Replace with **{BRAND}**?"
- Options:
  - A: "Yes, replace"
  - B: "No, cancel"

If B → append `- {ISO-8601 timestamp}: apply cancelled by user (target: {TARGET})` to `{BRAND_PATH}/STATE.md` under `## Apply log`. Output "Apply cancelled" and exit cleanly.
If A → continue.

If `CURRENT` is unrecognized or fresh, skip this confirmation and proceed silently.

## Steps 4–6: Spawn preset server, run apply, kill server

**Run Steps 4 through 6 as a single Bash call.** `SERVER_PID`, `PRESET_URL`, and `APPLY_EXIT` are shell variables — they do not survive across separate Bash tool invocations.

```bash
# Step 4: spawn preset server, capture URL
node ${CLAUDE_SKILL_DIR}/bin/serve-preset.js {THEME_JSON} > /tmp/preset-server-url-$$.txt 2>/dev/null &
SERVER_PID=$!
# Wait up to 2s for the URL to be written
for i in 1 2 3 4 5 6 7 8 9 10; do sleep 0.2; [ -s /tmp/preset-server-url-$$.txt ] && break; done
PRESET_URL=$(head -1 /tmp/preset-server-url-$$.txt 2>/dev/null)
rm -f /tmp/preset-server-url-$$.txt

# Bail if the server didn't print a URL
if [[ -z "$PRESET_URL" || "$PRESET_URL" != http* ]]; then
  kill "$SERVER_PID" 2>/dev/null
  wait "$SERVER_PID" 2>/dev/null
  echo "ERROR: preset server failed to start — serve-preset.js executable? Node available?"
  exit 1
fi

# Step 5: run apply (quote {TARGET} — paths may contain spaces)
cd "{TARGET}" && npx shadcn@latest apply --only theme --preset "$PRESET_URL" --yes 2>&1
APPLY_EXIT=$?

# Step 6: kill preset server unconditionally
kill "$SERVER_PID" 2>/dev/null
wait "$SERVER_PID" 2>/dev/null

# Surface APPLY_EXIT for the verification step
echo "APPLY_EXIT=$APPLY_EXIT"
```

Capture the bash output (especially the `APPLY_EXIT=N` line and any shadcn stderr) to use in Step 7.

## Step 7: Verify or report failure

If `APPLY_EXIT != 0`:
- Surface the captured shadcn output to the user (concise — full stderr, plus a single-line summary).
- Append to `{BRAND_PATH}/STATE.md` under `## Apply log`: `- {ISO-timestamp}: apply FAILED — exit {code} on {TARGET}`.
- Stop. Do NOT auto-retry. Do NOT manually paste tokens as a fallback.

If `APPLY_EXIT == 0`:
- Resolve the CSS path: read `{TARGET}/components.json` and extract the value at `.tailwind.css` (a relative path from `{TARGET}`).
- Read `{BRAND_PATH}/patterns/{BRAND}.theme.json` and extract `cssVars.light.background` (the brand's signature OKLCH value).
- Open `{TARGET}/{cssPath}`. Verify:
  - Contains `oklch(`
  - Has both `:root {` and `.dark {` blocks
  - Declares `--background`, `--foreground`, `--primary`, `--radius`
  - **Contains the exact `cssVars.light.background` value from the theme.json** (this distinguishes a successful brand apply from shadcn's own nova defaults, which also satisfy the structural checks above)
- If any check fails → warn (do not error): "Apply reported success but expected tokens not found in `{cssPath}` — the apply may have fallen back to defaults. Inspect manually." Continue to Step 8.
- If all checks pass → continue to Step 8.

## Step 8: Log success

Append to `{BRAND_PATH}/STATE.md` under a `## Apply log` section. If the file or section doesn't exist, create it.

```
## Apply log

- {ISO-8601 timestamp}: applied to `{TARGET}` (replaced: {CURRENT})
```

## Step 9: Output

After apply, check whether `package.json`, `package-lock.json`, or `components.json` were modified by shadcn's preflight:

```bash
cd {TARGET} && git diff --name-only -- package.json package-lock.json components.json 2>/dev/null
```

If the output is non-empty, list those files in the success block under a "Review" line so the user knows to inspect them. If empty (or the target is not a git repo), omit the Review line.

```
  ◆ brand applied — {BRAND} → {TARGET}

    {cssPath} updated
    Re-apply: /gsp-brand-apply {BRAND}
    Refine:   /gsp-brand-refine

    [if dep files changed]
    Review:   git diff {file1} {file2} ...
              (shadcn preflight may have bumped dep versions —
               commit or revert as you prefer)

  ──────────────────────────────
```
</process>
