#!/usr/bin/env node
/**
 * serve-preset.js — ephemeral HTTP server for shadcn --preset URL fetch.
 *
 * Usage (from repo root):
 *   node gsp/skills/gsp-brand-apply/bin/serve-preset.js <path-to-registry-item.json>
 *
 * Behavior:
 *   - Listens on a random free port on 127.0.0.1.
 *   - Prints the URL ("http://127.0.0.1:<port>/<basename>") to stdout.
 *   - Serves the file as application/json on any request path.
 *   - Exits cleanly on SIGTERM/SIGINT.
 *   - Self-exits after 60s as a safety net.
 */

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const TIMEOUT_MS = 60_000;

function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: node gsp/skills/gsp-brand-apply/bin/serve-preset.js <path-to-json>');
    process.exit(1);
  }
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) {
    console.error(`File not found: ${abs}`);
    process.exit(1);
  }
  const body = fs.readFileSync(abs, 'utf8');
  const basename = path.basename(abs);

  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.end(body);
  });

  server.on('error', (err) => {
    console.error(`Server error: ${err.message}`);
    process.exit(1);
  });

  server.listen(0, '127.0.0.1', () => {
    const { port } = server.address();
    const url = `http://127.0.0.1:${port}/${basename}`;
    process.stdout.write(url + '\n');
  });

  let shuttingDown = false;
  const shutdown = () => {
    if (shuttingDown) return;
    shuttingDown = true;
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 1000).unref();
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
  setTimeout(() => {
    console.error('serve-preset: 60s safety timeout reached, exiting');
    shutdown();
  }, TIMEOUT_MS).unref();
}

main();
