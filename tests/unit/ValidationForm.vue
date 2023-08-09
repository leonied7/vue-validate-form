<template>
  <validation-provider
    :default-values="defaultValues"
    :default-errors="defaultErrors"
    :resolver="resolver"
    @submit="onSubmit"
    @dirty="$emit('dirty', $event)"
  >
    <template
      #default="{
        handleSubmit,
        reset,
        onFieldChange,
        values,
        dirty: formDirty,
        pristine: formPristine,
        invalid: formInvalid,
        errors: formErrors
      }"
    >
      <form @submit.prevent="handleSubmit">
        <ValidationField name="my-input">
          <template
            #default="{ modelValue, name, firstError, errors, dirty, pristine, invalid, onChange }"
          >
            <base-input
              :name="name"
              :first-error="firstError"
              :errors="errors"
              :model-value="modelValue"
              :dirty="dirty"
              :pristine="pristine"
              :invalid="invalid"
              @update:modelValue="onChange"
            />
          </template>
        </ValidationField>

        <ValidationField name="my.nested.value">
          <template
            #default="{ modelValue, name, firstError, errors, dirty, pristine, invalid, onChange }"
          >
            <base-input
              :name="name"
              :first-error="firstError"
              :errors="errors"
              :model-value="modelValue"
              :dirty="dirty"
              :pristine="pristine"
              :invalid="invalid"
              @update:modelValue="onChange"
            />
          </template>
        </ValidationField>

        <ValidationFieldArray name="arrayField">
          <template
            #default="{
              name: arrayName,
              onChange,
              fields,
              append,
              prepend,
              insert,
              swap,
              move,
              remove
            }"
          >
            <div v-for="(field, index) in fields" :key="field.id">
              <ValidationField :name="`${arrayName}.${index}.id`" />
              <ValidationField :name="`${arrayName}.${index}.firstName`">
                <template
                  #default="{
                    modelValue,
                    name,
                    firstError,
                    errors,
                    dirty,
                    pristine,
                    invalid,
                    onChange
                  }"
                >
                  <base-input
                    :name="name"
                    :first-error="firstError"
                    :errors="errors"
                    :model-value="modelValue"
                    :dirty="dirty"
                    :pristine="pristine"
                    :invalid="invalid"
                    @update:modelValue="onChange"
                  />
                </template>
              </ValidationField>
            </div>
            <button id="append" type="button" @click="append">Append</button>
            <button id="prepend" type="button" @click="prepend">Prepend</button>
            <button id="insert" type="button" @click="insert(1, { firstName: 'insert' })">
              Insert
            </button>
            <button id="swap" type="button" @click="swap(0, 2)">Swap</button>
            <button id="move" type="button" @click="move(0, 2)">Move</button>
            <button id="remove" type="button" @click="remove(1)">Remove</button>
            <button id="arrayChange" type="button" @click="onChange([{ id: 42 }])">
              Change array
            </button>
          </template>
        </ValidationFieldArray>

        <ValidationErrors name="common">
          <template #default="{ errors }">
            <BaseErrors :errors="errors" />
          </template>
        </ValidationErrors>

        <FormInfo
          :values="values"
          :dirty="formDirty"
          :pristine="formPristine"
          :invalid="formInvalid"
          :errors="formErrors"
          @set-field-value="onFieldChange"
        />

        <button type="submit">Submit</button>
        <button type="reset" @click="reset($event.payload)">Reset</button>
      </form>
    </template>
  </validation-provider>
</template>

<script>
import {
  ValidationProvider,
  ValidationField,
  ValidationFieldArray,
  ValidationErrors
} from '../../src';
import BaseInput from './BaseInput.vue';
import FormInfo from './FormInfo.vue';
import BaseErrors from './BaseErrors.vue';

export default {
  name: 'ValidationForm',
  components: {
    BaseErrors,
    FormInfo,
    ValidationProvider,
    ValidationField,
    ValidationFieldArray,
    ValidationErrors,
    BaseInput
  },
  inheritAttrs: false,
  props: {
    defaultValues: {
      type: Object,
      default: () => ({})
    },
    defaultErrors: {
      type: Object,
      default: () => ({})
    },
    resolver: {
      type: Function,
      default: undefined
    }
  },
  emits: {
    submit: null,
    dirty: null
  },
  methods: {
    onSubmit(values, options) {
      this.$emit('submit', values, options);
    }
  }
};
</script>
