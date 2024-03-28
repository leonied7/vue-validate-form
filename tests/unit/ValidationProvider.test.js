import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { yupResolver } from '@vue-validate-form/resolvers';
import * as yup from 'yup';

import ValidationForm from './ValidationForm';
import FormInfo from './FormInfo';
import BaseInput from './BaseInput';

describe('ValidationProvider', () => {
  let wrapper;

  const createComponent = ({ props } = {}) => {
    wrapper = mount(ValidationForm, {
      propsData: props,
      attachTo: document.body
    });
  };

  it('should submitted without settings', async () => {
    createComponent();

    await wrapper.find('button[type=submit]').trigger('click');
    await nextTick();

    expect(wrapper.emitted().submit[0]).toEqual(
      expect.arrayContaining([
        {
          my: {
            nested: {
              value: undefined
            }
          },
          'my-input': undefined,
          arrayField: []
        },
        expect.any(Object)
      ])
    );
  });

  it('check dirty event', async () => {
    createComponent();
    await nextTick();
    expect(wrapper.emitted().dirty[0]).toEqual([false]);

    wrapper.findComponent(BaseInput).vm.$emit('update:modelValue', 42);
    await nextTick();

    expect(wrapper.emitted().dirty[1]).toEqual([true]);

    wrapper.findComponent(BaseInput).vm.$emit('update:modelValue', undefined);
    await nextTick();

    expect(wrapper.emitted().dirty[2]).toEqual([false]);
  });

  describe('defaults reset logic', () => {
    it('should reset form state on change defaultValues', async () => {
      createComponent();
      await nextTick();

      const myInputWrapper = wrapper.findComponent(BaseInput);
      myInputWrapper.vm.$emit('update:modelValue', 'new value');
      await nextTick();
      await nextTick();

      const formInfo = wrapper.findComponent(FormInfo);

      expect(formInfo.props().dirty).toBe(true);

      await wrapper.setProps({
        defaultValues: {
          'my-input': 42
        }
      });
      await nextTick();
      await nextTick();

      expect(formInfo.props().dirty).toBe(false);
      expect(formInfo.props().values).toEqual({
        'my-input': 42,
        my: {
          nested: {
            value: undefined
          }
        },
        arrayField: []
      });
    });

    it('shouldn`t reset form state on change defaultValues without resetOnUpdate', async () => {
      createComponent({
        props: {
          resetOnUpdate: false
        }
      });
      await nextTick();

      const myInputWrapper = wrapper.findComponent(BaseInput);
      myInputWrapper.vm.$emit('update:modelValue', 'new value');
      await nextTick();
      await nextTick();

      const formInfo = wrapper.findComponent(FormInfo);

      expect(formInfo.props().dirty).toBe(true);

      await wrapper.setProps({
        defaultValues: {
          'my-input': 42
        }
      });
      await nextTick();
      await nextTick();

      expect(formInfo.props().dirty).toBe(true);
      expect(formInfo.props().values).toEqual({
        'my-input': 'new value',
        my: {
          nested: {
            value: undefined
          }
        },
        arrayField: []
      });
    });

    it('should reset form state on change defaultErrors', async () => {
      createComponent();
      await nextTick();

      const myInputWrapper = wrapper.findComponent(BaseInput);
      myInputWrapper.vm.$emit('update:modelValue', 'new value');
      await nextTick();
      await nextTick();

      const formInfo = wrapper.findComponent(FormInfo);

      expect(formInfo.props().dirty).toBe(true);

      await wrapper.setProps({
        defaultErrors: {
          'my-input': [{ message: 'new error' }]
        }
      });
      await nextTick();
      await nextTick();

      expect(formInfo.props().dirty).toBe(false);
      expect(formInfo.props().values).toEqual({
        'my-input': undefined,
        my: {
          nested: {
            value: undefined
          }
        },
        arrayField: []
      });
    });

    it('shouldn`t reset form state on change defaultErrors without resetOnUpdate', async () => {
      createComponent({
        props: {
          resetOnUpdate: false
        }
      });
      await nextTick();

      const myInputWrapper = wrapper.findComponent(BaseInput);
      myInputWrapper.vm.$emit('update:modelValue', 'new value');
      await nextTick();
      await nextTick();

      const formInfo = wrapper.findComponent(FormInfo);

      expect(formInfo.props().dirty).toBe(true);

      await wrapper.setProps({
        defaultErrors: {
          'my-input': [{ message: 'new error' }]
        }
      });
      await nextTick();
      await nextTick();

      expect(formInfo.props().dirty).toBe(true);
      expect(formInfo.props().values).toEqual({
        'my-input': 'new value',
        my: {
          nested: {
            value: undefined
          }
        },
        arrayField: []
      });
    });
  });

  describe('defaultValues', () => {
    it('should submitted with defaultValues', async () => {
      createComponent({
        props: {
          defaultValues: {
            'my-input': 42,
            my: {
              nested: {
                value: 'wqe'
              },
              unused: 1
            }
          }
        }
      });

      await wrapper.find('button[type=submit]').trigger('click');
      await nextTick();

      expect(wrapper.emitted().submit[0]).toEqual(
        expect.arrayContaining([
          {
            my: {
              nested: {
                value: 'wqe'
              }
            },
            'my-input': 42,
            arrayField: []
          },
          expect.any(Object)
        ])
      );
    });

    it('shouldn`t pollute form', async () => {
      createComponent({
        props: {
          defaultValues: {
            'my-input': 42
          }
        }
      });

      const formInfoProps = wrapper.findComponent(FormInfo).props();

      expect(formInfoProps.dirty).toBe(false);
      expect(formInfoProps.invalid).toBe(false);
    });
  });

  describe('defaultErrors', () => {
    it('set default errors', async () => {
      createComponent({
        props: {
          defaultErrors: {
            'my-input': [
              {
                message: 'outer error'
              }
            ]
          }
        }
      });
      await nextTick();
      await nextTick();

      const formInfoWrapper = wrapper.findComponent(FormInfo);

      expect(formInfoWrapper.props().errors).toEqual({
        'my-input': [
          expect.objectContaining({
            message: 'outer error'
          })
        ],
        arrayField: [],
        'my.nested.value': []
      });
    });

    it('should work with defaultValues', async () => {
      createComponent({
        props: {
          defaultValues: {
            my: {
              nested: {
                value: 'wqe'
              }
            }
          },
          defaultErrors: {
            'my-input': [
              {
                message: 'outer error'
              }
            ]
          }
        }
      });
      await nextTick();
      await nextTick();

      const formInfoWrapper = wrapper.findComponent(FormInfo);

      expect(formInfoWrapper.props().errors).toEqual({
        'my-input': [
          expect.objectContaining({
            message: 'outer error'
          })
        ],
        arrayField: [],
        'my.nested.value': []
      });
    });

    it('should keep defaultErrors on change another fields', async () => {
      createComponent({
        props: {
          defaultValues: {
            'my-input': 'test',
            my: {
              nested: {
                value: 'wqe'
              }
            }
          },
          defaultErrors: {
            'my-input': [
              {
                message: 'outer error'
              }
            ],
            'my.nested.value': [
              {
                message: 'nested'
              }
            ],
            common: [
              {
                message: 'common error'
              }
            ]
          }
        }
      });
      await nextTick();
      await nextTick();
      await nextTick();

      const inputWrapper = wrapper.findAllComponents(BaseInput).at(1);
      const formInfoWrapper = wrapper.findComponent(FormInfo);
      inputWrapper.vm.$emit('update:modelValue', 42);
      await nextTick();
      await nextTick();

      expect(formInfoWrapper.props().errors).toEqual({
        'my-input': [
          expect.objectContaining({
            message: 'outer error'
          })
        ],
        arrayField: [],
        'my.nested.value': []
      });
    });
  });

  describe('resolver', () => {
    it('should validate', async () => {
      const MESSAGE = 'required field';
      const UNUSED_MESSAGE = 'required unused field';
      const schema = yup.object().shape({
        'my-input': yup.string().required(MESSAGE),
        unused: yup.string().required(UNUSED_MESSAGE)
      });
      createComponent({
        props: {
          resolver: yupResolver(schema)
        }
      });

      await wrapper.find('button[type=submit]').trigger('click');
      // wait async yup validate
      await nextTick();
      await nextTick();
      await nextTick();
      await nextTick();

      const formInfoProps = wrapper.findComponent(FormInfo).props();

      expect(formInfoProps.errors).toEqual({
        'my.nested.value': [],
        'my-input': [expect.objectContaining({ message: MESSAGE })],
        unused: [expect.objectContaining({ message: UNUSED_MESSAGE })],
        arrayField: []
      });
      expect(formInfoProps.dirty).toBe(false);
      expect(formInfoProps.invalid).toBe(true);
      expect(wrapper.emitted().submit).toBeUndefined();
    });

    it('check change emit', async () => {
      const myInputDefault = '42';
      createComponent({
        props: {
          resolver: yupResolver(
            yup.object({
              'my-input': yup.string().required().default(myInputDefault)
            })
          )
        }
      });

      await nextTick();
      await nextTick();
      await nextTick();

      const values = wrapper.emitted().change[0][0];
      expect(values).toEqual({
        'my-input': myInputDefault,
        my: {
          nested: {
            value: undefined
          }
        },
        arrayField: []
      });
    });

    it('should set default values', async () => {
      const MESSAGE = 'required field';
      const schema = yup.object({
        'my-input': yup.string().required(MESSAGE).default('42')
      });
      createComponent({
        props: {
          resolver: yupResolver(schema)
        }
      });

      await wrapper.find('button[type=submit]').trigger('click');
      // wait async yup validate
      await nextTick();
      await nextTick();
      await nextTick();

      const formInfoProps = wrapper.findComponent(FormInfo).props();

      expect(formInfoProps.errors).toEqual({
        'my.nested.value': [],
        'my-input': [],
        arrayField: []
      });
      expect(wrapper.emitted().submit[0]).toEqual(
        expect.arrayContaining([
          {
            my: {
              nested: {
                value: undefined
              }
            },
            'my-input': '42',
            arrayField: []
          },
          expect.any(Object)
        ])
      );
    });
  });

  describe('reset', () => {
    it('without payload', async () => {
      createComponent();
      await nextTick();

      wrapper.findComponent(BaseInput).vm.$emit('update:modelValue', 42);
      await nextTick();
      const formInfo = wrapper.findComponent(FormInfo);
      expect(formInfo.props().values).toEqual({
        'my-input': 42,
        my: {
          nested: {
            value: undefined
          }
        },
        arrayField: []
      });
      expect(formInfo.props().dirty).toBe(true);

      await wrapper.find('button[type=reset]').trigger('click');

      expect(formInfo.props().values).toEqual({
        'my-input': undefined,
        my: {
          nested: {
            value: undefined
          }
        },
        arrayField: []
      });
      expect(formInfo.props().dirty).toBe(false);
    });

    it('with payload', async () => {
      createComponent();
      await nextTick();

      wrapper.findComponent(BaseInput).vm.$emit('update:modelValue', 42);
      await nextTick();
      const formInfo = wrapper.findComponent(FormInfo);
      expect(formInfo.props().values).toEqual({
        'my-input': 42,
        my: {
          nested: {
            value: undefined
          }
        },
        arrayField: []
      });
      expect(formInfo.props().dirty).toBe(true);

      await wrapper.find('button[type=reset]').trigger('click', {
        payload: {
          'my-input': 'qwe',
          my: {
            nested: {
              value: 42
            },
            unused: 'test'
          }
        }
      });

      expect(formInfo.props().values).toEqual({
        'my-input': 'qwe',
        my: {
          nested: {
            value: 42
          }
        },
        arrayField: []
      });
      expect(formInfo.props().dirty).toBe(false);
    });

    it('correctly reset after remove', async () => {
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
                id: 3,
                firstName: 'name 2'
              }
            ]
          }
        }
      });
      await nextTick();

      await wrapper.find('#remove').trigger('click');
      const formInfo = wrapper.findComponent(FormInfo);
      expect(formInfo.props().dirty).toBe(true);

      await wrapper.find('button[type=reset]').trigger('click');

      expect(formInfo.props().dirty).toBe(false);
    });
  });

  it('set field value by provider', async () => {
    createComponent();

    wrapper.findComponent(FormInfo).vm.$emit('set-field-value', 'my.nested.value', 'new value');
    await nextTick();

    expect(wrapper.findComponent(FormInfo).props().values).toEqual({
      'my-input': undefined,
      my: {
        nested: {
          value: 'new value'
        }
      },
      arrayField: []
    });
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
    const formInfoWrapper = wrapper.findComponent(FormInfo);

    expect(formInfoWrapper.props().pristine).toBe(true);
    inputWrapper.vm.$emit('update:modelValue', 42);
    await nextTick();
    expect(formInfoWrapper.props().pristine).toBe(true);
    inputWrapper.vm.$emit('update:modelValue', '42');
    await nextTick();
    expect(formInfoWrapper.props().pristine).toBe(false);
    inputWrapper.vm.$emit('update:modelValue', 42);
    await nextTick();
    expect(formInfoWrapper.props().pristine).toBe(false);
    await wrapper.find('button[type=reset]').trigger('click');
    expect(formInfoWrapper.props().pristine).toBe(true);
  });
});
