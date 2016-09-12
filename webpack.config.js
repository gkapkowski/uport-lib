// Webpack
const webpack = require('webpack')
// const path = require('path');
// const env = require('yargs').argv.mode;

// Plugin Setup
const globalsPlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  'process.env': { 'NODE_ENV': JSON.stringify('development') }
})
// const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

let libraryName = 'uportlib'
// let plugins = []
let outputFile = libraryName + '.js'

// if (env === 'build') {
//   plugins.push(new UglifyJsPlugin({ minimize: true }));
//   outputFile = libraryName + '.min.js';
// } else {
//   outputFile = libraryName + '.js';
// }

// Final Config
module.exports = {
  entry: './lib/index.js',
  output: {
    // library: ['uportlib'],
    // path: 'dist',
    // filename: 'uportlib.js'
    path: 'dist',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
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
