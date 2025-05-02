<script lang="ts">
import { minLength } from '@vue-validate-form/validators';
import { ValidationField, ValidationProvider } from 'vue-validate-form';

export default {
  components: { ValidationProvider, ValidationField },
  resolver(values) {
    const result = {
      values,
      errors: {},
    };
    if (!minLength(values.firstName, 5)) {
      result.errors.firstName = [{ message: 'min length 5' }];
    }
    return result;
  },
  methods: {
    onSubmit(values) {},
  },
};
</script>

<template>
  <ValidationProvider
    :resolver="$options.resolver"
    @submit="onSubmit"
  >
    <template #default="{ handleSubmit }">
      <form
        novalidate
        @submit.prevent="handleSubmit"
      >
        <ValidationField name="firstName">
          <template #default="{ modelValue, onChange }">
            <input
              :value="modelValue"
              type="text"
              @input="onChange($event.target.value)"
            >
          </template>
        </ValidationField>
      </form>
    </template>
  </ValidationProvider>
</template>
