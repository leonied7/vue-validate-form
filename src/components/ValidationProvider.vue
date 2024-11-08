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
    :submitted="submitted"
  />
</template>

<script lang="ts" setup>
import { computed, nextTick, provide, ref, toRefs, watch, onBeforeUnmount } from 'vue';

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
  getFieldPristineSymbol,
  getIsSubmittedSymbol,
  getIsValidateAvailableSymbol,
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
  instantValidate?: boolean;
  resetOnUpdate?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  defaultValues: () => ({}),
  defaultErrors: () => ({}),
  resolver: (values: Record<string, unknown>) => ({ values, errors: {} }),
  instantValidate: false,
  resetOnUpdate: true
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
  (e: 'change', values: Values): void;
}>();

const { defaultValues, defaultErrors, resolver, instantValidate, resetOnUpdate } = toRefs(props);

const submitted = ref(false);
const innerDefaultValues = ref<Values>({});
const fieldComponents = ref<Field[]>([]);
const additionalErrors = ref<InnerValidationsErrors>({});

const fieldComponentMap = computed<Record<string, Field>>(() => {
  return fieldComponents.value.reduce<Record<string, Field>>((map, fieldComponent) => {
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
  return fieldComponents.value.reduce(
    (allErrors, { name, errors }) => {
      allErrors[name] = errors;
      return allErrors;
    },
    Object.assign({}, additionalErrors.value)
  );
});
const existsErrors = computed(() => {
  return Object.values(errors.value).some((errors) => errors.length);
});
const firstInvalidFieldComponent = computed<Field | undefined>(() => {
  return fieldComponents.value.find(({ name }) => errors.value[name].length);
});
const validateAvailable = computed(() => {
  return submitted.value || instantValidate.value;
});
const invalid = computed(() => {
  return existsErrors.value;
});

watch(defaultValues, () => {
  if (resetOnUpdate.value) {
    setDefaultData();
  }
});
watch(defaultErrors, () => {
  if (resetOnUpdate.value) {
    setDefaultData();
  }
});
watch(
  dirty,
  (dirty) => {
    emit('dirty', dirty);
  },
  {
    immediate: true
  }
);
watch(values, async () => {
  const { values } = await resolveSchema();
  emit('change', values);
});
setDefaultData();

async function setDefaultData() {
  reset(defaultValues.value);
  additionalErrors.value = {};
  const hasErrors = Object.values(defaultErrors.value).some((errors) => errors.length);
  if (!instantValidate.value && !hasErrors) {
    return;
  }

  await nextTick();
  setErrorsList(defaultErrors.value, ON_FIELD_CHANGE);
  const { errors } = await validate();
  setErrorsList(errors);
  if (hasErrors) {
    submitted.value = true;
  }
}

const getFieldDefaultValue: GetFieldDefaultValue = (
  name: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValue?: any
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
      const actualErrors: ValidationError[] = errors.filter(
        ({ resetBehaviour }) => resetBehaviour !== ON_FORM_CHANGE
      );
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
  Object.entries(errorsList as InnerValidationsErrors).forEach(([name, errors]) => {
    errors.forEach(({ message, type, resetBehaviour = defaultResetBehaviour }) => {
      setError(name, { message, type, resetBehaviour });
    });
  });
}
function setError(name: string, error: InnerValidationError | ValidationError) {
  const { message, type, resetBehaviour = ON_FIELD_CHANGE } = error as InnerValidationError;
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
  if (fieldComponents.value.length === 0) {
    return;
  }

  const index = fieldComponents.value.indexOf(fieldComponent);
  if (index === -1) {
    return;
  }

  fieldComponents.value.splice(index, 1);
}

onBeforeUnmount(() => {
  fieldComponents.value = [];
});

provide(registerSymbol, register);
provide(validateSymbol, async (name: string) => {
  const { errors } = await validate(name);
  // скидываем ошибки отдельно, т.к. одновременно могу валидироваться несколько полей
  // валидация асинхронная ошибки могут наслаиваться друг на друга
  fieldComponents.value.forEach(({ resetErrors }) => {
    resetErrors();
  });
  setErrorsList(errors);
});
provide(getFieldDefaultValueSymbol, getFieldDefaultValue);
provide(getFieldValueSymbol, (name: string) => get(values.value, name));
provide(getFieldPristineSymbol, (name: string) => fieldComponentMap.value[name]?.pristine ?? true);
provide(getErrorsSymbol, getErrors);
provide(hasFieldValueSymbol, (name: string) => has(values.value, name));
provide(getIsSubmittedSymbol, () => submitted.value);
provide(getIsValidateAvailableSymbol, () => validateAvailable.value);

defineExpose({
  handleSubmit,
  onFieldChange,
  reset,
  setError,
  focusInvalidField,
  values,
  dirty,
  pristine,
  invalid,
  errors,
  submitted
});
</script>
