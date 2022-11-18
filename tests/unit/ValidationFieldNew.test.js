import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import ValidationForm from './ValidationForm';
import BaseInput from './BaseInput';

describe('ValidationFieldNew', () => {
  let wrapper;

  const createComponent = ({ props } = {}) => {
    wrapper = mount(ValidationForm, {
      propsData: props,
      attachTo: document.body
    });
  };

  it('set invalid only after submit', async () => {
    createComponent({
      props: {
        defaultValues: {
          'my-input': 42
        },
        rulesByField: {
          'my-input': {
            required: {
              value: true,
              message: 'field required'
            }
          }
        }
      }
    });
    const myInputWrapper = wrapper.findComponent(BaseInput);

    expect(myInputWrapper.props().invalid).toBe(false);

    myInputWrapper.vm.$emit('update:modelValue', '');
    expect(myInputWrapper.props().invalid).toBe(false);

    await wrapper.find('button[type=submit]').trigger('click');
    expect(myInputWrapper.props().invalid).toBe(true);
    expect(myInputWrapper.props().errors).toEqual([
      { type: 'required', message: 'field required' }
    ]);
    expect(myInputWrapper.props().firstError).toEqual({
      type: 'required',
      message: 'field required'
    });
    expect(wrapper.emitted().submit).toBeUndefined();
  });

  it('recalculate errors on each change', async () => {
    createComponent({
      props: {
        rulesByField: {
          'my-input': {
            required: {
              value: true,
              message: 'field required'
            }
          }
        }
      }
    });
    const myInputWrapper = wrapper.findComponent(BaseInput);

    await wrapper.find('button[type=submit]').trigger('click');
    expect(myInputWrapper.props().invalid).toBe(true);
    expect(myInputWrapper.props().errors).toEqual([
      { type: 'required', message: 'field required' }
    ]);

    myInputWrapper.vm.$emit('update:modelValue', 42);
    await nextTick();
    expect(myInputWrapper.props().invalid).toBe(false);
    expect(myInputWrapper.props().errors).toEqual([]);
  });
});
