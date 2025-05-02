<script lang="ts">
import { yupResolver } from '@vue-validate-form/resolvers';
import { ValidationField, ValidationProvider } from 'vue-validate-form';
import { object, string } from 'yup';

export default {
  components: { ValidationProvider, ValidationField },
  computed: {
    resolver() {
      return yupResolver(
        object({
          firstName: string().required(),
        }),
      );
    },
  },
  methods: {
    onSubmit(values) {},
  },
};
</script>

<template>
  <ValidationProvider
    :resolver="resolver"
    @submit="onSubmit"
  >
    <template #default="{ handleSubmit }">
      <form
        novalidate
        @submit.prevent="handleSubmit"
      >
        <ValidationField name="firstName">
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
