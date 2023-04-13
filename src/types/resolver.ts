import type { Values } from './values';
import type { ValidationsErrors } from './error';

export interface ResolverResult {
  values: Values;
  errors: ValidationsErrors;
}

export type Resolver = (values: Values) => Promise<ResolverResult> | ResolverResult;
