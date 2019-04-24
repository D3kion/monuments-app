/* eslint-disable no-undef */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: [
    "core-js",
    "whatwg-fetch",
    "./src/app/index.js"
  ],

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },

  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          configFile: "./.eslintrc.json",
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                "corejs": "3",
                "useBuiltIns": "entry",
                "modules": false,
              }
            ]
          ]
        }
      },
      {
        test: /\.html$/,
        use: "html-loader",
      },
      {
        test: /\.css$/,
        loader: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/,
        loader: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.hbs$/,
        loader: "handlebars-loader",
        options: {
          precompileOptions: {
            knownHelpersOnly: false,
          },
        }
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: "url-loader?limit=10000",
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        use: "file-loader",
      },
    ],
  },

  resolve: {
    alias: {
      Styles: path.resolve(__dirname, "src/styles"),
      Models: path.resolve(__dirname, "src/app/models"),
      Collections: path.resolve(__dirname, "src/app/collections"),
      Views: path.resolve(__dirname, "src/app/views"),
    }
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
  ],
};