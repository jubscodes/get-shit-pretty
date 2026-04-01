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

// ═══════════════════════════════════════════════════════════
// 1. NAMESPACE CONTRACT
//    Source dirs have gsp- prefix. All runtimes copy as-is.
// ═══════════════════════════════════════════════════════════

describe('Namespace contract — source gsp- prefix preserved', () => {
  beforeEach(() => { tmpDir = makeTmp(); });
  afterEach(() => { cleanup(tmpDir); });

  it('Claude: preserves gsp- prefix from source', () => {
    const skillsDir = path.join(tmpDir, 'skills');
    copyClaudeSkills(path.join(FIXTURES, 'skills'), skillsDir, './.claude/');

    assert.ok(
      fs.existsSync(path.join(skillsDir, 'gsp-test-skill', 'SKILL.md')),
      'skill should exist at gsp- prefixed path'
    );
    assert.ok(
      !fs.existsSync(path.join(skillsDir, 'test-skill')),
      'should NOT create unprefixed dir'
    );
  });

  it('OpenCode: preserves gsp- prefix from source', () => {
    copyOpencodeSkills(path.join(FIXTURES, 'skills'), tmpDir, '~/.config/opencode/');

    assert.ok(fs.existsSync(path.join(tmpDir, 'gsp-test-skill', 'SKILL.md')));
    assert.ok(!fs.existsSync(path.join(tmpDir, 'test-skill')));
  });

  it('Gemini: preserves gsp- prefix from source', () => {
    copyGeminiSkills(path.join(FIXTURES, 'skills'), tmpDir, '~/.gemini/');

    assert.ok(fs.existsSync(path.join(tmpDir, 'gsp-test-skill', 'SKILL.md')));
    assert.ok(!fs.existsSync(path.join(tmpDir, 'test-skill')));
  });

  it('Codex: preserves gsp- prefix from source', () => {
    copyCodexSkillsFromSource(path.join(FIXTURES, 'skills'), tmpDir, '~/.codex/');

    assert.ok(fs.existsSync(path.join(tmpDir, 'gsp-test-skill', 'SKILL.md')));
    assert.ok(!fs.existsSync(path.join(tmpDir, 'test-skill')));
  });
});

// ═══════════════════════════════════════════════════════════
// 2. CLEAN INSTALL (empty target directory)
//    Each runtime installs skills with correct conversions.
// ═══════════════════════════════════════════════════════════

describe('Clean install — Claude', () => {
  beforeEach(() => { tmpDir = makeTmp(); });
  afterEach(() => { cleanup(tmpDir); });

  it('installs with path replacement only (no body conversion)', () => {
    const skillsDir = path.join(tmpDir, 'skills');
    const count = copyClaudeSkills(
      path.join(FIXTURES, 'skills'), skillsDir, '~/Library/Application Support/claude/'
    );

    assert.equal(count, 1);

    const content = fs.readFileSync(path.join(skillsDir, 'gsp-test-skill', 'SKILL.md'), 'utf8');
    assert.ok(content.includes('~/Library/Application Support/claude/'), 'path replacement');
    assert.ok(!content.includes('~/.claude/'), 'original path removed');
    // Native format preserved
    assert.ok(content.includes('AskUserQuestion'), 'keeps AskUserQuestion');
    assert.ok(content.includes('${CLAUDE_SKILL_DIR}'), 'keeps CLAUDE_SKILL_DIR');
    assert.ok(content.includes('/gsp:build'), 'keeps /gsp: syntax');
    assert.ok(content.includes('<sub>'), 'keeps <sub> tags');
  });

  it('does not inject model: or effort: fields', () => {
    const skillsDir = path.join(tmpDir, 'skills');
    copyClaudeSkills(path.join(FIXTURES, 'skills'), skillsDir, './.claude/');
    const content = fs.readFileSync(path.join(skillsDir, 'gsp-test-skill', 'SKILL.md'), 'utf8');
    assert.ok(!content.match(/^model:/m), 'no model field');
    assert.ok(!content.match(/^effort:/m), 'no effort field');
  });

  it('copies sibling files alongside SKILL.md', () => {
    const skillsDir = path.join(tmpDir, 'skills');
    copyClaudeSkills(path.join(FIXTURES, 'skills'), skillsDir, './.claude/');
    assert.ok(
      fs.existsSync(path.join(skillsDir, 'gsp-test-skill', 'styles', 'minimal.yml')),
      'sibling subdir files copied'
    );
  });
});

describe('Clean install — OpenCode', () => {
  beforeEach(() => { tmpDir = makeTmp(); });
  afterEach(() => { cleanup(tmpDir); });

  it('converts body and paths for OpenCode', () => {
    const count = copyOpencodeSkills(path.join(FIXTURES, 'skills'), tmpDir, '~/.config/opencode/');
    assert.equal(count, 1);

    const content = fs.readFileSync(path.join(tmpDir, 'gsp-test-skill', 'SKILL.md'), 'utf8');
    assert.ok(content.includes('${SKILL_DIR}'), 'CLAUDE_SKILL_DIR → SKILL_DIR');
    assert.ok(!content.includes('${CLAUDE_SKILL_DIR}'), 'no CLAUDE_SKILL_DIR');
    assert.ok(content.includes('/gsp-build'), '/gsp: → /gsp-');
    assert.ok(!content.includes('/gsp:build'), 'no /gsp:');
    assert.ok(content.includes('~/.config/opencode/'), 'opencode path');
    assert.ok(!content.includes('~/.claude/'), 'no claude path');
  });

  it('strips model: and effort: fields', () => {
    copyOpencodeSkills(path.join(FIXTURES, 'skills'), tmpDir, '~/.config/opencode/');
    const content = fs.readFileSync(path.join(tmpDir, 'gsp-test-skill', 'SKILL.md'), 'utf8');
    assert.ok(!content.includes('model:'), 'model stripped');
    assert.ok(!content.includes('effort:'), 'effort stripped');
  });

  it('copies sibling files', () => {
    copyOpencodeSkills(path.join(FIXTURES, 'skills'), tmpDir, '~/.config/opencode/');
    assert.ok(
      fs.existsSync(path.join(tmpDir, 'gsp-test-skill', 'styles', 'minimal.yml')),
      'sibling subdir files copied'
    );
  });
});

describe('Clean install — Gemini', () => {
  beforeEach(() => { tmpDir = makeTmp(); });
  afterEach(() => { cleanup(tmpDir); });

  it('converts body and paths for Gemini', () => {
    const count = copyGeminiSkills(path.join(FIXTURES, 'skills'), tmpDir, '~/.gemini/');
    assert.equal(count, 1);

    const content = fs.readFileSync(path.join(tmpDir, 'gsp-test-skill', 'SKILL.md'), 'utf8');
    assert.ok(!content.includes('${CLAUDE_SKILL_DIR}'), 'no CLAUDE_SKILL_DIR');
    assert.ok(content.includes('*(emphasis)*'), '<sub> → *()*');
    assert.ok(!content.includes('<sub>'), 'no <sub>');
    assert.ok(!content.includes('/gsp-build'), 'Gemini keeps colon syntax');
    assert.ok(content.includes('~/.gemini/'), 'gemini path');
    assert.ok(!content.includes('~/.claude/'), 'no claude path');
  });

  it('strips model: and effort: fields', () => {
    copyGeminiSkills(path.join(FIXTURES, 'skills'), tmpDir, '~/.gemini/');
    const content = fs.readFileSync(path.join(tmpDir, 'gsp-test-skill', 'SKILL.md'), 'utf8');
    assert.ok(!content.includes('model:'), 'model stripped');
    assert.ok(!content.includes('effort:'), 'effort stripped');
  });

  it('copies sibling files', () => {
    copyGeminiSkills(path.join(FIXTURES, 'skills'), tmpDir, '~/.gemini/');
    assert.ok(
      fs.existsSync(path.join(tmpDir, 'gsp-test-skill', 'styles', 'minimal.yml')),
      'sibling subdir files copied'
    );
  });
});

describe('Clean install — Codex', () => {
  beforeEach(() => { tmpDir = makeTmp(); });
  afterEach(() => { cleanup(tmpDir); });

  it('converts body and paths for Codex', () => {
    const count = copyCodexSkillsFromSource(path.join(FIXTURES, 'skills'), tmpDir, '~/.codex/');
    assert.equal(count, 1);

    const content = fs.readFileSync(path.join(tmpDir, 'gsp-test-skill', 'SKILL.md'), 'utf8');
    assert.ok(content.includes('$gsp-build'), '/gsp: → $gsp-');
    assert.ok(!content.includes('/gsp:build'), 'no /gsp:');
    assert.ok(content.includes('~/.codex/'), 'codex path');
    assert.ok(!content.includes('~/.claude/'), 'no claude path');
  });

  it('strips model: and effort: fields', () => {
    copyCodexSkillsFromSource(path.join(FIXTURES, 'skills'), tmpDir, '~/.codex/');
    const content = fs.readFileSync(path.join(tmpDir, 'gsp-test-skill', 'SKILL.md'), 'utf8');
    assert.ok(!content.includes('model:'), 'model stripped');
    assert.ok(!content.includes('effort:'), 'effort stripped');
  });

  it('copies sibling files', () => {
    copyCodexSkillsFromSource(path.join(FIXTURES, 'skills'), tmpDir, '~/.codex/');
    assert.ok(
      fs.existsSync(path.join(tmpDir, 'gsp-test-skill', 'styles', 'minimal.yml')),
      'sibling subdir files copied'
    );
  });
});

// ═══════════════════════════════════════════════════════════
// 3. UPGRADE INSTALL (pre-existing codebase with old GSP)
//    Tests cleanup of stale dirs, broken symlinks, and
//    preservation of non-GSP user content.
// ═══════════════════════════════════════════════════════════

describe('Upgrade — Claude (stale dirs)', () => {
  beforeEach(() => { tmpDir = makeTmp(); });
  afterEach(() => { cleanup(tmpDir); });

  it('removes legacy gsp- prefixed skill dirs', () => {
    const skillsDir = path.join(tmpDir, 'skills');
    fs.mkdirSync(skillsDir, { recursive: true });

    const staleGsp = path.join(skillsDir, 'gsp-old-skill');
    fs.mkdirSync(staleGsp, { recursive: true });
    fs.writeFileSync(path.join(staleGsp, 'SKILL.md'), 'stale');

    copyClaudeSkills(path.join(FIXTURES, 'skills'), skillsDir, './.claude/');

    assert.ok(!fs.existsSync(staleGsp), 'legacy gsp- dir removed');
  });

  it('preserves non-GSP dirs during cleanup', () => {
    const skillsDir = path.join(tmpDir, 'skills');
    fs.mkdirSync(skillsDir, { recursive: true });

    // Non-GSP dir should survive cleanup
    const otherSkill = path.join(skillsDir, 'my-other-tool');
    fs.mkdirSync(otherSkill, { recursive: true });
    fs.writeFileSync(path.join(otherSkill, 'SKILL.md'), 'keep');

    copyClaudeSkills(path.join(FIXTURES, 'skills'), skillsDir, './.claude/');

    assert.ok(fs.existsSync(otherSkill), 'non-GSP dir should survive');
    assert.ok(
      fs.existsSync(path.join(skillsDir, 'gsp-test-skill', 'SKILL.md')),
      'new gsp- prefixed dir should be installed'
    );
  });

  it('preserves non-GSP user skills', () => {
    const skillsDir = path.join(tmpDir, 'skills');
    fs.mkdirSync(skillsDir, { recursive: true });

    const userSkill = path.join(skillsDir, 'my-custom-skill');
    fs.mkdirSync(userSkill, { recursive: true });
    fs.writeFileSync(path.join(userSkill, 'SKILL.md'), 'user content');

    copyClaudeSkills(path.join(FIXTURES, 'skills'), skillsDir, './.claude/');

    assert.ok(fs.existsSync(userSkill), 'user skill survives');
    assert.equal(
      fs.readFileSync(path.join(userSkill, 'SKILL.md'), 'utf8'),
      'user content',
      'user content unchanged'
    );
  });

  it('removes broken symlinks from renamed source dirs', () => {
    const skillsDir = path.join(tmpDir, 'skills');
    fs.mkdirSync(skillsDir, { recursive: true });

    // Simulate broken symlink: old gsp-style → nonexistent target
    const brokenTarget = path.join(tmpDir, 'nonexistent-target');
    fs.symlinkSync(brokenTarget, path.join(skillsDir, 'gsp-old-symlink'));

    // Verify it's a broken symlink
    assert.ok(fs.lstatSync(path.join(skillsDir, 'gsp-old-symlink')).isSymbolicLink());
    assert.ok(!fs.existsSync(path.join(skillsDir, 'gsp-old-symlink')));

    copyClaudeSkills(path.join(FIXTURES, 'skills'), skillsDir, './.claude/');

    // Broken symlink should be gone
    try {
      fs.lstatSync(path.join(skillsDir, 'gsp-old-symlink'));
      assert.fail('broken symlink should have been removed');
    } catch (e) {
      assert.equal(e.code, 'ENOENT');
    }
  });
});

describe('Upgrade — OpenCode (stale dirs)', () => {
  beforeEach(() => { tmpDir = makeTmp(); });
  afterEach(() => { cleanup(tmpDir); });

  it('removes stale gsp- dirs before installing new ones', () => {
    const staleDir = path.join(tmpDir, 'gsp-stale-skill');
    fs.mkdirSync(staleDir, { recursive: true });
    fs.writeFileSync(path.join(staleDir, 'SKILL.md'), 'stale');

    copyOpencodeSkills(path.join(FIXTURES, 'skills'), tmpDir, '~/.config/opencode/');

    assert.ok(!fs.existsSync(staleDir), 'stale dir removed');
    assert.ok(
      fs.existsSync(path.join(tmpDir, 'gsp-test-skill', 'SKILL.md')),
      'new skill installed'
    );
  });
});

describe('Upgrade — Gemini (stale dirs)', () => {
  beforeEach(() => { tmpDir = makeTmp(); });
  afterEach(() => { cleanup(tmpDir); });

  it('removes stale gsp- dirs before installing new ones', () => {
    const staleDir = path.join(tmpDir, 'gsp-stale-skill');
    fs.mkdirSync(staleDir, { recursive: true });
    fs.writeFileSync(path.join(staleDir, 'SKILL.md'), 'stale');

    copyGeminiSkills(path.join(FIXTURES, 'skills'), tmpDir, '~/.gemini/');

    assert.ok(!fs.existsSync(staleDir), 'stale dir removed');
  });
});

describe('Upgrade — Codex (stale dirs)', () => {
  beforeEach(() => { tmpDir = makeTmp(); });
  afterEach(() => { cleanup(tmpDir); });

  it('removes stale gsp- dirs before installing new ones', () => {
    const staleDir = path.join(tmpDir, 'gsp-stale-skill');
    fs.mkdirSync(staleDir, { recursive: true });
    fs.writeFileSync(path.join(staleDir, 'SKILL.md'), 'stale');

    copyCodexSkillsFromSource(path.join(FIXTURES, 'skills'), tmpDir, '~/.codex/');

    assert.ok(!fs.existsSync(staleDir), 'stale dir removed');
  });
});

// ═══════════════════════════════════════════════════════════
// 4. AGENTS
// ═══════════════════════════════════════════════════════════

describe('Agents — Claude', () => {
  beforeEach(() => { tmpDir = makeTmp(); });
  afterEach(() => { cleanup(tmpDir); });

  it('copies with path replacement only (native format)', () => {
    const dest = path.join(tmpDir, 'agents');
    const count = copyAgents(path.join(FIXTURES, 'agents'), dest, './.claude/', 'claude');
    assert.equal(count, 1);

    const content = fs.readFileSync(path.join(dest, 'gsp-test-agent.md'), 'utf8');
    assert.ok(content.includes('./.claude/'), 'path replaced');
    assert.ok(!content.includes('~/.claude/'), 'original path removed');
    assert.ok(content.includes('AskUserQuestion'), 'keeps native tools');
    assert.ok(content.includes('/gsp:build'), 'keeps /gsp: syntax');
    assert.ok(content.includes('<sub>'), 'keeps <sub> tags');
    assert.ok(content.includes('Spawn the'), 'keeps Spawn');
  });

  it('cleans stale gsp- agents, preserves user agents', () => {
    const dest = path.join(tmpDir, 'agents');
    fs.mkdirSync(dest, { recursive: true });
    fs.writeFileSync(path.join(dest, 'gsp-old-agent.md'), 'stale');
    fs.writeFileSync(path.join(dest, 'my-custom-agent.md'), 'keep');

    copyAgents(path.join(FIXTURES, 'agents'), dest, './.claude/', 'claude', { clean: true });

    assert.ok(!fs.existsSync(path.join(dest, 'gsp-old-agent.md')), 'stale removed');
    assert.ok(fs.existsSync(path.join(dest, 'my-custom-agent.md')), 'user agent survives');
    assert.ok(fs.existsSync(path.join(dest, 'gsp-test-agent.md')), 'new agent installed');
  });

  it('ignores non-.md files in agents directory', () => {
    const agentSrc = path.join(tmpDir, 'src-agents');
    fs.mkdirSync(agentSrc, { recursive: true });
    fs.copyFileSync(
      path.join(FIXTURES, 'agents', 'gsp-test-agent.md'),
      path.join(agentSrc, 'gsp-test-agent.md')
    );
    fs.writeFileSync(path.join(agentSrc, 'README.txt'), 'not an agent');
    fs.writeFileSync(path.join(agentSrc, '.DS_Store'), 'junk');

    const dest = path.join(tmpDir, 'dest-agents');
    copyAgents(agentSrc, dest, './.claude/', 'claude');

    assert.ok(fs.existsSync(path.join(dest, 'gsp-test-agent.md')), '.md copied');
    assert.ok(!fs.existsSync(path.join(dest, 'README.txt')), 'non-.md skipped');
    assert.ok(!fs.existsSync(path.join(dest, '.DS_Store')), 'junk skipped');
  });
});

describe('Agents — OpenCode', () => {
  beforeEach(() => { tmpDir = makeTmp(); });
  afterEach(() => { cleanup(tmpDir); });

  it('converts tools, paths, and invocation syntax', () => {
    const dest = path.join(tmpDir, 'agents');
    copyAgents(path.join(FIXTURES, 'agents'), dest, '~/.config/opencode/', 'opencode');

    const content = fs.readFileSync(path.join(dest, 'gsp-test-agent.md'), 'utf8');
    assert.ok(content.includes('~/.config/opencode/'), 'opencode path');
    assert.ok(!content.includes('AskUserQuestion'), 'tool converted');
    assert.ok(content.includes('question'), 'opencode tool name');
    assert.ok(content.includes('/gsp-build'), '/gsp: → /gsp-');
    assert.ok(content.includes('Delegate to'), 'Spawn → Delegate');
    assert.ok(content.includes('subagent_type="general"'), 'general-purpose → general');
  });
});

describe('Agents — Gemini', () => {
  beforeEach(() => { tmpDir = makeTmp(); });
  afterEach(() => { cleanup(tmpDir); });

  it('converts tools, paths, sub tags, and filters MCP tools', () => {
    const dest = path.join(tmpDir, 'agents');
    copyAgents(path.join(FIXTURES, 'agents'), dest, '~/.gemini/', 'gemini');

    const content = fs.readFileSync(path.join(dest, 'gsp-test-agent.md'), 'utf8');
    assert.ok(content.includes('~/.gemini/'), 'gemini path');
    assert.ok(!content.includes('AskUserQuestion'), 'tool converted');
    assert.ok(content.includes('ask_user'), 'gemini tool name');
    assert.ok(content.includes('*(subscript)*'), '<sub> → *()*');
    assert.ok(!content.includes('<sub>'), 'no <sub> tags');
    assert.ok(content.includes('Invoke the'), 'Spawn → Invoke');
    assert.ok(!content.includes('mcp__github__search'), 'MCP tools filtered');
  });
});

describe('Agents — Codex regression guard', () => {
  it('copyAgents would install agents if called — gate in install() is load-bearing', () => {
    const dest = path.join(
      fs.mkdtempSync(path.join(os.tmpdir(), 'gsp-codex-guard-')),
      'agents'
    );

    try {
      const count = copyAgents(path.join(FIXTURES, 'agents'), dest, '~/.codex/', 'codex');
      assert.equal(count, 1, 'copyAgents blindly copies if called');

      const content = fs.readFileSync(path.join(dest, 'gsp-test-agent.md'), 'utf8');
      assert.ok(content.includes('AskUserQuestion'),
        'codex has no agent conversion — gate in install() prevents this');
    } finally {
      cleanup(path.dirname(dest));
    }
  });
});

// ═══════════════════════════════════════════════════════════
// 5. BUNDLES (prompts, templates, references)
// ═══════════════════════════════════════════════════════════

describe('Bundle copy — OpenCode', () => {
  beforeEach(() => { tmpDir = makeTmp(); });
  afterEach(() => { cleanup(tmpDir); });

  it('replaces paths and converts invocation syntax', () => {
    const dest = path.join(tmpDir, 'prompts');
    copyWithPathReplacement(path.join(FIXTURES, 'prompts'), dest, '~/.config/opencode/', 'opencode');

    const content = fs.readFileSync(path.join(dest, 'system.md'), 'utf8');
    assert.ok(content.includes('~/.config/opencode/'), 'opencode path');
    assert.ok(!content.includes('~/.claude/'), 'no claude path');
    assert.ok(content.includes('/gsp-build'), '/gsp: → /gsp-');
  });
});

describe('Bundle copy — Gemini', () => {
  beforeEach(() => { tmpDir = makeTmp(); });
  afterEach(() => { cleanup(tmpDir); });

  it('replaces paths', () => {
    const dest = path.join(tmpDir, 'prompts');
    copyWithPathReplacement(path.join(FIXTURES, 'prompts'), dest, '~/.gemini/', 'gemini');

    const content = fs.readFileSync(path.join(dest, 'system.md'), 'utf8');
    assert.ok(content.includes('~/.gemini/'), 'gemini path');
    assert.ok(!content.includes('~/.claude/'), 'no claude path');
  });
});

describe('Bundle copy — Codex', () => {
  beforeEach(() => { tmpDir = makeTmp(); });
  afterEach(() => { cleanup(tmpDir); });

  it('replaces paths and converts invocation syntax', () => {
    const dest = path.join(tmpDir, 'prompts');
    copyWithPathReplacement(path.join(FIXTURES, 'prompts'), dest, '~/.codex/', 'codex');

    const content = fs.readFileSync(path.join(dest, 'system.md'), 'utf8');
    assert.ok(content.includes('~/.codex/'), 'codex path');
    assert.ok(!content.includes('~/.claude/'), 'no claude path');
    assert.ok(content.includes('$gsp-build'), '/gsp: → $gsp-');
  });
});

describe('Bundle copy — integrity', () => {
  beforeEach(() => { tmpDir = makeTmp(); });
  afterEach(() => { cleanup(tmpDir); });

  it('copies JSON files verbatim (no corruption)', () => {
    const dest = path.join(tmpDir, 'templates');
    copyWithPathReplacement(path.join(FIXTURES, 'templates'), dest, '~/.config/opencode/', 'opencode');

    const parsed = JSON.parse(fs.readFileSync(path.join(dest, 'config.json'), 'utf8'));
    assert.equal(parsed.project_type, 'test');
    assert.equal(parsed.version, '0.0.1');
  });

  it('recreates directory tree structure', () => {
    const dest = path.join(tmpDir, 'references');
    copyWithPathReplacement(path.join(FIXTURES, 'references'), dest, '~/.config/opencode/', 'opencode');
    assert.ok(fs.existsSync(path.join(dest, 'chunk-format.md')));
  });
});
