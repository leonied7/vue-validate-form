import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';

import ValidationForm from './ValidationForm.vue';
import BaseErrors from './BaseErrors.vue';
import { ON_FIELD_CHANGE } from '../../src/components/constants';

describe('ValidationErrors', () => {
  let wrapper;

  const createComponent = ({ props, attrs } = {}) => {
    wrapper = mount(ValidationForm, {
      props,
      attrs,
      attachTo: document.body
    });
  };

  it('should submitted without settings', async () => {
    createComponent({
      attrs: {
        onSubmit(values, { setError }) {
          setError('common', { message: 'invalid', type: 'custom' });
        }
      }
    });

    expect(wrapper.findComponent(BaseErrors).exists()).toBe(false);

    await wrapper.find('button[type=submit]').trigger('click');
    await nextTick();
    await nextTick();

    expect(wrapper.findComponent(BaseErrors).props().errors).toEqual([
      {
        type: 'custom',
        message: 'invalid',
        resetBehaviour: ON_FIELD_CHANGE
      }
    ]);
  });
});
