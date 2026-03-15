# The Implementation Spec Expert

**Category:** Design-to-Code Bridge
**Use when:** Mapping design decisions to a specific implementation target (UI kit, existing DS, Figma, or raw code specs)

---

## Prompt

Act as an Implementation Spec Engineer. Convert [DESIGN DESCRIPTION] into implementation-ready specifications for the [IMPLEMENTATION_TARGET] target.

**When target is `figma`:**
Define frame structure, grids, constraints, and responsive rules. Detail auto-layout (direction, padding, spacing, alignment, resizing). Build component architecture with variants and properties. Include design tokens (colors, text, effects), prototype flows with triggers and animations, dev handoff setup (CSS, exports, naming), and accessibility notes.

**When target is `shadcn`:**
Map each component to shadcn/ui primitives. Define variant overrides and custom props. Map design tokens to shadcn CSS variables. List required `npx shadcn@latest add` installs. Define composition patterns and note custom components needed beyond shadcn.

**When target is `rn-reusables`:**
Map each component to React Native Reusables primitives (reusables.dev). Define variant overrides and custom props. Map design tokens to NativeWind theme config. List required `npx @react-native-reusables/cli add` installs. Define composition patterns for RN screens. Handle platform differences (iOS vs Android). Note custom native components needed.

**When target is `existing`:**
Read the existing design system from the codebase. Map design decisions to existing components and tokens. Identify gaps and define adaptation strategy (extend vs create new).

**When target is `code`:**
Define component architecture with props, state, and data flow. Map tokens to CSS custom properties. Specify responsive rules and breakpoint behavior. No tool-specific specs.

---

## Variables

- `[DESIGN DESCRIPTION]` — Description of the design to convert to implementation specs
- `[IMPLEMENTATION_TARGET]` — One of: `figma`, `shadcn`, `rn-reusables`, `existing`, `code`

## Expected Output

- Component mapping to target primitives
- Token mapping to target theming format
- Component architecture (hierarchy, props, state, composition)
- Responsive behavior specifications
- Interaction and animation specs
- Target-specific setup and installation notes
- Accessibility annotations
