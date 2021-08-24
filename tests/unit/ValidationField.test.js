import { shallowMount } from '@vue/test-utils';
import ValidationField from '../../src/components/ValidationField.js';
import {
  addField,
  removeField,
  updateField,
  setValue,
  setFieldError,
  getFieldDefaultValues,
  getFieldValue,
  getFieldErrors,
  getFieldDirty,
  getFieldInvalid
} from '../../src/components/symbols.js';

const mockAddField = jest.fn();
const mockRemoveField = jest.fn();
const mockUpdateField = jest.fn();
const mockSetValue = jest.fn();
const mockSetFieldError = jest.fn();
const mockGetFieldDefaultValues = jest.fn().mockImplementation();
const mockGetFieldValue = jest.fn();
const mockGetFieldErrors = jest.fn().mockImplementation(() => []);
const mockGetFieldDirty = jest.fn();
const mockGetFieldInvalid = jest.fn();

describe('ValidationField', () => {
  let wrapper;
  const NAME = 'firstName';

  const createComponent = ({ props, slots, scopedSlots, provide } = {}) => {
    wrapper = shallowMount(ValidationField, {
      propsData: props,
      slots,
      scopedSlots,
      provide: {
        [addField]: mockAddField,
        [removeField]: mockRemoveField,
        [updateField]: mockUpdateField,
        [setValue]: mockSetValue,
        [setFieldError]: mockSetFieldError,
        [getFieldDefaultValues]: mockGetFieldDefaultValues,
        [getFieldValue]: mockGetFieldValue,
        [getFieldErrors]: mockGetFieldErrors,
        [getFieldDirty]: mockGetFieldDirty,
        [getFieldInvalid]: mockGetFieldInvalid,
        ...provide
      }
    });
  };

  it('should correct add and remove fields', () => {
    createComponent({
      props: {
        name: NAME
      },
      slots: {
        default: '<div></div>'
      }
    });

    expect(mockAddField).toBeCalledWith(
      expect.objectContaining({
        name: NAME,
        defaultValue: undefined,
        focus: expect.any(Function),
        rules: {}
      })
    );

    expect(mockUpdateField).not.toBeCalled();
    expect(mockRemoveField).not.toBeCalled();

    wrapper.destroy();
    expect(mockRemoveField).toBeCalledWith(NAME);
  });

  it('should correct update fields', async () => {
    const NEW_NAME = 'secondName';

    function getRules() {
      return {
        required: 'required field'
      };
    }

    createComponent({
      props: {
        name: NAME,
        rules: getRules()
      },
      slots: {
        default: '<div></div>'
      }
    });

    expect(mockUpdateField).not.toBeCalled();

    await wrapper.setProps({
      name: NEW_NAME
    });

    expect(mockUpdateField).toBeCalledWith(
      NAME,
      expect.objectContaining({
        name: NEW_NAME,
        focus: expect.any(Function),
        rules: getRules()
      })
    );
    expect(mockUpdateField).toBeCalledTimes(1);

    await wrapper.setProps({
      rules: getRules()
    });

    expect(mockUpdateField).toBeCalledWith(
      NEW_NAME,
      expect.objectContaining({
        name: NEW_NAME,
        focus: expect.any(Function),
        rules: getRules()
      })
    );
    expect(mockUpdateField).toBeCalledTimes(2);
  });

  it('should set modelValue', async () => {
    const MODEL_VALUE = 'test';
    const NEW_MODEL_VALUE = 'test_TEST';
    createComponent({
      props: {
        name: NAME,
        modelValue: MODEL_VALUE
      },
      slots: {
        default: '<div></div>'
      }
    });

    expect(mockAddField).toBeCalledWith(
      expect.objectContaining({
        name: NAME,
        defaultValue: MODEL_VALUE,
        focus: expect.any(Function),
        rules: {}
      })
    );

    await wrapper.setProps({
      modelValue: NEW_MODEL_VALUE
    });

    expect(mockSetValue).toBeCalledWith(NAME, NEW_MODEL_VALUE);
  });

  it('should set defaultValue', async () => {
    const DEFAULT_VALUE = 42;
    const VALUE = 4242;
    mockGetFieldDefaultValues.mockImplementationOnce(() => DEFAULT_VALUE);
    mockGetFieldValue.mockImplementationOnce(() => VALUE);
    createComponent({
      props: {
        name: NAME
      },
      scopedSlots: {
        default: '<input type="text" :name="props.name" :value="props.modelValue" />'
      }
    });

    expect(mockAddField).toBeCalledWith(
      expect.objectContaining({
        name: NAME,
        defaultValue: DEFAULT_VALUE,
        focus: expect.any(Function),
        rules: {}
      })
    );
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual([DEFAULT_VALUE]);
    expect(wrapper.find('input').element.value).toBe(String(VALUE));
  });

  it('should update modelValue', async () => {
    const VALUE = 42;
    createComponent({
      props: {
        name: NAME
      },
      scopedSlots: {
        default:
          '<input type="text" :name="props.name" :value="props.modelValue" @input="props.onChange($event.target.value)" />'
      }
    });

    wrapper.find('input').element.value = VALUE;
    await wrapper.find('input').trigger('input');

    expect(wrapper.emitted()['update:modelValue'][0]).toEqual([String(VALUE)]);
  });
});
