<template>
  <div>
    <input
      :value="modelValue"
      type="text"
      @input="$emit('update:model-value', $event.target.value)"
    >
  </div>
</template>

<script lang="ts">
export default {
  name: 'BaseInput',
  model: {
    prop: 'modelValue',
    event: 'update:model-value'
  },
  props: {
    modelValue: {
      type: [String, Number],
      default: undefined
    },
    errors: {
      type: Array,
      required: true
    },
    firstError: {
      type: Object,
      default: undefined
    },
    name: {
      type: String,
      required: true
    },
    dirty: Boolean,
    pristine: Boolean,
    invalid: Boolean
  },
  emits: ['update:model-value']
};
</script>
