# Install Manifest

> Phase: brief | Project: gsp-app | Generated: 2026-03-19

---

## Prerequisites

```bash
# Initialize Next.js App Router project (if not already done)
npx create-next-app@latest app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Initialize shadcn/ui
npx shadcn@latest init
```

During `shadcn init`, select:
- Style: New York
- Base color: Neutral (will be overridden by GSP tokens)
- CSS variables: Yes

---

## Layout Components

Used for page structure, navigation, and content containers.

```bash
# Navigation and layout
npx shadcn@latest add navigation-menu
npx shadcn@latest add sheet
npx shadcn@latest add separator
npx shadcn@latest add scroll-area
```

| Component | Rationale |
|-----------|-----------|
| navigation-menu | Desktop nav with monospace links and hover states |
| sheet | Mobile nav drawer (slides from right) |
| separator | Section dividers, footer top border |
| scroll-area | Code block horizontal overflow, content scroll |

---

## Content Components

Used for displaying information, blog posts, and feature sections.

```bash
# Cards and content display
npx shadcn@latest add card
npx shadcn@latest add badge
```

| Component | Rationale |
|-----------|-----------|
| card | Feature cards on landing page, blog post cards in list view |
| badge | Blog post tags, version labels, category indicators |

---

## Interaction Components

Used for CTAs, form elements, and user actions.

```bash
# Buttons and interaction
npx shadcn@latest add button
npx shadcn@latest add tooltip
```

| Component | Rationale |
|-----------|-----------|
| button | Hero CTA (primary), GitHub link (secondary), nav actions (ghost) |
| tooltip | Copy-to-clipboard feedback on install command, nav hover hints |

---

## Utility Components

Used for accessibility and progressive enhancement.

```bash
# Utility
npx shadcn@latest add visually-hidden
```

| Component | Rationale |
|-----------|-----------|
| visually-hidden | Skip-to-content link, screen reader labels on pipeline nodes |

---

## All-in-One Install

Copy-paste ready -- installs all components in one command:

```bash
npx shadcn@latest add navigation-menu sheet separator scroll-area card badge button tooltip visually-hidden
```

---

## Additional Dependencies

These are not shadcn components but are needed for the project:

```bash
# MDX for blog/changelog content
npm install @next/mdx @mdx-js/loader @mdx-js/react

# Syntax highlighting for code blocks
npm install shiki

# Copy to clipboard (for install command component)
npm install sonner
```

| Package | Rationale |
|---------|-----------|
| @next/mdx + @mdx-js/* | MDX pipeline for changelog/blog posts rendered as pages |
| shiki | Terminal-accurate syntax highlighting with custom monochrome theme |
| sonner | Toast notifications for copy-to-clipboard feedback (shadcn-compatible) |

---

## Components NOT Needed

Explicitly excluded to keep scope tight:

| Component | Why excluded |
|-----------|-------------|
| dialog / alert-dialog | No modals in scope |
| form / input / textarea | No forms (no search, no auth, no contact) |
| dropdown-menu | Nav is flat, no dropdowns |
| tabs | No tabbed interfaces in scope |
| accordion | No FAQ or collapsible sections in scope |
| table | No data tables (pipeline viz is custom) |
| avatar | No user profiles |
| select / combobox | No form controls |
| toast | Using sonner directly instead |

---

## Related

- [Scope](./scope.md)
- [Target Adaptations](./target-adaptations.md)
