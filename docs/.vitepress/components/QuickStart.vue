<template>
  <validation-provider @submit="onSubmit">
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

        <validation-field name="lastName">
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
import { defineComponent } from 'vue';
import { ValidationProvider, ValidationField } from 'vue-validate-form';

export default defineComponent({
  components: { ValidationProvider, ValidationField },
  methods: {
    onSubmit(values) {
      // values хранит следующую структуру
      // { firstName: 'значение из поля', lastName: 'значение из поля' }
      // обработка данных формы
    }
  }
});
</script>
