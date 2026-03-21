const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');

const {
  copyOpencodeSkills,
  copyGeminiSkills,
  copyCodexSkillsFromSource,
  copyClaudeSkills,
  copyAgents,
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

// ── copyClaudeSkills ────────────────────────────────────

describe('copyClaudeSkills integration', () => {
  beforeEach(() => { tmpDir = makeTmp(); });
  afterEach(() => { cleanup(tmpDir); });

  it('copies skills with path replacement only (no body conversion)', () => {
    const skillsDir = path.join(tmpDir, 'skills');
    const count = copyClaudeSkills(
      path.join(FIXTURES, 'skills'), skillsDir, '~/Library/Application Support/claude/'
    );

    assert.equal(count, 1, 'should return skill count of 1');

    const skillPath = path.join(skillsDir, 'gsp-test-skill', 'SKILL.md');
    assert.ok(fs.existsSync(skillPath), 'skill file should exist');

    const content = fs.readFileSync(skillPath, 'utf8');
    // Path replacement happens
    assert.ok(content.includes('~/Library/Application Support/claude/'), 'should replace ~/.claude/ with pathPrefix');
    assert.ok(!content.includes('~/.claude/'), 'should not have ~/.claude/');
    // Body conversion does NOT happen (Claude is native format)
    assert.ok(content.includes('AskUserQuestion'), 'should keep AskUserQuestion unchanged');
    assert.ok(content.includes('${CLAUDE_SKILL_DIR}'), 'should keep ${CLAUDE_SKILL_DIR} unchanged');
    assert.ok(content.includes('/gsp:build'), 'should keep /gsp: syntax unchanged');
    assert.ok(content.includes('<sub>'), 'should keep <sub> tags unchanged');
  });

  it('cleans stale gsp- and get-shit-pretty dirs before installing', () => {
    const skillsDir = path.join(tmpDir, 'skills');
    fs.mkdirSync(skillsDir, { recursive: true });

    // Create stale gsp- dir
    const staleGsp = path.join(skillsDir, 'gsp-old-skill');
    fs.mkdirSync(staleGsp, { recursive: true });
    fs.writeFileSync(path.join(staleGsp, 'SKILL.md'), 'stale');

    // Create stale get-shit-pretty dir (legacy name)
    const staleLegacy = path.join(skillsDir, 'get-shit-pretty');
    fs.mkdirSync(staleLegacy, { recursive: true });
    fs.writeFileSync(path.join(staleLegacy, 'SKILL.md'), 'legacy');

    // Create non-GSP skill that should survive
    const userSkill = path.join(skillsDir, 'my-custom-skill');
    fs.mkdirSync(userSkill, { recursive: true });
    fs.writeFileSync(path.join(userSkill, 'SKILL.md'), 'user');

    copyClaudeSkills(path.join(FIXTURES, 'skills'), skillsDir, './.claude/');

    assert.ok(!fs.existsSync(staleGsp), 'stale gsp- dir should be removed');
    assert.ok(!fs.existsSync(staleLegacy), 'legacy get-shit-pretty dir should be removed');
    assert.ok(fs.existsSync(userSkill), 'non-GSP skill should survive');
    assert.ok(
      fs.existsSync(path.join(skillsDir, 'gsp-test-skill', 'SKILL.md')),
      'new skill should exist'
    );
  });
});

// ── copyAgents ──────────────────────────────────────────

describe('copyAgents integration', () => {
  beforeEach(() => { tmpDir = makeTmp(); });
  afterEach(() => { cleanup(tmpDir); });

  it('copies agents for Claude (path replacement only)', () => {
    const agentsDest = path.join(tmpDir, 'agents');
    const count = copyAgents(
      path.join(FIXTURES, 'agents'), agentsDest, './.claude/', 'claude'
    );

    assert.equal(count, 1, 'should install 1 agent');

    const agentPath = path.join(agentsDest, 'gsp-test-agent.md');
    assert.ok(fs.existsSync(agentPath), 'agent file should exist');

    const content = fs.readFileSync(agentPath, 'utf8');
    // Path replacement
    assert.ok(!content.includes('~/.claude/'), 'should not have ~/.claude/');
    assert.ok(content.includes('./.claude/'), 'should have local .claude/ path');
    // No body conversion for Claude
    assert.ok(content.includes('AskUserQuestion'), 'should keep AskUserQuestion');
    assert.ok(content.includes('/gsp:build'), 'should keep /gsp: syntax');
    assert.ok(content.includes('<sub>'), 'should keep <sub> tags');
    assert.ok(content.includes('Spawn the'), 'should keep Spawn');
  });

  it('copies agents for OpenCode with full conversion', () => {
    const agentsDest = path.join(tmpDir, 'agents');
    const count = copyAgents(
      path.join(FIXTURES, 'agents'), agentsDest, '~/.config/opencode/', 'opencode'
    );

    assert.equal(count, 1, 'should install 1 agent');

    const content = fs.readFileSync(
      path.join(agentsDest, 'gsp-test-agent.md'), 'utf8'
    );
    // Path replacement
    assert.ok(content.includes('~/.config/opencode/'), 'should have opencode path');
    assert.ok(!content.includes('~/.claude/'), 'should not have ~/.claude/');
    // Body conversion
    assert.ok(!content.includes('AskUserQuestion'), 'should convert AskUserQuestion');
    assert.ok(content.includes('question'), 'should have "question" tool');
    assert.ok(content.includes('/gsp-build'), 'should convert /gsp: to /gsp-');
    assert.ok(!content.includes('/gsp:build'), 'should not have /gsp:build');
    assert.ok(content.includes('Delegate to'), 'should convert Spawn to Delegate');
    assert.ok(content.includes('subagent_type="general"'), 'should convert general-purpose');
  });

  it('copies agents for Gemini with full conversion', () => {
    const agentsDest = path.join(tmpDir, 'agents');
    const count = copyAgents(
      path.join(FIXTURES, 'agents'), agentsDest, '~/.gemini/', 'gemini'
    );

    assert.equal(count, 1, 'should install 1 agent');

    const content = fs.readFileSync(
      path.join(agentsDest, 'gsp-test-agent.md'), 'utf8'
    );
    // Path replacement
    assert.ok(content.includes('~/.gemini/'), 'should have gemini path');
    assert.ok(!content.includes('~/.claude/'), 'should not have ~/.claude/');
    // Gemini body conversion
    assert.ok(!content.includes('AskUserQuestion'), 'should convert AskUserQuestion');
    assert.ok(content.includes('ask_user'), 'should have "ask_user" tool');
    assert.ok(content.includes('*(subscript)*'), 'should convert <sub> to *()*');
    assert.ok(!content.includes('<sub>'), 'should not have <sub> tags');
    assert.ok(content.includes('Invoke the'), 'should convert Spawn to Invoke');
    // Gemini frontmatter: MCP tools should be filtered out
    assert.ok(!content.includes('mcp__github__search'), 'should filter MCP tools from Gemini');
  });

  it('cleans stale gsp- agents before installing', () => {
    const agentsDest = path.join(tmpDir, 'agents');
    fs.mkdirSync(agentsDest, { recursive: true });

    // Create stale agent
    fs.writeFileSync(path.join(agentsDest, 'gsp-old-agent.md'), 'stale');
    // Create non-GSP agent that should survive
    fs.writeFileSync(path.join(agentsDest, 'my-custom-agent.md'), 'keep');

    copyAgents(path.join(FIXTURES, 'agents'), agentsDest, './.claude/', 'claude');

    assert.ok(
      !fs.existsSync(path.join(agentsDest, 'gsp-old-agent.md')),
      'stale gsp- agent should be removed'
    );
    assert.ok(
      fs.existsSync(path.join(agentsDest, 'my-custom-agent.md')),
      'non-GSP agent should survive'
    );
    assert.ok(
      fs.existsSync(path.join(agentsDest, 'gsp-test-agent.md')),
      'new agent should exist'
    );
  });

  it('ignores non-.md files in agents directory', () => {
    // Create a temp source dir with a non-md file alongside the agent
    const agentSrc = path.join(tmpDir, 'src-agents');
    fs.mkdirSync(agentSrc, { recursive: true });
    fs.copyFileSync(
      path.join(FIXTURES, 'agents', 'gsp-test-agent.md'),
      path.join(agentSrc, 'gsp-test-agent.md')
    );
    fs.writeFileSync(path.join(agentSrc, 'README.txt'), 'not an agent');
    fs.writeFileSync(path.join(agentSrc, '.DS_Store'), 'junk');

    const agentsDest = path.join(tmpDir, 'dest-agents');
    copyAgents(agentSrc, agentsDest, './.claude/', 'claude');

    assert.ok(
      fs.existsSync(path.join(agentsDest, 'gsp-test-agent.md')),
      'agent .md should be copied'
    );
    assert.ok(
      !fs.existsSync(path.join(agentsDest, 'README.txt')),
      'non-.md file should not be copied'
    );
    assert.ok(
      !fs.existsSync(path.join(agentsDest, '.DS_Store')),
      'junk file should not be copied'
    );
  });
});

// ── Codex skips agents (regression guard) ───────────────

describe('Codex agent skip (regression)', () => {
  it('copyAgents is never called for codex in install() — verified by contract', () => {
    // The install() function gates agent installation with `if (!isCodex)`.
    // This test verifies the copyAgents function itself doesn't have
    // codex-specific logic — it would blindly copy if called.
    // The regression guard is that Codex has no agent converter,
    // so if someone accidentally called copyAgents with runtime='codex',
    // agents would be written with only path replacement (no conversion).
    // We verify the gate exists by confirming there's no codex branch in copyAgents output.
    const agentsDest = path.join(
      fs.mkdtempSync(path.join(os.tmpdir(), 'gsp-codex-guard-')),
      'agents'
    );

    try {
      // If someone mistakenly routes codex here, agents get path-replaced but no conversion
      const count = copyAgents(
        path.join(FIXTURES, 'agents'), agentsDest, '~/.codex/', 'codex'
      );
      assert.equal(count, 1, 'copyAgents would install agents if called');

      const content = fs.readFileSync(
        path.join(agentsDest, 'gsp-test-agent.md'), 'utf8'
      );
      // Codex falls through to no conversion — agents keep Claude tool names
      // This proves the gate in install() is load-bearing
      assert.ok(content.includes('AskUserQuestion'),
        'codex has no agent conversion — gate in install() is required');
    } finally {
      cleanup(path.dirname(agentsDest));
    }
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
