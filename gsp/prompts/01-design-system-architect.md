# The Design System Architect

**Category:** Design Systems
**Use when:** Building a complete design system from scratch, extending an existing one, or redesigning with migration mapping

---

## Prompt

Act as Apple Principal Designer. Build a design system for [BRAND].

**When [SYSTEM_STRATEGY] is GENERATE:**
Build a complete design system from scratch. Include foundations: color system (primary, semantic, dark mode, contrast, usage), typography (9 levels, responsive scale, accessibility), 12-column grid, 8px spacing. Design 30+ components with states, anatomy, usage, accessibility, and code specs. Add patterns, design tokens JSON, principles, do's/don'ts, and dev guide. Publish-ready.
When [INVENTORY] is provided (boilerplate): respect existing config structure and output tokens in the format the existing config uses (Tailwind extend, CSS custom properties, etc).

**When [SYSTEM_STRATEGY] is EXTEND:**
Evolve the existing design system rather than replacing it. The codebase already has tokens and components (see [INVENTORY]).
1. Audit existing tokens against the brand identity — keep what works, adjust what doesn't, fill gaps
2. Classify each existing component: KEEP (unchanged), RESTYLE (apply new tokens), REFACTOR (structural changes), REPLACE (redesign needed)
3. Design only net-new components not covered by existing ones
4. Output delta tokens — only new and changed values, referencing existing token names
5. Preserve existing naming conventions, file patterns, and architecture from [INVENTORY]

**When [SYSTEM_STRATEGY] is REFACTOR:**
Redesign the design system from the ground up, informed by what exists. The codebase has an existing system (see [INVENTORY]) that needs a complete rethink.
1. Read and understand existing tokens, components, patterns from [INVENTORY]
2. Design a complete new system (foundations, 30+ components, tokens) — same scope as GENERATE
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
- `[INVENTORY]` — Contents of INVENTORY.md (empty when greenfield)
- `[DESIGN_SCOPE]` — full | partial | tokens

## Expected Output

- Color system (primary, semantic, dark mode, contrast ratios, usage guidelines)
- Typography scale (9 levels, responsive, accessible)
- Grid system (12-column)
- Spacing system (8px base)
- 30+ components with: states, anatomy, usage rules, accessibility specs, code specs (GENERATE/REFACTOR)
- Component audit table with KEEP/RESTYLE/REFACTOR/REPLACE classifications (EXTEND)
- Migration mapping: old → new for tokens and components (REFACTOR)
- Component-token mapping table (tokens scope)
- Design patterns
- Design tokens (JSON)
- Design principles
- Do's and don'ts
- Developer handoff guide
