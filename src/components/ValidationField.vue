<script>
export default {
  name: 'ValidationField',
  inject: ['addField', 'removeField', 'updateField', 'setValue', 'defaultValues'],
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
      required: true
    },
    rules: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    props() {
      const props = {};
      Object.defineProperty(props, 'model', {
        get: () => this.modelValue,
        set: this.onModelChange
      });
      return props;
    },
    providedDefaultValue() {
      return this.defaultValues[this.name];
    },
    defaultValue() {
      return this.providedDefaultValue !== undefined ? this.providedDefaultValue : this.modelValue;
    }
  },
  watch: {
    rules(rules) {
      this.updateField(this.name, { name: this.name, rules });
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
    },
    name: {
      immediate: true,
      handler(name, oldName) {
        if (oldName === undefined) {
          this.onInit(name);
        } else {
          this.updateField(oldName, { name, rules: this.rules });
        }
      }
    }
  },
  beforeDestroy() {
    this.removeField(this.name);
  },
  methods: {
    onInit(name) {
      this.addField({ name, rules: this.rules, defaultValue: this.defaultValue });
    },
    onModelChange(value) {
      this.$emit('update:modelValue', value);
    }
  },
  render() {
    return this.$scopedSlots.default(this.props);
  }
};
</script>
