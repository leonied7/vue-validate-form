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
    },
    inject: ["addField", "removeField", "updateField", "setValue"],
    watch: {
      rules(rules) {
        this.updateField(this.name, this.name, rules);
      },
      value: {
        immediate: true,
        handler(value, oldValue) {
          this.setValue(this.name, value);
        },
      },
      name: {
        immediate: true,
        handler(name, oldName) {
          oldName
            ? this.updateField(oldName, name, this.rules)
            : this.addField(name, this.rules);
        },
      },
    },
    beforeDestroy() {
      this.removeField(this.name);
    },
    render() {
      return this.$scopedSlots.default(this.props);
    },
  };
</script>
