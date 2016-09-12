// Webpack
const webpack = require('webpack')

// Plugin Setup
const globalsPlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  'process.env': { 'NODE_ENV': JSON.stringify('development') }
})

// Final Config
module.exports = {
  entry: './lib/index.js',
  output: {
    library: ['uportlib'],
    path: 'dist',
    filename: 'uportlib.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel'
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  },
  node: {
    console: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  resolve: {
    extensions: ['', '.js', '.json']
  },
  devTool: 'inline-source-map',
  plugins: [globalsPlugin]
}
