export interface ValidationError {
  message: string
  type?: string
}

export type ResetBehaviour = 'onFieldChange' | 'onFormChange';

export interface InnerValidationError extends ValidationError {
  resetBehaviour: ResetBehaviour
}

export type ValidationsErrors = Record<string, ValidationError[]>;
export type InnerValidationsErrors = Record<string, InnerValidationError[]>;
