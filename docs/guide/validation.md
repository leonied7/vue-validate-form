# Валидация

vue-validate-form поддерживает несколько вариантов валидации

- Правила валиации на уровне поля
- Использование резолвера на верхнем уровне

## Валиации на уровне поля

Правила определяются на уровне поля, используя `ValidationField` и передачу параметра `rules`

::: warning
Все правила должны регистрироваться через `registerValidator`
:::

<<< @/docs/.vuepress/components/VFieldLevelValidation.vue{5,19-21,25-30}

### Базовые валидаторы

Существует отдельный пакет с набором базовых валидаторов `@vue-validate-form/validators`

```bash
npm install @vue-validate-form/validators
```

Использование

<<< @/docs/.vuepress/components/VFieldLevelValidationWithValidators.vue{19-20}


## Валидация с помощью ресолвера

Ресолвер опеределяется на уровне `ValidationProvider`, через параметр `resolver`

<<< @/docs/.vuepress/components/VResolver.vue{2,23-38}

### Базовые ресолверы

Существует отдельный пакет с набором ресолверов `@vue-validate-form/resolvers` (пока поддерживается только [`yup`](https://github.com/jquense/yup))

```bash
npm install @vue-validate-form/resolvers yup
```

Использование

<<< @/docs/.vuepress/components/VResolverWithYup.vue{2,18,20,24-28}
