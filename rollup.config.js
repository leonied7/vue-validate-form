import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import VuePlugin from 'rollup-plugin-vue';
import pkg from './package.json';

// browser-friendly UMD build
function getBrowserConfig(input, outputFile, name) {
  return {
    input,
    output: {
      name,
      file: outputFile,
      format: 'umd',
      exports: 'named'
    },
    plugins: [
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
      VuePlugin(),
      babel({
        babelHelpers: 'bundled',
        exclude: ['node_modules/**']
      })
    ]
  };
}

// CommonJS (for Node) build.
function getCommonJSConfig(input, outputFile) {
  return {
    input,
    external: ['lodash.get', 'lodash.set', 'lodash.clonedeep'],
    output: { file: outputFile, format: 'cjs', exports: 'named' },
    plugins: [VuePlugin()]
  };
}

// ES module (for bundlers) build.
function getEsConfig(input, outputFile) {
  return {
    input,
    external: ['lodash.get', 'lodash.set', 'lodash.clonedeep'],
    output: { file: outputFile, format: 'es', exports: 'named' },
    plugins: [VuePlugin()]
  };
}

export default [
  getBrowserConfig('src/index.js', pkg.browser, 'VueValidateForm'),
  getBrowserConfig(
    'src/validators/index.js',
    'dist/validators.umd.js',
    'VueValidateFormValidators'
  ),

  getCommonJSConfig('src/index.js', pkg.main),
  getCommonJSConfig('src/validators/index.js', 'dist/validators.cjs.js'),

  getEsConfig('src/index.js', pkg.module),
  getEsConfig('src/validators/index.js', 'dist/validators.esm.js')
];
