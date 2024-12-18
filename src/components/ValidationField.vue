<template>
  <slot
    v-if="registered"
    v-bind="{ name }"
    :on-change="onChange"
    :set-error="setError"
    :model-value="value"
    :errors="errors"
    :first-error="firstError"
    :dirty="dirty"
    :invalid="invalid"
    :pristine="pristine"
  />
</template>

<script lang="ts" setup>
import { computed, inject, ref, reactive, nextTick, onUnmounted } from 'vue';

import type { InnerValidationError } from '../types/error';
import {
  getFieldDefaultValueSymbol,
  getFieldPristineSymbol,
  getFieldValueSymbol,
  getIsValidateAvailableSymbol,
  hasFieldValueSymbol,
  registerSymbol,
  validateSymbol
} from './symbols';
import type { Field } from '../types/field';
import { ON_FIELD_CHANGE } from './constants';

const { name, isEqual = (a, b) => a === b } = defineProps<{
  name: string;
  isEqual?: (a: unknown, b: unknown) => boolean;
}>();

const emit = defineEmits<{
  (e: 'should-focus', options: { name: string }): void;
  (e: 'change', value: unknown): void;
}>();

const registered = ref(false);
const errors = ref<InnerValidationError[]>([]);

const hasFieldValue = inject(hasFieldValueSymbol)!;
const getFieldDefaultValue = inject(getFieldDefaultValueSymbol)!;
const getFieldValue = inject(getFieldValueSymbol)!;
const getFieldPristine = inject(getFieldPristineSymbol)!;
const getIsValidateAvailable = inject(getIsValidateAvailableSymbol)!;
const register = inject(registerSymbol)!;
const validate = inject(validateSymbol)!;

const defaultValue = computed(() => getFieldDefaultValue(name));
const hasProvidedValue = computed(() => hasFieldValue(name));
const providedValue = computed(() => getFieldValue(name));
const validateAvailable = computed(() => getIsValidateAvailable());
const value = ref(hasProvidedValue.value ? providedValue.value : defaultValue.value);
const pristine = ref<boolean>(getFieldPristine(name));

const dirty = computed(() => !isEqual(value.value, defaultValue.value));
const firstError = computed(() => errors.value[0]);
const invalid = computed(() => !!errors.value.length);

const reset: Field['reset'] = () => {
  resetErrors();
  nextTick(() => {
    onChange(defaultValue.value);
    pristine.value = true;
  });
};

const onChange: Field['onChange'] = (newValue: unknown) => {
  if (isEqual(value.value, newValue)) {
    return;
  }

  value.value = newValue;
  pristine.value = false;
  emit('change', newValue);

  if (!validateAvailable.value) {
    return;
  }

  validate(name);
};

const setError: Field['setError'] = ({
  message,
  type,
  resetBehaviour = ON_FIELD_CHANGE
}: InnerValidationError) => {
  errors.value.push({
    type,
    message,
    resetBehaviour
  });
};

const resetErrors: Field['resetErrors'] = () => {
  if (errors.value.length) {
    errors.value = [];
  }
};

const field: Field = reactive({
  name: computed(() => name),
  dirty,
  pristine,
  errors,
  getValue: () => value.value,
  onChange,
  setError,
  resetErrors,
  reset,
  onFocus: () => {
    emit('should-focus', {
      name
    });
  }
});

defineExpose({
  name,
  onChange,
  setError,
  modelValue: value,
  errors,
  firstError,
  dirty,
  invalid,
  pristine
});

const unregister = register(field);
onUnmounted(() => {
  unregister();
});
registered.value = true;
</script>
