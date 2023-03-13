<template>
  <div id="app">
    <ValidationProvider
      :default-values="defaultValues"
      :default-errors="{
        'my-input': [{ message: 'outer error' }],
        'my.nested.value': [{ message: 'qwe' }]
      }"
      @submit="onSubmit"
    >
      <template #default="{ handleSubmit, values, dirty, errors, reset, onFieldChange }">
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
                <div v-for="(field, index) in fields" :key="field.id">
                  <ValidationField :name="`${name}.${index}.id`">
                    <template #default="{ modelValue, onChange }">
                      <input
                        :value="modelValue"
                        type="text"
                        @input="onChange($event.target.value)"
                      />
                    </template>
                  </ValidationField>
                  <ValidationField :name="`${name}.${index}.type`">
                    <template #default="{ modelValue, onChange }">
                      <input
                        :value="modelValue"
                        type="text"
                        @input="onChange($event.target.value)"
                      />
                    </template>
                  </ValidationField>
                  <ValidationField :name="`${name}.${index}.firstName`" :rules="rules">
                    <template #default="{ modelValue, onChange }">
                      <input
                        :value="modelValue"
                        type="text"
                        @input="onChange($event.target.value)"
                      />
                    </template>
                  </ValidationField>
                </div>
                <button
                  type="button"
                  @click="
                    prepend({ firstName: 'prepend' }, { focusName: 'arrayField.0.firstName' })
                  "
                >
                  Prepend
                </button>
                <button type="button" @click="append({ firstName: 'append' })">Append</button>
                <button type="button" @click="insert(1, { firstName: 'insert' })">Insert</button>
                <button type="button" @click="swap(0, 2)">Swap</button>
                <button type="button" @click="move(0, 2)">Move</button>
                <button type="button" @click="remove(0)">Remove</button>
                <button type="button" @click="reset()">Reset</button>
              </div>
            </template>
          </ValidationFieldArray>

          <ValidationErrors />
          <ValidationErrors name="my-input" />
          <button type="button" @click="onFieldChange('my-input', 123)">
            Set 'my-input' field
          </button>
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
  ValidationErrors,
  registerValidator
} from './index';

registerValidator('required', (value) => !!value);

export default {
  name: 'App',
  components: {
    ValidationProvider,
    ValidationField,
    ValidationFieldArray,
    ValidationErrors
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
            id: '1',
            firstName: '111',
            type: 'user'
          },
          {
            id: '2',
            firstName: '222',
            type: 'user'
          },
          {
            id: '3',
            firstName: '333',
            type: null
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
