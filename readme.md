# ✨Shiny code config

My [sharable settings](https://eslint.org/docs/latest/developer-guide/shareable-configs) for Eslint and Prettier, based on the amazing work done by [Wes Bos](https://github.com/wesbos/eslint-config-wesbos/).

Version 2 of this package uses ESLint 9 and its new flat config.

## Installation

1. Install the package
```
npm install eslint-config-shiny-code
```

2. Add the scripts to package.json
```json
"scripts": {
  "lint": "eslint .",
  "fix": "eslint . --fix"
},
```

3. Create a eslint.config.js (or .mjs if you don't have `"type: "module"` in your package.json)
```js
import {defineConfig} from "eslint/config";
import shinyConfig from "eslint-config-shiny-code";

export default defineConfig([
    {
        ...shinyConfig.configs.base,
        files: ["src/**/*.{ts,js,tsx}"],
        ignores: ['node_modules'],
    }
]);

```

If you want to override or extend any rules, add a new entry to the array.

3. Add a tsconfig.json, this can be copied from this repository or just be an empty `{}` object.
4. Bonus: enable automatic eslint running in the IDE for the project.

## Specific configs

### React
```js
import {defineConfig} from "eslint/config";
import shinyConfig from "eslint-config-shiny-code";

export default defineConfig([
  {
    ...shinyConfig.configs.react,
    files: ["src/**/*.{ts,js,tsx}"],
    ignores: ['node_modules'],
  }
]);
```

### React Native
```js
import {defineConfig} from "eslint/config";
import shinyConfig from "eslint-config-shiny-code";

export default defineConfig([
    {
        ...shinyConfig.configs.reactNative,
        files: ["src/**/*.{ts,js,tsx}"],
        ignores: ['android/app/build', 'dist/*', 'expo-env.d.ts', 'node_modules', '.expo'],
    }
]);
```
