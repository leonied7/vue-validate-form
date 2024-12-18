import type { Values } from './values';
import type { ValidationsErrors } from './error';

export interface ResolverResult<V extends Values> {
  values: Partial<V>;
  errors: ValidationsErrors;
}

export type Resolver<V extends Values> = (values: Partial<V>) => Promise<ResolverResult<V>> | ResolverResult<V>;
