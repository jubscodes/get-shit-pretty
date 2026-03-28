# Design Token Standards

**Format:** W3C Design Tokens Community Group specification

---

## What Are Design Tokens?

Design tokens are the atomic values of a design system — colors, typography, spacing, shadows — expressed as platform-agnostic data. They bridge design and code.

## Token Structure (W3C Format)

```json
{
  "color": {
    "primary": {
      "$value": "#0066FF",
      "$type": "color",
      "$description": "Primary brand color"
    }
  }
}
```

### Required Fields
- `$value` — The token value
- `$type` — The token type

### Optional Fields
- `$description` — Human-readable description
- `$extensions` — Tool-specific metadata

## Token Types

### Color
```json
{
  "color": {
    "brand": {
      "primary": { "$value": "#0066FF", "$type": "color" },
      "secondary": { "$value": "#6B7280", "$type": "color" }
    },
    "semantic": {
      "text-primary": { "$value": "{color.brand.primary}", "$type": "color" },
      "background": { "$value": "#FFFFFF", "$type": "color" },
      "surface": { "$value": "#F9FAFB", "$type": "color" },
      "error": { "$value": "#DC2626", "$type": "color" },
      "success": { "$value": "#16A34A", "$type": "color" },
      "warning": { "$value": "#F59E0B", "$type": "color" }
    }
  }
}
```

### Typography
```json
{
  "typography": {
    "heading-1": {
      "$value": {
        "fontFamily": "{font.family.primary}",
        "fontSize": "32px",
        "fontWeight": 700,
        "lineHeight": 1.2,
        "letterSpacing": "-0.02em"
      },
      "$type": "typography"
    }
  }
}
```

### Spacing
```json
{
  "spacing": {
    "xs": { "$value": "4px", "$type": "dimension" },
    "sm": { "$value": "8px", "$type": "dimension" },
    "md": { "$value": "16px", "$type": "dimension" },
    "lg": { "$value": "24px", "$type": "dimension" },
    "xl": { "$value": "32px", "$type": "dimension" },
    "2xl": { "$value": "48px", "$type": "dimension" },
    "3xl": { "$value": "64px", "$type": "dimension" }
  }
}
```

### Shadow / Elevation
```json
{
  "shadow": {
    "sm": {
      "$value": {
        "offsetX": "0px",
        "offsetY": "1px",
        "blur": "2px",
        "spread": "0px",
        "color": "#0000001A"
      },
      "$type": "shadow"
    }
  }
}
```

### Border Radius
```json
{
  "radius": {
    "none": { "$value": "0px", "$type": "dimension" },
    "sm": { "$value": "4px", "$type": "dimension" },
    "md": { "$value": "8px", "$type": "dimension" },
    "lg": { "$value": "12px", "$type": "dimension" },
    "xl": { "$value": "16px", "$type": "dimension" },
    "full": { "$value": "9999px", "$type": "dimension" }
  }
}
```

## Token Naming Convention

```
{category}-{property}-{variant}-{state}
```

Examples:
- `color-text-primary`
- `color-background-surface`
- `spacing-padding-sm`
- `font-size-heading-1`
- `shadow-elevation-md`

## Aliasing (References)

Use `{}` to reference other tokens:

```json
{
  "button": {
    "primary": {
      "background": { "$value": "{color.brand.primary}", "$type": "color" },
      "text": { "$value": "{color.semantic.on-primary}", "$type": "color" }
    }
  }
}
```

## Dark Mode Strategy

### Separate token files:
- `tokens.light.json` — Light theme values
- `tokens.dark.json` — Dark theme values
- `tokens.base.json` — Theme-agnostic (spacing, radius, font sizes)

### Or semantic aliases:
```json
{
  "color": {
    "background": {
      "$value": "{color.white}",
      "$type": "color",
      "$extensions": {
        "dark": { "$value": "{color.gray.900}" }
      }
    }
  }
}
```

## Token-to-Code Mapping

| Token | CSS Custom Property | Tailwind |
|-------|-------------------|----------|
| `color.brand.primary` | `--color-brand-primary` | `text-brand-primary` |
| `spacing.md` | `--spacing-md` | `p-md` (custom) |
| `radius.lg` | `--radius-lg` | `rounded-lg` |
| `shadow.md` | `--shadow-md` | `shadow-md` |

## Tools
- **Style Dictionary** — Token transformation and export
- **Figma Tokens** (Tokens Studio) — Figma ↔ token sync
- **Specify** — Design API for token distribution
