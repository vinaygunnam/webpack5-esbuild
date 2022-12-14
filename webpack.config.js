const path = require("path");
const { ESBuildMinifyPlugin } = require("esbuild-loader");
const {
  container: { ModuleFederationPlugin },
} = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { name, port } = require("./configuration.json");

const { dependencies: sharedDependencies } = require("./package.json");

const isProd = process.env.NODE_ENV === "production";
const whenNotProd = (x) => (isProd ? undefined : x);

/** @type {import('webpack').WebpackOptionsNormalized} */
module.exports = {
  mode: isProd ? "production" : "development",

  entry: {
    main: "./src/main.js",
  },

  output: {
    library: {
      type: "umd",
    },
    path: path.resolve(__dirname, `./dist/`),
    publicPath: "auto",
  },

  devServer: whenNotProd({
    compress: true,
    port: process.env.PORT || port,
    host: "0.0.0.0",
    allowedHosts: "all",
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
  }),
  resolve: {
    alias: {
      vue$: isProd ? "vue/dist/vue.min.js" : "vue/dist/vue.js",
    },
  },
  module: {
    rules: [
      // Use esbuild as a Babel alternative
      {
        test: /\.[jt]s$/,
        loader: "esbuild-loader",
        options: {
          loader: "ts",
          target: "es2015",
        },
      },
    ],
  },
  optimization: {
    minimizer: [
      // Use esbuild to minify
      new ESBuildMinifyPlugin({
        target: "es2015",
        css: true,
      }),
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name,
      filename: "remoteEntry.js",
      shared: sharedDependencies,
      exposes: {
        "./calc": "./src/utilities/calculator",
      },
    }),
    new HtmlWebpackPlugin({
      title: "Demo",
      template: "public/index.html",
      templateParameters: {
        moduleScope: name,
        port,
      },
      inject: false,
    }),
  ],
};
