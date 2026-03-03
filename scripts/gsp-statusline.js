#!/usr/bin/env node
// Claude Code Statusline - GSP Edition
// Shows: model | phase + prettiness | current task | context usage

const fs = require('fs');
const path = require('path');
const os = require('os');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const model = data.model?.display_name || 'Claude';
    const dir = data.workspace?.current_dir || process.cwd();
    const session = data.session_id || '';
    const remaining = data.context_window?.remaining_percentage;

    // ── Context window display ──
    let ctx = '';
    if (remaining != null) {
      const rem = Math.round(remaining);
      const rawUsed = Math.max(0, Math.min(100, 100 - rem));
      const used = Math.min(100, Math.round((rawUsed / 80) * 100));

      const filled = Math.floor(used / 10);
      const bar = '\u2588'.repeat(filled) + '\u2591'.repeat(10 - filled);

      if (used < 63) {
        ctx = ` \x1b[32m${bar} ${used}%\x1b[0m`;
      } else if (used < 81) {
        ctx = ` \x1b[33m${bar} ${used}%\x1b[0m`;
      } else if (used < 95) {
        ctx = ` \x1b[38;5;208m${bar} ${used}%\x1b[0m`;
      } else {
        ctx = ` \x1b[5;31m\u{1F480} ${bar} ${used}%\x1b[0m`;
      }
    }

    // ── Current task from todos ──
    let task = '';
    const homeDir = os.homedir();
    const todosDir = path.join(homeDir, '.claude', 'todos');
    if (session && fs.existsSync(todosDir)) {
      try {
        const files = fs.readdirSync(todosDir)
          .filter(f => f.startsWith(session) && f.includes('-agent-') && f.endsWith('.json'))
          .map(f => ({ name: f, mtime: fs.statSync(path.join(todosDir, f)).mtime }))
          .sort((a, b) => b.mtime - a.mtime);

        if (files.length > 0) {
          try {
            const todos = JSON.parse(fs.readFileSync(path.join(todosDir, files[0].name), 'utf8'));
            const inProgress = todos.find(t => t.status === 'in_progress');
            if (inProgress) task = inProgress.activeForm || '';
          } catch (e) {}
        }
      } catch (e) {}
    }

    // ── Design state from .design/STATE.md ──
    let phase = '';
    let prettiness = '';
    const statePath = path.join(dir, '.design', 'STATE.md');
    if (fs.existsSync(statePath)) {
      try {
        const state = fs.readFileSync(statePath, 'utf8');

        // Parse current phase number
        const phaseMatch = state.match(/\*\*Current Phase:\*\*\s*(\d+)/);
        const phaseNum = phaseMatch ? parseInt(phaseMatch[1]) : 0;

        // Parse prettiness level
        const prettyMatch = state.match(/\*\*Prettiness Level:\*\*\s*(\d+)%/);
        const prettyPct = prettyMatch ? parseInt(prettyMatch[1]) : 0;

        // Find phase name from table
        const phaseNames = ['Setup', 'Research', 'Brand', 'System', 'Design', 'Spec', 'Review', 'Build', 'Launch'];
        const phaseName = phaseNum > 0 && phaseNum <= 8 ? phaseNames[phaseNum] : 'Ready';

        // Find current phase status from table
        let phaseStatus = '';
        const tableRegex = /\|\s*(\d+)\s*\|\s*(\w+)\s*\|\s*(\w+)\s*\|/g;
        let match;
        while ((match = tableRegex.exec(state)) !== null) {
          if (parseInt(match[1]) === phaseNum) {
            phaseStatus = match[3].toLowerCase();
            break;
          }
        }

        if (phaseNum > 0) {
          phase = `Phase ${phaseNum}: ${phaseName}`;
          if (phaseStatus && phaseStatus !== 'pending') {
            phase += ` (${phaseStatus})`;
          }
        }

        // Build prettiness meter
        if (prettyPct > 0 || phaseNum > 0) {
          const prettyFilled = Math.floor(prettyPct / 12.5);
          const prettyBar = '\u2588'.repeat(prettyFilled) + '\u2591'.repeat(8 - prettyFilled);
          prettiness = `${prettyBar} ${prettyPct}% pretty`;
        }
      } catch (e) {}
    }

    // ── Output ──
    const dirname = path.basename(dir);
    const parts = [`\x1b[2m${model}\x1b[0m`];

    if (task) {
      // Active task overrides phase display
      parts.push(`\x1b[1m${task}\x1b[0m`);
    } else if (phase) {
      parts.push(`\x1b[36m${phase}\x1b[0m`);
    }

    if (prettiness) {
      parts.push(`\x1b[35m${prettiness}\x1b[0m`);
    }

    if (!phase && !task) {
      parts.push(`\x1b[2m${dirname}\x1b[0m`);
    }

    process.stdout.write(parts.join(' \u2502 ') + ctx);
  } catch (e) {
    // Silent fail
  }
});
