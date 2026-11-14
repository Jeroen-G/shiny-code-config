#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const TYPES = {
  js: { config: "js", extensions: "js,mjs,cjs", tsconfig: null },
  ts: { config: "ts", extensions: "ts,js", tsconfig: "tsconfig.json" },
  react: {
    config: "react",
    extensions: "ts,js,tsx,jsx",
    tsconfig: "tsconfig.json",
  },
  "react-native": {
    config: "reactNative",
    extensions: "ts,js,tsx,jsx",
    tsconfig: "tsconfig.react-native.json",
    ignores: ["android/app/build", "dist/*", "expo-env.d.ts", ".expo"],
  },
};

const USAGE = `Usage: npx eslint-config-shiny-code init [options]

Detects the project type and writes eslint.config.js, tsconfig.json and lint scripts.

Options:
  --type <${Object.keys(TYPES).join("|")}>  Skip detection and use this config
  --force                 Overwrite existing eslint.config / tsconfig.json
  --dry-run               Print what would be done without writing files
  -h, --help              Show this help`;

export const parseArgs = (argv) => {
  const options = {
    command: null,
    type: null,
    force: false,
    dryRun: false,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--type") options.type = argv[++i];
    else if (arg.startsWith("--type="))
      options.type = arg.slice("--type=".length);
    else if (arg === "--force") options.force = true;
    else if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "-h" || arg === "--help") options.help = true;
    else if (!options.command) options.command = arg;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (options.type && !TYPES[options.type]) {
    throw new Error(
      `Unknown --type "${options.type}". Use one of: ${Object.keys(TYPES).join(", ")}`,
    );
  }
  return options;
};

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

export const detectType = (cwd, pkg) => {
  const deps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
    ...pkg.peerDependencies,
  };
  if (deps["react-native"] || deps.expo) return "react-native";
  if (deps.react) return "react";
  if (deps.typescript || fs.existsSync(path.join(cwd, "tsconfig.json")))
    return "ts";
  return "js";
};

export const renderEslintConfig = (type, hasSrc) => {
  const { config, extensions, ignores = [] } = TYPES[type];
  const files = `${hasSrc ? "src/" : ""}**/*.{${extensions}}`;
  const ignoreList = ["node_modules", "eslint.config.*", ...ignores]
    .map((i) => `'${i}'`)
    .join(", ");
  return `import { defineConfig } from 'eslint/config';
import shinyConfig from 'eslint-config-shiny-code';

export default defineConfig([
    {
        ...shinyConfig.configs.${config},
        files: ['${files}'],
        ignores: [${ignoreList}],
    },
    // Add your own overrides below.
]);
`;
};

export const init = (cwd, options, log = console.log) => {
  const pkgPath = path.join(cwd, "package.json");
  if (!fs.existsSync(pkgPath)) {
    throw new Error(
      `No package.json found in ${cwd}. Run this from your project root.`,
    );
  }
  const pkg = readJson(pkgPath);
  const type = options.type ?? detectType(cwd, pkg);
  const { tsconfig } = TYPES[type];
  const isModule = pkg.type === "module";
  const configName = isModule ? "eslint.config.js" : "eslint.config.mjs";
  const actions = [];

  const write = (file, contents) => {
    const target = path.join(cwd, file);
    if (fs.existsSync(target) && !options.force) {
      actions.push(`skip   ${file} (exists, use --force to overwrite)`);
      return;
    }
    if (!options.dryRun) fs.writeFileSync(target, contents);
    actions.push(`write  ${file}`);
  };

  const existingConfig = [
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.cjs",
  ].find((f) => f !== configName && fs.existsSync(path.join(cwd, f)));
  if (existingConfig && !options.force) {
    actions.push(
      `skip   ${configName} (${existingConfig} exists, use --force to overwrite)`,
    );
  } else {
    write(
      configName,
      renderEslintConfig(type, fs.existsSync(path.join(cwd, "src"))),
    );
  }

  if (tsconfig) {
    write(
      "tsconfig.json",
      fs.readFileSync(path.join(packageRoot, tsconfig), "utf8"),
    );
  }

  pkg.scripts ??= {};
  const scripts = { lint: "eslint .", fix: "eslint . --fix" };
  const added = Object.entries(scripts).filter(([name]) => !pkg.scripts[name]);
  if (added.length) {
    for (const [name, cmd] of added) pkg.scripts[name] = cmd;
    if (!options.dryRun)
      fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
    actions.push(
      `update package.json scripts: ${added.map(([name]) => name).join(", ")}`,
    );
  }

  const peers = ["eslint-config-shiny-code", "eslint", "prettier"];
  if (type !== "js") peers.push("typescript");
  const missing = peers.filter(
    (name) => !pkg.dependencies?.[name] && !pkg.devDependencies?.[name],
  );

  log(`Detected project type: ${type}${options.type ? " (from --type)" : ""}`);
  for (const action of actions) log(`  ${action}`);
  if (missing.length)
    log(`\nInstall missing packages:\n  npm install -D ${missing.join(" ")}`);
  log("\nThen verify with:\n  npm run lint");

  return { type, configName, actions, missing };
};

const isMain =
  process.argv[1] &&
  fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help || options.command !== "init") {
      console.log(USAGE);
      process.exit(options.help ? 0 : 1);
    }
    init(process.cwd(), options);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
