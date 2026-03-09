// ============================================================
// GSP Status Message Helper — bin/install.js
// ============================================================
// Utility for consistent status line output during install.
//
// Dependencies: `c` (from color-system.js)
// ============================================================

/**
 * Print a success status message.
 * @param {string} message - The message text
 *
 * Usage:
 *   statusSuccess('commands installed — 20 files');
 *   // Output: "  ✓ commands installed — 20 files"
 */
function statusSuccess(message) {
  console.log(`  ${c.success}\u2713${c.reset} ${c.textPrimary}${message}${c.reset}`);
}

/**
 * Print a skipped/dim status message (NOT an error).
 * @param {string} message - The message text
 *
 * Usage:
 *   statusSkipped('opencode — not detected, skipped');
 *   // Output: "  ✗ opencode — not detected, skipped"
 */
function statusSkipped(message) {
  console.log(`  ${c.textTertiary}\u2717${c.reset} ${c.textSecondary}${message}${c.reset}`);
}

/**
 * Print a warning status message.
 * @param {string} message - The message text
 *
 * Usage:
 *   statusWarning('Installation incomplete! Failed: agents');
 */
function statusWarning(message) {
  console.log(`  ${c.warning}!${c.reset} ${c.textPrimary}${message}${c.reset}`);
}

/**
 * Print an info status message.
 * @param {string} message - The message text
 *
 * Usage:
 *   statusInfo('scanning your codebase in the background');
 */
function statusInfo(message) {
  console.log(`  ${c.info}i${c.reset} ${c.textSecondary}${message}${c.reset}`);
}
