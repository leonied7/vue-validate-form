<template>
  <div id="app">
    <ValidationProvider :default-values="defaultValues" @submit="onSubmit">
      <template #default="{ handleSubmit, values, isDirty, errors }">
        <form @submit.prevent="handleSubmit">
          <label>Values</label>
          <pre>{{ values }}</pre>
          <label>Is dirty</label>
          <pre>{{ isDirty }}</pre>
          <label>errors</label>
          <pre>{{ errors }}</pre>
          <ValidationField v-model="text" name="my-input" :rules="rules">
            <template #default="{ modelValue, onChange }">
              <input :value="modelValue" type="text" @input="onChange($event.target.value)" />
            </template>
          </ValidationField>

          <ValidationField name="my.nested.value" :rules="rules">
            <template #default="{ modelValue, onChange }">
              <input :value="modelValue" type="text" @input="onChange($event.target.value)" />
            </template>
          </ValidationField>
          <button type="submit">Send</button>
        </form>
      </template>
    </ValidationProvider>
  </div>
</template>

<script>
import { ValidationField, ValidationProvider, registerValidator } from './index';

registerValidator('required', (value) => !!value);

export default {
  name: 'App',
  components: {
    ValidationProvider,
    ValidationField
  },
  data() {
    return {
      text: 'qwe123',
      rules: {
        required: {
          value: true,
          message: 'field required'
        }
      },
      defaultValues: {
        'my.nested.value': 'test'
      }
    };
  },
  methods: {
    onSubmit(values) {
      console.log(values);
    }
  }
};
</script>
