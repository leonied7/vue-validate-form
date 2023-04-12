<template>
  <slot
    v-if="registered"
    v-bind="{ name }"
    :onChange="onChange"
    :setError="setError"
    :modelValue="value"
    :errors="errors"
    :firstError="firstError"
    :dirty="dirty"
    :invalid="invalid"
    :pristine="pristine"
  />
</template>

<script>
import {
  getFieldDefaultValue,
  getFieldValue,
  hasFieldValue,
  getIsSubmitted,
  register,
  validate
} from './symbols';
import { ON_FIELD_CHANGE } from './constants';

export default {
  name: 'ValidationField',
  inject: {
    hasFieldValue,
    getFieldDefaultValue,
    getFieldValue,
    getIsSubmitted,
    register,
    validate
  },
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      required: true
    },
    isEqual: {
      type: Function,
      default: (a, b) => a === b
    },
    tag: {
      type: String,
      default: 'div'
    }
  },
  // TODO: доописать при переходе на ts
  emits: {
    'should-focus': null,
    change: null
  },
  data() {
    return {
      registered: false,
      value: undefined,
      pristine: true,
      errors: []
    };
  },
  computed: {
    defaultValue() {
      return this.getFieldDefaultValue(this.name);
    },
    hasProvidedValue() {
      return this.hasFieldValue(this.name);
    },
    providedValue() {
      return this.getFieldValue(this.name);
    },
    submitted() {
      return this.getIsSubmitted();
    },
    dirty() {
      return !this.isEqual(this.value, this.defaultValue);
    },
    firstError() {
      return this.errors[0];
    },
    invalid() {
      return this.submitted && !!this.errors.length;
    }
  },
  mounted() {
    this.value = this.hasProvidedValue ? this.providedValue : this.defaultValue;
    this.unregister = this.register(this);
    this.registered = true;
  },
  beforeUnmount() {
    this.unregister();
  },
  methods: {
    getValue() {
      return this.value;
    },
    onFocus() {
      this.$emit('should-focus', {
        name: this.name
      });
    },
    reset() {
      this.resetErrors();
      this.$nextTick(() => {
        this.onChange(this.defaultValue);
        this.pristine = true;
      });
    },
    onChange(value) {
      if (this.isEqual(this.value, value)) {
        return;
      }

      this.value = value;
      this.pristine = false;
      this.$emit('change', value);

      if (!this.submitted) {
        return;
      }

      this.validate(this.name);
    },
    setError({ message, type = null, resetBehaviour = ON_FIELD_CHANGE }) {
      this.errors.push({
        type,
        message,
        resetBehaviour
      });
    },
    resetErrors() {
      if (this.errors.length) {
        this.errors = [];
      }
    }
  }
};
</script>
