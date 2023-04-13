import type { InnerValidationError } from './error';

export interface Field {
  name: string;
  dirty: boolean;
  pristine: boolean;
  errors: InnerValidationError[];
  getValue: () => unknown;
  onChange: (value: unknown) => void;
  setError: (error: InnerValidationError) => void;
  resetErrors: () => void;
  reset: () => void;
  onFocus: () => void;
}
