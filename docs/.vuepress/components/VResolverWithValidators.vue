<template>
  <validation-provider :resolver="$options.resolver" @submit="onSubmit">
    <template #default="{ handleSubmit, errors }">
      <form novalidate @submit.prevent="handleSubmit">
        <validation-field name="firstName">
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
import { ValidationProvider, ValidationField } from 'vue-validate-form'
import { minLength } from '@vue-validate-form/validators';

export default {
  components: {ValidationProvider, ValidationField},
  resolver(values) {
    const result = {
      values,
      errors: {}
    };
    if(!minLength(values.firstName, 5)) {
      result.errors.firstName = [{message: 'min length 5'}]
    }
    return result;
  },
  methods: {
    onSubmit(values) {}
  }
}
</script>
