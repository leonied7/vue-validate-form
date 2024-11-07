<template>
  <validation-provider @submit="onSubmit" :resolver="resolver">
    <template #default="{ handleSubmit }">
      <form novalidate @submit.prevent="handleSubmit">
        <validation-field name="firstName">
          <template #default="{ modelValue, onChange }">
            <input :value="modelValue" type="text" @input="onChange($event.target.value)" />
          </template>
        </validation-field>
      </form>
    </template>
  </validation-provider>
</template>

<script>
import { object, string } from 'yup';
import { ValidationProvider, ValidationField } from 'vue-validate-form'
import { yupResolver } from '@vue-validate-form/resolvers';

export default {
  components: { ValidationProvider, ValidationField },
  computed: {
    resolver() {
      return yupResolver(
        object({
          firstName: string().required()
        })
      )
    }
  },
  methods: {
    onSubmit(values) {}
  }
}
</script>
