import get from 'lodash.get';
import set from 'lodash.set';
import cloneDeep from 'lodash.clonedeep';

const validators = {};

function register(name, validate) {
  validators[name] = validate;
}

var script = {
  name: 'ValidationProvider',
  provide() {
    return {
      addField: this.addField,
      updateField: this.updateField,
      removeField: this.removeField,
      setValue: this.setValue,
      setFieldError: this.setError,
      getFieldDefaultValues: this.getFieldDefaultValues,
      getFieldValue: (name) => this.flatValues[name],
      getFieldErrors: this.getFieldErrors
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
      innerDefaultValues: {},
      defaultValuesByField: {}
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
    },
    firstInvalidField() {
      const name = Object.keys(this.fields).find((name) => this.errors[name].length);
      return this.fields[name];
    },
    existsErrors() {
      return Object.values(this.errors).some((errors) => errors.length);
    }
  },
  created() {
    this.innerDefaultValues = cloneDeep(this.defaultValues);
  },
  methods: {
    onSubmit() {
      Object.keys(this.fields).forEach((name) => {
        this.validateField(name);
      });
      if (this.existsErrors) {
        return this.focusInvalidField();
      }

      this.$emit('submit', this.values, {
        setError: this.setError,
        reset: this.reset,
        focusInvalidField: this.focusInvalidField
      });
    },
    focusInvalidField() {
      return this.firstInvalidField.focus();
    },
    addField({ name, rules, defaultValue, focus }) {
      this.$set(this.fields, name, { rules, focus });
      this.$set(this.defaultValuesByField, name, defaultValue);
      this.$set(this.flatValues, name, defaultValue);
      this.$set(this.errors, name, []);
      this.$delete(this.dirtyFields, name);
    },
    updateField(oldName, { name, rules, focus }) {
      this.$set(this.fields, oldName, { rules, focus });
      this.replaceFieldName(oldName, name);
    },
    removeField(name) {
      this.$delete(this.fields, name);
      this.$delete(this.defaultValuesByField, name);
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
      this.$set(this.defaultValuesByField, to, this.defaultValuesByField[from]);
      this.$delete(this.defaultValuesByField, from);
      this.$set(this.flatValues, to, this.flatValues[from]);
      this.$delete(this.flatValues, from);
      this.$set(this.errors, to, this.errors[from]);
      this.$delete(this.errors, from);
    },
    setValue(name, value) {
      if (this.flatValues[name] === value) {
        return;
      }
      this.flatValues[name] = value;
      value === this.defaultValuesByField[name]
        ? this.$delete(this.dirtyFields, name)
        : this.$set(this.dirtyFields, name, true);
      this.validateField(name);
    },
    setError(name, message) {
      if (this.errors[name] === undefined) {
        throw new Error(`field '${name}' must be registered for set error`);
      }
      this.errors[name].push(message);
    },
    validateField(name) {
      this.errors[name] = [];
      const rules = this.fields[name].rules;
      const value = this.flatValues[name];
      Object.entries(rules).forEach(([ruleName, options]) => {
        const validator = validators[ruleName];
        if (!validator) {
          throw new Error(`validator '${ruleName}' must be registered`);
        }
        if (!validator(value, options.params)) {
          this.setError(name, options.message);
        }
      });
    },
    getFieldDefaultValues(name, defaultValue) {
      return get(this.innerDefaultValues, name, defaultValue);
    },
    getFieldErrors(name) {
      return this.errors[name];
    },
    reset(values) {
      if (values) {
        this.innerDefaultValues = cloneDeep(values);
      }
      Object.entries(this.defaultValuesByField).forEach(([name, value]) => {
        const defaultValue = this.getFieldDefaultValues(name, value);
        this.defaultValuesByField[name] = defaultValue;
        this.setValue(name, defaultValue);
      });
    }
  },
  render() {
    return this.$scopedSlots.default({
      handleSubmit: this.onSubmit,
      reset: this.reset,
      setError: this.setError,
      values: this.values,
      isDirty: this.isDirty,
      errors: this.errors,
      defaultValues: this.defaultValuesByField,
      dirtyFields: this.dirtyFields
    });
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

/* script */
const __vue_script__ = script;

/* template */

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = undefined;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = /*#__PURE__*/normalizeComponent(
    {},
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    undefined,
    undefined,
    undefined
  );

var script$1 = {
  name: 'ValidationField',
  inject: [
    'addField',
    'removeField',
    'updateField',
    'setValue',
    'setFieldError',
    'getFieldDefaultValues',
    'getFieldValue',
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
    providedValue() {
      return this.getFieldValue(this.name);
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
      return this.hasModelValue ? this.modelValue : this.providedValue;
    }
  },
  watch: {
    rules(rules) {
      this.updateField(this.name, { name: this.name, rules, focus: this.onFocus });
    },
    name(name, oldName) {
      this.updateField(oldName, { name, rules: this.rules, focus: this.onFocus });
    },
    modelValue(value) {
      this.setValue(this.name, value);
    },
    providedValue(value) {
      this.onModelChange(value);
    }
  },
  mounted() {
    const defaultValue = this.defaultValue;
    this.addField({ name: this.name, rules: this.rules, defaultValue, focus: this.onFocus });
    if (defaultValue !== this.modelValue) {
      this.onModelChange(defaultValue);
    }
  },
  beforeDestroy() {
    this.removeField(this.name);
  },
  methods: {
    onModelChange(value) {
      this.$emit('update:modelValue', value);
      this.$nextTick(() => {
        value = this.hasModelValue ? this.computedModelValue : value;
        this.setValue(this.name, value);
      });
    },
    setError(message) {
      this.setFieldError(this.name, message);
    },
    onFocus() {
      this.$emit('should-focus', {
        name: this.name,
        field: this
      });
    }
  },
  render() {
    return this.$scopedSlots.default({
      onChange: this.onModelChange,
      setError: this.setError,
      modelValue: this.computedModelValue,
      errors: this.errors
    });
  }
};

/* script */
const __vue_script__$1 = script$1;

/* template */

  /* style */
  const __vue_inject_styles__$1 = undefined;
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = undefined;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$1 = /*#__PURE__*/normalizeComponent(
    {},
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    false,
    undefined,
    undefined,
    undefined
  );

export { __vue_component__$1 as ValidationField, __vue_component__ as ValidationProvider, register as registerValidator };
