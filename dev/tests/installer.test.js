const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const {
  convertToolName,
  convertGeminiToolName,
  convertCodexToolName,
  stripSubTags,
  applyOpencodeBodyReplacements,
  applyGeminiBodyReplacements,
  applyCodexBodyReplacements,
  convertClaudeToOpencodeAgent,
  convertClaudeToGeminiAgent,
  convertClaudeSkillToOpencode,
  convertClaudeSkillToGemini,
  convertClaudeSkillToCodex,
  claudeToOpencodeTools,
  claudeToGeminiTools,
  claudeToCodexTools,
  colorNameToHex,
} = require('../../bin/install.js');

const FIXTURES = path.join(__dirname, 'fixtures');
const read = (name) => fs.readFileSync(path.join(FIXTURES, name), 'utf8');

// ── Tool name converters ──────────────────────────────

describe('convertToolName (OpenCode)', () => {
  it('maps known Claude tools', () => {
    assert.equal(convertToolName('AskUserQuestion'), 'question');
    assert.equal(convertToolName('SlashCommand'), 'skill');
    assert.equal(convertToolName('TodoWrite'), 'todowrite');
    assert.equal(convertToolName('WebFetch'), 'webfetch');
    assert.equal(convertToolName('WebSearch'), 'websearch');
  });

  it('passes through MCP tools unchanged', () => {
    assert.equal(convertToolName('mcp__github__search'), 'mcp__github__search');
    assert.equal(convertToolName('mcp__figma__get_file'), 'mcp__figma__get_file');
  });

  it('lowercases unknown tools', () => {
    assert.equal(convertToolName('Read'), 'read');
    assert.equal(convertToolName('Write'), 'write');
    assert.equal(convertToolName('Bash'), 'bash');
    assert.equal(convertToolName('Agent'), 'agent');
  });
});

describe('convertGeminiToolName', () => {
  it('maps known Claude tools', () => {
    assert.equal(convertGeminiToolName('Read'), 'read_file');
    assert.equal(convertGeminiToolName('Write'), 'write_file');
    assert.equal(convertGeminiToolName('Edit'), 'replace');
    assert.equal(convertGeminiToolName('Bash'), 'run_shell_command');
    assert.equal(convertGeminiToolName('Glob'), 'glob');
    assert.equal(convertGeminiToolName('Grep'), 'search_file_content');
    assert.equal(convertGeminiToolName('WebSearch'), 'google_web_search');
    assert.equal(convertGeminiToolName('WebFetch'), 'web_fetch');
    assert.equal(convertGeminiToolName('AskUserQuestion'), 'ask_user');
    assert.equal(convertGeminiToolName('TodoWrite'), 'write_todos');
  });

  it('returns null for MCP tools', () => {
    assert.equal(convertGeminiToolName('mcp__github__search'), null);
  });

  it('lowercases unknown tools', () => {
    assert.equal(convertGeminiToolName('Agent'), 'agent');
    assert.equal(convertGeminiToolName('NotebookEdit'), 'notebookedit');
  });
});

describe('convertCodexToolName', () => {
  it('maps known Claude tools', () => {
    assert.equal(convertCodexToolName('Read'), 'read');
    assert.equal(convertCodexToolName('Write'), 'write');
    assert.equal(convertCodexToolName('Edit'), 'edit');
    assert.equal(convertCodexToolName('Bash'), 'shell');
    assert.equal(convertCodexToolName('Glob'), 'glob');
    assert.equal(convertCodexToolName('Grep'), 'grep');
    assert.equal(convertCodexToolName('WebSearch'), 'web_search');
    assert.equal(convertCodexToolName('WebFetch'), 'web_fetch');
  });

  it('returns null for MCP tools', () => {
    assert.equal(convertCodexToolName('mcp__github__search'), null);
    assert.equal(convertCodexToolName('mcp__figma__get_file'), null);
  });

  it('lowercases unknown tools', () => {
    assert.equal(convertCodexToolName('Agent'), 'agent');
  });
});

// ── stripSubTags ──────────────────────────────────────

describe('stripSubTags', () => {
  it('converts sub tags to italic parens', () => {
    assert.equal(stripSubTags('<sub>hello</sub>'), '*(hello)*');
  });

  it('handles multiple sub tags', () => {
    assert.equal(
      stripSubTags('a <sub>b</sub> c <sub>d</sub> e'),
      'a *(b)* c *(d)* e'
    );
  });

  it('leaves content without sub tags unchanged', () => {
    assert.equal(stripSubTags('no tags here'), 'no tags here');
  });
});

// ── Body replacements ─────────────────────────────────

describe('applyOpencodeBodyReplacements', () => {
  it('replaces AskUserQuestion', () => {
    assert.equal(applyOpencodeBodyReplacements('Use AskUserQuestion tool'), 'Use question tool');
  });

  it('replaces SlashCommand', () => {
    assert.equal(applyOpencodeBodyReplacements('the SlashCommand tool'), 'the skill tool');
  });

  it('replaces Skill tool with lookahead', () => {
    assert.equal(applyOpencodeBodyReplacements('Use the Skill tool'), 'Use the skill tool');
    // Should NOT replace Skill in other contexts
    assert.equal(applyOpencodeBodyReplacements('SKILL.md file'), 'SKILL.md file');
  });

  it('replaces TodoWrite', () => {
    assert.equal(applyOpencodeBodyReplacements('use TodoWrite'), 'use todowrite');
  });

  it('converts /gsp: to /gsp-', () => {
    assert.equal(applyOpencodeBodyReplacements('/gsp:build'), '/gsp-build');
  });

  it('converts ~/.claude to ~/.config/opencode', () => {
    assert.equal(applyOpencodeBodyReplacements('~/.claude/settings'), '~/.config/opencode/settings');
  });

  it('converts subagent_type general-purpose to general', () => {
    assert.equal(
      applyOpencodeBodyReplacements('subagent_type="general-purpose"'),
      'subagent_type="general"'
    );
  });

  it('converts Spawn agent pattern', () => {
    assert.equal(
      applyOpencodeBodyReplacements('Spawn the `gsp-project-builder` agent'),
      'Delegate to the `gsp-project-builder` subagent'
    );
  });

  it('converts spawn (lowercase) agent pattern', () => {
    assert.equal(
      applyOpencodeBodyReplacements('spawn the `gsp-project-reviewer` agent'),
      'delegate to the `gsp-project-reviewer` subagent'
    );
  });

  it('converts Re-spawn pattern', () => {
    assert.equal(applyOpencodeBodyReplacements('Re-spawn the agent'), 'Re-delegate to the subagent');
    assert.equal(applyOpencodeBodyReplacements('re-spawn the agent'), 're-delegate to the subagent');
  });
});

describe('applyGeminiBodyReplacements', () => {
  it('replaces AskUserQuestion', () => {
    assert.equal(applyGeminiBodyReplacements('Use AskUserQuestion tool'), 'Use ask_user tool');
  });

  it('replaces SlashCommand', () => {
    assert.equal(applyGeminiBodyReplacements('the SlashCommand tool'), 'the activate_skill tool');
  });

  it('replaces Skill tool with lookahead', () => {
    assert.equal(applyGeminiBodyReplacements('Use the Skill tool'), 'Use the activate_skill tool');
    assert.equal(applyGeminiBodyReplacements('SKILL.md file'), 'SKILL.md file');
  });

  it('replaces TodoWrite', () => {
    assert.equal(applyGeminiBodyReplacements('use TodoWrite'), 'use write_todos');
  });

  it('converts ~/.claude to ~/.gemini', () => {
    assert.equal(applyGeminiBodyReplacements('~/.claude/settings'), '~/.gemini/settings');
  });

  it('does NOT convert /gsp: (Gemini keeps colon syntax)', () => {
    assert.equal(applyGeminiBodyReplacements('/gsp:build'), '/gsp:build');
  });

  it('converts Spawn agent pattern', () => {
    assert.equal(
      applyGeminiBodyReplacements('Spawn the `gsp-project-builder` agent'),
      'Invoke the `gsp-project-builder` subagent'
    );
  });

  it('converts Re-spawn pattern', () => {
    assert.equal(applyGeminiBodyReplacements('Re-spawn the agent'), 'Re-invoke the subagent');
    assert.equal(applyGeminiBodyReplacements('re-spawn the agent'), 're-invoke the subagent');
  });
});

describe('applyCodexBodyReplacements', () => {
  it('converts /gsp: to $gsp-', () => {
    assert.equal(applyCodexBodyReplacements('/gsp:build'), '$gsp-build');
  });

  it('converts ~/.claude to ~/.codex', () => {
    assert.equal(applyCodexBodyReplacements('~/.claude/settings'), '~/.codex/settings');
  });

  it('replaces AskUserQuestion', () => {
    assert.equal(applyCodexBodyReplacements('Use AskUserQuestion tool'), 'Use ask the user tool');
  });

  it('replaces SlashCommand', () => {
    assert.equal(applyCodexBodyReplacements('the SlashCommand tool'), 'the skill tool');
  });

  it('replaces Skill tool with lookahead', () => {
    assert.equal(applyCodexBodyReplacements('Use the Skill tool'), 'Use the skill tool');
    assert.equal(applyCodexBodyReplacements('SKILL.md file'), 'SKILL.md file');
  });

  it('replaces TodoWrite', () => {
    assert.equal(applyCodexBodyReplacements('use TodoWrite'), 'use todowrite');
  });

  it('converts Spawn agent pattern', () => {
    assert.equal(
      applyCodexBodyReplacements('Spawn the `gsp-project-builder` agent'),
      'Spawn a worker agent for `gsp-project-builder`'
    );
  });

  it('converts Re-spawn pattern', () => {
    assert.equal(applyCodexBodyReplacements('Re-spawn the agent'), 'Spawn another worker agent');
    assert.equal(applyCodexBodyReplacements('re-spawn the agent'), 'spawn another worker agent');
  });
});

// ── Agent converters (snapshot) ───────────────────────

describe('convertClaudeToOpencodeAgent', () => {
  const input = read('sample-agent.claude.md');

  it('matches expected snapshot', () => {
    const expected = read('sample-agent.opencode.expected.md');
    assert.equal(convertClaudeToOpencodeAgent(input), expected);
  });

  it('passes through content without frontmatter', () => {
    const bare = 'Just a body with no frontmatter.';
    const result = convertClaudeToOpencodeAgent(bare);
    assert.ok(!result.startsWith('---'));
    assert.ok(result.includes('Just a body'));
  });

  it('handles incomplete frontmatter (no closing ---)', () => {
    const broken = '---\nname: broken\nbody text';
    const result = convertClaudeToOpencodeAgent(broken);
    // Should pass through since no closing ---
    assert.ok(result.includes('body text'));
  });
});

describe('convertClaudeToGeminiAgent', () => {
  const input = read('sample-agent.claude.md');

  it('matches expected snapshot', () => {
    const expected = read('sample-agent.gemini.expected.md');
    assert.equal(convertClaudeToGeminiAgent(input), expected);
  });

  it('passes through content without frontmatter', () => {
    const bare = 'Just body content.';
    const result = convertClaudeToGeminiAgent(bare);
    assert.ok(!result.startsWith('---'));
  });

  it('filters out MCP tools from tool list', () => {
    const result = convertClaudeToGeminiAgent(input);
    assert.ok(!result.includes('mcp__'));
  });

  it('strips sub tags in body', () => {
    const result = convertClaudeToGeminiAgent(input);
    assert.ok(result.includes('*(subscript)*'));
    assert.ok(!result.includes('<sub>'));
  });
});

// ── Skill converters (snapshot) ───────────────────────

describe('convertClaudeSkillToOpencode', () => {
  const input = read('sample-skill.claude.md');

  it('matches expected snapshot', () => {
    const expected = read('sample-skill.opencode.expected.md');
    assert.equal(convertClaudeSkillToOpencode(input, 'gsp-test-skill'), expected);
  });

  it('adds frontmatter to bare body', () => {
    const bare = 'Just instructions, no frontmatter.';
    const result = convertClaudeSkillToOpencode(bare, 'my-skill');
    assert.ok(result.startsWith('---'));
    assert.ok(result.includes('name: my-skill'));
    assert.ok(result.includes('description: GSP skill'));
  });

  it('replaces CLAUDE_SKILL_DIR with SKILL_DIR', () => {
    const result = convertClaudeSkillToOpencode(input, 'gsp-test-skill');
    assert.ok(!result.includes('CLAUDE_SKILL_DIR'));
    assert.ok(result.includes('${SKILL_DIR}'));
  });
});

describe('convertClaudeSkillToGemini', () => {
  const input = read('sample-skill.claude.md');

  it('matches expected snapshot', () => {
    const expected = read('sample-skill.gemini.expected.md');
    assert.equal(convertClaudeSkillToGemini(input, 'gsp-test-skill'), expected);
  });

  it('adds frontmatter to bare body', () => {
    const bare = 'Bare body.';
    const result = convertClaudeSkillToGemini(bare, 'test');
    assert.ok(result.startsWith('---'));
    assert.ok(result.includes('name: test'));
  });

  it('replaces CLAUDE_SKILL_DIR with relative path', () => {
    const result = convertClaudeSkillToGemini(input, 'gsp-test-skill');
    assert.ok(!result.includes('CLAUDE_SKILL_DIR'));
    assert.ok(result.includes('./'));
  });

  it('strips sub tags in body', () => {
    const result = convertClaudeSkillToGemini(input, 'gsp-test-skill');
    assert.ok(result.includes('*(emphasis)*'));
    assert.ok(!result.includes('<sub>'));
  });
});

describe('convertClaudeSkillToCodex', () => {
  const input = read('sample-skill.claude.md');

  it('matches expected snapshot', () => {
    const expected = read('sample-skill.codex.expected.md');
    assert.equal(convertClaudeSkillToCodex(input, 'gsp-test-skill'), expected);
  });

  it('adds frontmatter to bare body', () => {
    const bare = 'Bare body.';
    const result = convertClaudeSkillToCodex(bare, 'test');
    assert.ok(result.startsWith('---'));
    assert.ok(result.includes('name: test'));
  });

  it('replaces CLAUDE_SKILL_DIR with relative path', () => {
    const result = convertClaudeSkillToCodex(input, 'gsp-test-skill');
    assert.ok(!result.includes('CLAUDE_SKILL_DIR'));
  });

  it('converts /gsp: to $gsp-', () => {
    const result = convertClaudeSkillToCodex(input, 'gsp-test-skill');
    assert.ok(result.includes('$gsp-build'));
    assert.ok(!result.includes('/gsp:'));
  });
});

// ── Mapping completeness ──────────────────────────────

describe('Mapping objects', () => {
  it('OpenCode mapping has expected key count', () => {
    assert.ok(Object.keys(claudeToOpencodeTools).length >= 4,
      `Expected ≥4 OpenCode mappings, got ${Object.keys(claudeToOpencodeTools).length}`);
  });

  it('Gemini mapping has expected key count', () => {
    assert.ok(Object.keys(claudeToGeminiTools).length >= 8,
      `Expected ≥8 Gemini mappings, got ${Object.keys(claudeToGeminiTools).length}`);
  });

  it('Codex mapping has expected key count', () => {
    assert.ok(Object.keys(claudeToCodexTools).length >= 6,
      `Expected ≥6 Codex mappings, got ${Object.keys(claudeToCodexTools).length}`);
  });

  it('colorNameToHex has common colors', () => {
    assert.ok(colorNameToHex.red);
    assert.ok(colorNameToHex.blue);
    assert.ok(colorNameToHex.orange);
    assert.ok(colorNameToHex.cyan);
  });

  it('all mapping values are strings', () => {
    for (const [k, v] of Object.entries(claudeToOpencodeTools)) {
      assert.equal(typeof v, 'string', `OpenCode: ${k} → ${v}`);
    }
    for (const [k, v] of Object.entries(claudeToGeminiTools)) {
      assert.equal(typeof v, 'string', `Gemini: ${k} → ${v}`);
    }
    for (const [k, v] of Object.entries(claudeToCodexTools)) {
      assert.equal(typeof v, 'string', `Codex: ${k} → ${v}`);
    }
  });
});
