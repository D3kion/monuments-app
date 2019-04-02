const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',

  entry: {
    'bundle.js': './src/app/index.js'
  },

  output: {
    path: __dirname + '/dist/',
    filename: '[name]',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader'],
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
      }
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
  ],
};