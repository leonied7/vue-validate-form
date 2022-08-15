<template>
  <validation-provider @submit="onSubmit" :resolver="$options.resolver">
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
import { object, string } from 'yup';
import { ValidationProvider, ValidationField } from 'vue-validate-form'
import { yupResolver } from '@vue-validate-form/resolvers';

export default {
  components: {ValidationProvider, ValidationField},
  resolver: yupResolver(
    object({
      firstName: string().required()
    })
  ),
  methods: {
    onSubmit(values) {}
  }
}
</script>
