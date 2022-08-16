<template>
  <validation-provider @submit="onSubmit">
    <template #default="{ handleSubmit }">
      <form novalidate @submit.prevent="handleSubmit">
        <validation-field name="firstName" :rules="$options.rules" @should-focus="handleFocus">
          <template #default="{ modelValue, onChange }">
            <input :value="modelValue" type="text" @input="onChange($event.target.value)" />
          </template>
        </validation-field>
        <validation-field name="secondName" :rules="$options.rules" @should-focus="handleFocus">
          <template #default="{ modelValue, onChange }">
            <input :value="modelValue" type="text" @input="onChange($event.target.value)" />
          </template>
        </validation-field>
        <validation-field name="lastName" :rules="$options.rules" @should-focus="handleFocus">
          <template #default="{ modelValue, onChange }">
            <input :value="modelValue" type="text" @input="onChange($event.target.value)" />
          </template>
        </validation-field>
      </form>
    </template>
  </validation-provider>
</template>

<script>
import { ValidationProvider, ValidationField, registerValidator } from 'vue-validate-form'
registerValidator('required', (value) => !!value);

export default {
  components: {ValidationProvider, ValidationField},
  rules: {
    required: {
      value: true,
      message: 'field required'
    }
  },
  methods: {
    handleFocus({ name }) {
      alert(`Фокус поля: ${name}`)
    },
    onSubmit(values, { setError, focusInvalidField }) {
      setError('lastName', 'serverError', 'invalid');
      focusInvalidField();
    }
  }
}
</script>
