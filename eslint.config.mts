import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import unusedImports from 'eslint-plugin-unused-imports';
import pluginPrettier from 'eslint-plugin-prettier';

export default defineConfig([
	globalIgnores(['dist', 'node_modules']),
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
				project: './tsconfig.json',
			},
			globals: {
				...globals.node,
			},
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
			'unused-imports': unusedImports,
			prettier: pluginPrettier,
		},
		rules: {
			'no-console': 'off',
			'no-unused-vars': 'off',
			'unused-imports/no-unused-imports': 'error',
			'unused-imports/no-unused-vars': [
				'warn',
				{
					vars: 'all',
					varsIgnorePattern: '^_',
					args: 'after-used',
					argsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/no-explicit-any': ['warn'],
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-floating-promises': 'error',
			'@typescript-eslint/require-await': 'warn',
			'@typescript-eslint/no-misused-promises': 'error',

			'prettier/prettier': [
				'error',
				{},
				{
					endOfLine: 'auto',
				},
				{ usePrettierrc: true },
			],
		},
	},
]);
