import type { InjectionKey } from 'vue';
import type { InnerValidationError, InnerValidationsErrors } from '../types/error';
import type { Field } from '../types/field';

export const hasFieldValueSymbol: InjectionKey<(name: string) => boolean> = Symbol('hasFieldValue');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GetFieldValue = (name: string) => any;
export const getFieldValueSymbol: InjectionKey<GetFieldValue> = Symbol('getFieldValue');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GetFieldDefaultValue = (name: string, defaultValue?: any) => any;
export const getFieldDefaultValueSymbol: InjectionKey<GetFieldDefaultValue>
  = Symbol('getFieldDefaultValue');

export type GetFieldPristine = (name: string) => boolean;
export const getFieldPristineSymbol: InjectionKey<GetFieldPristine> = Symbol('getFieldPristine');

export type GetErrors = (name?: string) => InnerValidationError[] | InnerValidationsErrors;
export const getErrorsSymbol: InjectionKey<GetErrors> = Symbol('getErrors');

export type Register = (fieldComponent: Field) => () => void;
export const registerSymbol: InjectionKey<Register> = Symbol('register');
export const validateSymbol: InjectionKey<(name: string) => void> = Symbol('validate');
export const getIsSubmittedSymbol: InjectionKey<() => boolean> = Symbol('getIsSubmitted');
export const getIsValidateAvailableSymbol: InjectionKey<() => boolean>
  = Symbol('getIsValidateAvailable');
