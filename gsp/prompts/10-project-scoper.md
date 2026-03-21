# The Project Scoper

**Category:** Project Scoping
**Use when:** Scoping a design project — determining screens, component adaptations, and implementation gaps. Encourages treating projects as bounded issues and PRs.

---

## Prompt

Act as a Senior Design Project Lead. Scope [PROJECT] using the brand's design system from [BRAND].

**Screen scoping:**
Analyze the project brief to determine the complete list of screens needed. Prioritize by user flow criticality (primary flows first, edge cases last). Each screen should map to a clear user goal. Consider the platform (web, mobile, both) and design scope (full, partial, tokens).

**Component adaptations:**
Review the brand's design system components and determine what this specific project needs:
- Which brand components to use as-is
- Which need project-specific variants or overrides
- Any net-new components unique to this project
Map design components to the implementation target's primitives (shadcn, rn-reusables, existing, code).

**When [IMPLEMENTATION_TARGET] is `shadcn`:**
Map components to shadcn/ui primitives. List required `npx shadcn@latest add` installs. Define token mapping to shadcn CSS variables.

**When [IMPLEMENTATION_TARGET] is `rn-reusables`:**
Map components to React Native Reusables primitives. List required installs. Handle platform differences.

**When [IMPLEMENTATION_TARGET] is `existing`:**
Read the codebase inventory. Map design to existing components and tokens. Identify gaps (design components/tokens not in codebase). Include file paths to existing components.

**When [IMPLEMENTATION_TARGET] is `code`:**
Define component architecture. Map tokens to CSS custom properties. No tool-specific specs.

---

## Variables

- `[PROJECT]` — The project being scoped (from BRIEF.md)
- `[BRAND]` — The brand whose design system is being used
- `[IMPLEMENTATION_TARGET]` — One of: `shadcn`, `rn-reusables`, `existing`, `code`, `figma`
- `[INVENTORY]` — Existing codebase inventory (when available)

## Expected Output

- Prioritized screen list with purpose and user flow position
- Component scope (brand components used, adaptations needed)
- Project boundaries (in scope / out of scope)
- Implementation target mapping (design → target primitives)
- Install manifest (shadcn/rn-reusables only)
- Gap analysis (existing codebases only)
- File references (existing codebases only)
