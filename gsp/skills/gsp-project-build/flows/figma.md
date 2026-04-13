# Build Flow: Figma Fallback

Activated when `implementation_target` is `figma` in `config.json`.

## When this runs

When the project's target is Figma (designer handoff), there is no codebase to edit. Instead, the builder produces structured implementation specs that a developer can use to implement in Figma or hand off to their dev team.

## Steps

### 1. Log intent

Log: "Figma target — producing implementation specs (no codebase to edit)"

### 2. Spawn spec agent

Spawn a single `gsp-project-builder` agent with:
- `execution_mode: full`
- `spec_only: true`
- All design chunks from `{PROJECT_PATH}/design/` inlined
- Brand system: `{BRAND_PATH}/patterns/STYLE.md` and `{BRAND_PATH}/patterns/{brand-name}.yml`
- Brief: `{PROJECT_PATH}/brief/target-adaptations.md` and `{PROJECT_PATH}/brief/scope.md`
- Agent methodology (loaded in Step 2.5 of main flow)

Agent instructions:

> execution_mode: full
> spec_only: true
>
> Produce Figma-ready implementation specs — no codebase to edit.
>
> Output:
> 1. `{PROJECT_PATH}/build/CODE.md` — component-by-component implementation guide:
>    - For each screen: component tree, token values, interaction states, responsive behavior
>    - For each component: props, variants, accessibility requirements
>    - Token table: all CSS variables with values from the brand `.yml`
>
> 2. `{PROJECT_PATH}/build/components/` — one `.md` file per significant custom component:
>    - Structure (HTML/JSX pseudocode)
>    - Variants and states
>    - Token usage (which CSS variables drive which properties)
>    - Accessibility notes (ARIA roles, keyboard, focus)
>
> Format specs for developer consumption — be precise about measurements, colors (include both OKLCH and hex), and interaction behavior.

### 3. Finalize

After the spec agent completes, continue from Step 6 (Finalize) of the main build flow.

`BUILD-LOG.md` in this mode documents spec files produced rather than codebase changes.
