<template>
  <div>
    <div v-for="(error, index) in errors" :key="index">{{ error.message }}</div>
  </div>
</template>

<script>
export default {
  name: 'BaseErrors',
  props: {
    errors: {
      type: Array,
      required: true
    }
  }
};
</script>
