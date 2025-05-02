import type { ValidationsErrors } from './error';
import type { Values } from './values';

export interface ResolverResult<V extends Values> {
  values: Partial<V>;
  errors: ValidationsErrors;
}

export type Resolver<V extends Values> = (values: Partial<V>) => Promise<ResolverResult<V>> | ResolverResult<V>;
