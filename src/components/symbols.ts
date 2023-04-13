import type { InjectionKey } from 'vue';
import type { InnerValidationError, InnerValidationsErrors } from '../types/error';
import type { Field } from '../types/field';

export const hasFieldValueSymbol: InjectionKey<(name: string) => boolean> = Symbol('hasFieldValue');

export type GetFieldValue = (name: string) => unknown;
export const getFieldValueSymbol: InjectionKey<GetFieldValue> = Symbol('getFieldValue');

export type GetFieldDefaultValue = (name: string, defaultValue: unknown) => unknown;
export const getFieldDefaultValueSymbol: InjectionKey<GetFieldDefaultValue> =
  Symbol('getFieldDefaultValue');

export type GetErrors = <Type extends string | undefined>(
  name: Type,
) => Type extends string ? InnerValidationError[] : InnerValidationsErrors;
export const getErrorsSymbol: InjectionKey<GetErrors> = Symbol('getErrors');

export type Register = (fieldComponent: Field) => () => void;
export const registerSymbol: InjectionKey<Register> = Symbol('register');
export const validateSymbol: InjectionKey<(name: string) => void> = Symbol('validate');
export const getIsSubmittedSymbol: InjectionKey<() => boolean> = Symbol('getIsSubmitted');
