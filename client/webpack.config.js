const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const { merge } = require("webpack-merge");
const commonConfig = require("../webpack.common.js");

const clientDirectory = path.resolve(__dirname);
const srcDirectory = path.resolve(clientDirectory, "src");
const publicDirectory = path.resolve(clientDirectory, "./public");
const outputDirectory = path.resolve(clientDirectory, "../dist/public");

const clientConfig = merge(commonConfig, {
  context: __dirname,

  entry: {
    client: {
      import: path.resolve(srcDirectory, "index.tsx"),
      dependOn: ["react"],
    },
    react: ["react", "react-dom"],
  },

  output: {
    path: outputDirectory,
    publicPath: "/",
    globalObject: "this",
    assetModuleFilename: "images/[hash][ext][query]",
  },

  target: "web",

  devServer: {
    static: {
      directory: outputDirectory,
    },
    proxy: [
      // allows redirect of requests to webpack-dev-server to another destination
      {
        context: ["/api", "/auth"], // can have multiple
        target: "http://localhost:3000", // server and port to redirect to
        secure: false,
      },
    ],
    client: {
      overlay: {
        errors: true,
        warnings: false,
        runtimeErrors: true,
      },
    },
    port: 8080,
  },

  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
          },
        ],
      },
    ],
  },

  plugins: [
    new ESLintWebpackPlugin({
      extensions: ["js", "jsx", "ts", "tsx"],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(publicDirectory, "index.html"),
      filename: path.resolve(outputDirectory, "index.html"),
      inject: "body",
      publicPath: "/",
    }),
  ],
});

const configs = [
  merge(clientConfig, {
    name: "client-dev",
    mode: "development",
    devtool: "inline-source-map",
    output: {
      filename: "[name].bundle.js",
    },
  }),
  merge(clientConfig, {
    name: "client-prod",
    mode: "production",
    devtool: "source-map",
    output: {
      filename: "[name].[contenthash].bundle.js",
    },
  }),
];

module.exports = configs;
