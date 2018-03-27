const path = require('path');

module.exports = {
  entry: './main.js',
  output: {
    library: 'Uno',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    filename: 'uno.bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }]
  }
};