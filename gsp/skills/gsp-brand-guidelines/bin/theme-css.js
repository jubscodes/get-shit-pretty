#!/usr/bin/env node
/**
 * theme-css.js — GSP deterministic token generator
 *
 * Reads a GSP style preset `.yml` file and emits either a shadcn-compatible
 * CSS variables block (`:root` and `.dark`) or a `registry:theme`
 * registry-item.json artifact for use with `shadcn apply --only theme`.
 *
 * Usage (from repo root):
 *   node gsp/skills/gsp-brand-guidelines/bin/theme-css.js <preset.yml>                                # CSS to stdout
 *   node gsp/skills/gsp-brand-guidelines/bin/theme-css.js <preset.yml> --output globals.css           # CSS to file
 *   node gsp/skills/gsp-brand-guidelines/bin/theme-css.js <preset.yml> --stdout                       # CSS to stdout (explicit)
 *   node gsp/skills/gsp-brand-guidelines/bin/theme-css.js <preset.yml> --registry --output theme.json # registry-item.json
 *
 * Token → CSS var mapping is 1:1. No derivation, no LLM guesswork.
 * Hex values are converted to OKLCH. Alpha values (oklch with /) pass through.
 * Sidebar vars are output verbatim. Extras (success/warning/info) become custom props.
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// YAML parser (zero-dependency, handles the subset GSP uses)
// ---------------------------------------------------------------------------

function parseYaml(text) {
  const lines = text.split('\n');
  const root = {};
  const stack = [{ indent: -1, obj: root }];

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trimEnd();
    if (!trimmed || trimmed.trimStart().startsWith('#')) continue;

    const indent = raw.length - raw.trimStart().length;
    const content = trimmed.trimStart();

    // Handle inline arrays: key: [a, b, c]
    const colonIdx = content.indexOf(':');
    if (colonIdx === -1) continue;

    const key = content.slice(0, colonIdx).trim();
    const rest = content.slice(colonIdx + 1).trim();

    // Pop stack to correct parent
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }
    const parent = stack[stack.length - 1].obj;

    if (rest === '' || rest.startsWith('#')) {
      // Nested object
      parent[key] = {};
      stack.push({ indent, obj: parent[key] });
    } else if (rest.startsWith('[')) {
      // Inline array — parse as string, not needed for color extraction
      parent[key] = rest;
    } else {
      // Scalar — strip inline comments and quotes
      let val = rest.split(' #')[0].trim();
      if ((val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      // Numbers
      if (/^-?\d+(\.\d+)?$/.test(val)) {
        parent[key] = parseFloat(val);
      } else if (val === 'true') {
        parent[key] = true;
      } else if (val === 'false') {
        parent[key] = false;
      } else {
        parent[key] = val;
      }
    }
  }

  return root;
}

// ---------------------------------------------------------------------------
// Color conversion: hex → OKLCH
// ---------------------------------------------------------------------------

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const len = h.length;
  if (len === 3) {
    return [
      parseInt(h[0] + h[0], 16),
      parseInt(h[1] + h[1], 16),
      parseInt(h[2] + h[2], 16),
    ];
  }
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

// sRGB → linear
function toLinear(c) {
  c = c / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

// Linear RGB → XYZ (D65)
function linearToXyz(r, g, b) {
  return [
    r * 0.4124564 + g * 0.3575761 + b * 0.1804375,
    r * 0.2126729 + g * 0.7151522 + b * 0.0721750,
    r * 0.0193339 + g * 0.1191920 + b * 0.9503041,
  ];
}

// XYZ → OKLab
function xyzToOklab(x, y, z) {
  const l_ = Math.cbrt(0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z);
  const m_ = Math.cbrt(0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z);
  const s_ = Math.cbrt(0.0482003018 * x + 0.2643662691 * y + 0.6338517070 * z);
  return [
    0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  ];
}

// OKLab → OKLCH
function oklabToOklch(L, a, b) {
  const C = Math.sqrt(a * a + b * b);
  let H = Math.atan2(b, a) * (180 / Math.PI);
  if (H < 0) H += 360;
  return [L, C, H];
}

function hexToOklch(hex) {
  const [r, g, b] = hexToRgb(hex);
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);
  const [x, y, z] = linearToXyz(lr, lg, lb);
  const [L, a, bk] = xyzToOklab(x, y, z);
  const [Lch, C, H] = oklabToOklch(L, a, bk);
  // Format: oklch(L% C H)
  const Lpct = (Lch * 100).toFixed(2);
  const Cfmt = C.toFixed(4);
  const Hfmt = H.toFixed(2);
  return `oklch(${Lpct}% ${Cfmt} ${Hfmt})`;
}

// ---------------------------------------------------------------------------
// Value formatter: hex → oklch, alpha values pass through
// ---------------------------------------------------------------------------

function formatValue(val) {
  if (typeof val !== 'string') return String(val);
  const v = val.trim();

  // Already oklch (alpha or not) — pass through
  if (v.startsWith('oklch(')) return v;

  // Hex color
  if (/^#[0-9a-fA-F]{3,6}$/.test(v)) {
    return hexToOklch(v);
  }

  // Everything else (rgba, named colors, etc.) — pass through
  return v;
}

// ---------------------------------------------------------------------------
// CSS var name mapping (1:1 to shadcn/ui)
// ---------------------------------------------------------------------------

// Core color tokens → CSS var names
const CORE_VARS = [
  'background', 'foreground',
  'card', 'card-foreground',
  'popover', 'popover-foreground',
  'primary', 'primary-foreground',
  'secondary', 'secondary-foreground',
  'accent', 'accent-foreground',
  'muted', 'muted-foreground',
  'destructive',
  'border', 'input', 'ring',
];

// NOTE: 'sidebar' (not 'sidebar-background') matches shadcn's CSS var --sidebar
const SIDEBAR_VARS = [
  'sidebar', 'sidebar-foreground',
  'sidebar-primary', 'sidebar-primary-foreground',
  'sidebar-accent', 'sidebar-accent-foreground',
  'sidebar-border', 'sidebar-ring',
];

const EXTRA_VARS = ['success', 'warning', 'info'];

// Shape tokens → CSS vars
const SHAPE_VARS = {
  'border-radius-lg': '--radius',
};

// ---------------------------------------------------------------------------
// CSS block generator
// ---------------------------------------------------------------------------

function generateBlock(colorObj, shapeObj, typographyObj, selector) {
  if (!colorObj) return '';
  const lines = [];

  // Core vars
  for (const key of CORE_VARS) {
    if (colorObj[key] !== undefined) {
      lines.push(`  --${key}: ${formatValue(colorObj[key])};`);
    }
  }

  // Sidebar vars
  for (const key of SIDEBAR_VARS) {
    if (colorObj[key] !== undefined) {
      lines.push(`  --${key}: ${formatValue(colorObj[key])};`);
    }
  }

  // Chart vars — emit in both :root and .dark (dark falls back to light values if not set)
  {
    // For :root use light palette; for .dark use dark overrides falling back to light
    const chartColors = [
      colorObj['chart-1'] || colorObj.primary,
      colorObj['chart-2'] || colorObj.secondary,
      colorObj['chart-3'] || colorObj.accent,
      colorObj['chart-4'] || colorObj.info || colorObj.primary,
      colorObj['chart-5'] || colorObj.success || colorObj.secondary || colorObj.primary,
    ];
    chartColors.forEach((c, i) => {
      if (c) lines.push(`  --chart-${i + 1}: ${formatValue(c)};`);
    });
  }

  // Shape → radius (only in :root)
  if (selector === ':root' && shapeObj) {
    const lg = shapeObj['border-radius-lg'];
    if (lg !== undefined) {
      lines.push(`  --radius: ${lg};`);
    }
  }

  // Typography → font CSS vars (only in :root)
  if (selector === ':root' && typographyObj) {
    const fontMappings = [
      ['font-family-primary', '--font-sans'],
      ['font-family-mono',    '--font-mono'],
      ['font-family-display', '--font-display'],
      ['font-family-secondary', '--font-secondary'],
    ];
    for (const [ymlKey, cssVar] of fontMappings) {
      if (typographyObj[ymlKey] !== undefined) {
        lines.push(`  ${cssVar}: ${typographyObj[ymlKey]};`);
      }
    }
  }

  // Extras as custom properties
  for (const key of EXTRA_VARS) {
    if (colorObj[key] !== undefined) {
      lines.push(`  --${key}: ${formatValue(colorObj[key])};`);
    }
  }

  if (!lines.length) return '';
  return `${selector} {\n${lines.join('\n')}\n}`;
}

// ---------------------------------------------------------------------------
// Registry-item.json builder
// ---------------------------------------------------------------------------

/**
 * Walk a flat color object (e.g. preset.tokens.color) and convert every value
 * through formatValue, returning a flat key→value map for cssVars.
 * Keys are the same as in the YAML (background, primary, etc.) — NOT prefixed
 * with "--" because shadcn's registry-item.json schema uses bare names.
 */
// Note: unlike generateBlock (CSS path), this does NOT synthesize chart-1..5
// from primary/secondary/etc. when not explicitly defined in the YAML. All
// current GSP presets define all five chart vars explicitly, so the paths
// stay symmetric in practice; if a future preset omits chart vars, add the
// fallback logic here too.
function colorObjToCssVars(colorObj) {
  if (!colorObj) return {};
  const out = {};
  // Walk all known CSS var groups: core, sidebar, chart, extras
  const allKeys = [...CORE_VARS, ...SIDEBAR_VARS, ...EXTRA_VARS];
  for (const key of allKeys) {
    if (colorObj[key] !== undefined) {
      out[key] = formatValue(colorObj[key]);
    }
  }
  // Chart vars
  const chartSources = [
    colorObj['chart-1'],
    colorObj['chart-2'],
    colorObj['chart-3'],
    colorObj['chart-4'],
    colorObj['chart-5'],
  ];
  chartSources.forEach((c, i) => {
    if (c !== undefined) {
      out[`chart-${i + 1}`] = formatValue(c);
    }
  });
  return out;
}

/**
 * Build a shadcn registry-item.json object from a parsed preset.
 */
function buildRegistryItem(preset, inputPath) {
  const name = preset.name || path.basename(inputPath, '.yml');
  const title = preset.title || name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const description = preset.description || '';

  const colorLight = (preset.tokens && preset.tokens.color) || {};
  const colorDark = (preset.dark_mode && preset.dark_mode.color) || {};
  const shape = (preset.tokens && preset.tokens.shape) || {};
  const typography = (preset.tokens && preset.tokens.typography) || {};

  // Build cssVars.theme from typography font mappings
  const theme = {};
  const fontMappings = [
    ['font-family-primary', 'font-sans'],
    ['font-family-mono', 'font-mono'],
    ['font-family-display', 'font-display'],
    ['font-family-secondary', 'font-secondary'],
  ];
  for (const [ymlKey, cssKey] of fontMappings) {
    if (typography[ymlKey] !== undefined) {
      theme[cssKey] = typography[ymlKey];
    }
  }

  // Build cssVars.light — colors + radius
  const light = colorObjToCssVars(colorLight);
  const lg = shape['border-radius-lg'];
  if (lg !== undefined) {
    light['radius'] = String(lg);
  }

  // Build cssVars.dark — dark_mode color overrides
  const dark = colorObjToCssVars(colorDark);

  const registryItem = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name,
    type: 'registry:theme',
    title,
    cssVars: {
      ...(Object.keys(theme).length ? { theme } : {}),
      light,
      dark,
    },
  };

  if (description) {
    registryItem.description = description;
  }

  return registryItem;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  if (!args.length || args.includes('--help') || args.includes('-h')) {
    const cmd = 'node gsp/skills/gsp-brand-guidelines/bin/theme-css.js';
    console.log(`Usage: ${cmd} <preset.yml> [--output <file>] [--stdout] [--registry]`);
    console.log(`       ${cmd} gsp/skills/gsp-style/styles/saas.yml`);
    console.log(`       ${cmd} gsp/skills/gsp-style/styles/saas.yml --registry --output saas.theme.json`);
    process.exit(0);
  }

  const inputPath = path.resolve(args[0]);
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: File not found: ${inputPath}`);
    process.exit(1);
  }

  const outputIdx = args.indexOf('--output');
  const outputPath = outputIdx !== -1 ? path.resolve(args[outputIdx + 1]) : null;
  const toStdout = args.includes('--stdout') || !outputPath;
  const asRegistry = args.includes('--registry');

  const raw = fs.readFileSync(inputPath, 'utf8');
  const preset = parseYaml(raw);

  if (asRegistry) {
    const registryItem = buildRegistryItem(preset, inputPath);
    const output = JSON.stringify(registryItem, null, 2);
    if (toStdout) {
      process.stdout.write(output + '\n');
    } else {
      fs.writeFileSync(outputPath, output + '\n', 'utf8');
      console.log(`Written to ${outputPath}`);
    }
    return;
  }

  const colorLight = (preset.tokens && preset.tokens.color) || {};
  const colorDark = (preset.dark_mode && preset.dark_mode.color) || {};
  const shape = (preset.tokens && preset.tokens.shape) || {};
  const typography = (preset.tokens && preset.tokens.typography) || null;

  const rootBlock = generateBlock(colorLight, shape, typography, ':root');
  const darkBlock = generateBlock(colorDark, null, null, '.dark');

  const presetName = preset.name || path.basename(inputPath, '.yml');
  const presetDesc = preset.description || '';

  const header = [
    `/* GSP theme: ${presetName} */`,
    presetDesc ? `/* ${presetDesc} */` : null,
    `/* Generated by theme-css.js from ${path.basename(inputPath)} */`,
    `/* Edit the .yml file, not this output */`,
    '',
  ].filter(Boolean).join('\n');

  const output = [header, rootBlock, darkBlock ? '' : null, darkBlock].filter(s => s !== null).join('\n');

  if (toStdout) {
    process.stdout.write(output + '\n');
  } else {
    fs.writeFileSync(outputPath, output + '\n', 'utf8');
    console.log(`Written to ${outputPath}`);
  }
}

main();
