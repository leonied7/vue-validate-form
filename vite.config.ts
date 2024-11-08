/// <reference types="vitest" />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import checker from 'vite-plugin-checker';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      name: 'vue-validate-form'
    },
    rollupOptions: {
      external: ['vue', 'nanoid']
    }
  },
  plugins: [
    vue(),
    dts(),
    checker({
      vueTsc: true
    })
  ],
  test: {
    setupFiles: ['./tests/unit/testSetup.ts'],
    environment: 'jsdom'
  }
});
