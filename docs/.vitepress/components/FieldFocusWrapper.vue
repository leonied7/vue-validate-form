<script lang="ts">
import { ValidationField } from 'vue-validate-form';

export default {
  name: 'BaseValidationField',
  components: { ValidationField },
  props: {
    name: ValidationField.props.name,
  },
  methods: {
    handleFocus() {
      this.$nextTick(() => {
        this.$el.querySelector(`[name="${this.name}"]`)?.focus();
      });
    },
  },
};
</script>

<template>
  <ValidationField
    :name="name"
    @should-focus="handleFocus"
  >
    <template #default="scopedProps">
      <slot v-bind="scopedProps" />
    </template>
  </ValidationField>
</template>
