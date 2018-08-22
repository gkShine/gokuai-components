'use strict'

const VueLoaderPlugin = require('vue-loader/lib/plugin')
const config = require('./config')

module.exports = {
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: config.alias
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        use: 'eslint-loader',
        enforce: 'pre'
      }, {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          preserveWhitespace: false
        }
      }, {
        test: /\.js$/,
        exclude: config.jsexclude,
        loader: 'babel-loader'
      }, {
        test: /\.swf$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}