<template>
  <div id="app">
    <ValidationProvider :default-values="defaultValues" @submit="onSubmit">
      <template #default="{ handleSubmit, values, dirty, errors }">
        <form @submit.prevent="handleSubmit">
          <label>Values</label>
          <pre>{{ values }}</pre>
          <label>Is dirty</label>
          <pre>{{ dirty }}</pre>
          <label>errors</label>
          <pre>{{ errors }}</pre>
          <ValidationField name="my-input" :rules="rules">
            <template #default="{ modelValue, onChange }">
              <input :value="modelValue" type="text" @input="onChange($event.target.value)" />
            </template>
          </ValidationField>

          <ValidationField name="my.nested.value" :rules="rules">
            <template #default="{ modelValue, onChange }">
              <input :value="modelValue" type="text" @input="onChange($event.target.value)" />
            </template>
          </ValidationField>

          <ValidationFieldArray name="arrayField">
            <template #default="{ name, fields, append, prepend, insert, swap, move, remove }">
              <div>
                <ValidationField
                  v-for="(field, index) in fields"
                  :key="field.id"
                  :name="`${name}.${index}.firstName`"
                >
                  <template #default="{ modelValue, onChange }">
                    <input :value="modelValue" type="text" @input="onChange($event.target.value)" />
                  </template>
                </ValidationField>
                <button type="button" @click="prepend({ firstName: 'prepend' }, true)">
                  Prepend
                </button>
                <button type="button" @click="append({ firstName: 'append' })">Append</button>
                <button type="button" @click="insert(1, { firstName: 'insert' })">Insert</button>
                <button type="button" @click="swap(0, 2)">Swap</button>
                <button type="button" @click="move(0, 2)">Move</button>
                <button type="button" @click="remove(0)">Remove</button>
              </div>
            </template>
          </ValidationFieldArray>
          <button type="submit">Send</button>
        </form>
      </template>
    </ValidationProvider>
  </div>
</template>

<script>
import {
  ValidationField,
  ValidationProvider,
  ValidationFieldArray,
  registerValidator
} from './index';

registerValidator('required', (value) => !!value);

export default {
  name: 'App',
  components: {
    ValidationProvider,
    ValidationField,
    ValidationFieldArray
  },
  data() {
    return {
      rules: {
        required: {
          value: true,
          message: 'field required'
        }
      },
      defaultValues: {
        my: {
          nested: {
            value: 'test'
          }
        },
        arrayField: [
          {
            id: 'qwe123',
            firstName: '111'
          },
          {
            id: 'qwe1231',
            firstName: '222'
          }
        ]
      }
    };
  },
  methods: {
    onSubmit(values, { setError }) {
      setTimeout(() => {
        setError('my-input', 'invalid field', 'custom');
        setError('common', 'invalid common field', 'custom');
      }, 250);

      console.log(values);
    }
  }
};
</script>
