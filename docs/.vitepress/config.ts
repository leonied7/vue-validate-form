import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "VueValidateForm",
  description: "Форма валидации для Vue.js",
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Руководство', link: '/guide/getting-started' },
      { text: 'Справочник', link: '/reference/validation-provider' },
    ],

    sidebar: {
      '/guide': [
        {
          text: 'Введение',
          collapsed: false,
          items: [
            { text: 'Что такое VueValidateForm?', link: '/guide/what-is-vue-validate-form' },
            { text: 'Первые шаги', link: '/guide/getting-started' },
          ]
        },
        {
          text: 'Валидация',
          collapsed: false,
          items: [
            { text: 'Кастомная валидация', link: '/guide/validation' },
            { text: 'С помощью сторонних библиотек', link: '/guide/library-validation' },
          ]
        },
        { text: 'Работа с ошибками', link: '/guide/error-processing' },
        { text: 'Обработка форм', link: '/guide/handling-form' },
        { text: 'Динамические массивы', link: '/guide/dynamic-array' },
        { text: 'Работа с фокусом', link: '/guide/focusing-fields' },
        { text: 'Лучшие практики', link: '/guide/best-practices' },
      ],
      '/reference': [
        { text: 'Validation Provider', link: '/reference/validation-provider' },
        { text: 'Validation Field', link: '/reference/validation-field' },
        { text: 'Validation Errors', link: '/reference/validation-errors' },
        { text: 'Validation Field Array', link: '/reference/validation-field-array' },
        { text: 'Типы данных', link: '/reference/types' },
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
