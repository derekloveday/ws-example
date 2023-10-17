const typescriptOverride = {
  files: ["*.ts", "*.tsx"],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    project: "./tsconfig.json",
  },
  rules: {
    "no-console": "off",
  },
  env: {
    browser: true,
    node: true,
  },
};

const javascriptOverride = {
  files: ["*.js", "*.jsx"],
  rules: {
    "no-console": "off",
  },
  env: {
    browser: true,
    node: true,
  },
};

const config = {
  extends: "../.eslintrc.common.js",
  overrides: [javascriptOverride, typescriptOverride],
};

module.exports = config;
