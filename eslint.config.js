// Next 16 flat config — scopes ESLint to src/ only.
// gsp/, dev/, scripts/, bin/, plugin/ are ignored (not JS app code).

const next = require('eslint-config-next');

module.exports = [
  ...next,
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'gsp/**',
      'dev/**',
      'plugin/**',
      'scripts/**',
      'bin/**',
      'next-env.d.ts',
    ],
  },
];
