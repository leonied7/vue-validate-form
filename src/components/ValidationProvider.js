import { validators } from '../validators.js';
import {
  getFieldDefaultValue,
  getFieldValue,
  hasFieldValue,
  getIsSubmitted,
  register,
  validate,
  getErrors
} from './symbols.js';
import { set, get, has, normalizeChildren } from './helpers';

export default {
  name: 'ValidationProvider',
  provide() {
    return {
      [register]: this.register,
      [validate]: async (name) => {
        this.validateField(name);
        if (!this.resolver) {
          return;
        }
        const { errors } = await this.resolver(this.values);
        if (errors[name]) {
          const { setError } = this.callbackDataMap[name];
          setError(errors[name].message, errors[name].type);
        }
      },
      [getFieldDefaultValue]: this.getFieldDefaultValue,
      [getFieldValue]: (name) => get(this.values, name),
      [getErrors]: this.getErrors,
      [hasFieldValue]: (name) => has(this.values, name),
      [getIsSubmitted]: () => this.submitted
    };
  },
  props: {
    defaultValues: {
      type: Object,
      default: () => ({})
    },
    resolver: {
      type: Function,
      default: null
    },
    tag: {
      type: String,
      default: 'div'
    }
  },
  data() {
    return {
      submitted: false,
      innerDefaultValues: {},
      callbacks: [],
      additionalErrors: {}
    };
  },
  computed: {
    callbackDataMap() {
      return this.callbacks.reduce((result, callback) => {
        const data = callback();
        result[data.name] = data;
        return result;
      }, {});
    },
    values() {
      return Object.entries(this.callbackDataMap).reduce((result, [name, { value }]) => {
        set(result, name, value);
        return result;
      }, {});
    },
    dirty() {
      return Object.values(this.callbackDataMap).some(({ dirty }) => dirty);
    },
    errors() {
      return Object.values(this.callbackDataMap).reduce((allErrors, { errors, name }) => {
        allErrors[name] = errors;
        return allErrors;
      }, Object.assign({}, this.additionalErrors));
    },
    existsErrors() {
      return Object.values(this.errors).some((errors) => errors.length);
    },
    firstInvalidFieldData() {
      return Object.values(this.callbackDataMap).find(({ name }) => this.errors[name].length);
    }
  },
  watch: {
    defaultValues: {
      immediate: true,
      handler(values) {
        this.reset(values);
      }
    },
    dirty: {
      immediate: true,
      handler(dirty) {
        this.$emit('dirty', dirty);
      }
    }
  },
  methods: {
    getFieldDefaultValue(name, defaultValue) {
      return get(this.innerDefaultValues, name, defaultValue);
    },
    getErrors(name) {
      return name ? this.errors[name] || [] : this.errors;
    },
    validateField(name) {
      const { rules, value, setError, resetErrors } = this.callbackDataMap[name];
      resetErrors();
      Object.entries(rules).forEach(([ruleName, options]) => {
        const validator = validators[ruleName];
        if (!validator) {
          throw new Error(`validator '${ruleName}' must be registered`);
        }
        if (!validator(value, options.params)) {
          setError(options.message, ruleName);
        }
      });
    },
    async onSubmit() {
      this.submitted = true;
      let resultValues = this.values;

      this.additionalErrors = {};
      Object.keys(this.callbackDataMap).forEach((name) => {
        this.validateField(name);
      });
      if (this.resolver) {
        const { values, errors } = await this.resolver(this.values);
        resultValues = values;
        Object.entries(errors).forEach(([name, { message, type }]) => {
          this.setError(name, message, type);
        });
      }
      if (this.existsErrors) {
        return this.focusInvalidField();
      }

      this.$emit('submit', resultValues, {
        setError: this.setError,
        reset: this.reset,
        focusInvalidField: this.focusInvalidField
      });
    },
    reset(values) {
      this.submitted = false;
      if (values) {
        this.innerDefaultValues = JSON.parse(JSON.stringify(values));
      }
      Object.values(this.callbackDataMap).forEach(({ reset }) => {
        reset();
      });
    },
    setError(name, message, type = null) {
      const fieldData = this.callbackDataMap[name];
      if (fieldData) {
        fieldData.setError(message, type);
        return;
      }
      if (this.additionalErrors[name] === undefined) {
        this.$set(this.additionalErrors, name, []);
      }
      this.additionalErrors[name].push({
        type,
        message
      });
    },
    focusInvalidField() {
      return this.firstInvalidFieldData && this.firstInvalidFieldData.focus();
    },
    register(callback) {
      const { name, setError } = callback();
      (this.additionalErrors[name] || []).forEach((error) => {
        setError(error);
      });
      this.$delete(this.additionalErrors, name);
      this.callbacks.push(callback);
      return () => this.unregister(callback);
    },
    unregister(callback) {
      this.callbacks = this.callbacks.filter((field) => field !== callback);
    }
  },
  render(h) {
    const children = normalizeChildren(this, {
      handleSubmit: this.onSubmit,
      reset: this.reset,
      values: this.values,
      dirty: this.dirty,
      invalid: this.submitted && this.existsErrors,
      errors: this.errors
    });

    return children.length <= 1 ? children[0] : h(this.tag, children);
  }
};
