import {
  getFieldDefaultValue,
  getFieldValue,
  getFieldPristine,
  hasFieldValue,
  getIsSubmitted,
  register,
  validate,
  getErrors
} from './symbols.js';
import { set, get, has, normalizeChildren } from './helpers';
import { ON_FIELD_CHANGE, ON_FORM_CHANGE } from './constants';

export default {
  name: 'ValidationProvider',
  provide() {
    return {
      [register]: this.register,
      [validate]: this.handleValidate,
      [getFieldDefaultValue]: this.getFieldDefaultValue,
      [getFieldValue]: this.getValueByFieldName,
      [getFieldPristine]: this.getFieldPristine,
      [getErrors]: this.getErrors,
      [hasFieldValue]: this.hasValueByFieldName,
      [getIsSubmitted]: this.getIsSubmitted
    };
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
      default: (values) => ({ values, errors: {} })
    },
    tag: {
      type: String,
      default: 'div'
    },
    resetFieldsAfterUpdate: {
      type: Boolean
    }
  },
  data() {
    return {
      submitted: false,
      innerDefaultValues: {},
      fieldComponents: [],
      additionalErrors: {}
    };
  },
  computed: {
    fieldComponentMap() {
      return this.fieldComponents.reduce((map, fieldComponent) => {
        map[fieldComponent.name] = fieldComponent;
        return map;
      }, {});
    },
    values() {
      return this.fieldComponents.reduce((result, { name, getValue }) => {
        set(result, name, getValue());
        return result;
      }, {});
    },
    dirty() {
      return this.fieldComponents.some(({ dirty }) => dirty);
    },
    pristine() {
      return !this.fieldComponents.some(({ pristine }) => !pristine);
    },
    errors() {
      return this.fieldComponents.reduce((allErrors, { name, errors }) => {
        allErrors[name] = errors;
        return allErrors;
      }, Object.assign({}, this.additionalErrors));
    },
    existsErrors() {
      return Object.values(this.errors).some((errors) => errors.length);
    },
    firstInvalidFieldComponent() {
      return this.fieldComponents.find(({ name }) => this.errors[name].length);
    }
  },
  watch: {
    defaultValues: {
      immediate: true,
      handler: 'setDefaultData'
    },
    defaultErrors: 'setDefaultData',
    dirty: {
      immediate: true,
      handler(dirty) {
        this.$emit('dirty', dirty);
      }
    }
  },
  methods: {
    async handleValidate(name) {
      const { errors } = await this.validate(name);
      this.setErrorsList(errors);
    },
    getValueByFieldName(name) {
      return get(this.values, name);
    },
    hasValueByFieldName(name) {
      return has(this.values, name);
    },
    getIsSubmitted() {
      return this.submitted;
    },
    async setDefaultData() {
      this.reset(this.defaultValues);
      this.additionalErrors = {};
      if (!Object.values(this.defaultErrors).some((errors) => errors.length)) {
        return;
      }
      this.setErrorsList(this.defaultErrors, ON_FIELD_CHANGE);
      const { errors } = await this.validate();
      this.setErrorsList(errors);
      this.$nextTick(() => {
        this.submitted = true;
      });
    },
    getFieldDefaultValue(name, defaultValue) {
      return get(this.innerDefaultValues, name, defaultValue);
    },
    getFieldPristine(name) {
      return this.fieldComponentMap[name]?.pristine ?? true;
    },
    getErrors(name) {
      return name ? this.errors[name] || [] : this.errors;
    },
    async onSubmit() {
      this.submitted = true;
      this.additionalErrors = {};

      const { values, errors } = await this.validate();
      this.setErrorsList(errors);
      if (this.existsErrors) {
        return this.focusInvalidField();
      }

      this.$emit('submit', values, {
        setError: this.setError,
        reset: this.reset,
        onFieldChange: this.onFieldChange,
        focusInvalidField: this.focusInvalidField
      });
    },
    async validate(triggerFieldName = null) {
      const { values, errors: errorsList } = await this.resolveSchema();

      this.fieldComponents.forEach(({ resetErrors, errors, name }) => {
        if (triggerFieldName !== name) {
          const actualErrors = errors.filter(
            ({ resetBehaviour }) => resetBehaviour !== ON_FORM_CHANGE
          );
          errorsList[name] = actualErrors.concat(errorsList[name] || []);
        }
        resetErrors();
      });
      return { values, errors: errorsList };
    },
    resolveSchema() {
      const values = this.values;
      return this.resolver(values);
    },
    onFieldChange(name, value) {
      this.fieldComponentMap[name].onChange(value);
    },
    reset(values) {
      this.submitted = false;
      if (values) {
        this.innerDefaultValues = JSON.parse(JSON.stringify(values));
      }
      this.fieldComponents.forEach(({ dirty, reset }) => {
        if (this.resetFieldsAfterUpdate && dirty) {
          return;
        }
        reset();
      });
    },
    setErrorsList(errorsList, defaultResetBehaviour = ON_FORM_CHANGE) {
      Object.entries(errorsList).forEach(([name, errors]) => {
        errors.forEach(({ message, type, resetBehaviour = defaultResetBehaviour }) => {
          this.setError(name, { message, type, resetBehaviour });
        });
      });
    },
    setError(name, { message, type = null, resetBehaviour = ON_FIELD_CHANGE }) {
      const fieldComponent = this.fieldComponentMap[name];
      if (fieldComponent) {
        fieldComponent.setError({ message, type, resetBehaviour });
        return;
      }
      if (this.additionalErrors[name] === undefined) {
        this.$set(this.additionalErrors, name, []);
      }
      this.additionalErrors[name].push({
        type,
        message,
        resetBehaviour
      });
    },
    focusInvalidField() {
      return this.firstInvalidFieldComponent && this.firstInvalidFieldComponent.onFocus();
    },
    register(fieldComponent) {
      const name = fieldComponent.name;
      this.fieldComponents.push(fieldComponent);
      (this.additionalErrors[name] || []).forEach((error) => {
        this.setError(name, error);
      });
      this.$delete(this.additionalErrors, name);
      return () => this.unregister(fieldComponent);
    },
    unregister(fieldComponent) {
      if (this.fieldComponents.length === 0) {
        return;
      }

      const index = this.fieldComponents.indexOf(fieldComponent);
      if (index === -1) {
        return;
      }

      this.fieldComponents.splice(index, 1);
    }
  },
  beforeDestroy() {
    this.fieldComponents = [];
  },
  render(h) {
    const children = normalizeChildren(this, {
      handleSubmit: this.onSubmit,
      onFieldChange: this.onFieldChange,
      reset: this.reset,
      setError: this.setError,
      focusInvalidField: this.focusInvalidField,
      values: this.values,
      dirty: this.dirty,
      pristine: this.pristine,
      invalid: this.submitted && this.existsErrors,
      errors: this.errors
    });

    return children.length <= 1 ? children[0] : h(this.tag, children);
  }
};
