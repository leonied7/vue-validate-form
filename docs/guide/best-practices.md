# Лучшие практики

## Работа с фокусом

Один из вариантов работы с фокусом полей - это компонент обёртка

```vue{2,19-23}
<template>
  <validation-field :name="name" @should-focus="handleFocus">
    <template #default="scopedProps">
      <slot v-bind="scopedProps" />
    </template>
  </validation-field>
</template>

<script>
import { ValidationField } from 'vue-validate-form';

export default {
  name: 'ValidationField',
  components: { ValidationField },
  props: {
    name: ValidationField.props.name,
  },
  methods: {
    handleFocus() {
      this.$nextTick(() => {
        this.$el.querySelector(`[name="${this.name}"]`)?.focus();
      });
    }
  }
};
</script>
```

