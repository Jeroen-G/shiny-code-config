module.exports = {
    extends: [
        './.eslintrc.js',
        'plugin:react/recommended', // https://github.com/jsx-eslint/eslint-plugin-react
    ],
    plugins: ['react', 'react-hooks'],
    settings: {
        react: {
            version: 'detect',
        },
    },
    rules: {
        // Disallow unnecessary JSX expressions when literals alone are sufficient. https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-curly-brace-presence.md
        'react/jsx-curly-brace-presence': ['error', { props: "never", children: "never", "propElementValues": "always" }],
        // Ensure destructuring and symmetric naming of useState hook value and setter variables. https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/hook-use-state.md
        'react/hook-use-state': 'error',
        // Checks rules of Hooks. https://reactjs.org/docs/hooks-rules.html
        'react-hooks/rules-of-hooks': 'error',
        // Checks useEffect dependencies. https://reactjs.org/docs/hooks-rules.html
        'react-hooks/exhaustive-deps': 'warn',
    },
};
