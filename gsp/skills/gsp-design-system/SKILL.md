---
name: gsp-design-system
description: Scan and document the existing design system — use when: scan the codebase, document what components exist, what's already built, inventory the design system
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
Composable skill that scans the workspace codebase and documents the existing design system state. Produces focused documents that downstream skills and agents consume selectively.

Works two ways:
1. **Standalone** — user runs `/gsp-design-system` for a quick workspace audit
2. **Building block** — `/gsp-start` invokes this in the background during project setup

Output is workspace-level (not project-scoped), so it's shared across all projects and only needs to run once per codebase state change. Re-runnable — overwrites previous output.
</context>

<objective>
Scan the codebase and produce five focused design system documents.

**Output:** `.design/system/{STACK,COMPONENTS,TOKENS,CONVENTIONS,CONCERNS}.md`
</objective>

<execution_context>
@${CLAUDE_SKILL_DIR}/../../templates/system/STACK.md
@${CLAUDE_SKILL_DIR}/../../templates/system/COMPONENTS.md
@${CLAUDE_SKILL_DIR}/../../templates/system/TOKENS.md
@${CLAUDE_SKILL_DIR}/../../templates/system/CONVENTIONS.md
@${CLAUDE_SKILL_DIR}/../../templates/system/CONCERNS.md
</execution_context>

<rules>
- Always use `AskUserQuestion` for user interaction — never prompt via plain text
- One decision per question — never batch multiple questions in a single message
</rules>

<process>
## Step 0: Prepare output directory

```bash
mkdir -p .design/system
```

## Step 1: Detect tech stack (→ STACK.md)

1. **Detect package manager & lockfile**
   - Look for `package.json`, `bun.lockb`, `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`

2. **Read `package.json`**
   - Framework, dependencies, devDependencies, scripts

3. **Detect config files**
   - `tsconfig.json` / `jsconfig.json` — language, aliases
   - `tailwind.config.*` — styling, custom theme
   - `next.config.*` — Next.js
   - `vite.config.*` — Vite
   - `app.json` / `expo.json` — React Native / Expo
   - `postcss.config.*`, `.eslintrc.*`, `.prettierrc.*`

4. **Identify styling approach**
   - Tailwind, CSS Modules, styled-components, StyleSheet, vanilla CSS

5. **Identify architecture patterns**
   - Component style (functional, forwardRef, compound)
   - State management (Context, Zustand, Redux, Jotai)
   - Data fetching (Server Components, React Query, SWR)
   - Routing (App Router, Pages Router, Expo Router, React Router)
   - File organization (feature-based, type-based, flat)

6. **Classify codebase**
   - **greenfield**: No `package.json` or empty scaffold with no custom code
   - **boilerplate**: Scaffolded (create-next-app, create-expo-app, etc.) with minimal customization
   - **existing**: Real custom code — components, pages, business logic

7. **Write `.design/system/STACK.md`** from the STACK template

## Step 2: Scan components (→ COMPONENTS.md)

1. **Scan component directories**
   - Check: `src/components/`, `components/`, `app/`, `pages/`, `src/app/`, `src/pages/`, `src/ui/`, `lib/`

2. **For each component found**
   - Name, path, rough props/variants, reusability assessment

3. **Detect UI kit**
   - shadcn/ui, RN Reusables, Radix, MUI, Headless UI, etc.
   - Check package.json dependencies + component directory patterns

4. **Cap at 30 components** — summarize rest by directory/category

5. **"Where to add" guidance**
   - Where new components go, naming pattern, barrel file conventions

6. **Write `.design/system/COMPONENTS.md`** from the COMPONENTS template

## Step 3: Detect tokens & theming (→ TOKENS.md)

1. **Tailwind `extend` sections** — colors, fonts, spacing
2. **CSS custom properties** in `globals.css` / `global.css`
3. **Theme files** — `theme.ts`, `tokens.json`, `tokens.ts`
4. **Dark mode setup** — next-themes, class strategy, media query
5. **Prior GSP tokens** — scan `.design/branding/*/patterns/` for existing brand tokens

6. **Write `.design/system/TOKENS.md`** from the TOKENS template

## Step 4: Extract conventions (→ CONVENTIONS.md)

1. **Naming patterns** — PascalCase, kebab-case, camelCase across files
2. **Export style** — named, default, barrel files
3. **Styling approach** — `cn()`, className strings, StyleSheet
4. **Import aliases** — `@/`, `~/` from tsconfig/jsconfig
5. **File organization** — feature-based, type-based, flat
6. **"Where to add"** for each type — component, page, utility, token

7. **Write `.design/system/CONVENTIONS.md`** from the CONVENTIONS template

## Step 5: Identify concerns (→ CONCERNS.md)

1. **Design debt** — inconsistent spacing, mixed color systems, hardcoded values vs tokens
2. **Component fragility** — components with excessive props, no variants, tight coupling
3. **Accessibility gaps** — missing aria attributes, color contrast issues, no focus management
4. **Token coverage** — which categories are tokenized vs hardcoded
5. **Dark mode gaps** — components that don't support theme switching
6. **Responsive gaps** — components with fixed widths, missing breakpoints
7. **Naming inconsistencies** — mixed conventions across component directories

Each concern includes: file paths, severity (high/medium/low), and fix approach.

8. **Write `.design/system/CONCERNS.md`** from the CONCERNS template

**Greenfield shortcut:** If codebase is classified as greenfield (no package.json or no source code), write minimal versions of STACK.md and skip COMPONENTS, TOKENS, CONVENTIONS, and CONCERNS (write a one-line note in each: "Greenfield codebase — no existing design system to document.").

## Step 6: Completion display

Display a summary box:

```
  /gsp- design-system scan complete

  ┌──────────────────────────────────────────┐
  │  type           {classification}         │
  │  framework      {framework}              │
  │  styling        {styling approach}       │
  │  components     {N} detected             │
  │  token coverage {N}/6 categories         │
  │  concerns       {N} high, {N} medium     │
  └──────────────────────────────────────────┘

  output: .design/system/
```

Use plain text with Unicode box-drawing characters (`┌──┐│└──┘`) for the summary box.
</process>
