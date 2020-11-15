<script>
import get from 'lodash.get';
import set from 'lodash.set';
import cloneDeep from 'lodash.clonedeep';
import { validators } from '../validators.js';

export default {
  name: 'ValidationProvider',
  provide() {
    return {
      addField: this.addField,
      updateField: this.updateField,
      removeField: this.removeField,
      setValue: this.setValue,
      setFieldError: this.setError,
      getFieldDefaultValues: this.getFieldDefaultValues,
      getFieldValue: (name) => this.flatValues[name],
      getFieldErrors: this.getFieldErrors
    };
  },
  props: {
    defaultValues: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
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
    this.innerDefaultValues = cloneDeep(this.defaultValues);
  },
  methods: {
    onSubmit() {
      Object.keys(this.fields).forEach((name) => {
        this.validateField(name);
      });
      if (this.existsErrors) {
        return this.focusInvalidField();
      }

      this.$emit('submit', this.values, {
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
    setValue(name, value) {
      if (this.flatValues[name] === value) {
        return;
      }
      this.flatValues[name] = value;
      value === this.defaultValuesByField[name]
        ? this.$delete(this.dirtyFields, name)
        : this.$set(this.dirtyFields, name, true);
      this.validateField(name);
    },
    setError(name, message) {
      if (this.errors[name] === undefined) {
        throw new Error(`field '${name}' must be registered for set error`);
      }
      this.errors[name].push(message);
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
          this.setError(name, options.message);
        }
      });
    },
    getFieldDefaultValues(name, defaultValue) {
      return get(this.innerDefaultValues, name, defaultValue);
    },
    getFieldErrors(name) {
      return this.errors[name];
    },
    reset(values) {
      if (values) {
        this.innerDefaultValues = cloneDeep(values);
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
      errors: this.errors,
      defaultValues: this.defaultValuesByField,
      dirtyFields: this.dirtyFields
    });
  }
};
</script>
