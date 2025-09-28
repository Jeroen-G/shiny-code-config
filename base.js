import eslint from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import unusedImports from 'eslint-plugin-unused-imports';
import tsEslint from 'typescript-eslint';

export const javascript = {
    extends: [
        eslint.configs.recommended,
        importPlugin.flatConfigs.recommended,
        prettierRecommended,
    ],
    plugins: {
        'unused-imports': unusedImports,
    },
    rules: {
        // Enforce consistent indentation. https://eslint.org/docs/latest/rules/indent
        indent: ['error', 4, { SwitchCase: 1 }],
        // Enforce consistent linebreak style. https://eslint.org/docs/latest/rules/linebreak-style
        'linebreak-style': ['error', 'unix'],
        // Enforce the consistent use of single quotes. https://eslint.org/docs/latest/rules/quotes
        quotes: ['error', 'single', { avoidEscape: true }],
        // Require semicolons. https://eslint.org/docs/latest/rules/semi
        semi: ['error', 'always'],
        // Allows `@ts-` comments. https://typescript-eslint.io/rules/ban-ts-comment/
        '@typescript-eslint/ban-ts-comment': 'off',
        // Find and remove unused es6 module imports. https://github.com/sweepline/eslint-plugin-unused-imports
        'unused-imports/no-unused-imports': 'error',
        // Ensure all imports appear before other statements. https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/first.md
        'import/first': 'error',
        // Enforce a newline after import statements. https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/newline-after-import.md
        'import/newline-after-import': 'error',
        // Enforce a convention in the order of imports. https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
        'import/order': [
            'error',
            {
                groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
                'newlines-between': 'always',
            },
        ],
        // Prettier config. https://prettier.io/docs/en/options.html
        'prettier/prettier': [
            'error',
            {
                bracketSpacing: true,
                bracketSameLine: true,
                singleQuote: true,
                arrowParens: 'avoid',
                trailingComma: 'es5',
                tabWidth: 4,
                printWidth: 100,
            },
        ],
        // Slightly opinionated syntax preferences
        'no-restricted-syntax': [
            'error',
            {
                selector: 'Property[method=true]',
                message:
                    'Use arrow function properties (e.g., reset: () => {}) instead of method shorthand (reset() {}).',
            },
        ],
    },
};

export const typescript = {
    ...javascript,
    extends: [
        ...javascript.extends,
        tsEslint.configs.recommended,
        importPlugin.flatConfigs.typescript,
    ],
    plugins: {
        ...javascript.plugins,
        '@typescript-eslint': tsPlugin,
    },
    settings: {
        'import/resolver': {
            typescript: {},
        },
    },
    languageOptions: {
        parser: tsParser,
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
            ecmaVersion: 'latest',
            sourceType: 'module',
            project: './tsconfig.json',
        },
    },
};
