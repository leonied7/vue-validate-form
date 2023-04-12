import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { visualizer } from 'rollup-plugin-visualizer';

module.exports = defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      formats: ['cjs', 'es'],
      name: 'vue-validate-form',
      fileName: (format) => `vue-validate-form.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'nanoid'],
      plugins: [
        visualizer({
          open: true
        })
      ]
    }
  },
  test: {
    setupFiles: ['./tests/unit/testSetup.js'],
    environment: 'jsdom'
  }
});
