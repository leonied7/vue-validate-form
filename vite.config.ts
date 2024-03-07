/// <reference types="vitest" />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['cjs', 'es'],
      name: 'vue-validate-form',
      fileName: (format) => `vue-validate-form.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'nanoid']
    }
  },
  plugins: [vue(), dts()],
  test: {
    setupFiles: ['./tests/unit/testSetup.ts'],
    environment: 'jsdom'
  }
});
