import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

import { typescript } from './base.js';

export const reactSetup = {
    ...typescript,
    extends: [
        ...typescript.extends,
        reactPlugin.configs.flat.recommended, // https://github.com/jsx-eslint/eslint-plugin-react
        reactPlugin.configs.flat['jsx-runtime'], // https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#removing-unused-react-imports
    ],
    languageOptions: {
        ...typescript.languageOptions,
        ...reactPlugin.configs.flat.recommended.languageOptions,
        globals: {
            ...globals.browser,
            ...globals.node,
            ...globals.jest,
        },
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    plugins: {
        ...typescript.plugins,
        react: reactPlugin,
        'react-hooks': reactHooks,
    },
    rules: {
        ...typescript.rules,
        // Disallow unnecessary JSX expressions when literals alone are sufficient. https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-curly-brace-presence.md
        'react/jsx-curly-brace-presence': [
            'error',
            { props: 'never', children: 'never', propElementValues: 'always' },
        ],
        // Ensure destructuring and symmetric naming of useState hook value and setter variables. https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/hook-use-state.md
        'react/hook-use-state': 'error',
        // Enforces consistent naming for boolean props. https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/boolean-prop-naming.md
        'react/boolean-prop-naming': 'error',
        // Checks rules of Hooks. https://reactjs.org/docs/hooks-rules.html
        'react-hooks/rules-of-hooks': 'error',
        // Checks useEffect dependencies. https://reactjs.org/docs/hooks-rules.html
        'react-hooks/exhaustive-deps': 'warn',
    },
};
