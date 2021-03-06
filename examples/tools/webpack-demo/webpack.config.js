const path = require('path');

module.exports = {
  mode: 'production',
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
        include: path.resolve(__dirname, 'src'),
      },
    ],
  },
};
