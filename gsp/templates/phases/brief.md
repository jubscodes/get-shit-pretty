# Project Brief

## Project: {PROJECT_NAME}
**Brand:** {BRAND_NAME}
**Date:** {DATE}

---

> This phase scopes the project. Produces planning chunks + INDEX.md in the `brief/` directory.

## Chunk Mapping

### Brief Chunks (`brief/`)

| Chunk File | Content |
|-----------|---------|
| `scope.md` | Screen/component list, priorities, project boundaries |
| `target-adaptations.md` | Project-specific component adaptations from the brand system |
| `install-manifest.md` | Install commands for needed components (conditional — shadcn/rn-reusables only) |
| `gap-analysis.md` | Components/tokens in design but not in codebase (conditional — existing target only) |
| `file-references.md` | Paths to existing components/tokens being used (conditional — existing target only) |

## Content Reference

Each chunk follows the format in `references/chunk-format.md`. Below is the structural reference for what each chunk should contain:

### scope.md
- **Screen list:** prioritized list of screens to design and build
- **Component scope:** which brand system components this project uses
- **Project boundaries:** what's in scope and out of scope
- **Success criteria:** measurable outcomes for the project
- **Dependencies:** external systems, APIs, content needs
- **Issue framing:** how this project maps to bounded issues/PRs

### target-adaptations.md
- **Token overrides:** project-specific token adjustments (if any)
- **Component adaptations:** brand components that need project-specific variants
- **Platform considerations:** platform-specific adjustments (mobile, desktop, etc.)
- **Implementation target mapping:** design components → target primitives (shadcn, rn-reusables, existing, code)
- Links to brand system components: `{BRAND_PATH}/system/components/{name}.md`

### install-manifest.md
- Install commands for all needed components
- Only produced for shadcn/rn-reusables targets

### gap-analysis.md
- Components in brand system but not in project codebase
- Tokens in brand system but not in project codebase
- Only produced for existing target codebases

### file-references.md
- Paths to all existing components/tokens being used
- Only produced for existing target codebases
