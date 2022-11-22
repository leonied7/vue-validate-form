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
      [hasFieldValue]: (name) => {
        return has(this.fields, name.replace(new RegExp(`^${this.name}.`), ''));
      },
      [getFieldValue]: (name) => {
        return get(this.fields, name.replace(new RegExp(`^${this.name}.`), ''));
      },
      [register]: (callback) => {
        if (this.shouldFocus) {
          const { focus } = callback();
          focus();
          this.shouldFocus = false;
        }
        return this.register(callback);
      }
    };
  },
  data() {
    return {
      fields: [],
      shouldFocus: false
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
    this.unregister = this.register(this.fieldData);
  },
  beforeDestroy() {
    this.unregister();
  },
  methods: {
    fieldData() {
      return {
        name: this.name,
        value: [],
        dirty: false,
        errors: [],
        rules: {},
        focus: this.noop,
        reset: this.reset,
        setError: this.noop,
        resetErrors: this.noop
      };
    },
    noop() {},
    reset() {
      this.fields = [...this.defaultValue];
    },
    append(value, shouldFocus = false) {
      value[this.keyName] = value[this.keyName] ?? nanoid();
      this.shouldFocus = shouldFocus;
      this.fields.push(value);
    },
    prepend(value, shouldFocus = false) {
      value[this.keyName] = value[this.keyName] ?? nanoid();
      this.shouldFocus = shouldFocus;
      this.fields.unshift(value);
    },
    insert(index, value, shouldFocus = false) {
      value[this.keyName] = value[this.keyName] ?? nanoid();
      this.shouldFocus = shouldFocus;
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
