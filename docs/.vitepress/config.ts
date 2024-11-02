import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "VueValidateForm",
  description: "Форма валидации для Vue.js",
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Руководство', link: '/guide' },
      { text: 'Продвинутые кейсы', link: '/advanced' },
      { text: 'Справочник API', link: '/api' },
    ],

    sidebar: {
      '/guide': [
        { text: 'Установка', link: '/guide/installation' },
        { text: 'Быстрый старт', link: '/guide' },
        { text: 'Валидация', link: '/guide/validation' },
        { text: 'Работа с ошибками', link: '/guide/error-processing' },
        { text: 'Обработка форм', link: '/guide/handling-form' },
        { text: 'Работа с фокусом', link: '/guide/focusing-fields' },
        { text: 'Лучшие практики', link: '/guide/best-practices' },
      ],
      '/advanced': [
        { text: 'Валидация с помощью библиотек', link: '/advanced/library-validation' },
        { text: 'Динамические массивы', link: '/advanced/dynamic-array' },
      ],
      '/api': [
        { text: 'Validation Provider', link: '/api/validation-provider' },
        { text: 'Validation Field', link: '/api/validation-field' },
        { text: 'Validation Errors', link: '/api/validation-errors' },
        { text: 'Validation Field Array', link: '/api/validation-field-array' },
        { text: 'Типы данных', link: '/api/types' },
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/leonied7/vue-validate-form' }
    ],
    editLink: {
      pattern: 'https://github.com/leonied7/vue-validate-form/edit/master/docs/:path',
    },
    search: {
      provider: 'local'
    }
  }
})
