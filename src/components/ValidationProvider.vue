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

<script lang="ts" setup generic="T extends Values">
import { computed, nextTick, provide, ref, watch, onBeforeUnmount } from 'vue';

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

export interface Props<V extends Values> {
  defaultValues?: Partial<V>;
  defaultErrors?: ValidationsErrors;
  resolver?: Resolver<V>;
  instantValidate?: boolean;
  resetOnUpdate?: boolean;
}

const {
  defaultValues = {},
  defaultErrors = {},
  resolver = (values) => ({ values, errors: {} as ValidationsErrors }),
  instantValidate = false,
  resetOnUpdate = true
} = defineProps<Props<T>>();

const emit = defineEmits<{
  submit: [values: T, opt: {
    setError: (name: string, error: ValidationError) => void;
    reset: (defaultValue?: Partial<T>) => void;
    onFieldChange: (name: string, value: unknown) => void;
    focusInvalidField: () => void;
  }];
  dirty: [dirty: boolean];
  change: [values: Partial<T>];
}>();

const submitted = ref(false);
const innerDefaultValues = ref<Partial<T>>({});
const fieldComponents = ref<Field[]>([]);
const additionalErrors = ref<InnerValidationsErrors>({});

const fieldComponentMap = computed<Record<string, Field>>(() => {
  return fieldComponents.value.reduce<Record<string, Field>>((map, fieldComponent) => {
    map[fieldComponent.name] = fieldComponent;
    return map;
  }, {});
});
const values = computed<Partial<T>>(() => {
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
  return submitted.value || instantValidate;
});
const invalid = computed(() => {
  return existsErrors.value;
});

watch(() => defaultValues, () => {
  if (resetOnUpdate) {
    setDefaultData();
  }
});
watch(() => defaultErrors, () => {
  if (resetOnUpdate) {
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
  reset(defaultValues);
  additionalErrors.value = {};
  const hasErrors = Object.values(defaultErrors).some((errors) => errors.length);
  if (!instantValidate && !hasErrors) {
    return;
  }

  await nextTick();
  setErrorsList(defaultErrors, ON_FIELD_CHANGE);
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

  emit('submit', values as T, {
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
  return resolver(values.value);
}
function onFieldChange(name: string, value: unknown) {
  fieldComponentMap.value[name].onChange(value);
}
function reset(values?: Partial<T>) {
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
provide(getFieldValueSymbol, (name) => get(values.value, name));
provide(getFieldPristineSymbol, (name) => fieldComponentMap.value[name]?.pristine ?? true);
provide(getErrorsSymbol, getErrors);
provide(hasFieldValueSymbol, (name) => has(values.value, name));
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
