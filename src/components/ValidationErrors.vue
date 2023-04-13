<script lang="ts" setup>
import { computed, inject } from 'vue';

import type { ValidationError } from '../types/error';
import { getErrorsSymbol, getIsSubmittedSymbol } from './symbols';

const props = defineProps({
  name: { type: String, default: undefined },
});

const getIsSubmitted = inject(getIsSubmittedSymbol);
if (!getIsSubmitted) {
  throw new Error('getIsSubmitted not provided');
}

const submitted = computed(() => getIsSubmitted());
const getErrors = inject(getErrorsSymbol);
if (!getErrors) {
  throw new Error('getErrors not provided');
}

const errors = computed<Array<ValidationError>>(() => {
  const errors = getErrors(props.name);
  return Array.isArray(errors) ? errors : [].concat(...Object.values(errors));
});

const invalid = computed(() => submitted.value && !!errors.value.length);
</script>

<template>
  <slot v-if="invalid" :errors="errors" />
</template>
