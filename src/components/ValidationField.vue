<script>
  export default {
    name: "ValidationField",
    model: {
      event: "change",
    },
    props: {
      name: {
        type: String,
        required: true,
      },
      value: {
        require: true,
      },
      rules: {
        type: Object,
        default: () => ({}),
      },
    },
    computed: {
      props() {
        const props = {};
        Object.defineProperty(props, "model", {
          get: () => this.value,
          set: (value) => {
            this.$emit("change", value);
          },
        });
        return props;
      },
      providedDefaultValue() {
        return this.defaultValues[this.name];
      },
      defaultValue() {
        return this.providedDefaultValue !== undefined ? this.providedDefaultValue : this.value;
      }
    },
    inject: ["addField", "removeField", "updateField", "setValue", "defaultValues"],
    watch: {
      rules(rules) {
        this.updateField(this.name, { name:this.name, rules });
      },
      value: {
        immediate: true,
        handler(value, oldValue) {
          const defaultValue = this.defaultValue;
          if(oldValue === undefined && defaultValue !== value) {
            return this.$emit("change", defaultValue);
          }
          this.setValue(this.name, value);
        },
      },
      name: {
        immediate: true,
        handler(name, oldName) {
          if(oldName === undefined) {
            this.onInit(name);
          } else {
            this.updateField(oldName, { name, rules: this.rules })
          }
        },
      },
    },
    beforeDestroy() {
      this.removeField(this.name);
    },
    methods: {
      onInit(name) {
        this.addField({ name, rules: this.rules, defaultValue: this.defaultValue });
      },
    },
    render() {
      return this.$scopedSlots.default(this.props);
    },
  };
</script>
