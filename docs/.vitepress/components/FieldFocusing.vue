<script lang="ts">
import { ValidationField, ValidationProvider } from 'vue-validate-form';

const required = value => !!value;

export default {
  components: { ValidationProvider, ValidationField },
  resolver(values) {
    const result = {
      values,
      errors: {},
    };
    if (!required(values.firstName)) {
      result.errors.firstName = [{ message: 'field required' }];
    }
    if (!required(values.secondName)) {
      result.errors.secondName = [{ message: 'field required' }];
    }
    if (!required(values.lastName)) {
      result.errors.lastName = [{ message: 'field required' }];
    }
    return result;
  },
  methods: {
    handleFocus({ name }) {
      alert(`Фокус поля: ${name}`);
    },
    onSubmit(values, { setError, focusInvalidField }) {
      setError('lastName', { message: 'invalid', type: 'serverError' });
      focusInvalidField();
    },
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
        <ValidationField
          name="firstName"
          @should-focus="handleFocus"
        >
          <template #default="{ modelValue, onChange }">
            <input
              :value="modelValue"
              type="text"
              @input="onChange($event.target.value)"
            >
          </template>
        </ValidationField>
        <ValidationField
          name="secondName"
          @should-focus="handleFocus"
        >
          <template #default="{ modelValue, onChange }">
            <input
              :value="modelValue"
              type="text"
              @input="onChange($event.target.value)"
            >
          </template>
        </ValidationField>
        <ValidationField
          name="lastName"
          @should-focus="handleFocus"
        >
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
