const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');

const {
  copyOpencodeSkills,
  copyGeminiSkills,
  copyCodexSkillsFromSource,
  copyWithPathReplacement,
} = require('../../bin/install.js');

const FIXTURES = path.join(__dirname, 'fixtures', 'source');
let tmpDir;

function makeTmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'gsp-integration-'));
}

function cleanup(dir) {
  if (dir && fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true });
  }
}

// ── copyOpencodeSkills ──────────────────────────────────

describe('copyOpencodeSkills integration', () => {
  beforeEach(() => { tmpDir = makeTmp(); });
  afterEach(() => { cleanup(tmpDir); });

  it('copies skills with correct OpenCode conversions', () => {
    const count = copyOpencodeSkills(
      path.join(FIXTURES, 'skills'), tmpDir, '~/.config/opencode/'
    );

    assert.equal(count, 1, 'should return skill count of 1');

    const skillPath = path.join(tmpDir, 'gsp-test-skill', 'SKILL.md');
    assert.ok(fs.existsSync(skillPath), 'skill file should exist');

    const content = fs.readFileSync(skillPath, 'utf8');
    assert.ok(content.includes('${SKILL_DIR}'), 'should have ${SKILL_DIR}');
    assert.ok(!content.includes('${CLAUDE_SKILL_DIR}'), 'should not have ${CLAUDE_SKILL_DIR}');
    assert.ok(content.includes('/gsp-build'), 'should convert /gsp: to /gsp-');
    assert.ok(!content.includes('/gsp:build'), 'should not have /gsp:build');
    assert.ok(content.includes('~/.config/opencode/'), 'should have opencode path');
    assert.ok(!content.includes('~/.claude/'), 'should not have ~/.claude/');
  });

  it('cleans stale gsp- dirs before installing', () => {
    const staleDir = path.join(tmpDir, 'gsp-stale-skill');
    fs.mkdirSync(staleDir, { recursive: true });
    fs.writeFileSync(path.join(staleDir, 'SKILL.md'), 'stale');

    copyOpencodeSkills(
      path.join(FIXTURES, 'skills'), tmpDir, '~/.config/opencode/'
    );

    assert.ok(!fs.existsSync(staleDir), 'stale skill dir should be removed');
    assert.ok(
      fs.existsSync(path.join(tmpDir, 'gsp-test-skill', 'SKILL.md')),
      'new skill should exist'
    );
  });
});

// ── copyGeminiSkills ────────────────────────────────────

describe('copyGeminiSkills integration', () => {
  beforeEach(() => { tmpDir = makeTmp(); });
  afterEach(() => { cleanup(tmpDir); });

  it('copies skills with correct Gemini conversions', () => {
    const count = copyGeminiSkills(
      path.join(FIXTURES, 'skills'), tmpDir, '~/.gemini/'
    );

    assert.equal(count, 1, 'should return skill count of 1');

    const skillPath = path.join(tmpDir, 'gsp-test-skill', 'SKILL.md');
    assert.ok(fs.existsSync(skillPath), 'skill file should exist');

    const content = fs.readFileSync(skillPath, 'utf8');
    assert.ok(!content.includes('${CLAUDE_SKILL_DIR}'), 'should not have ${CLAUDE_SKILL_DIR}');
    assert.ok(content.includes('*(emphasis)*'), 'should convert <sub> to *()*');
    assert.ok(!content.includes('<sub>'), 'should not have <sub> tags');
    // Gemini keeps colon syntax
    assert.ok(!content.includes('/gsp-build'), 'should NOT convert to /gsp-');
    assert.ok(content.includes('~/.gemini/'), 'should have gemini path');
    assert.ok(!content.includes('~/.claude/'), 'should not have ~/.claude/');
  });

  it('cleans stale gsp- dirs before installing', () => {
    const staleDir = path.join(tmpDir, 'gsp-stale-skill');
    fs.mkdirSync(staleDir, { recursive: true });
    fs.writeFileSync(path.join(staleDir, 'SKILL.md'), 'stale');

    copyGeminiSkills(
      path.join(FIXTURES, 'skills'), tmpDir, '~/.gemini/'
    );

    assert.ok(!fs.existsSync(staleDir), 'stale skill dir should be removed');
  });
});

// ── copyCodexSkillsFromSource ───────────────────────────

describe('copyCodexSkillsFromSource integration', () => {
  beforeEach(() => { tmpDir = makeTmp(); });
  afterEach(() => { cleanup(tmpDir); });

  it('copies skills with correct Codex conversions', () => {
    const count = copyCodexSkillsFromSource(
      path.join(FIXTURES, 'skills'), tmpDir, '~/.codex/'
    );

    assert.equal(count, 1, 'should return skill count of 1');

    const skillPath = path.join(tmpDir, 'gsp-test-skill', 'SKILL.md');
    assert.ok(fs.existsSync(skillPath), 'skill file should exist');

    const content = fs.readFileSync(skillPath, 'utf8');
    assert.ok(content.includes('$gsp-build'), 'should convert /gsp: to $gsp-');
    assert.ok(!content.includes('/gsp:build'), 'should not have /gsp:build');
    assert.ok(content.includes('~/.codex/'), 'should have codex path');
    assert.ok(!content.includes('~/.claude/'), 'should not have ~/.claude/');
  });

  it('does NOT clean stale dirs (no cleanup in Codex)', () => {
    const staleDir = path.join(tmpDir, 'gsp-stale-skill');
    fs.mkdirSync(staleDir, { recursive: true });
    fs.writeFileSync(path.join(staleDir, 'SKILL.md'), 'stale');

    copyCodexSkillsFromSource(
      path.join(FIXTURES, 'skills'), tmpDir, '~/.codex/'
    );

    assert.ok(fs.existsSync(staleDir), 'stale skill dir should survive (no cleanup)');
  });
});

// ── copyWithPathReplacement ─────────────────────────────

describe('copyWithPathReplacement integration', () => {
  beforeEach(() => { tmpDir = makeTmp(); });
  afterEach(() => { cleanup(tmpDir); });

  it('copies OpenCode bundles with correct replacements', () => {
    const src = path.join(FIXTURES, 'prompts');
    const dest = path.join(tmpDir, 'prompts');
    copyWithPathReplacement(src, dest, '~/.config/opencode/', 'opencode');

    const content = fs.readFileSync(path.join(dest, 'system.md'), 'utf8');
    assert.ok(content.includes('~/.config/opencode/'), 'should have opencode path');
    assert.ok(!content.includes('~/.claude/'), 'should not have ~/.claude/');
    assert.ok(content.includes('/gsp-build'), 'should convert /gsp: to /gsp-');
  });

  it('copies Gemini bundles with correct replacements', () => {
    const src = path.join(FIXTURES, 'prompts');
    const dest = path.join(tmpDir, 'prompts');
    copyWithPathReplacement(src, dest, '~/.gemini/', 'gemini');

    const content = fs.readFileSync(path.join(dest, 'system.md'), 'utf8');
    assert.ok(content.includes('~/.gemini/'), 'should have gemini path');
    assert.ok(!content.includes('~/.claude/'), 'should not have ~/.claude/');
  });

  it('copies Codex bundles with correct replacements', () => {
    const src = path.join(FIXTURES, 'prompts');
    const dest = path.join(tmpDir, 'prompts');
    copyWithPathReplacement(src, dest, '~/.codex/', 'codex');

    const content = fs.readFileSync(path.join(dest, 'system.md'), 'utf8');
    assert.ok(content.includes('~/.codex/'), 'should have codex path');
    assert.ok(!content.includes('~/.claude/'), 'should not have ~/.claude/');
    assert.ok(content.includes('$gsp-build'), 'should convert /gsp: to $gsp-');
  });

  it('copies JSON files verbatim (no corruption)', () => {
    const src = path.join(FIXTURES, 'templates');
    const dest = path.join(tmpDir, 'templates');
    copyWithPathReplacement(src, dest, '~/.config/opencode/', 'opencode');

    const content = fs.readFileSync(path.join(dest, 'config.json'), 'utf8');
    // JSON files are binary-copied, not text-replaced
    const parsed = JSON.parse(content);
    assert.equal(parsed.project_type, 'test');
    assert.equal(parsed.version, '0.0.1');
  });

  it('recreates directory tree structure', () => {
    const src = path.join(FIXTURES, 'references');
    const dest = path.join(tmpDir, 'references');
    copyWithPathReplacement(src, dest, '~/.config/opencode/', 'opencode');

    assert.ok(fs.existsSync(path.join(dest, 'chunk-format.md')), 'should recreate file');
  });
});
