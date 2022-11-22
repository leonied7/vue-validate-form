import { getErrors, getIsSubmitted } from './symbols';
import { normalizeChildren } from './helpers';

export default {
  name: 'ValidationErrors',
  inject: {
    getErrors,
    getIsSubmitted
  },
  props: {
    name: {
      type: String,
      default: undefined
    },
    tag: {
      type: String,
      default: 'div'
    }
  },
  computed: {
    submitted() {
      return this.getIsSubmitted();
    },
    errors() {
      const errors = this.getErrors(this.name);
      return Array.isArray(errors) ? errors : [].concat(...Object.values(errors));
    },
    invalid() {
      return this.submitted && !!this.errors.length;
    }
  },
  render(h) {
    if (!this.invalid) {
      return;
    }
    const children = normalizeChildren(this, {
      errors: this.errors
    });
    return children.length <= 1 ? children[0] : h(this.tag, children);
  }
};
