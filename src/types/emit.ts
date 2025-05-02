import type { ComponentProps } from 'vue-component-type-helpers';
import type ValidationProvider from '../components/ValidationProvider.vue';
import type { Values } from './values';

type Props<V extends Values> = ComponentProps<typeof ValidationProvider<V>>;

export type OnSubmit<V extends Values = Values> = Exclude<Props<V>['onSubmit'], undefined>;

export type OnChange<V extends Values = Values> = Exclude<Props<V>['onChange'], undefined>;
