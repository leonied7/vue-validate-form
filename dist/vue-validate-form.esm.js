import get from 'lodash.get';
import set from 'lodash.set';

const validators = {};

function register(name, validate) {
  validators[name] = validate;
}

const addField = Symbol('addField');
const removeField = Symbol('removeField');
const updateField = Symbol('updateField');
const setValue = Symbol('setValue');
const setFieldError = Symbol('setFieldError');
const getFieldDefaultValues = Symbol('getFieldDefaultValues');
const getFieldValue = Symbol('getFieldValue');
const getFieldErrors = Symbol('getFieldErrors');
const getFieldDirty = Symbol('getFieldDirty');
const getFieldInvalid = Symbol('getFieldInvalid');

var ValidationProvider = {
  name: 'ValidationProvider',
  provide() {
    return {
      [addField]: this.addField,
      [updateField]: this.updateField,
      [removeField]: this.removeField,
      [setValue]: this.setValue,
      [setFieldError]: this.setError,
      [getFieldDefaultValues]: this.getFieldDefaultValues,
      [getFieldValue]: (name) => this.flatValues[name],
      [getFieldErrors]: this.getFieldErrors,
      [getFieldDirty]: this.getFieldDirty,
      [getFieldInvalid]: this.getFieldInvalid
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
    }
  },
  data() {
    return {
      submitted: false,
      fields: {},
      flatValues: {},
      errors: {},
      dirtyFields: {},
      innerDefaultValues: {},
      defaultValuesByField: {}
    };
  },
  computed: {
    isDirty() {
      return !!Object.keys(this.dirtyFields).length;
    },
    values() {
      return Object.entries(this.flatValues).reduce((result, [name, value]) => {
        set(result, name, value);
        return result;
      }, {});
    },
    firstInvalidField() {
      const name = Object.keys(this.fields).find((name) => this.errors[name].length);
      return this.fields[name];
    },
    existsErrors() {
      return Object.values(this.errors).some((errors) => errors.length);
    }
  },
  created() {
    this.innerDefaultValues = this.defaultValues;
  },
  methods: {
    async onSubmit() {
      this.submitted = true;
      let resultValues = this.values;
      Object.keys(this.errors).forEach((name) => {
        this.errors[name] = [];
      });
      Object.keys(this.fields).forEach((name) => {
        this.validateField(name);
      });
      if (this.resolver) {
        const { values, errors } = await this.resolver(this.values);
        resultValues = values;
        Object.entries(errors).forEach(([name, { message, type }]) => {
          this.setError(name, type, message);
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
    focusInvalidField() {
      return this.firstInvalidField && this.firstInvalidField.focus();
    },
    addField({ name, rules, defaultValue, focus }) {
      this.$set(this.fields, name, { rules, focus });
      this.$set(this.defaultValuesByField, name, defaultValue);
      this.$set(this.flatValues, name, defaultValue);
      this.$set(this.errors, name, []);
      this.$delete(this.dirtyFields, name);
    },
    updateField(oldName, { name, rules, focus }) {
      this.$set(this.fields, oldName, { rules, focus });
      this.replaceFieldName(oldName, name);
    },
    removeField(name) {
      this.$delete(this.fields, name);
      this.$delete(this.defaultValuesByField, name);
      this.$delete(this.flatValues, name);
      this.$delete(this.errors, name);
      this.$set(this.dirtyFields, name, true);
    },
    replaceFieldName(from, to) {
      if (from === to) {
        return;
      }
      this.$set(this.fields, to, this.fields[from]);
      this.$delete(this.fields, from);
      this.$set(this.dirtyFields, to, this.dirtyFields[from]);
      this.$delete(this.dirtyFields, from);
      this.$set(this.defaultValuesByField, to, this.defaultValuesByField[from]);
      this.$delete(this.defaultValuesByField, from);
      this.$set(this.flatValues, to, this.flatValues[from]);
      this.$delete(this.flatValues, from);
      this.$set(this.errors, to, this.errors[from]);
      this.$delete(this.errors, from);
    },
    async setValue(name, value) {
      if (this.flatValues[name] === value) {
        return;
      }
      this.flatValues[name] = value;
      value === this.defaultValuesByField[name]
        ? this.$delete(this.dirtyFields, name)
        : this.$set(this.dirtyFields, name, true);

      this.validateField(name);
      if (!this.resolver) {
        return;
      }
      const { errors } = await this.resolver(this.values);
      if (errors[name]) {
        this.setError(name, errors[name].type, errors[name].message);
      }
    },
    setError(name, type, message) {
      if (this.errors[name] === undefined) {
        this.$set(this.errors, name, []);
      }
      this.errors[name].push({
        type,
        message
      });
    },
    validateField(name) {
      this.errors[name] = [];
      const rules = this.fields[name].rules;
      const value = this.flatValues[name];
      Object.entries(rules).forEach(([ruleName, options]) => {
        const validator = validators[ruleName];
        if (!validator) {
          throw new Error(`validator '${ruleName}' must be registered`);
        }
        if (!validator(value, options.params)) {
          this.setError(name, ruleName, options.message);
        }
      });
    },
    getFieldDefaultValues(name, defaultValue) {
      return get(this.innerDefaultValues, name, defaultValue);
    },
    getFieldErrors(name) {
      return this.errors[name] || [];
    },
    getFieldDirty(name) {
      return this.dirtyFields[name];
    },
    getFieldInvalid(name) {
      return this.submitted && !!this.getFieldErrors(name).length;
    },
    reset(values) {
      this.submitted = false;
      if (values) {
        this.innerDefaultValues = values;
      }
      Object.entries(this.defaultValuesByField).forEach(([name, value]) => {
        const defaultValue = this.getFieldDefaultValues(name, value);
        this.defaultValuesByField[name] = defaultValue;
        this.setValue(name, defaultValue);
      });
    }
  },
  render() {
    return this.$scopedSlots.default({
      handleSubmit: this.onSubmit,
      reset: this.reset,
      setError: this.setError,
      values: this.values,
      isDirty: this.isDirty,
      invalid: this.submitted && this.existsErrors,
      errors: this.errors,
      defaultValues: this.defaultValuesByField,
      dirtyFields: this.dirtyFields
    });
  }
};

var ValidationField = {
  name: 'ValidationField',
  inject: {
    addField,
    removeField,
    updateField,
    setValue,
    setFieldError,
    getFieldDefaultValues,
    getFieldValue,
    getFieldErrors,
    getFieldDirty,
    getFieldInvalid
  },
  model: {
    prop: 'modelValue',
    event: 'update:modelValue'
  },
  props: {
    name: {
      type: String,
      required: true
    },
    modelValue: {
      type: null,
      default: undefined
    },
    rules: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    providedDefaultValue() {
      return this.getFieldDefaultValues(this.name);
    },
    providedValue() {
      return this.getFieldValue(this.name);
    },
    defaultValue() {
      return this.providedDefaultValue !== undefined ? this.providedDefaultValue : this.modelValue;
    },
    dirty() {
      return this.getFieldDirty(this.name);
    },
    errors() {
      return this.getFieldErrors(this.name);
    },
    firstError() {
      return this.errors[0] || '';
    },
    invalid() {
      return this.getFieldInvalid(this.name);
    },
    hasModelValue() {
      return this.modelValue !== undefined;
    },
    computedModelValue() {
      return this.hasModelValue ? this.modelValue : this.providedValue;
    }
  },
  watch: {
    rules(rules) {
      this.updateField(this.name, { name: this.name, rules, focus: this.onFocus });
    },
    name(name, oldName) {
      this.updateField(oldName, { name, rules: this.rules, focus: this.onFocus });
    },
    modelValue(value) {
      this.setValue(this.name, value);
    },
    providedValue(value) {
      this.onModelChange(value);
    }
  },
  mounted() {
    const defaultValue = this.defaultValue;
    this.addField({ name: this.name, rules: this.rules, defaultValue, focus: this.onFocus });
    if (defaultValue !== this.modelValue) {
      this.onModelChange(defaultValue);
    }
  },
  beforeDestroy() {
    this.removeField(this.name);
  },
  methods: {
    onModelChange(value) {
      this.$emit('update:modelValue', value);
      this.$nextTick(() => {
        value = this.hasModelValue ? this.computedModelValue : value;
        this.setValue(this.name, value);
      });
    },
    setError(type, message) {
      this.setFieldError(this.name, type, message);
    },
    onFocus() {
      this.$emit('should-focus', {
        name: this.name,
        field: this
      });
    }
  },
  render() {
    return this.$scopedSlots.default({
      name: this.name,
      onChange: this.onModelChange,
      setError: this.setError,
      modelValue: this.computedModelValue,
      errors: this.errors,
      firstError: this.firstError,
      dirty: this.dirty,
      invalid: this.invalid
    });
  }
};

export { ValidationField, ValidationProvider, register as registerValidator };
