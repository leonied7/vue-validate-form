# Обработка форм

## Значения формы

Получить значения формы можно через данные дефолтного слота `ValidationProvider` в поле `values`

```vue{2,3}
<validation-provider>
  <template #default="{ values }">
    <div>{{values}}</div>
  </template>
</validation-provider>
```

## Значения по-умолчанию

`ValidationProvider` поддерживает передачу значений по-умолчанию через параметр `defaultValues`

```vue{2}
<template>
  <validation-provider :default-values="defaultValues">
    <template #default="{ values }">
      <div>{{values}}</div>
    </template>
  </validation-provider>
</template>

<script>
export default {
  props: {
    defaultValues: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
```

:::warning
По-умолчанию `vue-validate-form` сбрасывает состояние `ValidationProvider` к начальному при изменении
`defaultValues`. Это поведение может быть изменено с помощью параметра `resetOnUpdate` у `ValidationProvider`
:::
