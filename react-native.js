import reactNativePlugin from 'eslint-plugin-react-native';

import { reactSetup } from './react.js';

export const reactNativeSetup = {
    ...reactSetup,
    languageOptions: {
        ...reactSetup.languageOptions,
        globals: {
            ...reactSetup.languageOptions.globals,
            ...reactNativePlugin.environments['react-native'].globals,
        },
    },
    plugins: {
        'react-native': reactNativePlugin,
        ...reactSetup.plugins,
    },
    rules: {
        ...reactSetup.rules,
        // Detect StyleSheet rules which are not used in your React components.
        'react-native/no-unused-styles': 'error',
        // Detect StyleSheet rules and inline styles containing color literals instead of variables.
        'react-native/no-color-literals': 'error',
        // No style arrays that have 1 element only <View style={[{height: 10}]}/>.
        'react-native/no-single-element-style-arrays': 'error',
        // Detect raw text outside of Text component.
        'react-native/no-raw-text': 'error',
        // Workaround for the bug where linting reports `Parse errors in imported module 'react-native': parser.parse is not a function`
        'import/namespace': 'off',
    },
};
