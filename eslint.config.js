import { defineConfig } from 'eslint/config';

import shinyCodeConfig from './index.js';

export default defineConfig([
    {
        files: ['*.js'],
        ...shinyCodeConfig.configs.js,
    },
]);
