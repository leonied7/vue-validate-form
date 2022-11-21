# Валидация

::: tip
`vue-validate-form` начинает валидировать только после первой попытки отправить форму
:::

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

## Работа с ошибками валидации

### Используя `ValidationField`

В данных дефолтного слота присутствуют поля `errors`, `firstError`, `invalid` для отображения ошибок

```vue{2,5-9}
<validation-field name="firstName">
  <template #default="{ modelValue, onChange, errors, invalid }">
    <div>
      <input :value="modelValue" type="text" @input="onChange($event.target.value)" />
      <template v-if="invalid">
        <span v-for="(error, index) in errors" :key="index">
          {{error.message}}
        </span>
      </template>
    </div>
  </template>
</validation-field>
```

### Используя `ValidationProvider`

В данных дефолтного слота присутствуют поля `errors`, `invalid` для отображения ошибок

```vue{2,4,5}
<validation-provider>
  <template #default="{ errors, invalid }">
    <div>
      <div>{{invalid}}</div>
      <div>{{errors}}</div>
    </div>
  </template>
</validation-provider>
```

### Установка ошибок

Установить ошибки можно с помощью метода `setError` в дефолтном слоте `ValidationProvider` или `ValidationField`

::: tip
Ошибки устанавливаемые через `setError` сбрасываются при изменении поля или при отправке формы
:::

Синтаксис `setError` для `ValidationProvider`

```ts
setError(fieldName:string, message:string, type?:string)
```

Синтаксис `setError` для `ValidationField`

```ts
setError(message:string, type?:string)
```

Там же в callback события `submit` приходит `setError`

```vue{2,10,12}
<template>
  <validation-provider @submit="onSubmit">
    //...
  </validation-provider>
</template>

<script>
export default {
  methods: {
    onSubmit(values, { setError }) {
      formApi.send(values).catch((error) => {
        setError('firstName', error, 'custom');
      })
    }
  }
}
</script>
```
