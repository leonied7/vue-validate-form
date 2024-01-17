import { mount } from '@vue/test-utils';
import { yupResolver } from '@vue-validate-form/resolvers';
import { nextTick } from 'vue';
import { array, object, string } from 'yup';

import ValidationForm from './ValidationForm';
import FormInfo from './FormInfo';
import BaseInput from './BaseInput';
import { ON_FORM_CHANGE } from '../../src/components/constants';

const resolver = yupResolver(
  object().shape({
    arrayField: array().of(
      object({
        firstName: string().required('invalid')
      })
    )
  })
);

describe('ValidationFieldArray', () => {
  let wrapper;

  const createComponent = ({ props } = {}) => {
    wrapper = mount(ValidationForm, {
      propsData: props,
      attachTo: document.body
    });
  };

  it('should render array fields', async () => {
    createComponent({
      props: {
        defaultValues: {
          arrayField: [
            {
              id: 1,
              firstName: 'name 1'
            },
            {
              id: 42,
              firstName: 'name 2'
            },
            {
              id: null,
              firstName: 'name 3'
            }
          ]
        }
      }
    });
    await nextTick();
    const formInfoProps = wrapper.findComponent(FormInfo).props();

    expect(wrapper.findAllComponents(BaseInput).length).toBe(5);
    expect(formInfoProps.dirty).toBe(false);
    expect(formInfoProps.invalid).toBe(false);
    expect(formInfoProps.values).toEqual({
      arrayField: [
        {
          id: 1,
          firstName: 'name 1',
          type: undefined
        },
        {
          id: 42,
          firstName: 'name 2',
          type: undefined
        },
        {
          id: null,
          firstName: 'name 3',
          type: undefined
        }
      ],
      my: {
        nested: {
          value: undefined
        }
      },
      'my-input': undefined
    });
  });

  it('set errors for array fields', async () => {
    createComponent({
      props: {
        defaultValues: {
          arrayField: [
            {
              id: 1,
              firstName: ''
            },
            {
              id: 42,
              firstName: 'name 2'
            }
          ]
        },
        resolver
      }
    });
    await nextTick();
    await wrapper.find('button[type=submit]').trigger('click');
    // wait async yup validate
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();
    const formInfoProps = wrapper.findComponent(FormInfo).props();

    expect(formInfoProps.errors).toEqual({
      'my.nested.value': [],
      'my-input': [],
      arrayField: [],
      'arrayField.0.id': [],
      'arrayField.0.type': [],
      'arrayField.0.firstName': [
        { type: 'required', message: 'invalid', resetBehaviour: ON_FORM_CHANGE }
      ],
      'arrayField.1.id': [],
      'arrayField.1.type': [],
      'arrayField.1.firstName': []
    });
    expect(formInfoProps.dirty).toBe(false);
    expect(formInfoProps.invalid).toBe(true);
  });

  it('append should work', async () => {
    createComponent({
      props: {
        defaultValues: {
          arrayField: [
            {
              id: 42,
              firstName: 'name 2'
            }
          ]
        },
        resolver
      }
    });
    await nextTick();
    expect(wrapper.findAllComponents(BaseInput).length).toBe(3);

    await wrapper.find('#append').trigger('click', { firstName: 'new name' });

    const baseInputWrappers = wrapper.findAllComponents(BaseInput);
    expect(baseInputWrappers.length).toBe(4);
    expect(baseInputWrappers.at(3).props().modelValue).toBe('new name');
  });

  it('remove should work', async () => {
    createComponent({
      props: {
        defaultValues: {
          arrayField: [
            {
              id: 1,
              firstName: 'name 1'
            },
            {
              id: 2,
              firstName: 'name 2'
            },
            {
              id: 42,
              firstName: ''
            }
          ]
        },
        resolver
      }
    });
    await nextTick();
    await wrapper.find('button[type=submit]').trigger('click');
    // wait async yup validate
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();

    expect(wrapper.findComponent(FormInfo).props().errors).toEqual({
      'my.nested.value': [],
      'my-input': [],
      arrayField: [],
      'arrayField.0.id': [],
      'arrayField.0.type': [],
      'arrayField.0.firstName': [],
      'arrayField.1.id': [],
      'arrayField.1.type': [],
      'arrayField.1.firstName': [],
      'arrayField.2.id': [],
      'arrayField.2.type': [],
      'arrayField.2.firstName': [
        { type: 'required', message: 'invalid', resetBehaviour: ON_FORM_CHANGE }
      ]
    });

    await wrapper.find('#remove').trigger('click');

    expect(wrapper.findComponent(FormInfo).props().errors).toEqual({
      'my.nested.value': [],
      'my-input': [],
      arrayField: [],
      'arrayField.0.id': [],
      'arrayField.0.type': [],
      'arrayField.0.firstName': [],
      'arrayField.1.id': [],
      'arrayField.1.type': [],
      'arrayField.1.firstName': [
        { type: 'required', message: 'invalid', resetBehaviour: ON_FORM_CHANGE }
      ]
    });
    expect(wrapper.findComponent(FormInfo).props().values).toEqual({
      my: {
        nested: {
          value: undefined
        }
      },
      'my-input': undefined,
      arrayField: [
        { firstName: 'name 1', id: 1 },
        { firstName: '', id: 42 }
      ]
    });
  });

  it('prepend should work', async () => {
    createComponent({
      props: {
        defaultValues: {
          arrayField: [
            {
              id: 1,
              firstName: 'name 1'
            },
            {
              id: 42,
              firstName: ''
            }
          ]
        },
        resolver
      }
    });
    await nextTick();
    await wrapper.find('button[type=submit]').trigger('click');
    // wait async yup validate
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();

    expect(wrapper.findComponent(FormInfo).props().errors).toEqual({
      'my.nested.value': [],
      'my-input': [],
      arrayField: [],
      'arrayField.0.id': [],
      'arrayField.0.type': [],
      'arrayField.0.firstName': [],
      'arrayField.1.id': [],
      'arrayField.1.type': [],
      'arrayField.1.firstName': [
        { type: 'required', message: 'invalid', resetBehaviour: ON_FORM_CHANGE }
      ]
    });

    await wrapper.find('#prepend').trigger('click', { firstName: 'new name' });

    expect(wrapper.findComponent(FormInfo).props().errors).toEqual({
      'my.nested.value': [],
      'my-input': [],
      arrayField: [],
      'arrayField.0.id': [],
      'arrayField.0.type': [],
      'arrayField.0.firstName': [],
      'arrayField.1.id': [],
      'arrayField.1.type': [],
      'arrayField.1.firstName': [],
      'arrayField.2.id': [],
      'arrayField.2.type': [],
      'arrayField.2.firstName': [
        { type: 'required', message: 'invalid', resetBehaviour: ON_FORM_CHANGE }
      ]
    });
    expect(wrapper.findAllComponents(BaseInput).at(2).props().modelValue).toBe('new name');
  });

  it('insert should work', async () => {
    createComponent({
      props: {
        defaultValues: {
          arrayField: [
            {
              id: 1,
              type: '1',
              firstName: 'name 1'
            },
            {
              id: 42,
              type: '42',
              firstName: ''
            }
          ]
        },
        resolver
      }
    });
    await nextTick();
    await wrapper.find('button[type=submit]').trigger('click');
    // wait async yup validate
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();

    expect(wrapper.findComponent(FormInfo).props().errors).toEqual({
      'my.nested.value': [],
      'my-input': [],
      arrayField: [],
      'arrayField.0.id': [],
      'arrayField.0.type': [],
      'arrayField.0.firstName': [],
      'arrayField.1.id': [],
      'arrayField.1.type': [],
      'arrayField.1.firstName': [
        { type: 'required', message: 'invalid', resetBehaviour: ON_FORM_CHANGE }
      ]
    });

    await wrapper.find('#insert').trigger('click');

    expect(wrapper.findComponent(FormInfo).props().errors).toEqual({
      'my.nested.value': [],
      'my-input': [],
      arrayField: [],
      'arrayField.0.id': [],
      'arrayField.0.type': [],
      'arrayField.0.firstName': [],
      'arrayField.1.id': [],
      'arrayField.1.type': [],
      'arrayField.1.firstName': [],
      'arrayField.2.id': [],
      'arrayField.2.type': [],
      'arrayField.2.firstName': [
        { type: 'required', message: 'invalid', resetBehaviour: ON_FORM_CHANGE }
      ]
    });

    expect(wrapper.findComponent(FormInfo).props().values.arrayField[1].type).toEqual(undefined);
    expect(wrapper.findAllComponents(BaseInput).at(3).props().modelValue).toBe('insert');
  });

  it('swap should work', async () => {
    createComponent({
      props: {
        defaultValues: {
          arrayField: [
            {
              id: 1,
              firstName: 'name 1'
            },
            {
              id: 2,
              firstName: 'name 2'
            },
            {
              id: 42,
              firstName: ''
            }
          ]
        },
        resolver
      }
    });
    await nextTick();
    await wrapper.find('button[type=submit]').trigger('click');
    // wait async yup validate
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();

    expect(wrapper.findComponent(FormInfo).props().errors).toEqual({
      'my.nested.value': [],
      'my-input': [],
      arrayField: [],
      'arrayField.0.id': [],
      'arrayField.0.type': [],
      'arrayField.0.firstName': [],
      'arrayField.1.id': [],
      'arrayField.1.type': [],
      'arrayField.1.firstName': [],
      'arrayField.2.id': [],
      'arrayField.2.type': [],
      'arrayField.2.firstName': [
        { type: 'required', message: 'invalid', resetBehaviour: ON_FORM_CHANGE }
      ]
    });
    const formInfoWrapper = wrapper.findComponent(FormInfo);

    await wrapper.find('#swap').trigger('click');

    expect(formInfoWrapper.props().errors).toEqual({
      'my.nested.value': [],
      'my-input': [],
      arrayField: [],
      'arrayField.0.id': [],
      'arrayField.0.type': [],
      'arrayField.0.firstName': [
        { type: 'required', message: 'invalid', resetBehaviour: ON_FORM_CHANGE }
      ],
      'arrayField.1.id': [],
      'arrayField.1.type': [],
      'arrayField.1.firstName': [],
      'arrayField.2.id': [],
      'arrayField.2.type': [],
      'arrayField.2.firstName': []
    });
    expect(formInfoWrapper.props().values).toEqual({
      my: {
        nested: {
          value: undefined
        }
      },
      'my-input': undefined,
      arrayField: [
        {
          id: 42,
          firstName: ''
        },
        {
          id: 2,
          firstName: 'name 2'
        },
        {
          id: 1,
          firstName: 'name 1'
        }
      ]
    });

    await wrapper.find('#swap').trigger('click');

    expect(formInfoWrapper.props().errors).toEqual({
      'my.nested.value': [],
      'my-input': [],
      arrayField: [],
      'arrayField.0.id': [],
      'arrayField.0.type': [],
      'arrayField.0.firstName': [],
      'arrayField.1.id': [],
      'arrayField.1.type': [],
      'arrayField.1.firstName': [],
      'arrayField.2.id': [],
      'arrayField.2.type': [],
      'arrayField.2.firstName': [
        { type: 'required', message: 'invalid', resetBehaviour: ON_FORM_CHANGE }
      ]
    });
    expect(formInfoWrapper.props().values).toEqual({
      my: {
        nested: {
          value: undefined
        }
      },
      'my-input': undefined,
      arrayField: [
        {
          id: 1,
          firstName: 'name 1'
        },
        {
          id: 2,
          firstName: 'name 2'
        },
        {
          id: 42,
          firstName: ''
        }
      ]
    });
  });

  it('move should work', async () => {
    createComponent({
      props: {
        defaultValues: {
          arrayField: [
            {
              id: 1,
              firstName: 'name 1'
            },
            {
              id: 2,
              firstName: 'name 2'
            },
            {
              id: 42,
              firstName: ''
            }
          ]
        },
        resolver
      }
    });
    await nextTick();
    await wrapper.find('button[type=submit]').trigger('click');
    // wait async yup validate
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();

    expect(wrapper.findComponent(FormInfo).props().errors).toEqual({
      'my.nested.value': [],
      'my-input': [],
      arrayField: [],
      'arrayField.0.id': [],
      'arrayField.0.type': [],
      'arrayField.0.firstName': [],
      'arrayField.1.id': [],
      'arrayField.1.type': [],
      'arrayField.1.firstName': [],
      'arrayField.2.id': [],
      'arrayField.2.type': [],
      'arrayField.2.firstName': [
        { type: 'required', message: 'invalid', resetBehaviour: ON_FORM_CHANGE }
      ]
    });
    const formInfoWrapper = wrapper.findComponent(FormInfo);

    await wrapper.find('#move').trigger('click');

    expect(formInfoWrapper.props().errors).toEqual({
      'my.nested.value': [],
      'my-input': [],
      arrayField: [],
      'arrayField.0.id': [],
      'arrayField.0.type': [],
      'arrayField.0.firstName': [],
      'arrayField.1.id': [],
      'arrayField.1.type': [],
      'arrayField.1.firstName': [
        { type: 'required', message: 'invalid', resetBehaviour: ON_FORM_CHANGE }
      ],
      'arrayField.2.id': [],
      'arrayField.2.type': [],
      'arrayField.2.firstName': []
    });
    expect(formInfoWrapper.props().values).toEqual({
      my: {
        nested: {
          value: undefined
        }
      },
      'my-input': undefined,
      arrayField: [
        {
          id: 2,
          firstName: 'name 2'
        },
        {
          id: 42,
          firstName: ''
        },
        {
          id: 1,
          firstName: 'name 1'
        }
      ]
    });

    await wrapper.find('#move').trigger('click');

    expect(formInfoWrapper.props().errors).toEqual({
      'my.nested.value': [],
      'my-input': [],
      arrayField: [],
      'arrayField.0.id': [],
      'arrayField.0.type': [],
      'arrayField.0.firstName': [
        { type: 'required', message: 'invalid', resetBehaviour: ON_FORM_CHANGE }
      ],
      'arrayField.1.id': [],
      'arrayField.1.type': [],
      'arrayField.1.firstName': [],
      'arrayField.2.id': [],
      'arrayField.2.type': [],
      'arrayField.2.firstName': []
    });
    expect(formInfoWrapper.props().values).toEqual({
      my: {
        nested: {
          value: undefined
        }
      },
      'my-input': undefined,
      arrayField: [
        {
          id: 42,
          firstName: ''
        },
        {
          id: 1,
          firstName: 'name 1'
        },
        {
          id: 2,
          firstName: 'name 2'
        }
      ]
    });
  });

  it('onChange should work', async () => {
    createComponent({
      props: {
        defaultValues: {
          arrayField: [
            {
              id: 1,
              firstName: 'name 1'
            },
            {
              id: 2,
              firstName: 'name 2'
            }
          ]
        },
        resolver
      }
    });
    await nextTick();

    const formInfoWrapper = wrapper.findComponent(FormInfo);

    await wrapper.find('#arrayChange').trigger('click');

    expect(formInfoWrapper.props().values).toEqual({
      my: {
        nested: {
          value: undefined
        }
      },
      'my-input': undefined,
      arrayField: [
        {
          id: 42,
          firstName: 'new name'
        }
      ]
    });
  });
});
