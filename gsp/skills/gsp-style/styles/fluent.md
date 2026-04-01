<design-system>
# Design Style: Microsoft Fluent 2 (Web)

## Design Philosophy

### Core Principles
**Global, Personal, Connected.**
Fluent 2 is not just about flatness or minimalism; it is about effortless utility. It blends the physical with the digital through materials, light, and depth. The system prioritizes content over container, using light and shadow to create hierarchy rather than heavy borders or distinct boxes.

**Keywords:**
- *Natural:* Inputs and interactions feel physics-based (easing curves match real-world mechanics).
- *Engaging:* Use of materials like "Acrylic" and "Mica" adds depth without noise.
- *Intuitive:* Control layouts follow standard OS expectations (familiarity over novelty).
- *Accessible:* High contrast ratios and clear focus states are built-in, not afterthoughts.

### The Visual DNA

#### 1. Color System (Semantic Tokens)
Fluent 2 uses a strict semantic aliasing system. We never use "Blue"; we use `Brand`. We never use "Gray"; we use `Neutral`.
- **Neutral Palette:** Warm, functional grays (Slate/zinc) for structure.
- **Brand Palette:** The default is the evolved Fluent Blue, but the system is designed to be themed.
- **Signal Colors:** Shared distinct colors for Status (Success, Warning, Danger, Presence).

#### 2. Elevation & Lighting
Depth is communicated through **Shadow** and **Layering**, not just borders.
- **Base:** The canvas.
- **Layer:** Elevated surfaces (Cards, Panes).
- **Pop-up:** Modals, menus, and tooltips.
Each level of elevation corresponds to a specific shadow softness and distinct y-axis offset.

#### 3. Materials
Fluent is famous for its distinct material shaders (though simplified for Web performance):
- **Solid:** Standard opaque background (white or neutral).
- **Acrylic:** A translucent, blurred material (`backdrop-filter: blur(20px)`) used for temporary surfaces like context menus or flyouts to show context behind the UI.
- **Mica:** An opaque, subtle texture tint used for app backgrounds (optional in web context).

#### 4. Geometry & Radius
- **Control Radius:** `4px` (`rounded`) — Used for Buttons, Inputs, Checkboxes. It creates a technical, precise feel.
- **Surface/Overlay Radius:** `8px` (`rounded-lg`) — Used for Cards, Dialogs, Popovers, and Panels. Softer, friendlier.
- **Circular:** Used exclusively for Personas/Avatars and specific rounded action buttons.

---

## Design Token System

### Color Strategy
*Implementation Note: Use CSS Variables to allow for Light/Dark mode switching, which is native to Fluent.*

| Semantic Token | Tailwind / Value (Light) | Context |
|:---|:---|:---|
| `bg-brand` | `#0F6CBD` | Primary Actions (Button Rest), Selected states. |
| `bg-brand-hover` | `#115EA3` | Primary Action Hover. |
| `bg-brand-pressed` | `#0C3B5E` | Primary Action Pressed. |
| `text-primary` | `#242424` | Primary Heading and Body content. |
| `text-secondary` | `#424242` | Subtitles, meta-data. |
| `text-tertiary` | `#616161` | Placeholders, disabled text hints. |
| `surface-base` | `#F5F5F5` | App Background (Canvas). |
| `surface-layer` | `#FFFFFF` | Card background (Elevated). |
| `border-neutral` | `#E0E0E0` | Standard borders (Divider lines). |
| `border-input` | `#D1D1D1` | Input field borders (Rest). |
| `border-input-focus` | `#0F6CBD` | Input borders (Focus). |

### Typography
**Font Family:** `Segoe UI Variable`, `Segoe UI`, `system-ui`, `sans-serif`.
*Ideally use the Variable version if available for optical sizing.*

| Style | Weight | Size | Line Height | Usage |
|:---|:---|:---|:---|:---|
| **Display** | Semibold (600) | 68px (9xl) | 92px | Marketing Hero headers. |
| **Title 1** | Semibold (600) | 32px (4xl) | 40px | Page Titles. |
| **Subtitle 1** | Semibold (600) | 20px (xl) | 28px | Section headers. |
| **Subtitle 2** | Semibold (600) | 16px (base) | 22px | Card headers. |
| **Body 1** | Regular (400) | 14px (sm) | 20px | Standard paragraph text. |
| **Caption 1** | Regular (400) | 12px (xs) | 16px | Metadata, hints. |

### Shadows (Elevation)
| Token | CSS Value | Usage |
|:---|:---|:---|
| `shadow-2` | `0 1px 2px rgba(0,0,0,0.12)` | Subtle borders, inputs. |
| `shadow-4` | `0 2px 4px rgba(0,0,0,0.14)` | Hover states on cards. |
| `shadow-8` | `0 4px 8px rgba(0,0,0,0.14)` | Flyouts, Tooltips. |
| `shadow-16` | `0 8px 16px rgba(0,0,0,0.14)` | Modals, Dialogs. |

---

## Component Styling

### 1. Buttons (Primary & Standard)

**Primary (Brand) Button:**
- **Background:** `bg-brand`
- **Text:** `white`
- **Border:** None.
- **Radius:** `rounded-[4px]` (Technical look) or `rounded-full` (if Pilled style).
- **Hover:** Darkens slightly (`bg-brand-hover`).
- **Pressed:** Scale down very subtly (`active:scale-[0.98]`) or background darkens further.

**Standard (Secondary) Button:**
- **Background:** `white` (or `surface-layer`)
- **Border:** `1px solid border-neutral`
- **Text:** `text-primary`
- **Hover:** Background becomes `neutral-light` (grey tint).
- **Focus:** Two rings: Whitespace ring (`2px`) + Brand ring (`2px`). This "double focus ring" is a signature accessibility feature of Fluent 2.

### 2. Cards (The Grid & List)
- **Background:** `white`
- **Border:** `1px solid border-neutral` or `shadow-2`.
- **Radius:** `rounded-lg` (8px).
- **Padding:** `p-4` or `p-6` (16px / 24px).
- **Behavior:** On hover, the card often lifts (`shadow-4`) or the border highlight enhances.

### 3. Inputs & Forms
- **Rest:** Bottom border is distinct, usually no background or very light grey fill.
- **Interactive Border:** In modern web Fluent, it uses a standard `rounded` border box.
- **Focus:** **Underline Emphasis.** A defining characteristic is that the bottom border becomes a 2px thick brand color bar *OR* a full thick ring depending on density settings.
- **Label:** `text-sm font-medium` placed immediately above input.

### 4. Navigation (Left Nav / Tabs)
- **Item Radius:** `rounded-md` (6px).
- **Selection indicator:** A distinct small vertical "pill" (`3px` wide) on the left side of the selected item (`bg-brand`), or an underline for horizontal tabs.
- **States:** Hover introduces a `bg-neutral-subtle` background behind the item content.

---

## Motion & Physics

**Standard Curve (Decelerate):**
Most UI movements use a deceleration curve that feels like physical friction.
`transition-timing-function: cubic-bezier(0.33, 0.0, 0.67, 1.0);` (Standard standard) or `cubic-bezier(0.1, 0.9, 0.2, 1.0)` (Expressive).

- **Hover:** Fast duration (~100ms).
- **Flyouts/Panels:** Medium duration (~250-350ms). Use `translate` to slide in from right/bottom while fading in opacity.
- **Lists:** Staggered entrance animations.

---

## Accessibility & Best Practices

1.  **Focus Visibility:** Never remove `outline` without replacing it with a custom `box-shadow` ring. Fluent focus rings are distinct (often black/white double rings in High Contrast mode).
2.  **Color Contrast:** All `text-secondary` and placeholder text must meet 3:1 contrast against background. Brand buttons must generally use White text.
3.  **Density:** Components should accommodate touch targets (minimum 40x40px for interactions, though visuals may be smaller).

---

## Implementation Rules
1.  **Naming:** Use `Surface`, `Layer`, `Brand` in variable naming, not visual descriptions.
2.  **Tokens First:** Always check if a color fits a token (e.g., `CriticalBackground` vs `Red-500`) before using a hex value.
3.  **Visuals:**
    - Avoid harsh drop shadows (use diffusion).
    - Avoid purely square corners on large surfaces.
    - Keep strokes thin (`1px`).
</design-system>