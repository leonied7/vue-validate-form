import { defineConfig } from "vuepress/config";
import { resolve } from 'path';

export default defineConfig({
  title: 'VueValidateForm',
  themeConfig: {
    repo: 'leonied7/vue-validate-form',
    nav: [
      { text: 'Руководство', link: '/guide/' },
      { text: 'Справочник API', link: '/api/' },
    ],
    sidebar: {
      '/guide/': [
        'installation',
        '',
        'validation',
        'handling-form',
        'focusing-fields',
        'best-practices'
      ],
      '/api/': [
        'validation-provider',
        'validation-field',
        'types'
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
        '@vue-validate-form/validators': resolve(__dirname, './util/validators.js')
      }
    }
  },
  chainWebpack: (config) => {
    const defaultExclude = config.module.rule('js').exclude.values().at(0);
    config.module.rule('js').exclude.clear();
    config.module.rule('js').exclude.add(filePath => {
      if(/@vue-validate-form\/resolvers.*\.js$/.test(filePath)) {
        return false;
      }
      return defaultExclude(filePath);
    });
  }
});
