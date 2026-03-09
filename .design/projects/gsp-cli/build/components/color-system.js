// ============================================================
// GSP Color System — bin/install.js
// ============================================================
// Replaces lines 9-15 of install.js (the hardcoded color constants).
// Insert this block at the same location.
//
// Accessibility notes:
//   - text-tertiary bumped from #666666 to #737373 (5.2:1 contrast)
//   - 16-color accent uses bright yellow (\x1b[33;1m) to differentiate from warning
//   - NO_COLOR and piped output return empty strings (no-color.org compliant)
// ============================================================

// Color tier detection
function getColorTier() {
  // NO_COLOR takes absolute precedence (no-color.org standard)
  if (process.env.NO_COLOR !== undefined) return 'none';

  // Non-TTY output (piped) — strip all color
  if (!process.stdout.isTTY) return 'none';

  // FORCE_COLOR overrides detection
  if (process.env.FORCE_COLOR !== undefined) {
    const level = parseInt(process.env.FORCE_COLOR, 10);
    if (level >= 3) return 'truecolor';
    if (level >= 2) return '256';
    if (level >= 1) return '16';
    return 'none';
  }

  // Explicit truecolor support
  if (process.env.COLORTERM === 'truecolor' || process.env.COLORTERM === '24bit') return 'truecolor';

  // 256-color detection
  if (process.env.TERM === 'xterm-256color' || process.stdout.hasColors?.(256)) return '256';

  // Fallback to basic 16-color
  return '16';
}

// Truecolor (RGB)
const TRUECOLOR = {
  accent:        '\x1b[38;2;255;107;53m',
  textPrimary:   '\x1b[38;2;224;224;224m',
  textSecondary: '\x1b[38;2;160;160;160m',
  textTertiary:  '\x1b[38;2;115;115;115m',  // #737373 — bumped from #666 for contrast
  success:       '\x1b[38;2;34;197;94m',
  warning:       '\x1b[38;2;251;191;36m',
  error:         '\x1b[38;2;239;68;68m',
  info:          '\x1b[38;2;96;165;250m',
  bold:          '\x1b[1m',
  dim:           '\x1b[2m',
  reset:         '\x1b[0m',
};

// 256-color fallback
const COLOR256 = {
  accent:        '\x1b[38;5;202m',
  textPrimary:   '\x1b[38;5;253m',
  textSecondary: '\x1b[38;5;247m',
  textTertiary:  '\x1b[38;5;243m',  // bumped from 241 for contrast
  success:       '\x1b[38;5;35m',
  warning:       '\x1b[38;5;220m',
  error:         '\x1b[38;5;196m',
  info:          '\x1b[38;5;69m',
  bold:          '\x1b[1m',
  dim:           '\x1b[2m',
  reset:         '\x1b[0m',
};

// 16-color fallback
const COLOR16 = {
  accent:        '\x1b[33;1m',  // bright yellow — differentiated from warning
  textPrimary:   '\x1b[37m',
  textSecondary: '\x1b[37m',
  textTertiary:  '\x1b[90m',    // bright black (gray)
  success:       '\x1b[32m',
  warning:       '\x1b[33m',    // plain yellow
  error:         '\x1b[31m',
  info:          '\x1b[36m',
  bold:          '\x1b[1m',
  dim:           '\x1b[2m',
  reset:         '\x1b[0m',
};

// No color (NO_COLOR or piped)
const NOCOLOR = {
  accent: '', textPrimary: '', textSecondary: '', textTertiary: '',
  success: '', warning: '', error: '', info: '',
  bold: '', dim: '', reset: '',
};

function getColors() {
  const tier = getColorTier();
  if (tier === 'truecolor') return TRUECOLOR;
  if (tier === '256') return COLOR256;
  if (tier === '16') return COLOR16;
  return NOCOLOR;
}

const c = getColors();
