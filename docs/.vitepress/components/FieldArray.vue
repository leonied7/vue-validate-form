<script lang="ts">
import { defineComponent } from 'vue';
import { ValidationField, ValidationFieldArray, ValidationProvider } from 'vue-validate-form';

export default defineComponent({
  components: { ValidationProvider, ValidationField, ValidationFieldArray },
  methods: {
    onSubmit(values) {
      // values хранит следующую структуру
      // items[{ id: 'значение из поля', firstName: 'значение из поля', lastName: 'значение из поля' }]
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
        <ValidationFieldArray name="items">
          <template #default="{ name, fields, append, remove }">
            <div
              v-for="(field, index) in fields"
              :key="field.id"
            >
              <ValidationField :name="`${name}.${index}.id`">
                <template #default="{ modelValue, onChange }">
                  <input
                    :value="modelValue"
                    type="text"
                    @input="onChange($event.target.value)"
                  >
                </template>
              </ValidationField>

              <ValidationField :name="`${name}.${index}.firstName`">
                <template #default="{ modelValue, onChange }">
                  <input
                    :value="modelValue"
                    type="text"
                    @input="onChange($event.target.value)"
                  >
                </template>
              </ValidationField>

              <ValidationField :name="`${name}.${index}.lastName`">
                <template #default="{ modelValue, onChange }">
                  <input
                    :value="modelValue"
                    type="text"
                    @input="onChange($event.target.value)"
                  >
                </template>
              </ValidationField>

              <button
                type="button"
                @click="remove(index, { field: 'firstName', index: 0 })"
              >
                Удалить
              </button>
            </div>

            <button
              type="button"
              @click="append({
                firstName: 'Заполните имя',
                lastName: 'Заполните фамилию',
              }, { field: 'firstName' })"
            >
              Добавить
            </button>
          </template>
        </ValidationFieldArray>
      </form>
    </template>
  </ValidationProvider>
</template>
