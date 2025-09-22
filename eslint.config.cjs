// ESLint v9 flat config (repo-wide)
const js = require('@eslint/js')
const tseslint = require('typescript-eslint')
const react = require('eslint-plugin-react')
const reactHooks = require('eslint-plugin-react-hooks')
const jsxA11y = require('eslint-plugin-jsx-a11y')
const prettier = require('eslint-config-prettier')

module.exports = [
  {
    // ignore outputs & config itself
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/artifacts/**',
      'eslint.config.*',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: { react, 'react-hooks': reactHooks, 'jsx-a11y': jsxA11y },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
    },
    settings: { react: { version: 'detect' } },
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { window: 'readonly', document: 'readonly', navigator: 'readonly' },
    },
  },

  {
    files: ['**/*.d.ts', 'apps/web/next-env.d.ts'],
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },

  prettier,
]
