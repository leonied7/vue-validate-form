<template>
  <validation-provider @submit="onSubmit" :resolver="resolver">
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

export default {
  components: {ValidationProvider, ValidationField},
  methods: {
    resolver(values) {
      if(String(values.firstName)?.length >= 5) {
        return {
          values,
          errors: {}
        }
      }
      return {
        values: {},
        errors: {
          firstName: {
            type: 'minLength',
            message: 'min length 5'
          }
        }
      }
    },
    onSubmit(values) {}
  }
}
</script>
