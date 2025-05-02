<script lang="ts">
import { yupResolver } from '@vue-validate-form/resolvers';
import { ValidationField, ValidationProvider } from 'vue-validate-form';
import { number, object, string } from 'yup';

export default {
  components: { ValidationProvider, ValidationField },
  props: {
    isNew: Boolean,
  },
  computed: {
    resolver() {
      const fields = {
        firstName: string().required(),
      };
      if (this.isNew) {
        fields.id = number().required();
      }
      return yupResolver(object(fields));
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
