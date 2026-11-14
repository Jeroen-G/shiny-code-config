import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { after, describe, test } from "node:test";
import { fileURLToPath } from "node:url";

import { ESLint } from "eslint";

import { detectType, init } from "../bin/init.js";
import shinyConfig from "../index.js";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
// Fixtures live inside the repo so they resolve eslint & plugins from its node_modules.
const tmpRoot = path.join(repoRoot, "test", ".tmp");

fs.rmSync(tmpRoot, { recursive: true, force: true });
after(() => fs.rmSync(tmpRoot, { recursive: true, force: true }));

const fixture = (name, pkg, files = {}) => {
  const dir = path.join(tmpRoot, name);
  fs.mkdirSync(path.join(dir, "node_modules"), { recursive: true });
  fs.symlinkSync(
    repoRoot,
    path.join(dir, "node_modules", "eslint-config-shiny-code"),
    "dir",
  );
  fs.writeFileSync(
    path.join(dir, "package.json"),
    JSON.stringify({ name, type: "module", ...pkg }),
  );
  for (const [file, contents] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    fs.writeFileSync(path.join(dir, file), contents);
  }
  return dir;
};

// Minimal stand-in packages, so JSX and imports type-check without installing react(-native).
const STUBS = {
  react: {
    "package.json": '{"name":"react","main":"index.js","types":"index.d.ts"}',
    "index.js": "export {};\n",
    "index.d.ts": "export {};\n",
    "jsx-runtime.js": "export {};\n",
    "jsx-runtime.d.ts":
      "export namespace JSX { type Element = { type: unknown }; interface IntrinsicElements { [name: string]: { children?: unknown } } }\nexport declare const jsx: unknown;\nexport declare const jsxs: unknown;\n",
  },
  "react-native": {
    "package.json":
      '{"name":"react-native","main":"index.js","types":"index.d.ts"}',
    "index.js": "export const Text = () => null;\n",
    "index.d.ts":
      "export declare const Text: (props: { children?: unknown }) => { type: unknown };\n",
  },
};

const stub = (dir, name) => {
  const target = path.join(dir, "node_modules", name);
  fs.mkdirSync(target, { recursive: true });
  for (const [file, contents] of Object.entries(STUBS[name])) {
    fs.writeFileSync(path.join(target, file), contents);
  }
};

const lint = async (dir) => {
  const eslint = new ESLint({ cwd: dir });
  return eslint.lintFiles(["."]);
};

const messages = (results) =>
  results.flatMap((r) => r.messages.map((m) => ({ file: r.filePath, ...m })));

// Clean, correctly formatted source files per project type.
const SOURCES = {
  js: {
    "src/index.js":
      "import { value } from './value.js';\n\nexport const double = value * 2;\n",
    "src/value.js": "export const value = 21;\n",
  },
  ts: {
    "src/index.ts":
      "import { value } from './value';\n\nexport const double = (n: number = value): number => n * 2;\n",
    "src/value.ts": "export const value = 21;\n",
  },
  react: { "src/App.tsx": "export const App = () => <div>Hello</div>;\n" },
  "react-native": {
    "src/App.tsx":
      "import { Text } from 'react-native';\n\nexport const App = () => <Text>Hello</Text>;\n",
  },
};

const PACKAGES = {
  js: {},
  ts: { devDependencies: { typescript: "*" } },
  react: { dependencies: { react: "*" } },
  "react-native": { dependencies: { react: "*", "react-native": "*" } },
};

describe("exported configs", () => {
  for (const name of ["js", "ts", "react", "reactNative"]) {
    test(`configs.${name} exists and has rules`, () => {
      const config = shinyConfig.configs[name];
      assert.ok(config, `configs.${name} is not exported`);
      assert.ok(Object.keys(config.rules).length > 0);
    });
  }
});

describe("detectType", () => {
  for (const [type, pkg] of Object.entries(PACKAGES)) {
    test(`detects ${type}`, () => assert.equal(detectType(tmpRoot, pkg), type));
  }
});

describe("init + lint", () => {
  for (const type of Object.keys(PACKAGES)) {
    test(`${type}: generated setup lints clean code without errors`, async () => {
      const dir = fixture(`init-${type}`, PACKAGES[type], SOURCES[type]);
      const result = init(
        dir,
        { type: null, force: false, dryRun: false },
        () => {},
      );
      assert.equal(result.type, type);
      assert.ok(fs.existsSync(path.join(dir, "eslint.config.js")));
      assert.equal(
        fs.existsSync(path.join(dir, "tsconfig.json")),
        type !== "js",
      );
      assert.equal(
        JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8"))
          .scripts.lint,
        "eslint .",
      );

      if (type === "react" || type === "react-native") stub(dir, "react");
      if (type === "react-native") {
        stub(dir, "react-native");
        // The shipped RN tsconfig extends expo, which is not installed here.
        fs.copyFileSync(
          path.join(repoRoot, "tsconfig.json"),
          path.join(dir, "tsconfig.json"),
        );
      }

      const problems = messages(await lint(dir));
      assert.deepEqual(
        problems.filter(
          (m) => m.severity === 2 || m.fatal || /Resolve error/.test(m.message),
        ),
        [],
      );
    });
  }

  test("reports violations (config is actually applied)", async () => {
    const dir = fixture("violations", PACKAGES.ts, {
      "src/index.ts":
        'import { b } from "./b";\nimport fs from "node:fs";\nexport const a = b\n',
      "src/b.ts": "export const b = 1;\n",
    });
    init(dir, { type: null, force: false, dryRun: false }, () => {});
    const rules = new Set(messages(await lint(dir)).map((m) => m.ruleId));
    for (const rule of [
      "prettier/prettier",
      "unused-imports/no-unused-imports",
      "import/order",
    ]) {
      assert.ok(
        rules.has(rule),
        `expected ${rule} to be reported, got ${[...rules].join(", ")}`,
      );
    }
  });

  test("does not overwrite existing files without --force", () => {
    const dir = fixture("existing", PACKAGES.ts, {
      "eslint.config.mjs": "export default [];\n",
      "tsconfig.json": "{}",
    });
    const { actions } = init(
      dir,
      { type: null, force: false, dryRun: false },
      () => {},
    );
    assert.equal(fs.existsSync(path.join(dir, "eslint.config.js")), false);
    assert.equal(
      fs.readFileSync(path.join(dir, "tsconfig.json"), "utf8"),
      "{}",
    );
    assert.ok(actions.some((a) => a.startsWith("skip")));
  });
});
