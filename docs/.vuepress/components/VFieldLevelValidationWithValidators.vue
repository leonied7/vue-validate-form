<template>
  <validation-provider @submit="onSubmit">
    <template #default="{ handleSubmit, errors }">
      <form novalidate @submit.prevent="handleSubmit">
        <validation-field name="firstName" :rules="$options.rules">
          <template #default="{ modelValue, onChange }">
            <input :value="modelValue" type="text" @input="onChange($event.target.value)" />
          </template>
        </validation-field>

        <div>{{errors.firstName}}</div>
      </form>
    </template>
  </validation-provider>
</template>

<script>
import { ValidationProvider, ValidationField, registerValidator } from 'vue-validate-form'
import { minLength } from '@vue-validate-form/validators';
registerValidator('minLength', minLength);

export default {
  components: {ValidationProvider, ValidationField},
  rules: {
    minLength: {
      value: 5,
      message: 'min length 5'
    }
  },
  methods: {
    onSubmit(values) {}
  }
}
</script>
