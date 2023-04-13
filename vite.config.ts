import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import visualizer from 'rollup-plugin-visualizer';

module.exports = defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['cjs', 'es'],
      name: 'vue-validate-form',
      fileName: (format) => `vue-validate-form.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'nanoid'],
      plugins: [
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        visualizer({
          open: true
        })
      ]
    }
  },
  plugins: [vue()],
  test: {
    setupFiles: ['./tests/unit/testSetup.js'],
    environment: 'jsdom'
  }
});
