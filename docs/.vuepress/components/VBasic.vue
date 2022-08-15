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
    onSubmit(values) {
      // обработка данных формы
    }
  }
}
</script>
