import { defineConfig } from "vuepress/config";
import { resolve } from 'path';

export default defineConfig({
  title: 'VueValidateForm',
  themeConfig: {
    repo: 'leonied7/vue-validate-form',
    nav: [
      { text: 'Руководство', link: '/guide/' },
    ],
    sidebar: {
      '/guide/': [
        'installation',
        '',
        'validation'
      ]
    }
  },
  plugins: [
    ['@dovyp/vuepress-plugin-clipboard-copy', true]
  ],
  configureWebpack: {
    resolve: {
      alias: {
        'vue-validate-form': resolve(__dirname, '../../src/index.js'),
      }
    }
  }
});
