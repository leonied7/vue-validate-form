import { getFieldErrors, getIsSubmitted } from './symbols';
import { normalizeChildren } from './helpers';

export default {
  name: 'ValidationErrors',
  inject: {
    getFieldErrors,
    getIsSubmitted
  },
  props: {
    name: {
      type: String,
      required: true
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
      return this.getFieldErrors(this.name);
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
