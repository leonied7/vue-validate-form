import type { Paths as PathsImplement } from 'type-fest';
import type { ToString } from './string';

export type Paths<V> = ToString<PathsImplement<V, { bracketNotation: false }>>;
