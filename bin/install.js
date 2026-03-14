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
function convertClaudeToOpencodeFrontmatter(content) {
  let converted = content;
  converted = converted.replace(/\bAskUserQuestion\b/g, 'question');
  converted = converted.replace(/\bSlashCommand\b/g, 'skill');
  converted = converted.replace(/\bTodoWrite\b/g, 'todowrite');
  converted = converted.replace(/\/gsp:/g, '/gsp-');
  converted = converted.replace(/~\/\.claude\b/g, '~/.config/opencode');
  converted = converted.replace(/subagent_type="general-purpose"/g, 'subagent_type="general"');

  if (!converted.startsWith('---')) return converted;
  const endIndex = converted.indexOf('---', 3);
  if (endIndex === -1) return converted;

  const frontmatter = converted.substring(3, endIndex).trim();
  const body = converted.substring(endIndex + 3);
  const lines = frontmatter.split('\n');
  const newLines = [];
  let inAllowedTools = false;
  const allowedTools = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('allowed-tools:')) { inAllowedTools = true; continue; }

    if (trimmed.startsWith('tools:')) {
      const val = trimmed.substring(6).trim();
      if (val) {
        allowedTools.push(...val.split(',').map(t => t.trim()).filter(Boolean));
      } else {
        inAllowedTools = true;
      }
      continue;
    }

    if (trimmed.startsWith('name:')) continue;

    if (trimmed.startsWith('color:')) {
      const colorValue = trimmed.substring(6).trim().toLowerCase();
      const hex = colorNameToHex[colorValue];
      if (hex) newLines.push(`color: "${hex}"`);
      else if (colorValue.startsWith('#') && /^#[0-9a-f]{3}$|^#[0-9a-f]{6}$/i.test(colorValue)) {
        newLines.push(line);
      }
      continue;
    }

    if (inAllowedTools) {
      if (trimmed.startsWith('- ')) { allowedTools.push(trimmed.substring(2).trim()); continue; }
      else if (trimmed && !trimmed.startsWith('-')) { inAllowedTools = false; }
    }

    if (!inAllowedTools) newLines.push(line);
  }

  if (allowedTools.length > 0) {
    newLines.push('tools:');
    for (const tool of allowedTools) {
      newLines.push(`  ${convertToolName(tool)}: true`);
    }
  }

  return `---\n${newLines.join('\n').trim()}\n---${body}`;
}

/**
 * Convert Claude command to Gemini TOML format
 */
function convertClaudeToGeminiToml(content) {
  if (!content.startsWith('---')) return `prompt = ${JSON.stringify(content)}\n`;
  const endIndex = content.indexOf('---', 3);
  if (endIndex === -1) return `prompt = ${JSON.stringify(content)}\n`;

  const frontmatter = content.substring(3, endIndex).trim();
  const body = content.substring(endIndex + 3).trim();

  let description = '';
  for (const line of frontmatter.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('description:')) {
      description = trimmed.substring(12).trim();
      break;
    }
  }

  let toml = '';
  if (description) toml += `description = ${JSON.stringify(description)}\n`;
  toml += `prompt = ${JSON.stringify(body)}\n`;
  return toml;
}

/**
 * Convert Claude agent to Gemini agent format
 */
function convertClaudeToGeminiAgent(content) {
  if (!content.startsWith('---')) return content;
  const endIndex = content.indexOf('---', 3);
  if (endIndex === -1) return content;

  const frontmatter = content.substring(3, endIndex).trim();
  const body = content.substring(endIndex + 3);
  const lines = frontmatter.split('\n');
  const newLines = [];
  let inAllowedTools = false;
  const tools = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('allowed-tools:')) { inAllowedTools = true; continue; }
    if (trimmed.startsWith('tools:')) {
      const val = trimmed.substring(6).trim();
      if (val) {
        for (const t of val.split(',').map(s => s.trim()).filter(Boolean)) {
          const mapped = convertGeminiToolName(t);
          if (mapped) tools.push(mapped);
        }
      } else { inAllowedTools = true; }
      continue;
    }
    if (trimmed.startsWith('color:')) continue;
    if (inAllowedTools) {
      if (trimmed.startsWith('- ')) {
        const mapped = convertGeminiToolName(trimmed.substring(2).trim());
        if (mapped) tools.push(mapped);
        continue;
      } else if (trimmed && !trimmed.startsWith('-')) { inAllowedTools = false; }
    }
    if (!inAllowedTools) newLines.push(line);
  }

  if (tools.length > 0) {
    newLines.push('tools:');
    for (const tool of tools) newLines.push(`  - ${tool}`);
  }

  const escapedBody = body.replace(/\$\{(\w+)\}/g, '$$$1');
  return `---\n${newLines.join('\n').trim()}\n---${stripSubTags(escapedBody)}`;
}

/**
 * Convert Claude command to Codex SKILL.md format
 * Codex expects: ~/.codex/skills/gsp-help/SKILL.md
 */
function convertClaudeCommandToCodexSkill(content) {
  if (!content.startsWith('---')) return content;
  const endIndex = content.indexOf('---', 3);
  if (endIndex === -1) return content;

  const frontmatter = content.substring(3, endIndex).trim();
  let body = content.substring(endIndex + 3).trim();

  // Extract metadata from frontmatter
  let description = '';
  const tools = [];
  let inTools = false;

  for (const line of frontmatter.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('description:')) {
      description = trimmed.substring(12).trim();
      inTools = false;
      continue;
    }
    if (trimmed.startsWith('allowed-tools:') || trimmed.startsWith('tools:')) {
      const val = trimmed.includes(':') ? trimmed.split(':').slice(1).join(':').trim() : '';
      if (val) {
        for (const t of val.split(',').map(s => s.trim()).filter(Boolean)) {
          const mapped = convertCodexToolName(t);
          if (mapped) tools.push(mapped);
        }
      } else {
        inTools = true;
      }
      continue;
    }
    if (inTools) {
      if (trimmed.startsWith('- ')) {
        const mapped = convertCodexToolName(trimmed.substring(2).trim());
        if (mapped) tools.push(mapped);
        continue;
      } else if (trimmed && !trimmed.startsWith('-')) {
        inTools = false;
      }
    }
  }

  // Replace slash command references: /gsp: → $gsp-
  body = body.replace(/\/gsp:/g, '$gsp-');
  // Replace ~/.claude references
  body = body.replace(/~\/\.claude\b/g, '~/.codex');

  // Build SKILL.md
  let skill = '';
  if (description) skill += `# ${description}\n\n`;
  if (tools.length > 0) skill += `Tools: ${tools.join(', ')}\n\n`;
  skill += body;
  return skill;
}

/**
 * Convert Claude agent to Codex agent format
 */
function convertClaudeToCodexAgent(content) {
  let converted = content;
  converted = converted.replace(/\/gsp:/g, '$gsp-');
  converted = converted.replace(/~\/\.claude\b/g, '~/.codex');

  if (!converted.startsWith('---')) return converted;
  const endIndex = converted.indexOf('---', 3);
  if (endIndex === -1) return converted;

  const frontmatter = converted.substring(3, endIndex).trim();
  const body = converted.substring(endIndex + 3);
  const lines = frontmatter.split('\n');
  const newLines = [];
  let inTools = false;
  const tools = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('allowed-tools:') || trimmed.startsWith('tools:')) {
      const val = trimmed.includes(':') ? trimmed.split(':').slice(1).join(':').trim() : '';
      if (val) {
        for (const t of val.split(',').map(s => s.trim()).filter(Boolean)) {
          const mapped = convertCodexToolName(t);
          if (mapped) tools.push(mapped);
        }
      } else { inTools = true; }
      continue;
    }
    if (trimmed.startsWith('color:')) continue;
    if (inTools) {
      if (trimmed.startsWith('- ')) {
        const mapped = convertCodexToolName(trimmed.substring(2).trim());
        if (mapped) tools.push(mapped);
        continue;
      } else if (trimmed && !trimmed.startsWith('-')) { inTools = false; }
    }
    if (!inTools) newLines.push(line);
  }

  if (tools.length > 0) {
    newLines.push('tools: ' + tools.join(', '));
  }

  return `---\n${newLines.join('\n').trim()}\n---${body}`;
}

// ──────────────────────────────────────────────────────
// File copy helpers
// ──────────────────────────────────────────────────────

/**
 * Copy commands to flat structure for OpenCode
 * commands/gsp/help.md → command/gsp-help.md
 */
function copyFlattenedCommands(srcDir, destDir, prefix, pathPrefix, runtime) {
  if (!fs.existsSync(srcDir)) return;

  if (fs.existsSync(destDir)) {
    for (const file of fs.readdirSync(destDir)) {
      if (file.startsWith(`${prefix}-`) && file.endsWith('.md')) {
        fs.unlinkSync(path.join(destDir, file));
      }
    }
  } else {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    if (entry.isDirectory()) {
      copyFlattenedCommands(srcPath, destDir, `${prefix}-${entry.name}`, pathPrefix, runtime);
    } else if (entry.name.endsWith('.md')) {
      const baseName = entry.name.replace('.md', '');
      const destPath = path.join(destDir, `${prefix}-${baseName}.md`);
      let content = fs.readFileSync(srcPath, 'utf8');
      content = content.replace(/~\/\.claude\//g, pathPrefix);
      content = content.replace(/\.\/\.claude\//g, `./${getDirName(runtime)}/`);
      content = convertClaudeToOpencodeFrontmatter(content);
      fs.writeFileSync(destPath, content);
    }
  }
}

/**
 * Copy commands to Codex skill structure
 * commands/gsp/help.md → skills/gsp-help/SKILL.md
 */
function copyCodexSkills(srcDir, destDir, prefix, pathPrefix) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });

  // Clean old gsp-* skill dirs
  if (fs.existsSync(destDir)) {
    for (const entry of fs.readdirSync(destDir, { withFileTypes: true })) {
      if (entry.isDirectory() && entry.name.startsWith(`${prefix}-`)) {
        fs.rmSync(path.join(destDir, entry.name), { recursive: true });
      }
    }
  }

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    if (entry.isDirectory()) {
      copyCodexSkills(srcPath, destDir, `${prefix}-${entry.name}`, pathPrefix);
    } else if (entry.name.endsWith('.md')) {
      const baseName = entry.name.replace('.md', '');
      const skillDir = path.join(destDir, `${prefix}-${baseName}`);
      fs.mkdirSync(skillDir, { recursive: true });
      let content = fs.readFileSync(srcPath, 'utf8');
      content = content.replace(/~\/\.claude\//g, pathPrefix);
      content = convertClaudeCommandToCodexSkill(content);
      fs.writeFileSync(path.join(skillDir, 'SKILL.md'), content);
    }
  }
}

/**
 * Recursively copy directory with path replacement and runtime conversion
 */
function copyWithPathReplacement(srcDir, destDir, pathPrefix, runtime, isCommand = false) {
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
      copyWithPathReplacement(srcPath, destPath, pathPrefix, runtime, isCommand);
    } else if (entry.name.endsWith('.md')) {
      let content = fs.readFileSync(srcPath, 'utf8');
      content = content.replace(/~\/\.claude\//g, pathPrefix);
      content = content.replace(/\.\/\.claude\//g, `./${dirName}/`);

      if (runtime === 'opencode') {
        content = convertClaudeToOpencodeFrontmatter(content);
        fs.writeFileSync(destPath, content);
      } else if (runtime === 'gemini') {
        if (isCommand) {
          content = stripSubTags(content);
          const tomlContent = convertClaudeToGeminiToml(content);
          fs.writeFileSync(destPath.replace(/\.md$/, '.toml'), tomlContent);
        } else {
          fs.writeFileSync(destPath, content);
        }
      } else if (runtime === 'codex') {
        content = content.replace(/\/gsp:/g, '$gsp-');
        fs.writeFileSync(destPath, content);
      } else {
        fs.writeFileSync(destPath, content);
      }
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

  const agentsSrc = path.join(cwd, 'agents');
  let agentCount = 0;
  for (const file of fs.readdirSync(agentsSrc)) {
    if (file.startsWith('gsp-') && file.endsWith('.md')) {
      forceSymlink(path.join('..', '..', 'agents', file), path.join(agentsDest, file));
      agentCount++;
    }
  }

  // ── Custom agents (agents/custom/) ──
  const customAgentsSrc = path.join(cwd, 'agents', 'custom');
  let customAgentCount = 0;
  if (fs.existsSync(customAgentsSrc)) {
    for (const file of fs.readdirSync(customAgentsSrc)) {
      if (file.endsWith('.md') && file !== '.gitkeep') {
        forceSymlink(path.join('..', '..', 'agents', 'custom', file), path.join(agentsDest, file));
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

  // ── Command symlink (whole gsp/ directory) ──
  const commandsDir = path.join(targetDir, 'commands');
  fs.mkdirSync(commandsDir, { recursive: true });
  const gspCommandsDest = path.join(commandsDir, 'gsp');
  try { fs.rmSync(gspCommandsDest, { recursive: true }); } catch {}
  forceSymlink(path.join('..', '..', 'commands', 'gsp'), gspCommandsDest);
  console.log(`  ${c.success}✓${c.reset} Symlinked commands/gsp`);

  // ── Bundle symlinks (prompts, templates, references → get-shit-pretty/) ──
  const bundleDest = path.join(targetDir, 'get-shit-pretty');
  if (fs.existsSync(bundleDest)) {
    fs.rmSync(bundleDest, { recursive: true });
  }
  fs.mkdirSync(bundleDest, { recursive: true });

  for (const dir of ['prompts', 'templates', 'references']) {
    if (fs.existsSync(path.join(cwd, dir))) {
      forceSymlink(path.join('..', '..', dir), path.join(bundleDest, dir));
      console.log(`  ${c.success}✓${c.reset} Symlinked get-shit-pretty/${dir}`);
    }
  }

  // VERSION is a real file (not in source repo as a standalone file)
  fs.writeFileSync(path.join(bundleDest, 'VERSION'), pkg.version);
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
    console.log(`  ${c.dim}(symlinked — edits to agents/ and commands/ are reflected immediately)${c.reset}`);
    const settingsPath = path.join(targetDir, 'settings.json');
    const settings = readSettings(settingsPath);
    const statuslineCommand = `node ${dirName}/hooks/statusline-dispatcher.js`;
    return { settingsPath, settings, statuslineCommand, runtime };
  }

  const failures = [];

  // ── Commands ──
  if (isOpencode) {
    const commandDir = path.join(targetDir, 'command');
    fs.mkdirSync(commandDir, { recursive: true });
    copyFlattenedCommands(path.join(src, 'commands', 'gsp'), commandDir, 'gsp', pathPrefix, runtime);
    if (verifyInstalled(commandDir, 'command/gsp-*')) {
      const count = fs.readdirSync(commandDir).filter(f => f.startsWith('gsp-')).length;
      console.log(`  ${c.success}✓${c.reset} Installed ${count} commands to command/`);
    } else { failures.push('commands'); }
  } else if (isCodex) {
    const skillsDir = path.join(targetDir, 'skills');
    fs.mkdirSync(skillsDir, { recursive: true });
    copyCodexSkills(path.join(src, 'commands', 'gsp'), skillsDir, 'gsp', pathPrefix);
    if (verifyInstalled(skillsDir, 'skills/gsp-*')) {
      const count = fs.readdirSync(skillsDir).filter(f => f.startsWith('gsp-')).length;
      console.log(`  ${c.success}✓${c.reset} Installed ${count} skills to skills/`);
    } else { failures.push('skills'); }
  } else {
    const commandsDir = path.join(targetDir, 'commands');
    fs.mkdirSync(commandsDir, { recursive: true });
    const gspDest = path.join(commandsDir, 'gsp');
    copyWithPathReplacement(path.join(src, 'commands', 'gsp'), gspDest, pathPrefix, runtime, true);
    if (verifyInstalled(gspDest, 'commands/gsp')) {
      console.log(`  ${c.success}✓${c.reset} Installed commands/gsp`);
    } else { failures.push('commands'); }
  }

  // ── Agents ──
  const agentsSrc = path.join(src, 'agents');
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
          content = convertClaudeToOpencodeFrontmatter(content);
        } else if (isGemini) {
          content = convertClaudeToGeminiAgent(content);
        } else if (isCodex) {
          content = convertClaudeToCodexAgent(content);
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
            content = convertClaudeToOpencodeFrontmatter(content);
          } else if (isGemini) {
            content = convertClaudeToGeminiAgent(content);
          } else if (isCodex) {
            content = convertClaudeToCodexAgent(content);
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
    } else { failures.push('agents'); }
  }

  // ── Bundle: prompts, templates, references → get-shit-pretty/ ──
  const bundleDest = path.join(targetDir, 'get-shit-pretty');
  // Clean install: remove old bundle dir to prevent stale files from previous installs
  if (fs.existsSync(bundleDest)) {
    fs.rmSync(bundleDest, { recursive: true });
  }
  fs.mkdirSync(bundleDest, { recursive: true });

  const bundleDirs = ['prompts', 'templates', 'references'];
  for (const dir of bundleDirs) {
    const dirSrc = path.join(src, dir);
    if (fs.existsSync(dirSrc)) {
      copyWithPathReplacement(dirSrc, path.join(bundleDest, dir), pathPrefix, runtime);
      if (verifyInstalled(path.join(bundleDest, dir), `get-shit-pretty/${dir}`)) {
        console.log(`  ${c.success}✓${c.reset} Installed get-shit-pretty/${dir}`);
      } else { failures.push(dir); }
    }
  }

  // Write VERSION file
  fs.writeFileSync(path.join(bundleDest, 'VERSION'), pkg.version);
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

  // Remove commands
  if (isOpencode) {
    const commandDir = path.join(targetDir, 'command');
    if (fs.existsSync(commandDir)) {
      for (const file of fs.readdirSync(commandDir)) {
        if (file.startsWith('gsp-') && file.endsWith('.md')) {
          fs.unlinkSync(path.join(commandDir, file));
          removedCount++;
        }
      }
      if (removedCount > 0) console.log(`  ${c.success}✓${c.reset} Removed GSP commands from command/`);
    }
  } else if (isCodex) {
    const skillsDir = path.join(targetDir, 'skills');
    if (fs.existsSync(skillsDir)) {
      for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
        if (entry.isDirectory() && entry.name.startsWith('gsp-')) {
          fs.rmSync(path.join(skillsDir, entry.name), { recursive: true });
          removedCount++;
        }
      }
      if (removedCount > 0) console.log(`  ${c.success}✓${c.reset} Removed GSP skills from skills/`);
    }
  } else {
    const gspCommandsDir = path.join(targetDir, 'commands', 'gsp');
    if (fs.existsSync(gspCommandsDir)) {
      fs.rmSync(gspCommandsDir, { recursive: true });
      removedCount++;
      console.log(`  ${c.success}✓${c.reset} Removed commands/gsp/`);
    }
  }

  // Remove get-shit-pretty bundle dir
  const gspDir = path.join(targetDir, 'get-shit-pretty');
  if (fs.existsSync(gspDir)) {
    fs.rmSync(gspDir, { recursive: true });
    removedCount++;
    console.log(`  ${c.success}✓${c.reset} Removed get-shit-pretty/`);
  }

  // Remove GSP agents
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

  GSP includes a smart dispatcher that auto-switches between
  your existing statusline (GSD) and the GSP statusline based
  on the current project type.

  GSP statusline shows:
    * Model name
    * Current design phase + prettiness meter
    * Context window usage (color-coded)

  ${cyan}1${reset}) Keep existing (current statusline only)
  ${cyan}2${reset}) Install dispatcher (auto-switches between both)\n`);

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
