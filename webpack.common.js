const path = require("path");

const commonConfig = {
  resolve: {
    modules: [path.resolve(__dirname), "node_modules"],
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    fallback: { crypto: false },
  },

  module: {
    rules: [
      {
        test: /\.tsx?/,
        use: ["babel-loader", "ts-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?/,
        use: ["babel-loader"],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    // new ESLintWebpackPlugin({
    //   extensions: ["js", "jsx", "ts", "tsx"],
    // }),
  ],
  optimization: {
    usedExports: true,
  },
};

module.exports = commonConfig;
