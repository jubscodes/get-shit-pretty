#!/usr/bin/env node
// Statusline Dispatcher — routes to GSP or GSD statusline based on project type
// Installed by GSP to ~/.claude/hooks/statusline-dispatcher.js

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Read stdin first, then decide which statusline to run
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const dir = data.workspace?.current_dir || process.cwd();
    const hooksDir = __dirname;

    // Pick statusline based on project type
    let script;
    if (fs.existsSync(path.join(dir, '.design', 'STATE.md'))) {
      script = path.join(hooksDir, 'gsp-statusline.js');
    } else {
      script = path.join(hooksDir, 'gsd-statusline.js');
    }

    // Fall back if chosen script doesn't exist
    if (!fs.existsSync(script)) {
      const fallback = script.includes('gsp-') ? 'gsd-statusline.js' : 'gsp-statusline.js';
      script = path.join(hooksDir, fallback);
      if (!fs.existsSync(script)) {
        // Neither exists — output minimal statusline
        const model = data.model?.display_name || 'Claude';
        process.stdout.write(`\x1b[2m${model}\x1b[0m`);
        return;
      }
    }

    // Pipe the input to the chosen statusline
    const child = spawn(process.execPath, [script], { stdio: ['pipe', 'inherit', 'inherit'] });
    child.stdin.write(input);
    child.stdin.end();
  } catch (e) {
    // Silent fail
  }
});
