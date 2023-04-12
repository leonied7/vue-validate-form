<template>
  <slot v-if="invalid" :errors="errors" />
</template>

<script>
// import { h } from 'vue';

import { getErrors, getIsSubmitted } from './symbols';

export default {
  name: 'ValidationErrors',
  inject: {
    getErrors,
    getIsSubmitted
  },
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      default: undefined
    },
    tag: {
      type: String,
      default: 'div'
    }
  },
  computed: {
    submitted() {
      return this.getIsSubmitted();
    },
    errors() {
      const errors = this.getErrors(this.name);
      return Array.isArray(errors) ? errors : [].concat(...Object.values(errors));
    },
    invalid() {
      return this.submitted && !!this.errors.length;
    }
  }
};
</script>
