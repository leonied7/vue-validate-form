export type ToString<T> = T extends string | number ? `${T}` : never;
