// This is a patch so that eslint will load the plugins as dependencies.
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
    extends: [
        'eslint:recommended', // https://eslint.org/docs/latest/rules/
        'plugin:react/recommended', // https://github.com/jsx-eslint/eslint-plugin-react
        'plugin:@typescript-eslint/recommended', // https://typescript-eslint.io
    ],
    plugins: ['@typescript-eslint', 'prettier', 'react', 'react-hooks', 'unused-imports'],
    env: {
        browser: true,
        node: true,
        jest: true,
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
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
        // Ensure destructuring and symmetric naming of useState hook value and setter variables. https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/hook-use-state.md
        'react/hook-use-state': 'error',
        // Checks rules of Hooks. https://reactjs.org/docs/hooks-rules.html
        'react-hooks/rules-of-hooks': 'error',
        // Checks useEffect dependencies. https://reactjs.org/docs/hooks-rules.html
        'react-hooks/exhaustive-deps': 'warn',
        // Find and remove unused es6 module imports. https://github.com/sweepline/eslint-plugin-unused-imports
        'unused-imports/no-unused-imports': 'error',
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
    },
};
