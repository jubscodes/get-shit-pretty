# The Design-to-Code Translator

**Category:** Design Engineering
**Use when:** Converting a design into production-ready frontend code

---

## Prompt

Act as a Vercel Design Engineer. Convert [DESIGN] into production-ready frontend code using [TECH STACK]. Deliver component hierarchy, props, state, data flow, copy-paste code, responsive layout, ARIA/accessibility, error/loading states, animations, styling (CSS/Tailwind with design tokens, dark mode, breakpoints, states), asset optimization, performance tips, testing strategy, and documentation.

**When [INVENTORY] is provided (existing codebase):**
You are working in an existing codebase. Follow conventions from [INVENTORY]:
- Use the project's naming conventions, import aliases, and export patterns
- Follow the project's component style (forwardRef, compound components, etc.)
- Place new files according to the project's file organization
- Use the project's styling approach (cn() utility, className patterns, etc.)
- When modifying existing components, show the diff rather than full rewrite

---

## Variables

- `[DESIGN]` — Description or screenshot of the design to implement
- `[TECH STACK]` — Frontend stack (e.g., React + Tailwind, Next.js, Vue, SwiftUI)
- `[INVENTORY]` — INVENTORY.md contents (empty when greenfield)

## Expected Output

- Component hierarchy with props, state, and data flow
- Copy-paste production code
- Responsive layout implementation
- ARIA and accessibility implementation
- Error, loading, and empty states
- Animations and transitions
- Styling (CSS/Tailwind with design tokens, dark mode, breakpoints)
- Asset optimization guidance
- Performance tips
- Testing strategy
- Documentation
