import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['react', 'typescript', 'import', 'oxc'],
  categories: {
    correctness: 'error',
    suspicious: 'warn',
    perf: 'warn',
  },
  env: {
    browser: true,
    es2022: true,
  },
  settings: {
    react: {
      jsxRuntime: 'automatic',
      version: '19',
    },
  },
  rules: {
    'react/jsx-key': 'error',
    'react/no-array-index-key': 'warn',
    'react/self-closing-comp': 'warn',
    'react/react-in-jsx-scope': 'off',
    'typescript/no-explicit-any': 'off',
    'typescript/consistent-type-imports': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
  ignorePatterns: ['dist/**', 'coverage/**', 'node_modules/**', '**/*.d.ts', 'vendor/**'],
})
