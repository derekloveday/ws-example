const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const path = require("path");
const { merge } = require("webpack-merge");
const nodeExternals = require("webpack-node-externals");
const commonConfig = require("../webpack.common.js");

const serverDirectory = path.resolve(__dirname);
const srcDirectory = path.resolve(serverDirectory, "src");
const outputDirectory = path.resolve(serverDirectory, "../dist");

const serverConfig = merge(commonConfig, {
  node: {
    __dirname: false,
    __filename: false,
  },

  entry: {
    server: {
      import: path.resolve(srcDirectory, "index.ts"),
    },
  },

  output: {
    path: outputDirectory,
    filename: "[name].bundle.js",
  },

  target: "node",

  externals: [
    nodeExternals(),
    {
      express: "require('express')",
    },
  ],
  externalsPresets: { node: true },
  optimization: {
    nodeEnv: false,
  },

  plugins: [
    new ESLintWebpackPlugin({
      extensions: ["js", "jsx", "ts", "tsx"],
    }),
  ],
});

const configs = [
  merge(serverConfig, {
    name: "server-dev",
    mode: "development",
    devtool: "inline-source-map",
  }),
  merge(serverConfig, {
    name: "server-prod",
    mode: "production",
    devtool: "source-map",
  }),
];

module.exports = configs;
