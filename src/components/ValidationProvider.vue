<script>
import isEqual from 'lodash.isequal';
import get from 'lodash.get';
import set from 'lodash.set';
import { validators } from '../validators';

export default {
  name: 'ValidationProvider',
  provide() {
    return {
      addField: this.addField,
      updateField: this.updateField,
      removeField: this.removeField,
      setValue: this.setValue,
      getFieldDefaultValues: (name) => get(this.defaultValues, name),
      getFieldValues: (name) => this.flatValues[name],
      getFieldErrors: (name) => this.errors[name]
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
      innerDefaultValues: {}
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
    }
  },
  methods: {
    onSubmit() {
      if (Object.values(this.errors).some((errors) => !errors.length)) {
        this.$emit('submit', {}, { setErrors: this.setErrors });
      }
    },
    addField({ name, rules, defaultValue }) {
      this.$set(this.fields, name, rules);
      this.$set(this.innerDefaultValues, name, defaultValue);
      this.$set(this.errors, name, []);
      this.$delete(this.dirtyFields, name);
    },
    updateField(oldName, { name, rules }) {
      this.$set(this.fields, oldName, rules);
      this.replaceFieldName(oldName, name);
    },
    removeField(name) {
      this.$delete(this.fields, name);
      this.$delete(this.innerDefaultValues, name);
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
      this.$set(this.innerDefaultValues, to, this.innerDefaultValues[from]);
      this.$delete(this.innerDefaultValues, from);
      this.$set(this.flatValues, to, this.flatValues[from]);
      this.$delete(this.flatValues, from);
      this.$set(this.errors, to, this.errors[from]);
      this.$delete(this.errors, from);
    },
    setValue(name, value) {
      this.$set(this.flatValues, name, value);
      value === this.innerDefaultValues[name]
        ? this.$delete(this.dirtyFields, name)
        : this.$set(this.dirtyFields, name, true);
      this.validateField(name);
    },
    setErrors(errors) {
      Object.entries(errors).forEach(([name, error]) => {
        this.setFieldError(name, error);
      });
    },
    setFieldError(name, message) {
      this.errors[name].push(message);
    },
    validateField(name) {
      this.errors[name] = [];
      const rules = this.fields[name];
      const value = this.flatValues[name];
      Object.entries(rules).forEach(([ruleName, options]) => {
        const validator = validators[ruleName];
        if (!validator) {
          throw new Error(`validator '${ruleName}' must be registered`);
        }
        if (!isEqual(validator(value), options.value)) {
          this.setFieldError(name, options.message);
        }
      });
    }
  },
  render() {
    return this.$scopedSlots.default({
      handleSubmit: this.onSubmit,
      values: this.values,
      isDirty: this.isDirty,
      errors: this.errors,
      innerDefaultValues: this.innerDefaultValues,
      fields: this.fields,
      dirtyFields: this.dirtyFields
    });
  }
};
</script>
