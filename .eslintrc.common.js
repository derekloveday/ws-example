const config = {
  root: true,
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      env: {
        es2021: true,
      },
      extends: ["eslint:recommended"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        project: "./tsconfig.common.json",
      },
      plugins: ["@typescript-eslint", "eslint-plugin-tsdoc"],
      rules: {
        "tsdoc/syntax": "warn",
        "no-restricted-syntax": [
          "error",
          "ForInStatement",
          "LabeledStatement",
          "WithStatement",
        ],
      },
    },
    {
      files: ["*.js", "*.jsx"],
      env: {
        es2021: true,
      },
      extends: ["eslint:recommended"],
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
      plugins: ["jsdoc"],
      rules: {
        "no-restricted-syntax": [
          "error",
          "ForInStatement",
          "LabeledStatement",
          "WithStatement",
        ],
      },
    },
  ],
};

module.exports = config;
