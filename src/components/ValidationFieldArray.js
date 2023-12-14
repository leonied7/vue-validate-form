import { nanoid } from 'nanoid';
import { getFieldDefaultValue, getFieldValue, hasFieldValue, register } from './symbols';
import { get, normalizeChildren } from './helpers';

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
      fieldComponents: [],
      fields: [],
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
    providedValues() {
      return this.getFieldValue(this.name) || [];
    },
    providedValuesMap() {
      const keyName = this.keyName;
      const map = {};
      const providedValues = this.providedValues;
      providedValues.forEach((field) => {
        map[field[keyName]] = field;
      });
      return map;
    },
    actualValue() {
      const keyName = this.keyName;
      const providedValuesMap = this.providedValuesMap;
      return this.fields.map((field) => ({
        ...providedValuesMap[field[keyName]],
        [keyName]: field[keyName]
      }));
    }
  },
  mounted() {
    this.fields = this.getInitialFields();
    this.unregister = this.register(this);
  },
  beforeDestroy() {
    this.fieldComponents = [];
    this.unregister();
  },
  methods: {
    getInitialFields() {
      return this.defaultValue.map((field) => ({
        ...field,
        [this.keyName]: field[this.keyName] ?? nanoid()
      }));
    },
    hasValueByFieldName() {
      return true;
    },
    getValueByFieldName(name) {
      const normalizedName = this.getNormalizedName(name);
      return get(this.fields, normalizedName);
    },
    handleRegister(fieldComponent) {
      this.fieldComponents.push(fieldComponent);
      const unregister = this.register(fieldComponent);
      return () => {
        this.handleUnregister(fieldComponent);
        return unregister(fieldComponent);
      };
    },
    handleUnregister(fieldComponent) {
      if (this.fieldComponents.length === 0) {
        return;
      }

      const index = this.fieldComponents.indexOf(fieldComponent);
      if (index === -1) {
        return;
      }

      this.fieldComponents.splice(index, 1);
    },
    handleFocus({ focusName }) {
      this.$nextTick(() => {
        const fieldComponent = this.fieldComponents.find(({ name }) => name === focusName);
        if (!fieldComponent) {
          return;
        }
        fieldComponent.onFocus();
      });
    },
    getNormalizedName(name) {
      const arrayName = `${this.name}.`;
      return name.startsWith(arrayName) ? name.slice(arrayName.length) : name;
    },
    onChange(value) {
      const newFields = [...value];
      this.fields = newFields;
      this.$nextTick(() => {
        this.fieldComponents.forEach(({ name, onChange }) => {
          const normalizedName = this.getNormalizedName(name);
          onChange(get(newFields, normalizedName));
        });
      });
    },
    getValue() {
      return this.fields.map((field) => {
        return {
          [this.keyName]: field[this.keyName]
        };
      });
    },
    setErrorActual() {},
    resetErrors() {},
    reset() {
      this.fields = this.getInitialFields();
    },
    append(value, focusOptions = null) {
      value[this.keyName] = value[this.keyName] ?? nanoid();
      this.fields.push(value);
      if (focusOptions) {
        this.handleFocus(focusOptions);
      }
    },
    prepend(value, focusOptions = null) {
      value[this.keyName] = value[this.keyName] ?? nanoid();
      this.fields.unshift(value);
      if (focusOptions) {
        this.handleFocus(focusOptions);
      }
    },
    insert(index, value, focusOptions = null) {
      value[this.keyName] = value[this.keyName] ?? nanoid();
      this.fields.splice(index, 0, value);
      if (focusOptions) {
        this.handleFocus(focusOptions);
      }
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
      this.fields.splice(index, 1);
    }
  },
  render(h) {
    const children = normalizeChildren(this, {
      name: this.name,
      onChange: this.onChange,
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
