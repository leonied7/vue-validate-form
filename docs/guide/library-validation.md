# Валидация с помощью вспомогательных библиотек

Существует отдельный пакет с набором ресолверов `@vue-validate-form/resolvers` (пока поддерживается только [`yup`](https://github.com/jquense/yup))

```bash
npm install @vue-validate-form/resolvers yup
```

Использование

<<< @/.vitepress/components/YupSimple.vue{2,9-15,25}

::: tip
Почему параметр `resolver` computed? `yupResolver` возвращает функцию для валидации, но при этом схема
может быть динамической и зависеть от состояния компонента (`data`, `props` и т.п.).

Например: У вас общая схема для создания и редактирования, для редактировать параметр id обязателен,
а вот для создания его нет
:::

<<< @/.vitepress/components/YupComputed.vue{9,12-20}
