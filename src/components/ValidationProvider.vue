<script>
  import isEqual from "lodash.isequal";
  //TODO: mb need add inner default values

  export default {
    name: "ValidationProvider",
    props: {
      defaultValues: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        fields: {},
        values: {},
        errors: {},
      };
    },
    computed: {
      isDirty() {
        return !isEqual(this.defaultValues, this.values);
      },
    },
    methods: {
      onSubmit() {
        Object.entries(this.fields).forEach(([name, rules]) => {
          const value = this.values[name];
          if (rules.required) {
            this.$set(this.errors, name, !!value ? "" : "Error");
          }
        });
        this.$emit("submit");
      },
      addField(name, rules) {
        this.$set(this.fields, name, rules);
      },
      updateField(oldName, name, rules) {
        console.log("updated");
        this.$set(this.fields, name, {
          ...this.fields[oldName],
          name,
          ...rules,
        });
        if (name !== oldName) {
          this.removeField(oldName);
        }
      },
      removeField(name) {
        this.$delete(this.fields, name);
      },
      setValue(name, value) {
        this.$set(this.values, name, value);
      },
    },
    provide() {
      return {
        addField: this.addField,
        updateField: this.updateField,
        removeField: this.removeField,
        setValue: this.setValue,
      };
    },
    render() {
      return this.$scopedSlots.default({
        handleSubmit: this.onSubmit,
        values: this.values,
        isDirty: this.isDirty,
        errors: this.errors,
      });
    },
  };
</script>