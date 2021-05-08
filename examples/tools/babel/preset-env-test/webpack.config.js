const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    tree: './treeshaking.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /.js/,
        loader: 'babel-loader',
      },
    ],
  },
};
