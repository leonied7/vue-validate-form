import { mount, createLocalVue } from '@vue/test-utils';
import { nextTick } from 'vue';
import { yupResolver } from '@vue-validate-form/resolvers';
import * as yup from 'yup';
import { ValidationProvider, ValidationField, registerValidator } from '../../src/index.js';

const localVue = createLocalVue();
localVue.component('ValidationField', ValidationField);
registerValidator('required', (value) => !!value);

describe('ValidationProvider', () => {
  let wrapper;

  const createComponent = ({ props, slots, scopedSlots } = {}) => {
    wrapper = mount(ValidationProvider, {
      propsData: props,
      slots,
      scopedSlots,
      localVue,
      attachTo: document.body
    });
  };

  it('should submitted actual values', async () => {
    const VALUE = 42;
    createComponent({
      scopedSlots: {
        default: `<form @submit.prevent='props.handleSubmit'>
  <ValidationField name="nested.name" :modelValue='${VALUE}'>
    <template #default='{ modelValue, name }'>
      <input :value='modelValue' :name='name' />
    </template>
  </ValidationField>
  <button type='submit'>Submit</button>
</form>`
      }
    });

    await wrapper.find('button[type=submit]').trigger('click');

    expect(wrapper.emitted().submit[0]).toEqual(
      expect.arrayContaining([
        {
          nested: { name: VALUE }
        },
        expect.any(Object)
      ])
    );
  });

  it('should work with resolver', async () => {
    const MESSAGE = 'required field';
    const schema = yup.object().shape({
      name: yup.string().required(MESSAGE)
    });
    createComponent({
      props: {
        resolver: yupResolver(schema)
      },
      scopedSlots: {
        default: `<form @submit.prevent='props.handleSubmit'>
  <ValidationField name="name">
    <template #default='{ modelValue, name }'>
      <input :value='modelValue' :name='name' />
    </template>
  </ValidationField>
  <div v-for='error in props.errors.name' :key='error.message'>
    {{error.message}}
  </div>
  <button type='submit'>Submit</button>
</form>`
      }
    });

    await wrapper.find('button[type=submit]').trigger('click');
    // wait async yup validate
    await nextTick();
    await nextTick();
    await nextTick();

    expect(wrapper.find('div').text()).toBe(MESSAGE);
    expect(wrapper.emitted().submit).toBeUndefined();
  });

  it('shouldn`t submitted if fields invalid', async () => {
    const MESSAGE = 'required field';
    const RULES = {
      required: {
        message: MESSAGE
      }
    };
    createComponent({
      scopedSlots: {
        default({ handleSubmit, errors }) {
          return this.$createElement(
            'form',
            {
              on: {
                submit(event) {
                  event.preventDefault();
                  handleSubmit();
                }
              }
            },
            [
              this.$createElement(ValidationField, {
                props: {
                  name: 'nested.name',
                  rules: RULES
                },
                scopedSlots: {
                  default: ({ modelValue, name, invalid }) =>
                    this.$createElement('input', {
                      attrs: {
                        value: modelValue,
                        name,
                        'aria-invalid': invalid
                      }
                    })
                }
              }),
              this.$createElement(
                'div',
                errors['nested.name']?.map(({ message }) => message)
              ),
              this.$createElement(
                'button',
                {
                  attrs: {
                    type: 'submit'
                  }
                },
                'Submit'
              )
            ]
          );
        }
      }
    });
    expect(wrapper.find('input').attributes()['aria-invalid']).toBe(undefined);

    await wrapper.find('button[type="submit"]').trigger('click');

    expect(wrapper.emitted().submit).toBeUndefined();
    expect(wrapper.find('input').attributes()['aria-invalid']).toBe('true');
    expect(wrapper.find('div').text()).toBe(MESSAGE);
  });

  it.todo('change ValidationField name');
  it.todo('check changing values');
  it.todo('check `reset` method');
  it.todo('check invalid');
  it.todo('check field invalid');
});
