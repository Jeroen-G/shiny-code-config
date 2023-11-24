module.exports = {
    extends: ['./react.js'],
    env: {
        'react-native/react-native': true,
    },
    plugins: [
        'react',
        'react-native',
        'react-hooks',
        'prettier',
        '@typescript-eslint',
        'unused-imports',
    ],
    rules: {
        'react-native/no-unused-styles': 'error',
    },
};
