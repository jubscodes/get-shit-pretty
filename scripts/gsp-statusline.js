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

    // ── Update check ──
    let updateTag = '';
    try {
      const gspDir = path.join(homeDir, '.claude', 'get-shit-pretty');
      const versionFile = path.join(gspDir, 'VERSION');
      const cacheFile = path.join(gspDir, '.update-cache.json');

      if (fs.existsSync(versionFile)) {
        const installed = fs.readFileSync(versionFile, 'utf8').trim();
        let latest = null;
        let shouldCheck = true;

        // Read cache (check once per 24h)
        if (fs.existsSync(cacheFile)) {
          try {
            const cache = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
            const age = Date.now() - (cache.ts || 0);
            if (age < 86400000) {
              latest = cache.latest || null;
              shouldCheck = false;
            }
          } catch (e) {}
        }

        // Background check if cache is stale
        if (shouldCheck) {
          const { execFile } = require('child_process');
          execFile('npm', ['view', 'get-shit-pretty', 'version', '--json'], { timeout: 5000 }, (err, stdout) => {
            if (!err && stdout) {
              try {
                const ver = JSON.parse(stdout.trim());
                fs.writeFileSync(cacheFile, JSON.stringify({ latest: ver, ts: Date.now() }));
              } catch (e) {}
            }
          });
        }

        // Compare versions if we have cached latest
        if (latest && latest !== installed) {
          const iParts = installed.split('.').map(Number);
          const lParts = latest.split('.').map(Number);
          const isNewer = lParts[0] > iParts[0] ||
            (lParts[0] === iParts[0] && lParts[1] > iParts[1]) ||
            (lParts[0] === iParts[0] && lParts[1] === iParts[1] && lParts[2] > iParts[2]);
          if (isNewer) {
            updateTag = ` \x1b[33m\u2191 /gsp:update\x1b[0m`;
          }
        }
      }
    } catch (e) {}

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

    process.stdout.write(parts.join(' \u2502 ') + ctx + updateTag);
  } catch (e) {
    // Silent fail
  }
});
