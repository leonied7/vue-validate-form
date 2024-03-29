import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "VueValidateForm",
  description: "Форма валидации для Vue.js",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Руководство', link: '/guide' },
      { text: 'Справочник API', link: '/api' },
    ],

    sidebar: {
      '/guide': [
        { text: 'Установка', link: '/guide/installation' },
        { text: 'Быстрый старт', link: '/guide' },
        { text: 'Валидация', link: '/guide/validation' },
        { text: 'Обработка форм', link: '/guide/handling-form' },
        { text: 'Работа с фокусом', link: '/guide/focusing-fields' },
        { text: 'Лучшие практики', link: '/guide/best-practices' },
      ],
      '/api/': [
        { text: 'Validation Provider', link: '/api/validation-provider' },
        { text: 'Validation Field', link: '/api/validation-field' },
        { text: 'Типы данных', link: '/api/types' },
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/leonied7/vue-validate-form' }
    ]
  }
})
