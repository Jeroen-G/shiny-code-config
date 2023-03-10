# ✨Shiny code config

My [sharable settings](https://eslint.org/docs/latest/developer-guide/shareable-configs) for Eslint and Prettier, based on the amazing work done by [Wes Bos](https://github.com/wesbos/eslint-config-wesbos/).

## Installation

1. Install the package
```
npm install eslint-config-shiny-code
```

2. Add the config to package.json (or in an eslintrc file)
```json
"eslintConfig": {
  "extends": ["shiny-code"]
},
"scripts": {
  "lint": "eslint .",
  "fix": "eslint . --fix"
},
```

If you want to override or extend any rules, add the `rules: {}` beneath the extends in your Eslint config.

3. Add a tsconfig.json, this can be copied from this repository or just be an empty `{}` object.
4. Bonus: enable automatic eslint running in the IDE for the project.

## Specific configs

### React
```json
"extends": ["shiny-code/react"]
```

### NextJS
```json
"extends": ["shiny-code/react-nextjs"]
```

### React Native
```json
"extends": ["shiny-code/react-native"]
```
