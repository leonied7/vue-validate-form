import type { InnerValidationError } from './error';

export interface Field {
  resetErrors: () => void
  errors: InnerValidationError[]
  name: string
  reset: () => void
  onFocus: () => void
  dirty: boolean
  pristine: boolean
  getValue: () => unknown
}
