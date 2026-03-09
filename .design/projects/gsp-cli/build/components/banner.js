// ============================================================
// GSP Banner — bin/install.js
// ============================================================
// Replaces lines 82-94 of install.js (the ASCII art banner).
// Insert this block at the same location.
//
// Dependencies: `c` (from color-system.js), `pkg`, `tagline`, `hasQuiet`
// ============================================================

const columns = process.stdout.columns || 80;

function center(text, width) {
  const stripped = text.replace(/\x1b\[[0-9;]*m/g, '');
  const pad = Math.max(0, Math.floor((width - stripped.length) / 2));
  return ' '.repeat(pad) + text;
}

function sparkleLine(width) {
  const chars = ['*', '.', '\u00B7'];
  const line = Array(width).fill(' ');
  const count = 4 + Math.floor(Math.random() * 5);
  for (let i = 0; i < count; i++) {
    const pos = Math.floor(Math.random() * width);
    line[pos] = chars[Math.floor(Math.random() * chars.length)];
  }
  return line.join('');
}

function printBanner() {
  const w = Math.min(columns, 50);
  const title = `${c.accent}\u2591\u2592\u2593\u2588${c.reset}  ${c.bold}GET SHIT PRETTY${c.reset}  ${c.accent}\u2588\u2593\u2592\u2591${c.reset}`;
  const mark = `${c.bold}${c.accent}/gsp:${c.reset} ${c.textTertiary}\u25C7\u25C7${c.reset}  ${c.textTertiary}v${pkg.version}${c.reset}`;
  const tag = `${c.textSecondary}${tagline}${c.reset}`;

  console.log('');
  console.log('');
  if (columns >= 50) {
    console.log(center(`${c.textTertiary}${sparkleLine(34)}${c.reset}`, columns));
    console.log(center(`${c.textTertiary}${sparkleLine(34)}${c.reset}`, columns));
    console.log('');
  }
  console.log(center(title, columns));
  if (columns >= 50) {
    console.log('');
    console.log(center(`${c.textTertiary}${sparkleLine(34)}${c.reset}`, columns));
    console.log(center(`${c.textTertiary}${sparkleLine(34)}${c.reset}`, columns));
  }
  console.log('');
  console.log(center(mark, columns));
  console.log(center(tag, columns));
  console.log('');
  console.log('');
}

// Usage: wrap the banner call in a quiet check
if (!hasQuiet) {
  printBanner();
}
