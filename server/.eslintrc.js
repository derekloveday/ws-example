const typescriptOverride = {
  files: ["*.ts", "*.tsx"],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    project: "./tsconfig.json",
  },
  env: {
    node: true,
  },
};

const javascriptOverride = {
  files: ["*.js", "*.jsx"],
  env: {
    node: true,
  },
};

const config = {
  extends: "../.eslintrc.common.js",
  overrides: [javascriptOverride, typescriptOverride],
};

module.exports = config;
