import { h as V, renderSlot as F, mergeProps as N, createCommentVNode as b } from "vue";
import { nanoid as m } from "nanoid";
const h = Symbol("hasFieldValue"), a = Symbol("getFieldValue"), d = Symbol("getFieldDefaultValue"), v = Symbol("getErrors"), l = Symbol("register"), y = Symbol("validate"), f = Symbol("getIsSubmitted"), $ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getErrors: v,
  getFieldDefaultValue: d,
  getFieldValue: a,
  getIsSubmitted: f,
  hasFieldValue: h,
  register: l,
  validate: y
}, Symbol.toStringTag, { value: "Module" }));
function p(e, t) {
  if (!u(e))
    return !1;
  let r = t.split(".");
  for (; r.length; ) {
    const s = r.shift();
    if (!(s in e))
      return !1;
    e = e[s];
  }
  return !0;
}
function o(e, t, r) {
  if (!u(e))
    return r;
  let s = t.split(".");
  for (; s.length; ) {
    const i = s.shift();
    if (!(i in e))
      return r;
    e = e[i];
  }
  return e;
}
function O(e, t, r) {
  if (!u(e))
    return;
  let s = t.split(".");
  for (; s.length > 1; ) {
    const i = s.shift();
    u(e[i]) || (e[i] = _(s[0]) ? [] : {}), e = e[i];
  }
  e[s[0]] = r;
}
function _(e) {
  const t = Number(e);
  return !Number.isNaN(t);
}
function u(e) {
  return !!e && typeof e == "object";
}
const g = "onFieldChange", E = "onFormChange", P = {
  name: "ValidationProvider",
  inheritAttrs: !1,
  provide() {
    return {
      [l]: this.register,
      [y]: async (e) => {
        const { errors: t } = await this.validate(e);
        this.setErrorsList(t);
      },
      [d]: this.getFieldDefaultValue,
      [a]: (e) => o(this.values, e),
      [v]: this.getErrors,
      [h]: (e) => p(this.values, e),
      [f]: () => this.submitted
    };
  },
  emits: {
    // TODO: доописать при переходе на ts
    submit: null,
    dirty: (e) => typeof e == "boolean" ? !0 : (console.warn("Invalid dirty event payload!"), !1)
  },
  props: {
    defaultValues: {
      type: Object,
      default: () => ({})
    },
    defaultErrors: {
      type: Object,
      default: () => ({})
    },
    resolver: {
      type: Function,
      default: (e) => ({ values: e, errors: {} })
    },
    tag: {
      type: String,
      default: "div"
    }
  },
  data() {
    return {
      submitted: !1,
      innerDefaultValues: {},
      fieldComponents: [],
      additionalErrors: {}
    };
  },
  computed: {
    fieldComponentMap() {
      return this.fieldComponents.reduce((e, t) => (e[t.name] = t, e), {});
    },
    values() {
      return this.fieldComponents.reduce((e, { name: t, getValue: r }) => (O(e, t, r()), e), {});
    },
    dirty() {
      return this.fieldComponents.some(({ dirty: e }) => e);
    },
    pristine() {
      return !this.fieldComponents.some(({ pristine: e }) => !e);
    },
    errors() {
      return this.fieldComponents.reduce((e, { name: t, errors: r }) => (e[t] = r, e), Object.assign({}, this.additionalErrors));
    },
    existsErrors() {
      return Object.values(this.errors).some((e) => e.length);
    },
    firstInvalidFieldComponent() {
      return this.fieldComponents.find(({ name: e }) => this.errors[e].length);
    },
    invalid() {
      return this.submitted && this.existsErrors;
    }
  },
  watch: {
    defaultValues: {
      immediate: !0,
      handler: "setDefaultData"
    },
    defaultErrors: "setDefaultData",
    dirty: {
      immediate: !0,
      handler(e) {
        this.$emit("dirty", e);
      }
    }
  },
  methods: {
    async setDefaultData() {
      if (this.reset(this.defaultValues), this.additionalErrors = {}, !Object.values(this.defaultErrors).some((t) => t.length))
        return;
      this.setErrorsList(this.defaultErrors, g);
      const { errors: e } = await this.validate();
      this.setErrorsList(e), this.$nextTick(() => {
        this.submitted = !0;
      });
    },
    getFieldDefaultValue(e, t) {
      return o(this.innerDefaultValues, e, t);
    },
    getErrors(e) {
      return e ? this.errors[e] || [] : this.errors;
    },
    async onSubmit() {
      this.submitted = !0, this.additionalErrors = {};
      const { values: e, errors: t } = await this.validate();
      if (this.setErrorsList(t), this.existsErrors)
        return this.focusInvalidField();
      this.$emit("submit", e, {
        setError: this.setError,
        reset: this.reset,
        onFieldChange: this.onFieldChange,
        focusInvalidField: this.focusInvalidField
      });
    },
    async validate(e = null) {
      const { values: t, errors: r } = await this.resolveSchema();
      return this.fieldComponents.forEach(({ resetErrors: s, errors: i, name: n }) => {
        if (e !== n) {
          const c = i.filter(
            ({ resetBehaviour: S }) => S !== E
          );
          r[n] = c.concat(r[n] || []);
        }
        s();
      }), { values: t, errors: r };
    },
    resolveSchema() {
      const e = this.values;
      return this.resolver(e);
    },
    onFieldChange(e, t) {
      this.fieldComponentMap[e].onChange(t);
    },
    reset(e) {
      this.submitted = !1, e && (this.innerDefaultValues = JSON.parse(JSON.stringify(e))), this.fieldComponents.forEach(({ reset: t }) => {
        t();
      });
    },
    setErrorsList(e, t = E) {
      Object.entries(e).forEach(([r, s]) => {
        s.forEach(({ message: i, type: n, resetBehaviour: c = t }) => {
          this.setError(r, { message: i, type: n, resetBehaviour: c });
        });
      });
    },
    setError(e, { message: t, type: r = null, resetBehaviour: s = g }) {
      const i = this.fieldComponentMap[e];
      if (i) {
        i.setError({ message: t, type: r, resetBehaviour: s });
        return;
      }
      this.additionalErrors[e] === void 0 && (this.additionalErrors[e] = []), this.additionalErrors[e].push({
        type: r,
        message: t,
        resetBehaviour: s
      });
    },
    focusInvalidField() {
      return this.firstInvalidFieldComponent && this.firstInvalidFieldComponent.onFocus();
    },
    register(e) {
      const t = e.name;
      return this.fieldComponents.push(e), (this.additionalErrors[t] || []).forEach((r) => {
        this.setError(t, r);
      }), delete this.additionalErrors[t], () => this.unregister(e);
    },
    unregister(e) {
      this.fieldComponents = this.fieldComponents.filter((t) => t !== e);
    }
  },
  render() {
    const e = this.$slots.default({
      handleSubmit: this.onSubmit,
      onFieldChange: this.onFieldChange,
      reset: this.reset,
      setError: this.setError,
      focusInvalidField: this.focusInvalidField,
      values: this.values,
      dirty: this.dirty,
      pristine: this.pristine,
      invalid: this.invalid,
      errors: this.errors
    });
    return e.length <= 1 ? e[0] : V(this.tag, e);
  }
}, C = (e, t) => {
  const r = e.__vccOpts || e;
  for (const [s, i] of t)
    r[s] = i;
  return r;
}, k = {
  name: "ValidationField",
  inject: {
    hasFieldValue: h,
    getFieldDefaultValue: d,
    getFieldValue: a,
    getIsSubmitted: f,
    register: l,
    validate: y
  },
  inheritAttrs: !1,
  props: {
    name: {
      type: String,
      required: !0
    },
    isEqual: {
      type: Function,
      default: (e, t) => e === t
    },
    tag: {
      type: String,
      default: "div"
    }
  },
  // TODO: доописать при переходе на ts
  emits: {
    "should-focus": null,
    change: null
  },
  data() {
    return {
      registered: !1,
      value: void 0,
      pristine: !0,
      errors: []
    };
  },
  computed: {
    defaultValue() {
      return this.getFieldDefaultValue(this.name);
    },
    hasProvidedValue() {
      return this.hasFieldValue(this.name);
    },
    providedValue() {
      return this.getFieldValue(this.name);
    },
    submitted() {
      return this.getIsSubmitted();
    },
    dirty() {
      return !this.isEqual(this.value, this.defaultValue);
    },
    firstError() {
      return this.errors[0];
    },
    invalid() {
      return this.submitted && !!this.errors.length;
    }
  },
  mounted() {
    this.value = this.hasProvidedValue ? this.providedValue : this.defaultValue, this.unregister = this.register(this), this.registered = !0;
  },
  beforeUnmount() {
    this.unregister();
  },
  methods: {
    getValue() {
      return this.value;
    },
    onFocus() {
      this.$emit("should-focus", {
        name: this.name
      });
    },
    reset() {
      this.resetErrors(), this.$nextTick(() => {
        this.onChange(this.defaultValue), this.pristine = !0;
      });
    },
    onChange(e) {
      this.isEqual(this.value, e) || (this.value = e, this.pristine = !1, this.$emit("change", e), this.submitted && this.validate(this.name));
    },
    setError({ message: e, type: t = null, resetBehaviour: r = g }) {
      this.errors.push({
        type: t,
        message: e,
        resetBehaviour: r
      });
    },
    resetErrors() {
      this.errors.length && (this.errors = []);
    }
  }
};
function D(e, t, r, s, i, n) {
  return i.registered ? F(e.$slots, "default", N({ key: 0 }, { name: r.name }, {
    onChange: n.onChange,
    setError: n.setError,
    modelValue: i.value,
    errors: i.errors,
    firstError: n.firstError,
    dirty: n.dirty,
    invalid: n.invalid,
    pristine: i.pristine
  })) : b("", !0);
}
const L = /* @__PURE__ */ C(k, [["render", D]]), q = {
  name: "ValidationFieldArray",
  inheritAttrs: !1,
  inject: {
    register: l,
    getFieldDefaultValue: d,
    getFieldValue: a
  },
  provide() {
    return {
      [h]: (e) => {
        const t = e.replace(new RegExp(`^${this.name}.`), "");
        return p(this.actualValue, t) || p(this.fields, t);
      },
      [a]: (e) => {
        const t = e.replace(new RegExp(`^${this.name}.`), "");
        return o(this.actualValue, t) || o(this.fields, t);
      },
      [l]: (e) => {
        if (this.focusOptions) {
          const { focusName: t } = this.focusOptions, { onFocus: r, name: s } = e;
          s === t && (r(), this.focusOptions = null);
        }
        return this.register(e);
      }
    };
  },
  data() {
    return {
      fields: [],
      focusOptions: null,
      // common fields with ValidationField
      errors: [],
      dirty: !1,
      pristine: !0
    };
  },
  props: {
    name: {
      type: String,
      required: !0
    },
    keyName: {
      type: String,
      default: "id"
    },
    tag: {
      type: String,
      default: "div"
    }
  },
  computed: {
    defaultValue() {
      return this.getFieldDefaultValue(this.name) || [];
    },
    actualValue() {
      const e = this.keyName, t = this.getFieldValue(this.name) || [];
      return this.fields.map((r, s) => ({
        ...t[s],
        [e]: r[e]
      }));
    }
  },
  mounted() {
    this.fields = [...this.defaultValue], this.unregister = this.register(this);
  },
  beforeDestroy() {
    this.unregister();
  },
  methods: {
    onChange(e) {
      this.fields = [...e];
    },
    getValue() {
      return [];
    },
    setErrorActual() {
    },
    resetErrors() {
    },
    reset() {
      this.fields = [...this.defaultValue];
    },
    append(e, t = null) {
      e[this.keyName] = e[this.keyName] ?? m(), this.focusOptions = t, this.fields.push(e);
    },
    prepend(e, t = null) {
      e[this.keyName] = e[this.keyName] ?? m(), this.focusOptions = t, this.fields.unshift(e);
    },
    insert(e, t, r = null) {
      t[this.keyName] = t[this.keyName] ?? m(), this.focusOptions = r, this.fields.splice(e, 0, t);
    },
    swap(e, t) {
      const r = this.fields[e];
      this.fields[e] = this.fields[t], this.fields[t] = r;
    },
    move(e, t) {
      this.fields.splice(t, 0, this.fields.splice(e, 1)[0]);
    },
    remove(e) {
      this.fields = this.fields.filter((t, r) => e !== r);
    }
  },
  render() {
    const e = this.$slots.default({
      name: this.name,
      fields: this.actualValue,
      append: this.append,
      prepend: this.prepend,
      insert: this.insert,
      swap: this.swap,
      move: this.move,
      remove: this.remove
    });
    return e.length <= 1 ? e[0] : V(this.tag, e);
  }
}, I = {
  name: "ValidationErrors",
  inject: {
    getErrors: v,
    getIsSubmitted: f
  },
  inheritAttrs: !1,
  props: {
    name: {
      type: String,
      default: void 0
    },
    tag: {
      type: String,
      default: "div"
    }
  },
  computed: {
    submitted() {
      return this.getIsSubmitted();
    },
    errors() {
      const e = this.getErrors(this.name);
      return Array.isArray(e) ? e : [].concat(...Object.values(e));
    },
    invalid() {
      return this.submitted && !!this.errors.length;
    }
  }
};
function w(e, t, r, s, i, n) {
  return n.invalid ? F(e.$slots, "default", {
    key: 0,
    errors: n.errors
  }) : b("", !0);
}
const M = /* @__PURE__ */ C(I, [["render", w]]);
export {
  M as ValidationErrors,
  L as ValidationField,
  q as ValidationFieldArray,
  P as ValidationProvider,
  o as get,
  $ as symbols
};
