import { defineConfig } from "eslint/config";
import globals from "globals";

import shinyCodeConfig from "./index.js";

export default defineConfig([
  {
    files: ["*.js", "bin/*.js", "test/*.js"],
    ...shinyCodeConfig.configs.js,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
    settings: {
      "import/resolver": {
        node: { extensions: [".js", ".mjs", ".cjs"] },
      },
    },
    rules: {
      "import/no-unresolved": [
        "error",
        { ignore: ["^eslint/", "^eslint$", "^typescript-eslint$"] },
      ],
    },
  },
]);
