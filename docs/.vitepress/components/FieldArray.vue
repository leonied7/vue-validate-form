<template>
  <validation-provider @submit="onSubmit">
    <template #default="{ handleSubmit }">
      <form novalidate @submit.prevent="handleSubmit">
        <validation-field-array name="items">
          <template #default="{ name, fields, append, remove }">
            <div v-for="(field, index) in fields" :key="field.id">
              <validation-field :name="`${name}.${index}.id`">
                <template #default="{ modelValue, onChange }">
                  <input :value="modelValue" type="text" @input="onChange($event.target.value)" />
                </template>
              </validation-field>

              <validation-field :name="`${name}.${index}.firstName`">
                <template #default="{ modelValue, onChange }">
                  <input :value="modelValue" type="text" @input="onChange($event.target.value)" />
                </template>
              </validation-field>

              <validation-field :name="`${name}.${index}.lastName`">
                <template #default="{ modelValue, onChange }">
                  <input :value="modelValue" type="text" @input="onChange($event.target.value)" />
                </template>
              </validation-field>

              <button type="button" @click="remove(index)">Удалить</button>
            </div>

            <button type="button" @click="append({
              firstName: 'Заполните имя',
              lastName: 'Заполните фамилию'
            })">
              Добавить
            </button>
          </template>
        </validation-field-array>
      </form>
    </template>
  </validation-provider>
</template>

<script>
import { defineComponent } from 'vue';
import { ValidationProvider, ValidationField, ValidationFieldArray } from 'vue-validate-form'

export default defineComponent({
  components: { ValidationProvider, ValidationField, ValidationFieldArray },
  methods: {
    onSubmit(values) {
      // values хранит следующую структуру
      // items[{ id: 'значение из поля', firstName: 'значение из поля', lastName: 'значение из поля' }]
      // обработка данных формы
    }
  }
});
</script>
