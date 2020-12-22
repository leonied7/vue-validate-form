import VuePlugin from 'rollup-plugin-vue';
import pkg from './package.json';

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
  getCommonJSConfig('src/index.js', pkg.main),

  getEsConfig('src/index.js', pkg.module)
];
