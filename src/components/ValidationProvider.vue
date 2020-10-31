<script>
// import isEqual from "lodash.isequal";
//TODO: mb need add inner default values

export default {
  name: 'ValidationProvider',
  provide() {
    return {
      addField: this.addField,
      updateField: this.updateField,
      removeField: this.removeField,
      setValue: this.setValue,
      defaultValues: this.defaultValues
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
      values: {},
      errors: {},
      dirtyFields: {},
      innerDefaultValues: {}
    };
  },
  computed: {
    isDirty() {
      return !!Object.keys(this.dirtyFields).length;
    }
  },
  methods: {
    onSubmit() {
      Object.entries(this.fields).forEach(([name, rules]) => {
        const value = this.values[name];
        if (rules.required) {
          this.$set(this.errors, name, value ? '' : 'Error');
        }
      });
      this.$emit('submit');
    },
    addField({ name, rules, defaultValue }) {
      this.$set(this.fields, name, rules);
      this.$set(this.innerDefaultValues, name, defaultValue);
      this.$delete(this.dirtyFields, name);
    },
    updateField(oldName, { name, rules }) {
      this.$set(this.fields, oldName, rules);
      this.replaceFieldName(oldName, name);
    },
    removeField(name) {
      this.$delete(this.fields, name);
      this.$delete(this.innerDefaultValues, name);
      this.$delete(this.values, name);
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
      this.$set(this.values, to, this.values[from]);
      this.$delete(this.values, from);
      this.$set(this.errors, to, this.errors[from]);
      this.$delete(this.errors, from);
    },
    setValue(name, value) {
      this.$set(this.values, name, value);
      value === this.innerDefaultValues[name]
        ? this.$delete(this.dirtyFields, name)
        : this.$set(this.dirtyFields, name, true);
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
