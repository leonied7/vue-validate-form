<template>
  <div>
    <input
      :value="modelValue"
      type="text"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  name: 'BaseInput',
  model: {
    prop: 'modelValue',
    event: 'update:modelValue'
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
  }
};
</script>
