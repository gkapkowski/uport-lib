// import json from 'rollup-plugin-json'
// import babel from 'rollup-plugin-babel'
// import commonjs from 'rollup-plugin-commonjs'
// import nodeResolve from 'rollup-plugin-node-resolve'
import buble from 'rollup-plugin-buble'

export default {
  entry: 'index.js',
  plugins: [ buble() ],
  sourceMap: 'inline',
  targets: [
    { dest: 'dist/uport-lib.cjs.js', format: 'cjs' },
    { dest: 'dist/uport-lib.umd.js', format: 'umd' },
    { dest: 'dist/uport-lib.es.js', format: 'es' }
  ]
}
