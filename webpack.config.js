// Webpack
const webpack = require('webpack')

// Plugin Setup
const commonsPlugin = new webpack.optimize.CommonsChunkPlugin('uport-lib.cjs.js')
const globalsPlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  'process.env': { 'NODE_ENV': JSON.stringify('development') }
})

// Final Config
module.exports = {
  entry: './lib/index.js',
  output: {
    path: 'dist',
    filename: 'uport-lib.js'
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
  resolve: {
    extensions: ['', '.js', '.json']
  },
  devTool: 'inline-source-map',
  plugins: [commonsPlugin, globalsPlugin]
}
