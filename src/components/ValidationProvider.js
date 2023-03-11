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
import { ON_FIELD_CHANGE, ON_FORM_CHANGE } from './constants';

export default {
  name: 'ValidationProvider',
  provide() {
    return {
      [register]: this.register,
      [validate]: async (name) => {
        const { errors } = await this.validate(name);
        this.setErrorsList(errors);
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
    async onSubmit() {
      this.submitted = true;
      this.additionalErrors = {};

      const { values, errors } = await this.validate();
      this.setErrorsList(errors);
      if (this.existsErrors) {
        return this.focusInvalidField();
      }

      this.$emit('submit', values, {
        setError: (name, message, type = null, resetBehaviour = ON_FIELD_CHANGE) =>
          this.setError(name, { message, type, resetBehaviour }),
        reset: this.reset,
        onFieldChange: this.onFieldChange,
        focusInvalidField: this.focusInvalidField
      });
    },
    async validate(triggerFieldName = null) {
      const { values, errors } = await this.resolveSchema();
      const errorsList = this.getLegacyValidateErrors(errors);

      Object.values(this.callbackDataMap).forEach(({ resetErrors, errors, name }) => {
        if (triggerFieldName !== name) {
          const actualErrors = errors.filter(
            ({ resetBehaviour }) => resetBehaviour !== ON_FORM_CHANGE
          );
          errorsList[name] = actualErrors.concat(errorsList[name] || []);
        }
        resetErrors();
      });
      return { values, errors: errorsList };
    },
    resolveSchema() {
      const values = this.values;
      return this.resolver ? this.resolver(values) : { values, errors: {} };
    },
    getLegacyValidateErrors(initialErrors = {}) {
      return Object.values(this.callbackDataMap).reduce((errorsList, { name, rules, value }) => {
        errorsList[name] = Object.entries(rules).reduce((errors, [ruleName, options]) => {
          const validator = validators[ruleName];
          if (!validator) {
            throw new Error(`validator '${ruleName}' must be registered`);
          }
          if (!validator(value, options.params)) {
            errors.push({ message: options.message, type: ruleName });
          }
          return errors;
        }, errorsList[name] || []);
        return errorsList;
      }, initialErrors);
    },
    onFieldChange(name, value) {
      this.callbackDataMap[name].set(value);
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
    setErrorsList(errorsList) {
      Object.entries(errorsList).forEach(([name, errors]) => {
        errors.forEach(({ message, type, resetBehaviour = ON_FORM_CHANGE }) => {
          this.setError(name, { message, type, resetBehaviour });
        });
      });
    },
    setError(name, { message, type = null, resetBehaviour = ON_FIELD_CHANGE }) {
      const fieldData = this.callbackDataMap[name];
      if (fieldData) {
        fieldData.setError({ message, type, resetBehaviour });
        return;
      }
      if (this.additionalErrors[name] === undefined) {
        this.$set(this.additionalErrors, name, []);
      }
      this.additionalErrors[name].push({
        type,
        message,
        resetBehaviour
      });
    },
    focusInvalidField() {
      return this.firstInvalidFieldData && this.firstInvalidFieldData.focus();
    },
    register(callback) {
      const { name } = callback();
      this.callbacks.push(callback);
      (this.additionalErrors[name] || []).forEach((error) => {
        this.setError(name, error);
      });
      this.$delete(this.additionalErrors, name);
      return () => this.unregister(callback);
    },
    unregister(callback) {
      this.callbacks = this.callbacks.filter((field) => field !== callback);
    }
  },
  render(h) {
    const children = normalizeChildren(this, {
      handleSubmit: this.onSubmit,
      onFieldChange: this.onFieldChange,
      reset: this.reset,
      values: this.values,
      dirty: this.dirty,
      invalid: this.submitted && this.existsErrors,
      errors: this.errors
    });

    return children.length <= 1 ? children[0] : h(this.tag, children);
  }
};
