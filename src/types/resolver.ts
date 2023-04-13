import { Values } from './values';
import { ValidationsErrors } from './error';

export interface ResolverResult {
  values: Values;
  errors: ValidationsErrors;
}

export type Resolver = (values: Values) => Promise<ResolverResult> | ResolverResult;
