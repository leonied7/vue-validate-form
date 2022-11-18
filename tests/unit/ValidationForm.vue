<template>
  <validation-provider
    :default-values="defaultValues"
    :resolver="resolver"
    @submit="onSubmit"
    @dirty="$emit('dirty', $event)"
  >
    <template
      #default="{
        handleSubmit,
        reset,
        values,
        dirty: formDirty,
        invalid: formInvalid,
        errors: formErrors
      }"
    >
      <form @submit.prevent="handleSubmit">
        <ValidationField name="my-input" :rules="rulesByField['my-input']">
          <template #default="{ modelValue, name, firstError, errors, dirty, invalid, onChange }">
            <base-input
              :name="name"
              :first-error="firstError"
              :errors="errors"
              :model-value="modelValue"
              :dirty="dirty"
              :invalid="invalid"
              @update:modelValue="onChange"
            />
          </template>
        </ValidationField>

        <ValidationField name="my.nested.value" :rules="rulesByField['my.nested.value']">
          <template #default="{ modelValue, name, firstError, errors, dirty, invalid, onChange }">
            <base-input
              :name="name"
              :first-error="firstError"
              :errors="errors"
              :model-value="modelValue"
              :dirty="dirty"
              :invalid="invalid"
              @update:modelValue="onChange"
            />
          </template>
        </ValidationField>

        <FormInfo :values="values" :dirty="formDirty" :invalid="formInvalid" :errors="formErrors" />

        <ValidationFieldArray name="arrayField">
          <template
            #default="{ name: arrayName, fields, append, prepend, insert, swap, move, remove }"
          >
            <ValidationField
              v-for="(field, index) in fields"
              :key="field.id"
              :name="`${arrayName}.${index}.firstName`"
            >
              <template
                #default="{ modelValue, name, firstError, errors, dirty, invalid, onChange }"
              >
                <base-input
                  :name="name"
                  :first-error="firstError"
                  :errors="errors"
                  :model-value="modelValue"
                  :dirty="dirty"
                  :invalid="invalid"
                  @update:modelValue="onChange"
                />
              </template>
            </ValidationField>
            <button id="append" type="button" @click="append">Append</button>
            <button id="prepend" type="button" @click="prepend">Prepend</button>
            <button id="insert" type="button" @click="insert(1, { firstName: 'insert' })">
              Insert
            </button>
            <button id="swap" type="button" @click="swap(0, 2)">Swap</button>
            <button id="move" type="button" @click="move(0, 2)">Move</button>
            <button id="remove" type="button" @click="remove(1)">Remove</button>
          </template>
        </ValidationFieldArray>

        <ValidationErrors name="common">
          <template #default="{ errors }">
            <BaseErrors :errors="errors" />
          </template>
        </ValidationErrors>

        <button type="submit">Submit</button>
        <button type="reset" @click="reset">Reset</button>
      </form>
    </template>
  </validation-provider>
</template>

<script>
import {
  ValidationProviderNew,
  ValidationFieldNew,
  ValidationFieldArray,
  ValidationErrors,
  registerValidator
} from '../../src/index.js';
import BaseInput from './BaseInput';
import FormInfo from './FormInfo';
import BaseErrors from './BaseErrors';

registerValidator('required', (value) => !!value);

export default {
  name: 'ValidationForm',
  components: {
    BaseErrors,
    FormInfo,
    ValidationProvider: ValidationProviderNew,
    ValidationField: ValidationFieldNew,
    ValidationFieldArray,
    ValidationErrors,

    BaseInput
  },
  props: {
    defaultValues: {
      type: Object,
      default: () => ({})
    },
    resolver: {
      type: Function,
      default: null
    },
    rulesByField: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    onSubmit(values, options) {
      this.$emit('submit', values, options);
    }
  }
};
</script>