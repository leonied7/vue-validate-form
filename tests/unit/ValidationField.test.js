import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { ValidationField, get } from '../../src/index';
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
        resolver(values) {
          if (!get(values, 'my-input')) {
            return {
              values,
              errors: {
                'my-input': [{ message: 'field required' }]
              }
            };
          }
          return {
            values,
            errors: {}
          };
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
        resolver(values) {
          if (!get(values, 'my-input')) {
            return {
              values,
              errors: {
                'my-input': [{ message: 'field required' }]
              }
            };
          }
          return {
            values,
            errors: {}
          };
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

  it('keep field state on component rerender', async () => {
    createComponent();
    await nextTick();

    wrapper.findComponent(BaseInput);

    expect(wrapper.findComponent({ ref: 'myInputValueSecond' }).props().modelValue).toBeUndefined();
    expect(wrapper.findComponent({ ref: 'myInputValueSecond' }).props().pristine).toBe(true);
    expect(wrapper.findComponent({ ref: 'myInputValueFirst' }).exists()).toBe(false);
    wrapper.findComponent(BaseInput).vm.$emit('update:modelValue', 42);

    await nextTick();
    expect(wrapper.findComponent({ ref: 'myInputValueSecond' }).props().modelValue).toBe(42);
    expect(wrapper.findComponent({ ref: 'myInputValueSecond' }).props().pristine).toBe(false);
    expect(wrapper.findComponent({ ref: 'myInputValueFirst' }).exists()).toBe(false);

    wrapper.findComponent({ ref: 'myNestedValueInput' }).vm.$emit('update:modelValue', 'test');
    await nextTick();
    expect(wrapper.findComponent({ ref: 'myInputValueFirst' }).props().modelValue).toBe(42);
    expect(wrapper.findComponent({ ref: 'myInputValueFirst' }).props().pristine).toBe(false);
    expect(wrapper.findComponent({ ref: 'myInputValueSecond' }).exists()).toBe(false);
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
