<template>
  <div />
</template>

<script lang="ts">
export default {
  name: 'FormInfo',
  props: {
    values: {
      type: Object,
      required: true
    },
    errors: {
      type: Object,
      required: true
    },
    dirty: Boolean,
    pristine: Boolean,
    invalid: Boolean
  }
};
</script>
