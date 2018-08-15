const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: ['./src/index.js']
  },
  output: {
    path: path.resolve('./lib')
  },
  module:{
    rules:[
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          preserveWhitespace: false
        }
      }
    ]
  }
};