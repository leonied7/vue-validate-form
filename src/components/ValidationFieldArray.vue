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

<script lang="ts" setup>
import { computed, inject, nextTick, onBeforeUnmount, provide, reactive, ref, toRefs } from 'vue';
import type { Field } from '../types/field';
import type { FocusOptions } from '../types/field-array';
import {
  getFieldDefaultValueSymbol,
  getFieldValueSymbol,
  hasFieldValueSymbol,
  registerSymbol
} from './symbols';
import { nanoid } from 'nanoid';
import { get } from './helpers';

export interface Props {
  name: string;
  keyName?: string;
}
const props = withDefaults(defineProps<Props>(), {
  keyName: 'id'
});

const { name, keyName } = toRefs(props);

const focusOptions = ref<FocusOptions>();

const register = inject(registerSymbol)!;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getFieldDefaultValue = inject<(name: string, defaultValue?: any[]) => any[]>(
  getFieldDefaultValueSymbol
)!;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getFieldValue = inject<(name: string) => any[]>(getFieldValueSymbol)!;

const defaultValue = computed(() => getFieldDefaultValue(name.value, []));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const providedValue = computed<Array<Record<string, any>>>(() => getFieldValue(name.value) || []);
const providedValueMap = computed(() => {
  const map: Record<string, Record<string, unknown>> = {};
  providedValue.value.forEach((field) => {
    map[field[keyName.value]] = field;
  });
  return map;
});
const actualValue = computed<Array<Record<string, unknown>>>(() => {
  const map = providedValueMap.value;
  return fields.value.map((field) => ({
    ...map[field[keyName.value]],
    [keyName.value]: field[keyName.value]
  }));
});

const fieldComponents = ref<Field[]>([]);
const fields = ref(getInitialFields());

function getInitialFields() {
  return defaultValue.value.map((field) => ({
    ...field,
    [keyName.value]: getId(field)
  }));
}

function getId(field: Record<string, unknown>) {
  return keyName.value in field ? field[keyName.value] : nanoid();
}

function append(value: Record<string, unknown>, options?: FocusOptions) {
  value[keyName.value] = getId(value);
  focusOptions.value = options;
  fields.value.push(value);
}
function prepend(value: Record<string, unknown>, options?: FocusOptions) {
  value[keyName.value] = getId(value);
  focusOptions.value = options;
  fields.value.unshift(value);
}
function insert(index: number, value: Record<string, unknown>, options?: FocusOptions) {
  value[keyName.value] = getId(value);
  focusOptions.value = options;
  fields.value.splice(index, 0, value);
}
function swap(from: number, to: number) {
  const temp = fields.value[from];
  fields.value[from] = fields.value[to];
  fields.value[to] = temp;
}
function move(from: number, to: number) {
  fields.value.splice(to, 0, fields.value.splice(from, 1)[0]);
}
function remove(index: number) {
  fields.value.splice(index, 1);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onChange: Field['onChange'] = (value: any) => {
  const newFields = [...value];
  fields.value = newFields;
  nextTick(() => {
    fieldComponents.value.forEach(({ name, onChange }) => {
      const normalizedName = getNormalizedName(name);
      onChange(get(newFields, normalizedName));
    });
  });
};

const reset: Field['reset'] = () => {
  fields.value = getInitialFields();
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

const field: Field = reactive({
  name,
  dirty: false,
  pristine: true,
  errors: [],
  getValue: () => {
    return fields.value.map((field) => {
      return {
        [keyName.value]: field[keyName.value]
      };
    });
  },
  onChange,
  setError: noop,
  resetErrors: noop,
  reset,
  onFocus: noop
});

const unregister = register(field);
onBeforeUnmount(() => {
  fieldComponents.value = [];
  unregister();
});

function getNormalizedName(fieldName: string) {
  return fieldName.replace(new RegExp(`^${name.value}.`), '');
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

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>
