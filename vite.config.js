const path = require('path');
const { defineConfig } = require('vite');
const { createVuePlugin } = require('vite-plugin-vue2');
import { visualizer } from 'rollup-plugin-visualizer';

module.exports = defineConfig({
  // esbuild: {
  //   minify: true
  // },
  plugins: [createVuePlugin()],
  build: {
    // minify: 'terser',
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      formats: ['es', 'umd'],
      name: 'vue-validate-form',
      fileName: (format) => `vue-validate-form.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'lodash.get', 'lodash.set'],
      plugins: [
        visualizer({
          open: true
        })
      ]
    }
  }
});
