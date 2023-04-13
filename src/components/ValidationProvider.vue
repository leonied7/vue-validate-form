<template>
  <slot
    :handle-submit="handleSubmit"
    :on-field-change="onFieldChange"
    :reset="reset"
    :set-error="setError"
    :focus-invalid-field="focusInvalidField"
    :values="values"
    :dirty="dirty"
    :pristine="pristine"
    :invalid="invalid"
    :errors="errors"
  />
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script lang="ts" setup>
import { computed, nextTick, provide, ref, toRefs, watch } from 'vue';

import type { Values } from '../types/values';
import type {
  InnerValidationError,
  InnerValidationsErrors,
  ResetBehaviour,
  ValidationError,
  ValidationsErrors
} from '../types/error';
import type { Field } from '../types/field';
import type { Resolver } from '../types/resolver';
import type { GetErrors, GetFieldDefaultValue, Register } from './symbols';
import {
  getErrorsSymbol,
  getFieldDefaultValueSymbol,
  getFieldValueSymbol,
  getIsSubmittedSymbol,
  hasFieldValueSymbol,
  registerSymbol,
  validateSymbol
} from './symbols';
import { get, has, set } from './helpers';
import { ON_FIELD_CHANGE, ON_FORM_CHANGE } from './constants';

export interface Props {
  defaultValues?: Values;
  defaultErrors?: ValidationsErrors;
  resolver?: Resolver;
}

const props = withDefaults(defineProps<Props>(), {
  defaultValues: () => ({}),
  defaultErrors: () => ({}),
  resolver: (values) => ({ values, errors: {} })
});
const emit = defineEmits<{
  (
    e: 'submit',
    values: Values,
    opt: {
      setError: (name: string, error: ValidationError) => void;
      reset: (defaultValue?: Values) => void;
      onFieldChange: (name: string, value: unknown) => void;
      focusInvalidField: () => void;
    }
  ): void;
  (e: 'dirty', dirty: boolean): void;
}>();

const { defaultValues, defaultErrors, resolver } = toRefs(props);

const submitted = ref(false);
const innerDefaultValues = ref<Values>({});
const fieldComponents = ref<Field[]>([]);
const additionalErrors = ref<InnerValidationsErrors>({});

const fieldComponentMap = computed(() => {
  return fieldComponents.value.reduce((map, fieldComponent) => {
    map[fieldComponent.name] = fieldComponent;
    return map;
  }, {});
});
const values = computed<Values>(() => {
  return fieldComponents.value.reduce((result, { name, getValue }) => {
    set(result, name, getValue());
    return result;
  }, {});
});
const dirty = computed(() => {
  return fieldComponents.value.some(({ dirty }) => dirty);
});
const pristine = computed(() => {
  return !fieldComponents.value.some(({ pristine }) => !pristine);
});
const errors = computed(() => {
  return fieldComponents.value.reduce((allErrors, { name, errors }) => {
    allErrors[name] = errors;
    return allErrors;
  }, Object.assign({}, additionalErrors.value));
});
const existsErrors = computed(() => {
  return Object.values(errors.value).some((errors) => errors.length);
});
const firstInvalidFieldComponent = computed<Field>(() => {
  return fieldComponents.value.find(({ name }) => errors.value[name].length);
});
const invalid = computed(() => {
  return submitted.value && existsErrors.value;
});

watch(defaultValues, setDefaultData);
watch(defaultErrors, setDefaultData);
watch(
  dirty,
  (dirty) => {
    emit('dirty', dirty);
  },
  {
    immediate: true
  }
);
setDefaultData();

async function setDefaultData() {
  reset(defaultValues.value);
  additionalErrors.value = {};
  if (!Object.values(defaultErrors.value).some((errors) => errors.length)) {
    return;
  }

  setErrorsList(defaultErrors.value, ON_FIELD_CHANGE);
  const { errors } = await validate();
  setErrorsList(errors);
  await nextTick();
  submitted.value = true;
}

const getFieldDefaultValue: GetFieldDefaultValue = (
  name: string,
  defaultValue: unknown
): unknown => {
  return get(innerDefaultValues.value, name, defaultValue);
};
const getErrors: GetErrors = (name?: string) => {
  return name ? errors.value[name] || [] : errors.value;
};
async function handleSubmit(): Promise<void> {
  submitted.value = true;
  additionalErrors.value = {};
  fieldComponents.value.forEach(({ resetErrors }) => resetErrors());

  const { values, errors } = await validate();
  setErrorsList(errors);
  if (existsErrors.value) {
    return focusInvalidField();
  }

  emit('submit', values, {
    setError,
    reset,
    onFieldChange,
    focusInvalidField
  });
}
async function validate(triggerFieldName?: string) {
  const { values, errors: errorsList } = await resolveSchema();

  fieldComponents.value.forEach(({ resetErrors, errors, name }) => {
    if (triggerFieldName !== name) {
      const actualErrors = errors.filter(({ resetBehaviour }) => resetBehaviour !== ON_FORM_CHANGE);
      errorsList[name] = actualErrors.concat(errorsList[name] || []);
    }
    resetErrors();
  });
  return { values, errors: errorsList };
}
function resolveSchema() {
  return resolver.value(values.value);
}
function onFieldChange(name: string, value: unknown) {
  fieldComponentMap.value[name].onChange(value);
}
function reset(values?: Values) {
  submitted.value = false;
  if (values) {
    innerDefaultValues.value = JSON.parse(JSON.stringify(values));
  }

  fieldComponents.value.forEach(({ reset }) => {
    reset();
  });
}

function setErrorsList(
  errorsList: InnerValidationsErrors | ValidationsErrors,
  defaultResetBehaviour: ResetBehaviour = ON_FORM_CHANGE
) {
  Object.entries(errorsList).forEach(([name, errors]) => {
    errors.forEach(
      ({ message, type, resetBehaviour = defaultResetBehaviour }: InnerValidationError) => {
        setError(name, { message, type, resetBehaviour });
      }
    );
  });
}
function setError(
  name: string,
  { message, type = null, resetBehaviour = ON_FIELD_CHANGE }: InnerValidationError | ValidationError
) {
  const fieldComponent = fieldComponentMap.value[name];
  if (fieldComponent) {
    fieldComponent.setError({ message, type, resetBehaviour });
    return;
  }
  if (additionalErrors.value[name] === undefined) {
    additionalErrors.value[name] = [];
  }

  additionalErrors.value[name].push({
    type,
    message,
    resetBehaviour
  });
}
function focusInvalidField(): void {
  return firstInvalidFieldComponent.value && firstInvalidFieldComponent.value.onFocus();
}

const register: Register = (fieldComponent) => {
  const name = fieldComponent.name;
  fieldComponents.value.push(fieldComponent);
  (additionalErrors.value[name] || []).forEach((error) => {
    setError(name, error);
  });
  delete additionalErrors.value[name];
  return () => {
    unregister(fieldComponent);
  };
};
function unregister(fieldComponent: Field) {
  fieldComponents.value = fieldComponents.value.filter((field) => field !== fieldComponent);
}

provide(registerSymbol, register);
provide(validateSymbol, async (name: string) => {
  const { errors } = await validate(name);
  setErrorsList(errors);
});
provide(getFieldDefaultValueSymbol, getFieldDefaultValue);
provide(getFieldValueSymbol, (name: string) => get(values.value, name));
provide(getErrorsSymbol, getErrors);
provide(hasFieldValueSymbol, (name: string) => has(values.value, name));
provide(getIsSubmittedSymbol, () => submitted.value);
</script>
