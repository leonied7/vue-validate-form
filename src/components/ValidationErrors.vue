<template>
  <slot
    :submitted="submitted"
    :errors="errors"
  />
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';

import type { ValidationError } from '../types/error';
import { getErrorsSymbol, getIsSubmittedSymbol } from './symbols';

const props = defineProps({
  name: { type: String, default: undefined }
});

const getIsSubmitted = inject(getIsSubmittedSymbol)!;

const submitted = computed(() => getIsSubmitted());
const getErrors = inject(getErrorsSymbol)!;

const errors = computed<Array<ValidationError>>(() => {
  const errors = getErrors(props.name);
  return Array.isArray(errors) ? errors : Object.values(errors).flat();
});
</script>
