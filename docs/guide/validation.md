# Валидация

Валидация осуществляется с помощью ресолвера (параметр `resolver` у `ValidationProvder`)

::: tip
`vue-validate-form` начинает валидировать только после первой попытки отправить форму
:::

## Валидация с помощью ресолвера

Ресолвер опеределяется на уровне `ValidationProvider`, через параметр `resolver`

<<< @/docs/.vuepress/components/VResolver.vue{2,23-38}

### Базовые валидаторы

Существует отдельный пакет с набором базовых валидаторов `@vue-validate-form/validators`

```bash
npm install @vue-validate-form/validators
```

Использование

<<< @/docs/.vuepress/components/VResolverWithValidators.vue{2,19,23-32}

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
setError(fieldName:string, error:Error)
```

Синтаксис `setError` для `ValidationField`

```ts
setError(error:Error)
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
        setError('firstName', { message: error, type: 'custom' });
      })
    }
  }
}
</script>
```
