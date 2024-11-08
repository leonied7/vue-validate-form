import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';

import ValidationForm from './ValidationForm.vue';
import BaseErrors from './BaseErrors.vue';
import { ON_FIELD_CHANGE } from '../../src/components/constants';

describe('ValidationErrors', () => {
  let wrapper;

  const createComponent = ({ props } = {}) => {
    wrapper = mount(ValidationForm, {
      props,
      attachTo: document.body
    });
  };

  it('should submitted without settings', async () => {
    createComponent();

    expect(wrapper.findComponent(BaseErrors).props().errors.length).toBe(0);

    await wrapper.find('button[type=submit]').trigger('click');
    await nextTick();
    await nextTick();

    const [, { setError }] = wrapper.emitted().submit[0];
    setError('common', { message: 'invalid', type: 'custom' });
    await nextTick();

    const props = wrapper.findComponent(BaseErrors).props();
    expect(props.errors).toEqual([
      {
        type: 'custom',
        message: 'invalid',
        resetBehaviour: ON_FIELD_CHANGE
      }
    ]);
    expect(props.submitted).toBe(true);
  });

  it('check set error', async () => {
    createComponent();

    await wrapper.find('#setError').trigger('click');
    await nextTick();

    const props = wrapper.findComponent(BaseErrors).props();
    expect(props.errors).toEqual([
      {
        type: undefined,
        message: 'test',
        resetBehaviour: ON_FIELD_CHANGE
      }
    ]);
    expect(props.submitted).toBe(false);
  });
});
