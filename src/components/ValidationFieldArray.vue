<script lang="ts" setup>
import type { Field } from '../types/field';
import type { FocusOptions } from '../types/field-array';
import { nanoid } from 'nanoid';
import { computed, inject, nextTick, onBeforeUnmount, provide, reactive, ref } from 'vue';
import { get } from './helpers';
import {
  getFieldDefaultValueSymbol,
  getFieldPristineSymbol,
  getFieldValueSymbol,
  hasFieldValueSymbol,
  registerSymbol,
} from './symbols';

export interface Props {
  name: string;
  keyName?: string;
}

const { name, keyName = 'id' } = defineProps<Props>();

const getFieldPristine = inject(getFieldPristineSymbol)!;
const pristine = ref<boolean>(getFieldPristine(name));

const register = inject(registerSymbol)!;
const getFieldDefaultValue = inject<(name: string, defaultValue?: any[]) => any[]>(
  getFieldDefaultValueSymbol,
)!;
const getFieldValue = inject<(name: string) => any[]>(getFieldValueSymbol)!;

const defaultValue = computed(() => getFieldDefaultValue(name, []));
const providedValue = computed<Array<Record<string, any>>>(() => getFieldValue(name) || []);
const providedValueMap = computed(() => {
  const map: Record<string, Record<string, any>> = {};
  providedValue.value.forEach((field) => {
    map[field[keyName]] = field;
  });
  return map;
});

const fieldComponents = ref<Field[]>([]);
const fields = ref(getInitialFields());

const actualValue = computed<Array<Record<string, any>>>(() => {
  const map = providedValueMap.value;
  return fields.value.map(field => ({
    ...map[field[keyName]],
    [keyName]: field[keyName],
  }));
});

function getInitialFields() {
  return defaultValue.value.map(field => ({
    ...field,
    [keyName]: getId(field),
  }));
}

function getId(field: Record<string, any>) {
  return keyName in field ? field[keyName] : nanoid();
}

function touch() {
  pristine.value = false;
}

function append(value: Record<string, any>, focusOptions?: FocusOptions) {
  value[keyName] = getId(value);
  fields.value.push(value);
  touch();
  if (focusOptions) {
    // by default focus on last field
    handleFocus({ index: fields.value.length - 1, ...focusOptions });
  }
}
function prepend(value: Record<string, any>, focusOptions?: FocusOptions) {
  value[keyName] = getId(value);
  fields.value.unshift(value);
  touch();
  if (focusOptions) {
    // by default focus on first field
    handleFocus(focusOptions);
  }
}
function insert(index: number, value: Record<string, any>, focusOptions?: FocusOptions) {
  checkIndexOverflow({
    index,
  });

  value[keyName] = getId(value);
  fields.value.splice(index, 0, value);
  touch();
  if (focusOptions) {
    // by default focus on inserted field
    handleFocus({ index, ...focusOptions });
  }
}
function swap(from: number, to: number, focusOptions?: FocusOptions) {
  checkIndexOverflow({
    from,
    to,
  });

  const temp = fields.value[from];
  fields.value[from] = fields.value[to];
  fields.value[to] = temp;
  touch();
  if (focusOptions) {
    // by default focus on swapped field
    handleFocus({ index: to, ...focusOptions });
  }
}
function move(from: number, to: number, focusOptions?: FocusOptions) {
  checkIndexOverflow({
    from,
    to,
  });

  fields.value.splice(to, 0, fields.value.splice(from, 1)[0]);
  touch();
  if (focusOptions) {
    // by default focus on moved field
    handleFocus({ index: to, ...focusOptions });
  }
}
function remove(index: number, focusOptions?: FocusOptions) {
  fields.value.splice(index, 1);
  touch();

  if (focusOptions && fields.value.length) {
    // by default focus on previous field, if there is no previous field focus on first field
    handleFocus({ index: Math.max(index - 1, 0), ...focusOptions });
  }
}

function checkIndexOverflow(values: Record<string, number>) {
  const maxIndex = fields.value.length - 1;
  Object.entries(values).forEach(([key, count]) => {
    if (count < 0 || count > maxIndex) {
      throw new Error(`'${key}' should be between 0 and ${maxIndex}`);
    }
  });
}

function handleFocus({ field, index = 0 }: FocusOptions) {
  if (!field) {
    throw new Error(`Field name is required for focus, please provide field name in focus options`);
  }

  const itemName = `${name}.${index || 0}.${field}`;
  nextTick(() => {
    const fieldComponent = fieldComponents.value.find(({ name }) => name === itemName);
    fieldComponent?.onFocus();
  });
}

const onChange: Field['onChange'] = (value: any) => {
  const newFields = [...value];
  fields.value = newFields;
  nextTick(() => {
    touch();
    fieldComponents.value.forEach(({ name, onChange }) => {
      const normalizedName = getNormalizedName(name);
      onChange(get(newFields, normalizedName));
    });
  });
};

const reset: Field['reset'] = () => {
  fields.value = getInitialFields();
  pristine.value = true;
};

function noop() {}

const field: Field = reactive({
  name: computed(() => name),
  dirty: false,
  pristine,
  errors: [],
  getValue: () => {
    return fields.value.map((field) => {
      return {
        [keyName]: field[keyName],
      };
    });
  },
  onChange,
  setError: noop,
  resetErrors: noop,
  reset,
  onFocus: noop,
});

const unregister = register(field);
onBeforeUnmount(() => {
  fieldComponents.value = [];
  unregister();
});

function getNormalizedName(fieldName: string) {
  return fieldName.replace(new RegExp(`^${name}.`), '');
}

provide(hasFieldValueSymbol, () => true);
provide(getFieldValueSymbol, (fieldName) => {
  const normalizedName = getNormalizedName(fieldName);
  return get(fields.value, normalizedName);
});
provide(registerSymbol, (fieldComponent) => {
  fieldComponents.value.push(fieldComponent);
  const unregister = register(fieldComponent);
  return () => {
    handleUnregister(fieldComponent);
    return unregister();
  };
});

function handleUnregister(fieldComponent: Field) {
  if (fieldComponents.value.length === 0) {
    return;
  }

  const index = fieldComponents.value.indexOf(fieldComponent);
  if (index === -1) {
    return;
  }

  fieldComponents.value.splice(index, 1);
}
</script>

<template>
  <slot
    v-bind="{ name }"
    :on-change="onChange"
    :fields="actualValue"
    :append="append"
    :prepend="prepend"
    :insert="insert"
    :swap="swap"
    :move="move"
    :remove="remove"
  />
</template>
