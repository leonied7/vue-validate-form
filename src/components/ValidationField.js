import {
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
} from './symbols.js';

export default {
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
