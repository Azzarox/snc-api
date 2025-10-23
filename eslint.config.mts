import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import unusedImports from "eslint-plugin-unused-imports";
export default defineConfig([
  // JS rules
  js.configs.recommended,

  // TS rules
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{js,ts,cjs,mjs}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      "unused-imports": unusedImports,
    },
    rules: {
      'semi': ['error', 'always'],
      'indent': ['error', 4, { SwitchCase: 1 }],
      'quotes': ['error', 'single'],
      'no-console': 'off',
      'no-unused-vars': 'off',
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          "vars": "all",
          "varsIgnorePattern": "^_",
          "args": "after-used",
          "argsIgnorePattern": "^_",
        },
      ]
      ,
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },

  {
    ignores: ['dist/', 'node_modules/'],
  },
]);