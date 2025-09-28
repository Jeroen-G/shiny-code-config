import { javascript, typescript } from './base.js';
import { reactNativeSetup } from './react-native.js';
import { reactSetup } from './react.js';

export default {
    configs: {
        js: javascript,
        ts: typescript,
        react: reactSetup,
        reactNative: reactNativeSetup,
    },
};
