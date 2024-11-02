// #region resetBehaviour
export type ResetBehaviour = 'onFieldChange' | 'onFormChange';
// #endregion resetBehaviour

// #region error
export interface ValidationError {
  message: string;
  type?: string;
  resetBehaviour?: ResetBehaviour;
}
// #endregion error

export interface InnerValidationError extends ValidationError {
  resetBehaviour: ResetBehaviour;
}

// #region errorsMap
export type ValidationsErrors = Record<string, ValidationError[]>;
// #endregion errorsMap
export type InnerValidationsErrors = Record<string, InnerValidationError[]>;
