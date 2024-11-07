<template>
  <div id="app">
    <ValidationProvider
      :default-values="defaultValues"
      :default-errors="{
        'my-input': [{ message: 'outer error' }],
        'my.nested.value': [{ message: 'qwe' }]
      }"
      :resolver="$options.resolver"
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
          <ValidationField name="my-input">
            <template #default="{ modelValue, onChange }">
              <input
                :value="modelValue"
                type="text"
                @input="onChange($event.target.value)"
              >
            </template>
          </ValidationField>

          <ValidationField name="my.nested.value">
            <template #default="{ modelValue, onChange }">
              <input
                :value="modelValue"
                type="text"
                @input="onChange($event.target.value)"
              >
            </template>
          </ValidationField>

          <ValidationFieldArray name="arrayField">
            <template
              #default="{ name, fields, onChange: onArrayChange, append, prepend, insert, swap, move, remove }"
            >
              <div>
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
                  <ValidationField :name="`${name}.${index}.type`">
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
                </div>
                <button
                  type="button"
                  @click="
                    prepend({ firstName: 'prepend' }, { focusName: 'arrayField.0.firstName' })
                  "
                >
                  Prepend
                </button>
                <button
                  type="button"
                  @click="append({ firstName: 'append' })"
                >
                  Append
                </button>
                <button
                  type="button"
                  @click="insert(1, { firstName: 'insert' })"
                >
                  Insert
                </button>
                <button
                  type="button"
                  @click="swap(0, 2)"
                >
                  Swap
                </button>
                <button
                  type="button"
                  @click="move(0, 2)"
                >
                  Move
                </button>
                <button
                  type="button"
                  @click="remove(0)"
                >
                  Remove
                </button>
                <button
                  type="button"
                  @click="reset()"
                >
                  Reset
                </button>
                <button
                  type="button"
                  @click="onArrayChange([{ id: 42, firstName: 'test' }])"
                >
                  Change
                </button>
              </div>
            </template>
          </ValidationFieldArray>
          <button
            type="button"
            @click="onFieldChange('my-input', 123)"
          >
            Set 'my-input' field
          </button>
          <button type="submit">
            Send
          </button>
        </form>

        <div>All errors</div>
        <ValidationErrors>
          <template #default="{ errors: allErrors }">
            <pre>{{ allErrors }}</pre>
          </template>
        </ValidationErrors>
        <div>'my-input' errors</div>
        <ValidationErrors name="my-input">
          <template #default="{ errors: inputErrors }">
            <pre>{{ inputErrors }}</pre>
          </template>
        </ValidationErrors>
      </template>
    </ValidationProvider>
  </div>
</template>

<script>
import {
  ValidationErrors,
  ValidationField,
  ValidationFieldArray,
  ValidationProvider,
  get
} from './index';

function required(value) {
  return !!value;
}

export default {
  name: 'App',
  components: {
    ValidationProvider,
    ValidationField,
    ValidationFieldArray,
    ValidationErrors
  },
  resolver(values) {
    const result = {
      values,
      errors: {}
    };
    if (!required(get(values, 'my-input'))) {
      result.errors['my-input'] = [{ message: 'field required' }];
    }
    if (!required(get(values, 'my.nested.value'))) {
      result.errors['my.nested.value'] = [{ message: 'field required' }];
    }
    get(values, 'arrayField', []).forEach(({ firstName }, index) => {
      if (!required(firstName)) {
        result.errors[`arrayField.${index}.firstName`] = [{ message: 'field required' }];
      }
    });
    return result;
  },
  data() {
    return {
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
        setError('my-input', { message: 'invalid field', type: 'custom' });
        setError('common', { message: 'invalid common field', type: 'custom' });
      }, 250);

      console.log(values);
    }
  }
};
</script>
