const path = require('path');

module.exports = {
  mode: 'production',
  entry: './input.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]-without-plugin.js',
  },
  module: {
    rules: [
      {
        test: /.js/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  optimization: {
    minimize: false,
  },
};
