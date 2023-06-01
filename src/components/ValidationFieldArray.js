import { nanoid } from 'nanoid';
import { getFieldDefaultValue, getFieldValue, hasFieldValue, register } from './symbols';
import { get, has, normalizeChildren } from './helpers';

export default {
  name: 'ValidationFieldArray',
  inject: {
    register,
    getFieldDefaultValue,
    getFieldValue
  },
  provide() {
    return {
      [hasFieldValue]: this.hasValueByFieldName,
      [getFieldValue]: this.getValueByFieldName,
      [register]: this.handleRegister
    };
  },
  data() {
    return {
      fields: [],
      focusOptions: null,
      // common fields with ValidationField
      errors: [],
      dirty: false,
      pristine: true
    };
  },
  props: {
    name: {
      type: String,
      required: true
    },
    keyName: {
      type: String,
      default: 'id'
    },
    tag: {
      type: String,
      default: 'div'
    }
  },
  computed: {
    defaultValue() {
      return this.getFieldDefaultValue(this.name) || [];
    },
    actualValue() {
      const keyName = this.keyName;
      const providedValues = this.getFieldValue(this.name) || [];
      return this.fields.map((field, index) => ({
        ...providedValues[index],
        [keyName]: field[keyName]
      }));
    }
  },
  mounted() {
    this.fields = [...this.defaultValue];
    this.unregister = this.register(this);
  },
  beforeDestroy() {
    this.unregister();
  },
  methods: {
    hasValueByFieldName(name) {
      const arrayName = `${this.name}.`;
      const normalizedName = name.startsWith(arrayName) ? name.slice(arrayName.length) : name;
      return has(this.actualValue, normalizedName) || has(this.fields, normalizedName);
    },
    getValueByFieldName(name) {
      const arrayName = `${this.name}.`;
      const normalizedName = name.startsWith(arrayName) ? name.slice(arrayName.length) : name;
      return get(this.actualValue, normalizedName) || get(this.fields, normalizedName);
    },
    handleRegister(fieldComponent) {
      if (this.focusOptions) {
        const { focusName } = this.focusOptions;
        const { onFocus, name } = fieldComponent;
        if (name === focusName) {
          onFocus();
          this.focusOptions = null;
        }
      }
      return this.register(fieldComponent);
    },
    onChange(value) {
      this.fields = [...value];
    },
    getValue() {
      return [];
    },
    setErrorActual() {},
    resetErrors() {},
    reset() {
      this.fields = [...this.defaultValue];
    },
    append(value, focusOptions = null) {
      value[this.keyName] = value[this.keyName] ?? nanoid();
      this.focusOptions = focusOptions;
      this.fields.push(value);
    },
    prepend(value, focusOptions = null) {
      value[this.keyName] = value[this.keyName] ?? nanoid();
      this.focusOptions = focusOptions;
      this.fields.unshift(value);
    },
    insert(index, value, focusOptions = null) {
      value[this.keyName] = value[this.keyName] ?? nanoid();
      this.focusOptions = focusOptions;
      this.fields.splice(index, 0, value);
    },
    swap(from, to) {
      const temp = this.fields[from];
      this.$set(this.fields, from, this.fields[to]);
      this.$set(this.fields, to, temp);
    },
    move(from, to) {
      this.fields.splice(to, 0, this.fields.splice(from, 1)[0]);
    },
    remove(index) {
      this.fields = this.fields.filter((field, i) => index !== i);
    }
  },
  render(h) {
    const children = normalizeChildren(this, {
      name: this.name,
      fields: this.actualValue,
      append: this.append,
      prepend: this.prepend,
      insert: this.insert,
      swap: this.swap,
      move: this.move,
      remove: this.remove
    });
    return children.length <= 1 ? children[0] : h(this.tag, children);
  }
};
