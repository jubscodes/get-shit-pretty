#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

// ── Color tier detection ──

function getColorTier() {
  if (process.env.NO_COLOR !== undefined) return 'none';
  if (!process.stdout.isTTY) return 'none';
  if (process.env.FORCE_COLOR !== undefined) {
    const level = parseInt(process.env.FORCE_COLOR, 10);
    if (level >= 3) return 'truecolor';
    if (level >= 2) return '256';
    if (level >= 1) return '16';
    return 'none';
  }
  if (process.env.COLORTERM === 'truecolor' || process.env.COLORTERM === '24bit') return 'truecolor';
  if (process.env.TERM === 'xterm-256color' || process.stdout.hasColors?.(256)) return '256';
  return '16';
}

const TRUECOLOR = {
  accent:    '\x1b[38;2;255;107;53m',
  primary:   '\x1b[38;2;224;224;224m',
  secondary: '\x1b[38;2;160;160;160m',
  tertiary:  '\x1b[38;2;102;102;102m',
  success:   '\x1b[38;2;34;197;94m',
  warning:   '\x1b[38;2;251;191;36m',
  error:     '\x1b[38;2;239;68;68m',
  info:      '\x1b[38;2;96;165;250m',
  bold:      '\x1b[1m',
  dim:       '\x1b[2m',
  reset:     '\x1b[0m',
};

const COLOR256 = {
  accent:    '\x1b[38;5;202m',
  primary:   '\x1b[38;5;253m',
  secondary: '\x1b[38;5;247m',
  tertiary:  '\x1b[38;5;241m',
  success:   '\x1b[38;5;35m',
  warning:   '\x1b[38;5;220m',
  error:     '\x1b[38;5;196m',
  info:      '\x1b[38;5;69m',
  bold:      '\x1b[1m',
  dim:       '\x1b[2m',
  reset:     '\x1b[0m',
};

const COLOR16 = {
  accent:    '\x1b[33m',
  primary:   '\x1b[37m',
  secondary: '\x1b[37m',
  tertiary:  '\x1b[90m',
  success:   '\x1b[32m',
  warning:   '\x1b[33m',
  error:     '\x1b[31m',
  info:      '\x1b[36m',
  bold:      '\x1b[1m',
  dim:       '\x1b[2m',
  reset:     '\x1b[0m',
};

const NOCOLOR = {
  accent: '', primary: '', secondary: '', tertiary: '',
  success: '', warning: '', error: '', info: '',
  bold: '', dim: '', reset: '',
};

const tier = getColorTier();
const c = tier === 'truecolor' ? TRUECOLOR : tier === '256' ? COLOR256 : tier === '16' ? COLOR16 : NOCOLOR;

// Legacy aliases (used in interactive prompts and error messages)
const cyan = c.accent;
const green = c.success;
const yellow = c.warning;
const magenta = c.accent;
const bold = c.bold;
const dim = c.dim;
const reset = c.reset;

// Get version from package.json
const pkg = require('../package.json');

// Parse args
const args = process.argv.slice(2);
const hasGlobal = args.includes('--global') || args.includes('-g');
const hasLocal = args.includes('--local') || args.includes('-l');
const hasClaude = args.includes('--claude');
const hasOpencode = args.includes('--opencode');
const hasGemini = args.includes('--gemini');
const hasCodex = args.includes('--codex');
const hasAll = args.includes('--all');
const hasUninstall = args.includes('--uninstall') || args.includes('-u');
const hasHelp = args.includes('--help') || args.includes('-h');
const hasQuiet = args.includes('--quiet') || args.includes('-q');
const forceStatusline = args.includes('--force-statusline');

// Runtime selection
let selectedRuntimes = [];
if (hasAll) {
  selectedRuntimes = ['claude', 'opencode', 'gemini', 'codex'];
} else {
  if (hasClaude) selectedRuntimes.push('claude');
  if (hasOpencode) selectedRuntimes.push('opencode');
  if (hasGemini) selectedRuntimes.push('gemini');
  if (hasCodex) selectedRuntimes.push('codex');
}

// Parse --config-dir argument
function parseConfigDirArg() {
  const idx = args.findIndex(a => a === '--config-dir' || a === '-c');
  if (idx !== -1) {
    const next = args[idx + 1];
    if (!next || next.startsWith('-')) {
      console.error(`  ${yellow}--config-dir requires a path argument${reset}`);
      process.exit(1);
    }
    return next;
  }
  const eqArg = args.find(a => a.startsWith('--config-dir=') || a.startsWith('-c='));
  if (eqArg) {
    const val = eqArg.split('=')[1];
    if (!val) {
      console.error(`  ${yellow}--config-dir requires a non-empty path${reset}`);
      process.exit(1);
    }
    return val;
  }
  return null;
}
const explicitConfigDir = parseConfigDirArg();

// Taglines
const taglines = [
  'opinionated design systems, packaged for agents.',
  'because "looks like AI made it" is becoming a genre.',
  'strategy first. pixels second. ship it pretty.',
  'teach your agent what good design looks like.',
  'design systems that agents can actually follow.',
  'your codebase called. it wants a design system.',
  'stop shipping defaults. start shipping taste.',
  'same system, different themes, different products.',
];
const tagline = taglines[Math.floor(Math.random() * taglines.length)];

// ── Sparkle field + density ramp banner ──

function sparkleLine(width) {
  const chars = ['✧', '.', '·'];
  const line = Array(width).fill(' ');
  const count = 4 + Math.floor(Math.random() * 5);
  for (let i = 0; i < count; i++) {
    const pos = Math.floor(Math.random() * width);
    line[pos] = chars[Math.floor(Math.random() * chars.length)];
  }
  return line.join('');
}

function center(text, width) {
  const stripped = text.replace(/\x1b\[[0-9;]*m/g, '');
  const pad = Math.max(0, Math.floor((width - stripped.length) / 2));
  return ' '.repeat(pad) + text;
}

const columns = process.stdout.columns || 80;
const rampText = `${c.accent}░▒▓█${c.reset} ${c.bold} GET SHIT PRETTY ${c.reset} ${c.accent}█▓▒░${c.reset}`;
const sparkleWidth = Math.min(34, columns - 4);
const showSparkles = columns >= 40;

const banner = '\n\n' +
  (showSparkles ? `${c.dim}  ${sparkleLine(sparkleWidth)}${c.reset}\n` : '') +
  (showSparkles ? `${c.dim}  ${sparkleLine(sparkleWidth)}${c.reset}\n` : '') +
  '\n' +
  center(rampText, columns) + '\n' +
  '\n' +
  (showSparkles ? `${c.dim}  ${sparkleLine(sparkleWidth)}${c.reset}\n` : '') +
  (showSparkles ? `${c.dim}  ${sparkleLine(sparkleWidth)}${c.reset}\n` : '') +
  '\n' +
  `  ${c.bold}${c.accent}/gsp:${c.reset} ${c.tertiary}◇◇${c.reset}  ${c.dim}v${pkg.version}${c.reset}\n` +
  `  ${c.dim}${tagline}${c.reset}\n`;

console.log(banner);

// Help
if (hasHelp) {
  console.log(`  ${yellow}Usage:${reset} npx get-shit-pretty [options]\n
  ${yellow}Options:${reset}
    ${cyan}-g, --global${reset}              Install globally (to config directory)
    ${cyan}-l, --local${reset}               Install locally (to current directory)
    ${cyan}--claude${reset}                  Install for Claude Code only
    ${cyan}--opencode${reset}                Install for OpenCode only
    ${cyan}--gemini${reset}                  Install for Gemini only
    ${cyan}--codex${reset}                   Install for Codex CLI only
    ${cyan}--all${reset}                     Install for all runtimes
    ${cyan}-u, --uninstall${reset}           Uninstall GSP (remove GSP files only)
    ${cyan}-c, --config-dir <path>${reset}   Specify custom config directory
    ${cyan}--force-statusline${reset}        Replace existing statusline config
    ${cyan}-q, --quiet${reset}               Skip onboarding message
    ${cyan}-h, --help${reset}                Show this help message

  ${yellow}Examples:${reset}
    ${dim}# Interactive install (prompts for runtime and location)${reset}
    npx get-shit-pretty

    ${dim}# Install for Claude Code globally${reset}
    npx get-shit-pretty --claude --global

    ${dim}# Install for all runtimes globally${reset}
    npx get-shit-pretty --all --global

    ${dim}# Install to current project only${reset}
    npx get-shit-pretty --claude --local

    ${dim}# Uninstall GSP from Claude Code globally${reset}
    npx get-shit-pretty --claude --global --uninstall
`);
  process.exit(0);
}

// ──────────────────────────────────────────────────────
// Utility functions
// ──────────────────────────────────────────────────────

function expandTilde(filePath) {
  if (filePath && filePath.startsWith('~/')) {
    return path.join(os.homedir(), filePath.slice(2));
  }
  return filePath;
}

function getDirName(runtime) {
  if (runtime === 'opencode') return '.opencode';
  if (runtime === 'gemini') return '.gemini';
  if (runtime === 'codex') return '.codex';
  return '.claude';
}

function getGlobalDir(runtime, explicitDir = null) {
  if (explicitDir) return expandTilde(explicitDir);

  if (runtime === 'opencode') {
    if (process.env.OPENCODE_CONFIG_DIR) return expandTilde(process.env.OPENCODE_CONFIG_DIR);
    if (process.env.OPENCODE_CONFIG) return path.dirname(expandTilde(process.env.OPENCODE_CONFIG));
    if (process.env.XDG_CONFIG_HOME) return path.join(expandTilde(process.env.XDG_CONFIG_HOME), 'opencode');
    return path.join(os.homedir(), '.config', 'opencode');
  }

  if (runtime === 'gemini') {
    if (process.env.GEMINI_CONFIG_DIR) return expandTilde(process.env.GEMINI_CONFIG_DIR);
    return path.join(os.homedir(), '.gemini');
  }

  if (runtime === 'codex') {
    if (process.env.CODEX_CONFIG_DIR) return expandTilde(process.env.CODEX_CONFIG_DIR);
    return path.join(os.homedir(), '.codex');
  }

  // Claude
  if (process.env.CLAUDE_CONFIG_DIR) return expandTilde(process.env.CLAUDE_CONFIG_DIR);
  return path.join(os.homedir(), '.claude');
}

function getCodexSkillsDir(isGlobal) {
  return isGlobal
    ? path.join(os.homedir(), '.agents', 'skills')
    : path.join(process.cwd(), '.agents', 'skills');
}

function getConfigDirFromHome(runtime, isGlobal) {
  if (!isGlobal) return `'${getDirName(runtime)}'`;
  if (runtime === 'opencode') return "'.config', 'opencode'";
  if (runtime === 'gemini') return "'.gemini'";
  if (runtime === 'codex') return "'.codex'";
  return "'.claude'";
}

function getRuntimeLabel(runtime) {
  if (runtime === 'opencode') return 'OpenCode';
  if (runtime === 'gemini') return 'Gemini';
  if (runtime === 'codex') return 'Codex';
  return 'Claude Code';
}

function readSettings(settingsPath) {
  if (fs.existsSync(settingsPath)) {
    try { return JSON.parse(fs.readFileSync(settingsPath, 'utf8')); } catch (e) { return {}; }
  }
  return {};
}

function writeSettings(settingsPath, settings) {
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');
}

// ──────────────────────────────────────────────────────
// Tool name mappings
// ──────────────────────────────────────────────────────

const claudeToOpencodeTools = {
  AskUserQuestion: 'question',
  SlashCommand: 'skill',
  TodoWrite: 'todowrite',
  WebFetch: 'webfetch',
  WebSearch: 'websearch',
};

const claudeToGeminiTools = {
  Read: 'read_file',
  Write: 'write_file',
  Edit: 'replace',
  Bash: 'run_shell_command',
  Glob: 'glob',
  Grep: 'search_file_content',
  WebSearch: 'google_web_search',
  WebFetch: 'web_fetch',
  TodoWrite: 'write_todos',
  AskUserQuestion: 'ask_user',
};

const claudeToCodexTools = {
  Read: 'read',
  Write: 'write',
  Edit: 'edit',
  Bash: 'shell',
  Glob: 'glob',
  Grep: 'grep',
  WebSearch: 'web_search',
  WebFetch: 'web_fetch',
};

const colorNameToHex = {
  cyan: '#00FFFF', red: '#FF0000', green: '#00FF00', blue: '#0000FF',
  yellow: '#FFFF00', magenta: '#FF00FF', orange: '#FFA500', purple: '#800080',
  pink: '#FFC0CB', white: '#FFFFFF', black: '#000000', gray: '#808080', grey: '#808080',
};

// ──────────────────────────────────────────────────────
// Conversion functions
// ──────────────────────────────────────────────────────

function convertToolName(claudeTool) {
  if (claudeToOpencodeTools[claudeTool]) return claudeToOpencodeTools[claudeTool];
  if (claudeTool.startsWith('mcp__')) return claudeTool;
  return claudeTool.toLowerCase();
}

function convertGeminiToolName(claudeTool) {
  if (claudeTool.startsWith('mcp__')) return null;
  if (claudeTool === 'Task') return null;
  if (claudeToGeminiTools[claudeTool]) return claudeToGeminiTools[claudeTool];
  return claudeTool.toLowerCase();
}

function convertCodexToolName(claudeTool) {
  if (claudeTool.startsWith('mcp__')) return null;
  if (claudeTool === 'Task') return null;
  if (claudeToCodexTools[claudeTool]) return claudeToCodexTools[claudeTool];
  return claudeTool.toLowerCase();
}

function stripSubTags(content) {
  return content.replace(/<sub>(.*?)<\/sub>/g, '*($1)*');
}

/**
 * Convert Claude frontmatter to OpenCode format
 */
/**
 * Shared body-level replacements for all OpenCode conversions.
 * Converts Claude tool names, command syntax, and agent spawning patterns
 * to their OpenCode equivalents.
 */
function applyOpencodeBodyReplacements(content) {
  let converted = content;
  converted = converted.replace(/\bAskUserQuestion\b/g, 'question');
  converted = converted.replace(/\bSlashCommand\b/g, 'skill');
  converted = converted.replace(/\bTodoWrite\b/g, 'todowrite');
  converted = converted.replace(/\/gsp:/g, '/gsp-');
  converted = converted.replace(/~\/\.claude\b/g, '~/.config/opencode');
  converted = converted.replace(/subagent_type="general-purpose"/g, 'subagent_type="general"');
  // Convert Claude agent spawning to OpenCode subagent delegation
  converted = converted.replace(/Spawn the (`gsp-[a-z-]+`) agent/g, 'Delegate to the $1 subagent');
  converted = converted.replace(/spawn the (`gsp-[a-z-]+`) agent/g, 'delegate to the $1 subagent');
  // Convert "Re-spawn the agent" patterns
  converted = converted.replace(/Re-spawn the agent/g, 'Re-delegate to the subagent');
  converted = converted.replace(/re-spawn the agent/g, 're-delegate to the subagent');
  return converted;
}

/**
 * Convert Claude agent frontmatter to OpenCode agent format.
 *
 * OpenCode agents use YAML frontmatter with these fields:
 *   description (required), mode, model, temperature, top_p, steps,
 *   tools (boolean map: { write: false }), permission, color, hidden, disable
 *
 * Claude fields that map:
 *   description → description
 *   tools (csv)  → tools (boolean map, all true)
 *   disallowedTools → tools (boolean map, set false)
 *   maxTurns → steps
 *   permissionMode → permission section
 *   color → color (hex)
 *   name → dropped (filename is the identifier)
 */
function convertClaudeToOpencodeAgent(content) {
  let converted = applyOpencodeBodyReplacements(content);


  if (!converted.startsWith('---')) return converted;
  const endIndex = converted.indexOf('---', 3);
  if (endIndex === -1) return converted;

  const frontmatter = converted.substring(3, endIndex).trim();
  const body = converted.substring(endIndex + 3);
  const lines = frontmatter.split('\n');
  const newLines = [];
  let inAllowedTools = false;
  let inDisallowedTools = false;
  const enabledTools = [];
  const disabledTools = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Parse allowed-tools / tools list
    if (trimmed.startsWith('allowed-tools:') || (trimmed.startsWith('tools:') && !trimmed.includes('false'))) {
      const val = trimmed.split(':').slice(1).join(':').trim();
      if (val) {
        enabledTools.push(...val.split(',').map(t => t.trim()).filter(Boolean));
      } else {
        inAllowedTools = true;
        inDisallowedTools = false;
      }
      continue;
    }

    // Parse disallowedTools
    if (trimmed.startsWith('disallowedTools:')) {
      const val = trimmed.split(':').slice(1).join(':').trim();
      if (val) {
        disabledTools.push(...val.split(',').map(t => t.trim()).filter(Boolean));
      } else {
        inDisallowedTools = true;
        inAllowedTools = false;
      }
      continue;
    }

    // Collect list items
    if (inAllowedTools) {
      if (trimmed.startsWith('- ')) { enabledTools.push(trimmed.substring(2).trim()); continue; }
      else if (trimmed && !trimmed.startsWith('-')) { inAllowedTools = false; }
    }
    if (inDisallowedTools) {
      if (trimmed.startsWith('- ')) { disabledTools.push(trimmed.substring(2).trim()); continue; }
      else if (trimmed && !trimmed.startsWith('-')) { inDisallowedTools = false; }
    }

    // Drop Claude-only fields
    if (trimmed.startsWith('name:')) continue;
    if (trimmed.startsWith('permissionMode:')) continue;

    // maxTurns → steps
    if (trimmed.startsWith('maxTurns:')) {
      const val = trimmed.split(':').slice(1).join(':').trim();
      newLines.push(`steps: ${val}`);
      continue;
    }

    // color → hex
    if (trimmed.startsWith('color:')) {
      const colorValue = trimmed.substring(6).trim().toLowerCase();
      const hex = colorNameToHex[colorValue];
      if (hex) newLines.push(`color: "${hex}"`);
      else if (colorValue.startsWith('#') && /^#[0-9a-f]{3}$|^#[0-9a-f]{6}$/i.test(colorValue)) {
        newLines.push(line);
      }
      continue;
    }

    if (!inAllowedTools && !inDisallowedTools) newLines.push(line);
  }

  // Build tools map (OpenCode uses boolean map, not list)
  if (enabledTools.length > 0 || disabledTools.length > 0) {
    newLines.push('tools:');
    for (const tool of enabledTools) {
      newLines.push(`  ${convertToolName(tool)}: true`);
    }
    for (const tool of disabledTools) {
      newLines.push(`  ${convertToolName(tool)}: false`);
    }
  }

  return `---\n${newLines.join('\n').trim()}\n---${body}`;
}

/**
 * Convert Claude command frontmatter to OpenCode command format.
 *
 * OpenCode commands use YAML frontmatter with:
 *   description, agent, model, subtask
 *
 * Claude fields that map:
 *   description → description
 *   allowed-tools → dropped (not supported in commands)
 *   disable-model-invocation → dropped
 *   name → dropped (filename is identifier)
 */
/**
 * Convert Claude SKILL.md to OpenCode skill format.
 *
 * OpenCode skills use YAML frontmatter with:
 *   name (required, must match dir name), description (required),
 *   license, compatibility, metadata
 *
 * Claude fields that map:
 *   name → name
 *   description → description
 *   allowed-tools → dropped (tools controlled via agent/permission config)
 *   disable-model-invocation → dropped
 *   user-invocable → dropped
 *
 * Body: path refs and tool names are converted.
 */
function convertClaudeSkillToOpencode(content, skillName) {
  let converted = applyOpencodeBodyReplacements(content);
  // Replace CLAUDE_SKILL_DIR with OPENCODE_SKILL_DIR (or equivalent path)
  converted = converted.replace(/\$\{CLAUDE_SKILL_DIR\}/g, '${SKILL_DIR}');

  if (!converted.startsWith('---')) {
    return `---\nname: ${skillName}\ndescription: GSP skill\n---\n${converted}`;
  }
  const endIndex = converted.indexOf('---', 3);
  if (endIndex === -1) {
    return `---\nname: ${skillName}\ndescription: GSP skill\n---\n${converted}`;
  }

  const frontmatter = converted.substring(3, endIndex).trim();
  const body = converted.substring(endIndex + 3);
  const newLines = [];
  let hasName = false;
  let hasDescription = false;
  let inList = false;

  for (const line of frontmatter.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('name:')) {
      // Override with directory-matching name
      newLines.push(`name: ${skillName}`);
      hasName = true;
      inList = false;
      continue;
    }
    if (trimmed.startsWith('description:')) { newLines.push(line); hasDescription = true; inList = false; continue; }
    // Drop Claude-only fields
    if (trimmed.startsWith('allowed-tools:')) { inList = true; continue; }
    if (trimmed.startsWith('disable-model-invocation:')) { inList = false; continue; }
    if (trimmed.startsWith('user-invocable:')) { inList = false; continue; }
    if (trimmed.startsWith('argument-hint:')) { inList = false; continue; }
    if (trimmed.startsWith('color:')) { inList = false; continue; }
    if (trimmed.startsWith('context:')) { inList = false; continue; }
    if (trimmed.startsWith('agent:')) { inList = false; continue; }
    // Skip list items under dropped fields
    if (inList) {
      if (trimmed.startsWith('- ')) continue;
      else if (trimmed && !trimmed.startsWith('-')) inList = false;
    }
    if (!inList) newLines.push(line);
  }

  if (!hasName) newLines.unshift(`name: ${skillName}`);
  if (!hasDescription) newLines.splice(1, 0, 'description: GSP skill');

  return `---\n${newLines.join('\n').trim()}\n---${body}`;
}

/**
 * Shared body-level replacements for all Gemini conversions.
 * Gemini uses TOML for commands but YAML for agents/skills.
 * Command syntax stays as /gsp: (Gemini uses colon namespacing from subdirectories).
 */
function applyGeminiBodyReplacements(content) {
  let converted = content;
  converted = converted.replace(/\bAskUserQuestion\b/g, 'ask_user');
  converted = converted.replace(/\bSlashCommand\b/g, 'activate_skill');
  converted = converted.replace(/\bTodoWrite\b/g, 'write_todos');
  converted = converted.replace(/~\/\.claude\b/g, '~/.gemini');
  // Convert agent spawning — Gemini delegates via subagent tool calls
  converted = converted.replace(/Spawn the (`gsp-[a-z-]+`) agent/g, 'Invoke the $1 subagent');
  converted = converted.replace(/spawn the (`gsp-[a-z-]+`) agent/g, 'invoke the $1 subagent');
  converted = converted.replace(/Re-spawn the agent/g, 'Re-invoke the subagent');
  converted = converted.replace(/re-spawn the agent/g, 're-invoke the subagent');
  return converted;
}

/**
 * Convert Claude agent to Gemini agent format.
 *
 * Gemini agents use YAML frontmatter with:
 *   name (required), description (required), kind, tools (array),
 *   model, temperature, max_turns, timeout_mins
 *
 * Claude fields that map:
 *   name → name
 *   description → description
 *   tools (csv) → tools (array of Gemini tool names)
 *   maxTurns → max_turns
 *   color → dropped (not supported)
 *   permissionMode → dropped (subagents run in YOLO mode)
 *   disallowedTools → dropped (Gemini uses allowlist only)
 */
function convertClaudeToGeminiAgent(content) {
  let converted = applyGeminiBodyReplacements(content);

  if (!converted.startsWith('---')) return converted;
  const endIndex = converted.indexOf('---', 3);
  if (endIndex === -1) return converted;

  const frontmatter = converted.substring(3, endIndex).trim();
  const body = converted.substring(endIndex + 3);
  const lines = frontmatter.split('\n');
  const newLines = [];
  let inAllowedTools = false;
  let inDisallowedTools = false;
  const tools = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('allowed-tools:') || (trimmed.startsWith('tools:') && !trimmed.includes('false'))) {
      const val = trimmed.split(':').slice(1).join(':').trim();
      if (val) {
        for (const t of val.split(',').map(s => s.trim()).filter(Boolean)) {
          const mapped = convertGeminiToolName(t);
          if (mapped) tools.push(mapped);
        }
      } else { inAllowedTools = true; }
      continue;
    }
    // Skip disallowedTools (Gemini uses allowlist only)
    if (trimmed.startsWith('disallowedTools:')) { inDisallowedTools = true; inAllowedTools = false; continue; }
    if (inDisallowedTools) {
      if (trimmed.startsWith('- ')) continue;
      else if (trimmed && !trimmed.startsWith('-')) inDisallowedTools = false;
    }
    if (trimmed.startsWith('color:')) continue;
    if (trimmed.startsWith('permissionMode:')) continue;
    // maxTurns → max_turns
    if (trimmed.startsWith('maxTurns:')) {
      const val = trimmed.split(':').slice(1).join(':').trim();
      newLines.push(`max_turns: ${val}`);
      continue;
    }
    if (inAllowedTools) {
      if (trimmed.startsWith('- ')) {
        const mapped = convertGeminiToolName(trimmed.substring(2).trim());
        if (mapped) tools.push(mapped);
        continue;
      } else if (trimmed && !trimmed.startsWith('-')) { inAllowedTools = false; }
    }
    if (!inAllowedTools && !inDisallowedTools) newLines.push(line);
  }

  if (tools.length > 0) {
    newLines.push('tools:');
    for (const tool of tools) newLines.push(`  - ${tool}`);
  }

  const escapedBody = body.replace(/\$\{(\w+)\}/g, '$$$1');
  return `---\n${newLines.join('\n').trim()}\n---${stripSubTags(escapedBody)}`;
}

/**
 * Convert Claude SKILL.md to Gemini skill format.
 *
 * Gemini skills use YAML frontmatter with:
 *   name (required, must match dir), description (required)
 *
 * Nearly identical to Claude format — just strip Claude-only fields
 * and apply body replacements.
 */
function convertClaudeSkillToGemini(content, skillName) {
  let converted = applyGeminiBodyReplacements(content);
  // Gemini doesn't document a SKILL_DIR variable — use relative paths
  converted = converted.replace(/\$\{CLAUDE_SKILL_DIR\}/g, '.');

  if (!converted.startsWith('---')) {
    return `---\nname: ${skillName}\ndescription: GSP skill\n---\n${converted}`;
  }
  const endIndex = converted.indexOf('---', 3);
  if (endIndex === -1) {
    return `---\nname: ${skillName}\ndescription: GSP skill\n---\n${converted}`;
  }

  const frontmatter = converted.substring(3, endIndex).trim();
  const body = converted.substring(endIndex + 3);
  const newLines = [];
  let hasName = false;
  let hasDescription = false;
  let inList = false;

  for (const line of frontmatter.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('name:')) {
      newLines.push(`name: ${skillName}`);
      hasName = true; inList = false; continue;
    }
    if (trimmed.startsWith('description:')) { newLines.push(line); hasDescription = true; inList = false; continue; }
    // Drop Claude-only fields
    if (trimmed.startsWith('allowed-tools:')) { inList = true; continue; }
    if (trimmed.startsWith('disable-model-invocation:')) { inList = false; continue; }
    if (trimmed.startsWith('user-invocable:')) { inList = false; continue; }
    if (trimmed.startsWith('argument-hint:')) { inList = false; continue; }
    if (trimmed.startsWith('color:')) { inList = false; continue; }
    if (trimmed.startsWith('context:')) { inList = false; continue; }
    if (trimmed.startsWith('agent:')) { inList = false; continue; }
    if (inList) {
      if (trimmed.startsWith('- ')) continue;
      else if (trimmed && !trimmed.startsWith('-')) inList = false;
    }
    if (!inList) newLines.push(line);
  }

  if (!hasName) newLines.unshift(`name: ${skillName}`);
  if (!hasDescription) newLines.splice(1, 0, 'description: GSP skill');

  return `---\n${newLines.join('\n').trim()}\n---${stripSubTags(body)}`;
}

/**
 * Shared body-level replacements for all Codex conversions.
 * Codex uses $skill-name for invocation and AGENTS.md for context.
 */
function applyCodexBodyReplacements(content) {
  let converted = content;
  converted = converted.replace(/\/gsp:/g, '$gsp-');
  converted = converted.replace(/~\/\.claude\b/g, '~/.codex');
  converted = converted.replace(/\bAskUserQuestion\b/g, 'ask the user');
  converted = converted.replace(/\bSlashCommand\b/g, 'skill');
  converted = converted.replace(/\bTodoWrite\b/g, 'todowrite');
  // Codex multi-agent uses direct prompting to spawn agents
  converted = converted.replace(/Spawn the (`gsp-[a-z-]+`) agent/g, 'Spawn a worker agent for $1');
  converted = converted.replace(/spawn the (`gsp-[a-z-]+`) agent/g, 'spawn a worker agent for $1');
  converted = converted.replace(/Re-spawn the agent/g, 'Spawn another worker agent');
  converted = converted.replace(/re-spawn the agent/g, 'spawn another worker agent');
  return converted;
}

/**
 * Convert Claude SKILL.md to Codex skill format.
 *
 * Codex expects: .agents/skills/<name>/SKILL.md
 * YAML frontmatter with name (required) and description (required).
 * Strips Claude-only fields, applies body replacements.
 */
function convertClaudeSkillToCodex(content, skillName) {
  let converted = applyCodexBodyReplacements(content);
  // Codex doesn't have a SKILL_DIR variable — use relative paths
  converted = converted.replace(/\$\{CLAUDE_SKILL_DIR\}/g, '.');

  if (!converted.startsWith('---')) {
    return `---\nname: ${skillName}\ndescription: GSP skill\n---\n${converted}`;
  }
  const endIndex = converted.indexOf('---', 3);
  if (endIndex === -1) {
    return `---\nname: ${skillName}\ndescription: GSP skill\n---\n${converted}`;
  }

  const frontmatter = converted.substring(3, endIndex).trim();
  const body = converted.substring(endIndex + 3);
  const newLines = [];
  let hasName = false;
  let hasDescription = false;
  let inList = false;

  for (const line of frontmatter.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('name:')) {
      newLines.push(`name: ${skillName}`);
      hasName = true; inList = false; continue;
    }
    if (trimmed.startsWith('description:')) { newLines.push(line); hasDescription = true; inList = false; continue; }
    // Drop Claude-only fields
    if (trimmed.startsWith('allowed-tools:')) { inList = true; continue; }
    if (trimmed.startsWith('disable-model-invocation:')) { inList = false; continue; }
    if (trimmed.startsWith('user-invocable:')) { inList = false; continue; }
    if (trimmed.startsWith('argument-hint:')) { inList = false; continue; }
    if (trimmed.startsWith('color:')) { inList = false; continue; }
    if (trimmed.startsWith('context:')) { inList = false; continue; }
    if (trimmed.startsWith('agent:')) { inList = false; continue; }
    if (inList) {
      if (trimmed.startsWith('- ')) continue;
      else if (trimmed && !trimmed.startsWith('-')) inList = false;
    }
    if (!inList) newLines.push(line);
  }

  if (!hasName) newLines.unshift(`name: ${skillName}`);
  if (!hasDescription) newLines.splice(1, 0, 'description: GSP skill');

  return `---\n${newLines.join('\n').trim()}\n---${body}`;
}

// ──────────────────────────────────────────────────────
// File copy helpers
// ──────────────────────────────────────────────────────

/**
 * Copy skills to OpenCode skill structure.
 * skills/<name>/SKILL.md → skills/<name>/SKILL.md
 *
 * OpenCode expects: .opencode/skills/<name>/SKILL.md or ~/.config/opencode/skills/<name>/SKILL.md
 * YAML frontmatter with name (required, must match dir), description (required).
 * Also copies any sibling files in the skill directory (scripts, references, assets).
 */
function copyOpencodeSkills(srcDir, destDir, pathPrefix) {
  if (!fs.existsSync(srcDir)) return 0;
  fs.mkdirSync(destDir, { recursive: true });

  // Clean old gsp- skill dirs
  if (fs.existsSync(destDir)) {
    for (const entry of fs.readdirSync(destDir, { withFileTypes: true })) {
      if (entry.isDirectory() && entry.name.startsWith('gsp-')) {
        fs.rmSync(path.join(destDir, entry.name), { recursive: true });
      }
    }
  }

  let count = 0;
  const skillDirs = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const dir of skillDirs) {
    if (!dir.isDirectory()) continue;

    const skillMd = path.join(srcDir, dir.name, 'SKILL.md');
    if (!fs.existsSync(skillMd)) continue;

    // OpenCode skill names: lowercase, hyphens, no consecutive hyphens, 1-64 chars
    // Prefix with gsp- so they don't collide, unless already prefixed
    const skillName = dir.name.startsWith('gsp-') ? dir.name : `gsp-${dir.name}`;
    const skillDest = path.join(destDir, skillName);
    fs.mkdirSync(skillDest, { recursive: true });

    let content = fs.readFileSync(skillMd, 'utf8');
    content = content.replace(/~\/\.claude\//g, pathPrefix);
    content = content.replace(/\.\/\.claude\//g, './.opencode/');
    content = convertClaudeSkillToOpencode(content, skillName);
    fs.writeFileSync(path.join(skillDest, 'SKILL.md'), content);
    count++;
  }

  return count;
}

/**
 * Copy skills/ source to Codex skill structure.
 * skills/<name>/SKILL.md → .agents/skills/gsp-<name>/SKILL.md
 *
 * Codex expects: .agents/skills/<name>/SKILL.md with YAML frontmatter (name + description).
 */
function copyCodexSkillsFromSource(srcDir, destDir, pathPrefix) {
  if (!fs.existsSync(srcDir)) return 0;
  fs.mkdirSync(destDir, { recursive: true });

  let count = 0;
  const skillDirs = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const dir of skillDirs) {
    if (!dir.isDirectory()) continue;
    const skillMd = path.join(srcDir, dir.name, 'SKILL.md');
    if (!fs.existsSync(skillMd)) continue;

    const skillName = dir.name.startsWith('gsp-') ? dir.name : `gsp-${dir.name}`;
    const skillDest = path.join(destDir, skillName);
    fs.mkdirSync(skillDest, { recursive: true });

    let content = fs.readFileSync(skillMd, 'utf8');
    content = content.replace(/~\/\.claude\//g, pathPrefix);
    content = convertClaudeSkillToCodex(content, skillName);
    fs.writeFileSync(path.join(skillDest, 'SKILL.md'), content);
    count++;
  }
  return count;
}

/**
 * Copy skills/ source to Gemini skill structure.
 * skills/<name>/SKILL.md → .gemini/skills/gsp-<name>/SKILL.md
 *
 * Gemini expects: .gemini/skills/<name>/SKILL.md with YAML frontmatter (name + description).
 */
function copyGeminiSkills(srcDir, destDir, pathPrefix) {
  if (!fs.existsSync(srcDir)) return 0;
  fs.mkdirSync(destDir, { recursive: true });

  // Clean old gsp- skill dirs
  if (fs.existsSync(destDir)) {
    for (const entry of fs.readdirSync(destDir, { withFileTypes: true })) {
      if (entry.isDirectory() && entry.name.startsWith('gsp-')) {
        fs.rmSync(path.join(destDir, entry.name), { recursive: true });
      }
    }
  }

  let count = 0;
  const skillDirs = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const dir of skillDirs) {
    if (!dir.isDirectory()) continue;
    const skillMd = path.join(srcDir, dir.name, 'SKILL.md');
    if (!fs.existsSync(skillMd)) continue;

    const skillName = dir.name.startsWith('gsp-') ? dir.name : `gsp-${dir.name}`;
    const skillDest = path.join(destDir, skillName);
    fs.mkdirSync(skillDest, { recursive: true });

    let content = fs.readFileSync(skillMd, 'utf8');
    content = content.replace(/~\/\.claude\//g, pathPrefix);
    content = content.replace(/\.\/\.claude\//g, './.gemini/');
    content = convertClaudeSkillToGemini(content, skillName);
    fs.writeFileSync(path.join(skillDest, 'SKILL.md'), content);
    count++;
  }
  return count;
}

/**
 * Recursively copy directory with path replacement and runtime conversion
 */
function copyWithPathReplacement(srcDir, destDir, pathPrefix, runtime) {
  const dirName = getDirName(runtime);

  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true });
  }
  fs.mkdirSync(destDir, { recursive: true });

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyWithPathReplacement(srcPath, destPath, pathPrefix, runtime);
    } else if (entry.name.endsWith('.md')) {
      let content = fs.readFileSync(srcPath, 'utf8');
      content = content.replace(/~\/\.claude\//g, pathPrefix);
      content = content.replace(/\.\/\.claude\//g, `./${dirName}/`);

      if (runtime === 'opencode') {
        content = applyOpencodeBodyReplacements(content);
      } else if (runtime === 'gemini') {
        content = applyGeminiBodyReplacements(content);
      } else if (runtime === 'codex') {
        content = applyCodexBodyReplacements(content);
      }
      fs.writeFileSync(destPath, content);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Check if we're running a local install inside the GSP source repo.
 * When true, we symlink instead of copying so edits to agents/ and commands/
 * are immediately reflected in .claude/ — no sync needed.
 */
function isGspSourceRepo(dir) {
  try {
    const p = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
    return p.name === 'get-shit-pretty';
  } catch { return false; }
}

/**
 * Create a symlink, removing any existing file/symlink at the destination.
 */
function forceSymlink(target, linkPath) {
  try { fs.unlinkSync(linkPath); } catch {}
  fs.symlinkSync(target, linkPath);
}

/**
 * Install using symlinks for Claude Code local installs in the GSP source repo.
 * Returns true if symlink install was performed, false if caller should fall back to copy.
 */
function installLocalSymlinks(targetDir, src) {
  const cwd = process.cwd();
  if (!isGspSourceRepo(cwd)) return false;

  const gspRoot = path.join(src, 'gsp');
  if (!fs.existsSync(gspRoot)) {
    console.error(`\n  ${c.error}GSP content not found at ${gspRoot}${reset}`);
    console.error(`  ${c.secondary}Run from the repo root or reinstall the package.${reset}\n`);
    return false;
  }

  const failures = [];

  // ── Agent symlinks (per-file, since agents/ dir is shared with other tools) ──
  const agentsDest = path.join(targetDir, 'agents');
  fs.mkdirSync(agentsDest, { recursive: true });

  // Clean old GSP agent files/symlinks
  for (const file of fs.readdirSync(agentsDest)) {
    if (file.startsWith('gsp-') && file.endsWith('.md')) {
      fs.unlinkSync(path.join(agentsDest, file));
    }
  }

  const agentsSrc = path.join(gspRoot, 'agents');
  let agentCount = 0;
  for (const file of fs.readdirSync(agentsSrc)) {
    if (file.startsWith('gsp-') && file.endsWith('.md')) {
      forceSymlink(path.join('..', '..', 'gsp', 'agents', file), path.join(agentsDest, file));
      agentCount++;
    }
  }

  // ── Custom agents (agents/custom/) ──
  const customAgentsSrc = path.join(gspRoot, 'agents', 'custom');
  let customAgentCount = 0;
  if (fs.existsSync(customAgentsSrc)) {
    for (const file of fs.readdirSync(customAgentsSrc)) {
      if (file.endsWith('.md') && file !== '.gitkeep') {
        forceSymlink(path.join('..', '..', 'gsp', 'agents', 'custom', file), path.join(agentsDest, file));
        customAgentCount++;
      }
    }
  }

  if (agentCount > 0) {
    const msg = customAgentCount > 0
      ? `Symlinked ${agentCount} agents + ${customAgentCount} custom`
      : `Symlinked ${agentCount} agents`;
    console.log(`  ${c.success}✓${c.reset} ${msg}`);
  } else { failures.push('agents'); }

  // ── Skill symlinks (per-dir, since skills/ dir is shared with other tools) ──
  const skillsDest = path.join(targetDir, 'skills');
  fs.mkdirSync(skillsDest, { recursive: true });

  // Clean old GSP skill dirs
  for (const entry of fs.readdirSync(skillsDest, { withFileTypes: true })) {
    if (entry.isDirectory() && (entry.name.startsWith('gsp-') || entry.name === 'get-shit-pretty')) {
      fs.rmSync(path.join(skillsDest, entry.name), { recursive: true });
    }
  }

  const skillsSrc = path.join(gspRoot, 'skills');
  let skillCount = 0;
  for (const dir of fs.readdirSync(skillsSrc, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    forceSymlink(path.join('..', '..', 'gsp', 'skills', dir.name), path.join(skillsDest, dir.name));
    skillCount++;
  }
  if (skillCount > 0) {
    console.log(`  ${c.success}✓${c.reset} Symlinked ${skillCount} skills`);
  } else { failures.push('skills'); }

  // Clean up legacy commands/gsp dir (may be broken symlink)
  const legacyCommandsGsp = path.join(targetDir, 'commands', 'gsp');
  try {
    fs.lstatSync(legacyCommandsGsp);
    fs.rmSync(legacyCommandsGsp, { recursive: true });
    console.log(`  ${c.success}✓${c.reset} Removed legacy commands/gsp`);
  } catch {}

  // ── Bundle symlinks (prompts, templates, references → runtime root) ──
  // Clean up legacy get-shit-pretty/ bundle dir
  const legacyBundleDest = path.join(targetDir, 'get-shit-pretty');
  if (fs.existsSync(legacyBundleDest)) {
    fs.rmSync(legacyBundleDest, { recursive: true });
    console.log(`  ${c.success}✓${c.reset} Removed legacy get-shit-pretty/ bundle`);
  }

  for (const dir of ['prompts', 'templates', 'references']) {
    if (fs.existsSync(path.join(gspRoot, dir))) {
      forceSymlink(path.join('..', 'gsp', dir), path.join(targetDir, dir));
      console.log(`  ${c.success}✓${c.reset} Symlinked ${dir}/`);
    }
  }

  // Write VERSION from package.json (local dev uses repo root VERSION via symlinks)
  fs.writeFileSync(path.join(targetDir, 'VERSION'), pkg.version);
  console.log(`  ${c.success}✓${c.reset} Wrote VERSION (${pkg.version})`);

  // ── Statusline ──
  const hooksDest = path.join(targetDir, 'hooks');
  fs.mkdirSync(hooksDest, { recursive: true });
  const statuslineSrc = path.join(src, 'scripts', 'gsp-statusline.js');
  if (fs.existsSync(statuslineSrc)) {
    let content = fs.readFileSync(statuslineSrc, 'utf8');
    content = content.replace(/'\.claude'/g, getConfigDirFromHome('claude', false));
    fs.writeFileSync(path.join(hooksDest, 'gsp-statusline.js'), content);
    console.log(`  ${c.success}✓${c.reset} Installed GSP statusline`);
  }
  const dispatcherSrc = path.join(src, 'scripts', 'statusline-dispatcher.js');
  if (fs.existsSync(dispatcherSrc)) {
    fs.copyFileSync(dispatcherSrc, path.join(hooksDest, 'statusline-dispatcher.js'));
    console.log(`  ${c.success}✓${c.reset} Installed statusline dispatcher`);
  }

  if (failures.length > 0) {
    console.error(`\n  ${yellow}Installation incomplete!${reset} Failed: ${failures.join(', ')}`);
    process.exit(1);
  }

  return true;
}

function verifyInstalled(dirPath, description) {
  if (!fs.existsSync(dirPath)) {
    console.error(`  ${yellow}!${reset} Failed to install ${description}: directory not created`);
    return false;
  }
  try {
    if (fs.readdirSync(dirPath).length === 0) {
      console.error(`  ${yellow}!${reset} Failed to install ${description}: directory is empty`);
      return false;
    }
  } catch (e) {
    console.error(`  ${yellow}!${reset} Failed to install ${description}: ${e.message}`);
    return false;
  }
  return true;
}

// ──────────────────────────────────────────────────────
// Install
// ──────────────────────────────────────────────────────

function install(isGlobal, runtime = 'claude') {
  const isOpencode = runtime === 'opencode';
  const isGemini = runtime === 'gemini';
  const isCodex = runtime === 'codex';
  const dirName = getDirName(runtime);
  const src = path.join(__dirname, '..');
  const gspRoot = path.join(src, 'gsp');
  if (!fs.existsSync(gspRoot)) {
    console.error(`\n  ${c.error}GSP content not found at ${gspRoot}${reset}`);
    console.error(`  ${c.secondary}Reinstall the package or run from the get-shit-pretty repo root.${reset}\n`);
    process.exit(1);
  }

  const targetDir = isGlobal
    ? getGlobalDir(runtime, explicitConfigDir)
    : path.join(process.cwd(), dirName);

  const locationLabel = isGlobal
    ? targetDir.replace(os.homedir(), '~')
    : targetDir.replace(process.cwd(), '.');

  const pathPrefix = isGlobal
    ? `${targetDir.replace(/\\/g, '/')}/`
    : `./${dirName}/`;

  const runtimeLabel = getRuntimeLabel(runtime);
  console.log(`\n  ${c.secondary}installing for${c.reset} ${c.primary}${runtimeLabel}${c.reset} ${c.secondary}to${c.reset} ${c.primary}${locationLabel}${c.reset}\n`);

  // Local Claude install in GSP source repo → use symlinks
  if (!isGlobal && runtime === 'claude' && installLocalSymlinks(targetDir, src)) {
    console.log(`  ${c.dim}(symlinked — edits to gsp/agents/ and gsp/skills/ are reflected immediately)${c.reset}`);
    const settingsPath = path.join(targetDir, 'settings.json');
    const settings = readSettings(settingsPath);
    const statuslineCommand = `node ${dirName}/hooks/statusline-dispatcher.js`;
    return { settingsPath, settings, statuslineCommand, runtime };
  }

  const failures = [];

  // ── Skills (all runtimes) ──
  if (isOpencode) {
    const skillsDir = path.join(targetDir, 'skills');
    const skillCount = copyOpencodeSkills(path.join(gspRoot, 'skills'), skillsDir, pathPrefix);
    if (skillCount > 0) {
      console.log(`  ${c.success}✓${c.reset} Installed ${skillCount} skills to skills/`);
    } else { failures.push('skills'); }

    // Clean up legacy commands from previous installs
    const commandsDir = path.join(targetDir, 'commands');
    if (fs.existsSync(commandsDir)) {
      let cleaned = 0;
      for (const file of fs.readdirSync(commandsDir)) {
        if (file.startsWith('gsp-') && file.endsWith('.md')) {
          fs.unlinkSync(path.join(commandsDir, file));
          cleaned++;
        }
      }
      if (cleaned > 0) console.log(`  ${c.success}✓${c.reset} Removed ${cleaned} legacy commands`);
    }
  } else if (isCodex) {
    // Codex discovers skills at .agents/skills/, NOT .codex/skills/
    const skillsDir = getCodexSkillsDir(isGlobal);
    const skillCount = copyCodexSkillsFromSource(path.join(gspRoot, 'skills'), skillsDir, pathPrefix);
    if (skillCount > 0) {
      console.log(`  ${c.success}✓${c.reset} Installed ${skillCount} skills to .agents/skills/`);
    } else { failures.push('skills'); }
  } else if (isGemini) {
    const skillsDir = path.join(targetDir, 'skills');
    const skillCount = copyGeminiSkills(path.join(gspRoot, 'skills'), skillsDir, pathPrefix);
    if (skillCount > 0) {
      console.log(`  ${c.success}✓${c.reset} Installed ${skillCount} skills to skills/`);
    } else { failures.push('skills'); }

    // Clean up legacy TOML commands from previous installs
    const legacyCmds = path.join(targetDir, 'commands', 'gsp');
    if (fs.existsSync(legacyCmds)) {
      fs.rmSync(legacyCmds, { recursive: true });
      console.log(`  ${c.success}✓${c.reset} Removed legacy commands/gsp/`);
    }
  } else {
    // Claude Code — install skills (copies for global, symlinks handled above for local)
    const skillsDir = path.join(targetDir, 'skills');
    fs.mkdirSync(skillsDir, { recursive: true });

    // Clean old gsp- skill dirs
    for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
      if (entry.isDirectory() && (entry.name.startsWith('gsp-') || entry.name === 'get-shit-pretty')) {
        fs.rmSync(path.join(skillsDir, entry.name), { recursive: true });
      }
    }

    const skillsSrc = path.join(gspRoot, 'skills');
    if (fs.existsSync(skillsSrc)) {
      let skillCount = 0;
      for (const dir of fs.readdirSync(skillsSrc, { withFileTypes: true })) {
        if (!dir.isDirectory()) continue;
        const skillMd = path.join(skillsSrc, dir.name, 'SKILL.md');
        if (!fs.existsSync(skillMd)) continue;
        const destSkillDir = path.join(skillsDir, dir.name);
        fs.mkdirSync(destSkillDir, { recursive: true });
        // Copy SKILL.md with path replacement
        let content = fs.readFileSync(skillMd, 'utf8');
        content = content.replace(/~\/\.claude\//g, pathPrefix);
        fs.writeFileSync(path.join(destSkillDir, 'SKILL.md'), content);
        skillCount++;
      }
      if (skillCount > 0) {
        console.log(`  ${c.success}✓${c.reset} Installed ${skillCount} skills`);
      } else { failures.push('skills'); }
    }

    // Clean up legacy commands/gsp from previous installs
    const legacyCmds = path.join(targetDir, 'commands', 'gsp');
    if (fs.existsSync(legacyCmds)) {
      fs.rmSync(legacyCmds, { recursive: true });
      console.log(`  ${c.success}✓${c.reset} Removed legacy commands/gsp/`);
    }
  }

  // ── Agents ──
  // Codex agents are TOML config sections, not .md files — skip file installation
  if (!isCodex) {
    const agentsSrc = path.join(gspRoot, 'agents');
    if (fs.existsSync(agentsSrc)) {
      const agentsDest = path.join(targetDir, 'agents');
      fs.mkdirSync(agentsDest, { recursive: true });

      // Remove old GSP agents before copying new ones
      if (fs.existsSync(agentsDest)) {
        for (const file of fs.readdirSync(agentsDest)) {
          if (file.startsWith('gsp-') && file.endsWith('.md')) {
            fs.unlinkSync(path.join(agentsDest, file));
          }
        }
      }

      const agentEntries = fs.readdirSync(agentsSrc, { withFileTypes: true });
      for (const entry of agentEntries) {
        if (entry.isFile() && entry.name.endsWith('.md')) {
          let content = fs.readFileSync(path.join(agentsSrc, entry.name), 'utf8');
          content = content.replace(/~\/\.claude\//g, pathPrefix);

          if (isOpencode) {
            content = convertClaudeToOpencodeAgent(content);
          } else if (isGemini) {
            content = convertClaudeToGeminiAgent(content);
          }
          fs.writeFileSync(path.join(agentsDest, entry.name), content);
        }
      }

      // ── Custom agents (agents/custom/) ──
      const customAgentsSrc = path.join(agentsSrc, 'custom');
      let customAgentCount = 0;
      if (fs.existsSync(customAgentsSrc)) {
        for (const entry of fs.readdirSync(customAgentsSrc, { withFileTypes: true })) {
          if (entry.isFile() && entry.name.endsWith('.md')) {
            let content = fs.readFileSync(path.join(customAgentsSrc, entry.name), 'utf8');
            content = content.replace(/~\/\.claude\//g, pathPrefix);

            if (isOpencode) {
              content = convertClaudeToOpencodeAgent(content);
            } else if (isGemini) {
              content = convertClaudeToGeminiAgent(content);
            }
            fs.writeFileSync(path.join(agentsDest, entry.name), content);
            customAgentCount++;
          }
        }
      }

      if (verifyInstalled(agentsDest, 'agents')) {
        const count = fs.readdirSync(agentsDest).filter(f => f.startsWith('gsp-')).length;
        const msg = customAgentCount > 0
          ? `Installed ${count} agents + ${customAgentCount} custom`
          : `Installed ${count} agents`;
        console.log(`  ${c.success}✓${c.reset} ${msg}`);
        if (isGemini) {
          console.log(`  ${c.dim}(agents require experimental.enableAgents: true in settings.json)${c.reset}`);
        }
      } else { failures.push('agents'); }
    }
  }

  // ── Bundle: prompts, templates, references → runtime root ──
  // Clean up legacy get-shit-pretty/ bundle dir from previous installs
  const legacyBundle = path.join(targetDir, 'get-shit-pretty');
  if (fs.existsSync(legacyBundle)) {
    fs.rmSync(legacyBundle, { recursive: true });
    console.log(`  ${c.success}✓${c.reset} Removed legacy get-shit-pretty/ bundle`);
  }

  const bundleDirs = ['prompts', 'templates', 'references'];
  for (const dir of bundleDirs) {
    const dirSrc = path.join(gspRoot, dir);
    if (fs.existsSync(dirSrc)) {
      copyWithPathReplacement(dirSrc, path.join(targetDir, dir), pathPrefix, runtime);
      if (verifyInstalled(path.join(targetDir, dir), dir)) {
        console.log(`  ${c.success}✓${c.reset} Installed ${dir}/`);
      } else { failures.push(dir); }
    }
  }

  // Write VERSION file
  fs.writeFileSync(path.join(targetDir, 'VERSION'), pkg.version);
  console.log(`  ${c.success}✓${c.reset} Wrote VERSION (${pkg.version})`);

  // ── Statusline (Claude Code only) ──
  if (runtime === 'claude') {
    const hooksDest = path.join(targetDir, 'hooks');
    fs.mkdirSync(hooksDest, { recursive: true });

    // Copy GSP statusline
    const statuslineSrc = path.join(src, 'scripts', 'gsp-statusline.js');
    if (fs.existsSync(statuslineSrc)) {
      let content = fs.readFileSync(statuslineSrc, 'utf8');
      content = content.replace(/'\.claude'/g, getConfigDirFromHome(runtime, isGlobal));
      fs.writeFileSync(path.join(hooksDest, 'gsp-statusline.js'), content);
      console.log(`  ${c.success}✓${c.reset} Installed GSP statusline`);
    }

    // Copy dispatcher (routes to GSP or GSD based on project type)
    const dispatcherSrc = path.join(src, 'scripts', 'statusline-dispatcher.js');
    if (fs.existsSync(dispatcherSrc)) {
      fs.copyFileSync(dispatcherSrc, path.join(hooksDest, 'statusline-dispatcher.js'));
      console.log(`  ${c.success}✓${c.reset} Installed statusline dispatcher`);
    }
  }

  if (failures.length > 0) {
    console.error(`\n  ${yellow}Installation incomplete!${reset} Failed: ${failures.join(', ')}`);
    process.exit(1);
  }

  // ── Settings (Claude Code & Gemini only) ──
  const settingsPath = path.join(targetDir, 'settings.json');
  const settings = readSettings(settingsPath);

  const statuslineCommand = isGlobal
    ? `node "${targetDir.replace(/\\/g, '/')}/hooks/statusline-dispatcher.js"`
    : `node ${dirName}/hooks/statusline-dispatcher.js`;

  return { settingsPath, settings, statuslineCommand, runtime };
}

// ──────────────────────────────────────────────────────
// Uninstall
// ──────────────────────────────────────────────────────

function uninstall(isGlobal, runtime = 'claude') {
  const isOpencode = runtime === 'opencode';
  const isGemini = runtime === 'gemini';
  const isCodex = runtime === 'codex';
  const dirName = getDirName(runtime);

  const targetDir = isGlobal
    ? getGlobalDir(runtime, explicitConfigDir)
    : path.join(process.cwd(), dirName);

  const locationLabel = isGlobal
    ? targetDir.replace(os.homedir(), '~')
    : targetDir.replace(process.cwd(), '.');

  const runtimeLabel = getRuntimeLabel(runtime);
  console.log(`  Uninstalling GSP from ${cyan}${runtimeLabel}${reset} at ${cyan}${locationLabel}${reset}\n`);

  if (!fs.existsSync(targetDir)) {
    console.log(`  ${yellow}!${reset} Directory does not exist: ${locationLabel}`);
    console.log(`  Nothing to uninstall.\n`);
    return;
  }

  let removedCount = 0;

  // Remove skills
  if (isCodex) {
    // Codex discovers skills at .agents/skills/, NOT .codex/skills/
    const skillsDir = getCodexSkillsDir(isGlobal);
    if (fs.existsSync(skillsDir)) {
      for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
        if (entry.isDirectory() && entry.name.startsWith('gsp-')) {
          fs.rmSync(path.join(skillsDir, entry.name), { recursive: true });
          removedCount++;
        }
      }
      if (removedCount > 0) console.log(`  ${c.success}✓${c.reset} Removed GSP skills from .agents/skills/`);
    }
    // Migration: clean old .codex/skills/ path from pre-fix installs
    const oldSkillsDir = path.join(targetDir, 'skills');
    if (fs.existsSync(oldSkillsDir)) {
      for (const entry of fs.readdirSync(oldSkillsDir, { withFileTypes: true })) {
        if (entry.isDirectory() && entry.name.startsWith('gsp-')) {
          fs.rmSync(path.join(oldSkillsDir, entry.name), { recursive: true });
        }
      }
    }
    // Clean up legacy agent .md files from previous installs
    const agentsDir = path.join(targetDir, 'agents');
    if (fs.existsSync(agentsDir)) {
      let agentCount = 0;
      for (const file of fs.readdirSync(agentsDir)) {
        if (file.startsWith('gsp-') && file.endsWith('.md')) {
          fs.unlinkSync(path.join(agentsDir, file));
          agentCount++;
        }
      }
      if (agentCount > 0) {
        removedCount++;
        console.log(`  ${c.success}✓${c.reset} Removed ${agentCount} legacy GSP agent files`);
      }
    }
  } else {
    // All other runtimes: remove gsp- skill dirs
    const skillsDir = path.join(targetDir, 'skills');
    if (fs.existsSync(skillsDir)) {
      let skillCount = 0;
      for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
        if (entry.isDirectory() && (entry.name.startsWith('gsp-') || entry.name === 'get-shit-pretty')) {
          fs.rmSync(path.join(skillsDir, entry.name), { recursive: true });
          skillCount++;
        }
      }
      if (skillCount > 0) {
        removedCount++;
        console.log(`  ${c.success}✓${c.reset} Removed ${skillCount} GSP skills`);
      }
    }
  }

  // Remove legacy commands (from previous installs)
  for (const cmdPath of [
    path.join(targetDir, 'commands', 'gsp'),
    ...(['commands', 'command'].map(d => path.join(targetDir, d)))
  ]) {
    if (fs.existsSync(cmdPath)) {
      // For commands/gsp dir, remove entirely; for commands/ and command/ roots, remove gsp- files only
      if (cmdPath.endsWith('gsp')) {
        fs.rmSync(cmdPath, { recursive: true });
        removedCount++;
        console.log(`  ${c.success}✓${c.reset} Removed legacy commands/gsp/`);
      } else {
        for (const file of fs.readdirSync(cmdPath)) {
          if (file.startsWith('gsp-') && (file.endsWith('.md') || file.endsWith('.toml'))) {
            fs.unlinkSync(path.join(cmdPath, file));
            removedCount++;
          }
        }
      }
    }
  }

  // Remove legacy get-shit-pretty/ bundle dir (now flattened to runtime root)
  const gspDir = path.join(targetDir, 'get-shit-pretty');
  if (fs.existsSync(gspDir)) {
    fs.rmSync(gspDir, { recursive: true });
    removedCount++;
    console.log(`  ${c.success}✓${c.reset} Removed legacy get-shit-pretty/`);
  }

  // Remove flattened bundle dirs
  for (const dir of ['prompts', 'templates', 'references']) {
    const bundlePath = path.join(targetDir, dir);
    if (fs.existsSync(bundlePath)) {
      fs.rmSync(bundlePath, { recursive: true });
      removedCount++;
      console.log(`  ${c.success}✓${c.reset} Removed ${dir}/`);
    }
  }

  // Remove VERSION file
  const versionFile = path.join(targetDir, 'VERSION');
  if (fs.existsSync(versionFile)) {
    fs.unlinkSync(versionFile);
    removedCount++;
  }

  // Remove GSP agents (skip Codex — agents are TOML config, not .md files)
  if (!isCodex) {
    const agentsDir = path.join(targetDir, 'agents');
    if (fs.existsSync(agentsDir)) {
      let agentCount = 0;
      for (const file of fs.readdirSync(agentsDir)) {
        if (file.startsWith('gsp-') && file.endsWith('.md')) {
          fs.unlinkSync(path.join(agentsDir, file));
          agentCount++;
        }
      }
      if (agentCount > 0) {
        removedCount++;
        console.log(`  ${c.success}✓${c.reset} Removed ${agentCount} GSP agents`);
      }
    }
  }

  // Remove statusline hooks
  for (const hook of ['gsp-statusline.js', 'statusline-dispatcher.js']) {
    const hookPath = path.join(targetDir, 'hooks', hook);
    if (fs.existsSync(hookPath)) {
      fs.unlinkSync(hookPath);
      removedCount++;
      console.log(`  ${c.success}✓${c.reset} Removed ${hook}`);
    }
  }

  // Clean up settings.json (statusline only — no hooks to clean)
  const settingsPath = path.join(targetDir, 'settings.json');
  if (fs.existsSync(settingsPath)) {
    const settings = readSettings(settingsPath);
    let modified = false;

    if (settings.statusLine && settings.statusLine.command &&
        (settings.statusLine.command.includes('gsp-statusline') || settings.statusLine.command.includes('statusline-dispatcher'))) {
      delete settings.statusLine;
      modified = true;
      console.log(`  ${c.success}✓${c.reset} Removed GSP statusline from settings`);
    }

    if (modified) {
      writeSettings(settingsPath, settings);
      removedCount++;
    }
  }

  if (removedCount === 0) {
    console.log(`  ${yellow}!${reset} No GSP files found to remove.`);
  }

  console.log(`\n  ${c.success}done.${c.reset} ${c.secondary}GSP has been uninstalled from ${runtimeLabel}.${c.reset}\n  ${c.secondary}Your other files and settings have been preserved.${c.reset}\n`);
}

// ──────────────────────────────────────────────────────
// Statusline handling
// ──────────────────────────────────────────────────────

function handleStatusline(settings, isInteractive, callback) {
  const hasExisting = settings.statusLine != null;

  if (!hasExisting) { callback(true); return; }
  if (forceStatusline) { callback(true); return; }

  if (!isInteractive) {
    console.log(`  ${yellow}!${reset} Skipping statusline (already configured)`);
    console.log(`    Use ${cyan}--force-statusline${reset} to replace\n`);
    callback(false);
    return;
  }

  const existingCmd = settings.statusLine.command || settings.statusLine.url || '(custom)';
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log(`\n  ${yellow}!${reset} Existing statusline detected\n
  Your current statusline:
    ${dim}command: ${existingCmd}${reset}

  GSP includes a statusline showing:
    * Model name
    * Current design phase + prettiness meter
    * Context window usage (color-coded)

  ${cyan}1${reset}) Keep existing
  ${cyan}2${reset}) Replace with GSP statusline\n`);

  rl.question(`  Choice ${dim}[1]${reset}: `, (answer) => {
    rl.close();
    callback((answer.trim() || '1') === '2');
  });
}

let onboardingShown = false;

function finishInstall(settingsPath, settings, statuslineCommand, shouldInstallStatusline, runtime = 'claude', isGlobal = true) {
  const isOpencode = runtime === 'opencode';
  const isCodex = runtime === 'codex';

  // Only Claude Code and Gemini support statusline
  if (shouldInstallStatusline && !isOpencode && !isCodex) {
    settings.statusLine = {
      type: 'command',
      command: statuslineCommand
    };
    console.log(`  ${c.success}✓${c.reset} Configured statusline`);
  }

  // Write settings for Claude/Gemini (they use settings.json)
  if (!isOpencode && !isCodex) {
    writeSettings(settingsPath, settings);
  }

  const runtimeLabel = getRuntimeLabel(runtime);
  const helpCmd = isOpencode ? '/gsp-help' : isCodex ? '$gsp-help' : '/gsp:help';
  const newCmd = isOpencode ? '/gsp-start' : isCodex ? '$gsp-start' : '/gsp:start';

  // Show onboarding once (not per-runtime)
  if (!onboardingShown && !hasQuiet) {
    onboardingShown = true;
    console.log(`
  ${c.bold}Get started:${c.reset}
    ${c.accent}${newCmd}${c.reset}     ${c.secondary}start here — brand, project, or both${c.reset}
    ${c.accent}${helpCmd}${c.reset}      ${c.secondary}all commands${c.reset}
`);
  }
}

// ──────────────────────────────────────────────────────
// Interactive prompts
// ──────────────────────────────────────────────────────

function promptRuntime(callback) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  let answered = false;

  rl.on('close', () => {
    if (!answered) { answered = true; console.log(`\n  ${yellow}Installation cancelled${reset}\n`); process.exit(0); }
  });

  console.log(`  ${yellow}Which runtime(s) would you like to install for?${reset}\n
  ${cyan}1${reset}) Claude Code ${dim}(~/.claude)${reset}
  ${cyan}2${reset}) OpenCode    ${dim}(~/.config/opencode)${reset}
  ${cyan}3${reset}) Gemini      ${dim}(~/.gemini)${reset}
  ${cyan}4${reset}) Codex       ${dim}(~/.codex)${reset}
  ${cyan}5${reset}) All\n`);

  rl.question(`  Choice ${dim}[1]${reset}: `, (answer) => {
    answered = true;
    rl.close();
    const choice = answer.trim() || '1';
    if (choice === '5') callback(['claude', 'opencode', 'gemini', 'codex']);
    else if (choice === '4') callback(['codex']);
    else if (choice === '3') callback(['gemini']);
    else if (choice === '2') callback(['opencode']);
    else callback(['claude']);
  });
}

function promptLocation(runtimes) {
  if (!process.stdin.isTTY) {
    console.log(`  ${yellow}Non-interactive terminal detected, defaulting to global install${reset}\n`);
    installAllRuntimes(runtimes, true, false);
    return;
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  let answered = false;

  rl.on('close', () => {
    if (!answered) { answered = true; console.log(`\n  ${yellow}Installation cancelled${reset}\n`); process.exit(0); }
  });

  const pathExamples = runtimes.map(r => getGlobalDir(r, explicitConfigDir).replace(os.homedir(), '~')).join(', ');
  const localExamples = runtimes.map(r => `./${getDirName(r)}`).join(', ');

  console.log(`  ${yellow}Where would you like to install?${reset}\n
  ${cyan}1${reset}) Global ${dim}(${pathExamples})${reset} - available in all projects
  ${cyan}2${reset}) Local  ${dim}(${localExamples})${reset} - this project only\n`);

  rl.question(`  Choice ${dim}[1]${reset}: `, (answer) => {
    answered = true;
    rl.close();
    const isGlobal = (answer.trim() || '1') !== '2';
    installAllRuntimes(runtimes, isGlobal, true);
  });
}

function installAllRuntimes(runtimes, isGlobal, isInteractive) {
  const results = [];
  for (const runtime of runtimes) {
    results.push(install(isGlobal, runtime));
  }

  // Handle statusline for Claude & Gemini
  const claudeResult = results.find(r => r.runtime === 'claude');
  const geminiResult = results.find(r => r.runtime === 'gemini');

  if (claudeResult || geminiResult) {
    const primaryResult = claudeResult || geminiResult;
    handleStatusline(primaryResult.settings, isInteractive, (shouldInstallStatusline) => {
      for (const result of results) {
        finishInstall(result.settingsPath, result.settings, result.statuslineCommand, shouldInstallStatusline, result.runtime, isGlobal);
      }
    });
  } else {
    for (const result of results) {
      finishInstall(result.settingsPath, result.settings, result.statuslineCommand, false, result.runtime, isGlobal);
    }
  }
}

// ──────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────

if (hasGlobal && hasLocal) {
  console.error(`  ${yellow}Cannot specify both --global and --local${reset}`);
  process.exit(1);
} else if (explicitConfigDir && hasLocal) {
  console.error(`  ${yellow}Cannot use --config-dir with --local${reset}`);
  process.exit(1);
} else if (hasUninstall) {
  if (!hasGlobal && !hasLocal) {
    console.error(`  ${yellow}--uninstall requires --global or --local${reset}`);
    process.exit(1);
  }
  const runtimes = selectedRuntimes.length > 0 ? selectedRuntimes : ['claude'];
  for (const runtime of runtimes) {
    uninstall(hasGlobal, runtime);
  }
} else if (selectedRuntimes.length > 0) {
  if (!hasGlobal && !hasLocal) {
    promptLocation(selectedRuntimes);
  } else {
    installAllRuntimes(selectedRuntimes, hasGlobal, false);
  }
} else if (hasGlobal || hasLocal) {
  installAllRuntimes(['claude'], hasGlobal, false);
} else {
  if (!process.stdin.isTTY) {
    console.log(`  ${yellow}Non-interactive terminal detected, defaulting to Claude Code global install${reset}\n`);
    installAllRuntimes(['claude'], true, false);
  } else {
    promptRuntime((runtimes) => {
      promptLocation(runtimes);
    });
  }
}
