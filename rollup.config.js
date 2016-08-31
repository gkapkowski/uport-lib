// See for rollup config inspiration
// https://github.com/rollup/rollup-starter-project

// Replaced Babel with Buble
// https://buble.surge.sh/guide/
// https://gist.github.com/angus-c/feea4e4cd0b853dc04c71fa4e7d2f83f

import buble from 'rollup-plugin-buble'
import commonjs from 'rollup-plugin-commonjs'
// import istanbul from 'rollup-plugin-istanbul'
// import builtins from 'rollup-plugin-node-builtins'
// import globals from 'rollup-plugin-node-globals'
import nodeResolve from 'rollup-plugin-node-resolve'

let pkg = require('./package.json')
let external = Object.keys(pkg.dependencies)

export default {
  entry: 'lib/index.js',
  plugins: [
    // builtins(),
    nodeResolve({
      module: true,
      jsnext: true,
      main: true,
      browser: true,
      extensions: [ '.js', '.json' ],
      preferBuiltins: true
    }),
    commonjs(),
    buble(),
    // istanbul({ exclude: ['test/**/*', 'node_modules/**/*', 'dist/**/*', 'coverage/**/*'] })
  ],
  external: external,
  targets: [
    {
      dest: pkg['main'],
      format: 'umd',
      moduleName: 'uportLib',
      sourceMap: true
    },
    {
      dest: pkg['jsnext:main'],
      format: 'es',
      sourceMap: true
    }
  ]
}
