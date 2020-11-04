<script>
export default {
  name: 'ValidationField',
  inject: [
    'addField',
    'removeField',
    'updateField',
    'setValue',
    'getFieldDefaultValues',
    'getFieldValues',
    'getFieldErrors'
  ],
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
    defaultValue() {
      return this.providedDefaultValue !== undefined ? this.providedDefaultValue : this.modelValue;
    },
    errors() {
      return this.getFieldErrors(this.name);
    },
    hasModelValue() {
      return this.modelValue !== undefined;
    },
    computedModelValue() {
      return this.hasModelValue ? this.modelValue : this.getFieldValues(this.name);
    }
  },
  watch: {
    rules(rules) {
      this.updateField(this.name, { name: this.name, rules });
    },
    name: {
      immediate: true,
      handler(name, oldName) {
        if (oldName === undefined) {
          this.addField({ name, rules: this.rules, defaultValue: this.defaultValue });
        } else {
          this.updateField(oldName, { name, rules: this.rules });
        }
      }
    },
    modelValue: {
      immediate: true,
      handler(value, oldValue) {
        const defaultValue = this.defaultValue;
        if (oldValue === undefined && defaultValue !== value) {
          return this.onModelChange(defaultValue);
        }
        this.setValue(this.name, value);
      }
    }
  },
  beforeDestroy() {
    this.removeField(this.name);
  },
  methods: {
    onModelChange(value) {
      this.$emit('update:modelValue', value);
      if (!this.hasModelValue) {
        return this.setValue(this.name, value);
      }
      this.$nextTick(() => {
        this.setValue(this.name, this.computedModelValue);
      });
    }
  },
  render() {
    return this.$scopedSlots.default({
      modelValue: this.computedModelValue,
      onChange: this.onModelChange
    });
  }
};
</script>
