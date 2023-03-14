import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { ValidationField } from '../../src/index';
import ValidationForm from './ValidationForm';
import BaseInput from './BaseInput';

describe('ValidationField', () => {
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
    await nextTick();
    const myInputWrapper = wrapper.findComponent(BaseInput);

    expect(myInputWrapper.props().invalid).toBe(false);

    myInputWrapper.vm.$emit('update:modelValue', '');

    expect(myInputWrapper.props().invalid).toBe(false);

    await wrapper.find('button[type=submit]').trigger('click');
    await nextTick();
    await nextTick();
    expect(myInputWrapper.props().invalid).toBe(true);
    expect(myInputWrapper.props().errors).toEqual([
      expect.objectContaining({ message: 'field required' })
    ]);
    expect(myInputWrapper.props().firstError).toEqual(
      expect.objectContaining({
        message: 'field required'
      })
    );
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
    await nextTick();
    const myInputWrapper = wrapper.findComponent(BaseInput);

    await wrapper.find('button[type=submit]').trigger('click');
    await nextTick();
    await nextTick();
    expect(myInputWrapper.props().invalid).toBe(true);
    expect(myInputWrapper.props().errors).toEqual([
      expect.objectContaining({ message: 'field required' })
    ]);

    myInputWrapper.vm.$emit('update:modelValue', 42);
    await nextTick();
    await nextTick();
    expect(myInputWrapper.props().invalid).toBe(false);
    expect(myInputWrapper.props().errors).toEqual([]);
  });

  it('shouldn`t emit event on equal change', async () => {
    createComponent({
      props: {
        defaultValues: {
          'my-input': 42
        }
      }
    });
    await nextTick();

    const fieldWrapper = wrapper.findComponent(ValidationField);
    const inputWrapper = wrapper.findComponent(BaseInput);

    expect(fieldWrapper.emitted().change).toBeUndefined();
    inputWrapper.vm.$emit('update:modelValue', 42);
    expect(fieldWrapper.emitted().change).toBeUndefined();
  });

  it('should emit event on change', async () => {
    createComponent({
      props: {
        defaultValues: {
          'my-input': 42
        }
      }
    });
    await nextTick();

    const fieldWrapper = wrapper.findComponent(ValidationField);
    const inputWrapper = wrapper.findComponent(BaseInput);

    expect(fieldWrapper.emitted().change).toBeUndefined();
    inputWrapper.vm.$emit('update:modelValue', '');
    expect(fieldWrapper.emitted().change).toEqual([['']]);
  });

  it('check pristine behaviour', async () => {
    createComponent({
      props: {
        defaultValues: {
          'my-input': 42
        }
      }
    });
    await nextTick();

    const inputWrapper = wrapper.findComponent(BaseInput);

    expect(inputWrapper.props().pristine).toBe(true);
    inputWrapper.vm.$emit('update:modelValue', 42);
    await nextTick();
    expect(inputWrapper.props().pristine).toBe(true);
    inputWrapper.vm.$emit('update:modelValue', '42');
    await nextTick();
    expect(inputWrapper.props().pristine).toBe(false);
    inputWrapper.vm.$emit('update:modelValue', 42);
    await nextTick();
    expect(inputWrapper.props().pristine).toBe(false);
  });
});
