# The Design System Architect

**Category:** Design Systems
**Use when:** Building a complete design system from scratch, extending an existing one, or redesigning with migration mapping

---

## Prompt

Act as Apple Principal Designer. Build a design system for [BRAND].

**When [SYSTEM_STRATEGY] is GENERATE:**
Build a design system from scratch. Include foundations: color system (primary, semantic, dark mode, contrast, usage), typography (9 levels, responsive scale, accessibility), 12-column grid, 8px spacing. For components: if a UI library exists (shadcn, Radix, MUI, etc.), write a token mapping that skins the library, plus override specs only for components needing treatment beyond tokens, plus custom specs only for brand-distinctive components with no library equivalent. If no UI library exists, write core component specs (15 max). Add design tokens JSON, principles, do's/don'ts, and dev guide. Publish-ready.
When [STACK], [COMPONENTS], or [TOKENS] are provided (boilerplate/existing): respect existing config structure and output tokens in the format the existing config uses (Tailwind extend, CSS custom properties, etc).

**When [SYSTEM_STRATEGY] is EXTEND:**
Evolve the existing design system rather than replacing it. The codebase already has tokens and components (see [STACK], [COMPONENTS], [TOKENS]).
1. Audit existing tokens against the brand identity — keep what works, adjust what doesn't, fill gaps
2. Classify existing components: KEEP (library + current tokens are fine), RESTYLE (apply new brand tokens via token mapping), OVERRIDE (needs visual treatment beyond tokens), REPLACE (needs custom spec)
3. Write token mapping for the library's theming API, override specs for OVERRIDE components, custom specs for REPLACE components
4. Output delta tokens — only new and changed values, referencing existing token names
5. Preserve existing naming conventions, file patterns, and architecture from [STACK] and [COMPONENTS]

**When [SYSTEM_STRATEGY] is REFACTOR:**
Redesign the design system from the ground up, informed by what exists. The codebase has an existing system (see [STACK], [COMPONENTS], [TOKENS]) that needs a complete rethink.
1. Read and understand existing tokens, components, patterns from [STACK], [COMPONENTS], [TOKENS]
2. Design a complete new system (foundations, component token mapping + selective specs, tokens) — same scope as GENERATE
3. Produce a migration mapping for every change:
   - Old token → new token (or "removed — use X instead")
   - Old component → new component (or "replaced by X")
   - Files that need updating and what changes
4. Preserve conventions (naming, file org, import aliases) unless the brand requires changes
5. Flag breaking changes explicitly

**When [DESIGN_SCOPE] is `tokens`:**
Focus exclusively on foundations and tokens. Do not design components. Produce a component-token mapping table showing which existing components are affected by token changes and how.

---

## Variables

- `[BRAND]` — The brand/product name to build the system for
- `[SYSTEM_STRATEGY]` — GENERATE | EXTEND | REFACTOR
- `[STACK]` — Contents of `.design/system/STACK.md` (empty when greenfield)
- `[COMPONENTS]` — Contents of `.design/system/COMPONENTS.md` (empty when greenfield)
- `[TOKENS]` — Contents of `.design/system/TOKENS.md` (empty when greenfield)
- `[DESIGN_SCOPE]` — full | partial | tokens

## Expected Output

- Color system (primary, semantic, dark mode, contrast ratios, usage guidelines)
- Typography scale (9 levels, responsive, accessible)
- Grid system (12-column)
- Spacing system (8px base)
- Token mapping: brand tokens → component library theming API (GENERATE/REFACTOR)
- Override specs for components needing treatment beyond tokens (GENERATE/REFACTOR)
- Custom specs for brand-distinctive components with no library equivalent (GENERATE/REFACTOR)
- Component classification table with KEEP/RESTYLE/OVERRIDE/REPLACE (EXTEND)
- Migration mapping: old → new for tokens and components (REFACTOR)
- Component-token mapping table (tokens scope)
- Design patterns
- Design tokens (JSON)
- Design principles
- Do's and don'ts
- Developer handoff guide
