<template>
  <validation-provider
    :resolver="resolver"
    @submit="onSubmit"
  >
    <template #default="{ handleSubmit }">
      <form
        novalidate
        @submit.prevent="handleSubmit"
      >
        <validation-field name="firstName">
          <template #default="{ modelValue, onChange }">
            <input
              :value="modelValue"
              type="text"
              @input="onChange($event.target.value)"
            >
          </template>
        </validation-field>
      </form>
    </template>
  </validation-provider>
</template>

<script lang="ts">
import { object, string, number } from 'yup';
import { ValidationProvider, ValidationField } from 'vue-validate-form';
import { yupResolver } from '@vue-validate-form/resolvers';

export default {
  components: { ValidationProvider, ValidationField },
  props: {
    isNew: Boolean
  },
  computed: {
    resolver() {
      const fields = {
        firstName: string().required()
      };
      if (this.isNew) {
        fields.id = number().required();
      }
      return yupResolver(object(fields));
    }
  },
  methods: {
    onSubmit(values) {}
  }
};
</script>
