<script lang="ts" setup>
import type { ValidationError } from '../types/error';

import { computed, inject } from 'vue';
import { getErrorsSymbol, getIsSubmittedSymbol } from './symbols';

const props = defineProps({
  name: { type: String, default: undefined },
});

const getIsSubmitted = inject(getIsSubmittedSymbol)!;

const submitted = computed(() => getIsSubmitted());
const getErrors = inject(getErrorsSymbol)!;

const errors = computed<Array<ValidationError>>(() => {
  const errors = getErrors(props.name);
  return Array.isArray(errors) ? errors : Object.values(errors).flat();
});
</script>

<template>
  <slot
    :submitted="submitted"
    :errors="errors"
  />
</template>
