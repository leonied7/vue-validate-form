<script lang="ts">
import { defineComponent } from 'vue';
import { ValidationField, ValidationProvider } from 'vue-validate-form';

export default defineComponent({
  components: { ValidationProvider, ValidationField },
  methods: {
    onSubmit(values) {
      // values хранит следующую структуру
      // { firstName: 'значение из поля', lastName: 'значение из поля' }
      // обработка данных формы
    },
  },
});
</script>

<template>
  <ValidationProvider @submit="onSubmit">
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

        <ValidationField name="lastName">
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
