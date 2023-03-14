import {
  getFieldDefaultValue,
  getFieldValue,
  hasFieldValue,
  getIsSubmitted,
  register,
  validate
} from './symbols';
import { normalizeChildren } from './helpers';
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
  data() {
    return {
      registered: false,
      value: undefined,
      pristine: true,
      errors: []
    };
  },
  props: {
    name: {
      type: String,
      required: true
    },
    rules: {
      type: Object,
      default: () => ({})
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
  beforeDestroy() {
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
    setError(message, type = null, resetBehaviour = ON_FIELD_CHANGE) {
      this.setErrorActual({ message, type, resetBehaviour });
    },
    setErrorActual({ message, type = null, resetBehaviour = ON_FIELD_CHANGE }) {
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
  },
  render(h) {
    if (!this.registered) {
      return;
    }
    const children = normalizeChildren(this, {
      name: this.name,
      onChange: this.onChange,
      setError: this.setError,
      modelValue: this.value,
      errors: this.errors,
      firstError: this.firstError,
      dirty: this.dirty,
      invalid: this.invalid,
      pristine: this.pristine
    });

    return children.length <= 1 ? children[0] : h(this.tag, children);
  }
};
