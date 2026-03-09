// ============================================================
// GSP File Tree Helper — bin/install.js
// ============================================================
// Renders a box-drawing file tree for installed paths.
//
// Dependencies: `c` (from color-system.js)
// ============================================================

/**
 * Print a file tree showing installed structure.
 *
 * @param {string} root - The root directory label (e.g., "~/.claude" or "./.claude")
 * @param {Array<{name: string, description: string}>} items - Tree items in order
 *
 * Usage:
 *   printFileTree('~/.claude', [
 *     { name: 'commands/gsp/', description: '20 commands' },
 *     { name: 'agents/', description: '8 agents' },
 *     { name: 'get-shit-pretty/', description: 'prompts, templates, references' },
 *     { name: 'hooks/', description: 'statusline' },
 *     { name: 'settings.json', description: 'updated' },
 *   ]);
 *
 * Output:
 *   installed to ~/.claude
 *   ├── commands/gsp/      20 commands
 *   ├── agents/             8 agents
 *   ├── get-shit-pretty/    prompts, templates, references
 *   ├── hooks/              statusline
 *   └── settings.json       updated
 */
function printFileTree(root, items) {
  console.log(`\n  ${c.textSecondary}installed to ${c.textPrimary}${root}${c.reset}`);

  // Find the longest item name for alignment
  const maxNameLen = Math.max(...items.map(i => i.name.length));
  const padTo = Math.max(maxNameLen + 2, 20); // minimum 20 chars for alignment

  for (let i = 0; i < items.length; i++) {
    const isLast = i === items.length - 1;
    const connector = isLast ? '\u2514\u2500\u2500' : '\u251C\u2500\u2500';
    const name = items[i].name;
    const desc = items[i].description;
    const padding = ' '.repeat(Math.max(1, padTo - name.length));

    console.log(`  ${c.textTertiary}${connector} ${c.reset}${c.textSecondary}${name}${c.reset}${padding}${c.textSecondary}${desc}${c.reset}`);
  }
}
