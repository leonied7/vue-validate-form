import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';

import ValidationForm from './ValidationForm';
import BaseErrors from './BaseErrors';
import { ON_FIELD_CHANGE } from '../../src/components/constants';

describe('ValidationErrors', () => {
  let wrapper;

  const createComponent = ({ props, listeners } = {}) => {
    wrapper = mount(ValidationForm, {
      propsData: props,
      listeners,
      attachTo: document.body
    });
  };

  it('should submitted without settings', async () => {
    createComponent({
      listeners: {
        submit(values, { setError }) {
          setError('common', { message: 'invalid', type: 'custom' });
        }
      }
    });

    expect(wrapper.findComponent(BaseErrors).exists()).toBe(false);

    await wrapper.find('button[type=submit]').trigger('click');
    await nextTick();
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
        type: null,
        message: 'test',
        resetBehaviour: ON_FIELD_CHANGE
      }
    ]);
    expect(props.submitted).toBe(false);
  });
});
