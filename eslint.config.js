import { defineConfig } from "eslint/config";

import shinyCodeConfig from "./index.js";

export default defineConfig([
  {
    files: ["*.js"],
    ...shinyCodeConfig.configs.js,
    settings: {
      "import/resolver": {
        node: { extensions: [".js", ".mjs", ".cjs"] },
      },
    },
    rules: {
      "import/no-unresolved": [
        "error",
        { ignore: ["^eslint/", "^typescript-eslint$"] },
      ],
    },
  },
]);
