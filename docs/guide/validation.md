# Валидация

Валидация осуществляется с помощью ресолвера (параметр `resolver` у `ValidationProvider`)

<<< @/.vitepress/components/ResolverSimple.vue{3,33-49}

::: tip
Параметр [`resolver`](../api/types.md#resolver) - фукнция, которая принимает на вход текущее состояние формы и ожидает на выходе объект c новым состоянием формы и ошибками формы
:::

### Базовые валидаторы

Существует отдельный пакет с набором базовых валидаторов `@vue-validate-form/validators`

```bash
npm install @vue-validate-form/validators
```

Использование

<<< @/.vitepress/components/ResolverValidators.vue{3,27,31-40}

:::tip
По-умолчанию `vue-validate-form` начинает валидировать поля после первой попытки отправить форму (вызов метода `handleSubmit` у `ValidationProvider`).
Это поведение может быть изменено с помощью параметра `instantValidate` у `ValidationProvider`
:::
