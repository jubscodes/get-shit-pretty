# Build Flow: Revision Mode

Activated when `{PROJECT_PATH}/STATE.md` shows build status `needs-revision`.

## When this runs

After `/gsp-project-review` completes and writes `{PROJECT_PATH}/review/issues.md` with QA issues, the next invocation of `/gsp-project-build` enters revision mode automatically.

## Steps

### 1. Read issues

Read `{PROJECT_PATH}/review/issues.md`. This file contains QA issues prioritized by severity.

Log: "Revision mode — addressing QA issues from review/issues.md"

### 2. Spawn revision agent

Spawn a single `gsp-project-builder` agent with:
- `execution_mode: full`
- `revision: true`
- Full content of `review/issues.md` inlined
- Agent methodology (loaded in Step 2.5 of main flow)
- Visual effects and block patterns refs (loaded in Step 2.6 of main flow)

Agent instructions:

> execution_mode: full
> revision: true
>
> Fix the QA issues from review/issues.md in the codebase.
>
> 1. Work through issues in priority order (critical → high → medium → low)
> 2. Read the relevant codebase files before editing — don't guess at existing structure
> 3. Do NOT modify foundation files unless the QA issue explicitly requires it
> 4. Do NOT refactor or improve code outside the scope of the listed issues
> 5. Leave changes unstaged
>
> After completing revisions, append a `## Revision` section to `{PROJECT_PATH}/build/BUILD-LOG.md` listing each issue addressed (issue ID, file changed, what was fixed).

### 3. Compile check

After the revision agent completes, run the build command:

| Stack | Build command |
|-------|--------------|
| Next.js | `npx next build` |
| Vite | `npx vite build` |
| TypeScript only | `npx tsc --noEmit` |
| Generic | `npm run build` |

**Pass:** Continue to brand feedback check.
**Fail:** Log the error. Surface to user: "Revision introduced build errors: {error}. Fix before finalizing?"

### 4. Brand feedback on revisions

After the revision agent completes, check if any QA fixes changed token-level values (colors, typography, spacing, shadows). If so:

1. Ask: "These revisions changed brand-level values. Update brand patterns so future projects inherit the fix?"
2. If yes, spawn a background `gsp-brand-engineer` agent with the changed values to update `{BRAND_PATH}/patterns/`.

### 5. Finalize

Continue from Step 6 (Finalize) of the main build flow.
