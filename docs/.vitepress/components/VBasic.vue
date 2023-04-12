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
const required = (value) => !!value;

export default {
  components: {ValidationProvider, ValidationField},
  resolver(values) {
    const result = {
      values,
      errors: {}
    };
    if(!required(values.firstName)) {
      result.errors.firstName = [{message: 'field required'}]
    }
    return result;
  },
  methods: {
    onSubmit(values) {
      // обработка данных формы
    }
  }
}
</script>
