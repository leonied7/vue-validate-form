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
import {
  computed,
  inject,
  ref,
  toRefs,
  getCurrentInstance,
  onBeforeUnmount,
  reactive,
  nextTick
} from 'vue';

import type { InnerValidationError } from '../types/error';
import {
  getFieldDefaultValueSymbol,
  getFieldValueSymbol,
  getIsSubmittedSymbol,
  hasFieldValueSymbol,
  registerSymbol,
  validateSymbol
} from './symbols';
import { Field } from '../types/field';
import { ON_FIELD_CHANGE } from './constants';

interface Props {
  name: string;
  isEqual?: (a: unknown, b: unknown) => boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isEqual: (a, b) => a === b
});

const emit = defineEmits<{
  (e: 'should-focus', options: { name: string }): void;
  (e: 'change', value: unknown): void;
}>();

const { name, isEqual } = toRefs(props);

const registered = ref(false);
const value = ref<unknown>();
const pristine = ref<unknown>(true);
const errors = ref<InnerValidationError[]>([]);

const hasFieldValue = inject(hasFieldValueSymbol)!;
const getFieldDefaultValue = inject(getFieldDefaultValueSymbol)!;
const getFieldValue = inject(getFieldValueSymbol)!;
const getIsSubmitted = inject(getIsSubmittedSymbol)!;
const register = inject(registerSymbol)!;
const validate = inject(validateSymbol)!;

const defaultValue = computed(() => getFieldDefaultValue(name.value));
const hasProvidedValue = computed(() => hasFieldValue(name.value));
const providedValue = computed(() => getFieldValue(name.value));
const submitted = computed(() => getIsSubmitted());
const dirty = computed(() => !isEqual.value(value.value, defaultValue.value));
const firstError = computed(() => errors.value[0]);
const invalid = computed(() => submitted.value && !!errors.value.length);

const reset: Field['reset'] = () => {
  resetErrors();
  nextTick(() => {
    onChange(defaultValue.value);
    pristine.value = true;
  });
};

const onChange: Field['onChange'] = (newValue: unknown) => {
  if (isEqual.value(value.value, newValue)) {
    return;
  }

  value.value = newValue;
  pristine.value = false;
  emit('change', newValue);

  if (!submitted.value) {
    return;
  }

  validate(name.value);
};

const setError: Field['setError'] = ({
  message,
  type = null,
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
  name,
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
      name: name.value
    });
  }
});

value.value = hasProvidedValue.value ? providedValue.value : defaultValue.value;
const unregister = register(field);
onBeforeUnmount(() => {
  unregister();
});
registered.value = true;
</script>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>
