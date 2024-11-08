<template>
  <div>
    <div
      v-for="(error, index) in errors"
      :key="index"
    >
      {{ error.message }}
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'BaseErrors',
  props: {
    errors: {
      type: Array,
      required: true
    },
    submitted: Boolean
  }
};
</script>
