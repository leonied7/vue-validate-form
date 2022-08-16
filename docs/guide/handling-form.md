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

## Значения по умолчанию

`ValidationProvider` поддерживает передачу значений по умолчанию через параметр `defaultValues`

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

## `v-model` для `ValidationField`

`ValidationField` поддерживает `v-model`, так что при необходимости можно привязать переменную из шаблона

::: tip
Значение `v-model` или параметра `modelValue` обрабатывается как значение по умолчанию при монтировании
:::

Изменение значения `v-model` у `ValidationField` из шаблона так же поменяет значение у `ValidationProvider`

::: danger
Если привязать к `ValidationField` `modelValue` без обновления значения, то его нельзя будет поменять вводом значения в поле в примере ниже значение всегда будет `42`

```vue{4}
<template >
  <validation-provider >
    <template #default="{ values }">
      <validation-field :model-value="constant">
        <template #default="{ modelValue, onChange }">
          <input :value="modelValue" type="text" @input="onChange($event.target.value)" />
        </template>
      </validation-field>
      <div >{{values}}</div >
    </template >
  </validation-provider >
</template >

<script >
export default {
  data() {
    return {
      constant: 42
    }
  }
}
</script >
```
:::
