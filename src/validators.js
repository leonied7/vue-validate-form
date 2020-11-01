export const validators = {};

export function register(name, validate) {
  validators[name] = validate;
}
