<template>
  <validation-provider
    :resolver="$options.resolver"
    @submit="onSubmit"
  >
    <template #default="{ handleSubmit }">
      <form
        novalidate
        @submit.prevent="handleSubmit"
      >
        <validation-field
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
        </validation-field>
        <validation-field
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
        </validation-field>
        <validation-field
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
        </validation-field>
      </form>
    </template>
  </validation-provider>
</template>

<script lang="ts">
import { ValidationProvider, ValidationField } from 'vue-validate-form';
const required = (value) => !!value;

export default {
  components: { ValidationProvider, ValidationField },
  resolver(values) {
    const result = {
      values,
      errors: {}
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
    }
  }
};
</script>
