import type { Values } from '../types/values';

export function has(object: Values, path: string): boolean {
  let tempObject = object;
  if (!isObject(tempObject)) {
    return false;
  }

  const pathParts = path.split('.');

  while (pathParts.length > 0) {
    const key = pathParts.shift() ?? '';
    if (!(key in tempObject)) {
      return false;
    }

    tempObject = tempObject[key];
  }

  return true;
}

export function get(object: Values, path: string, defaultValue?: unknown): unknown {
  let tempObject = object;
  if (!isObject(tempObject)) {
    return defaultValue;
  }

  const pathParts = path.split('.');
  while (pathParts.length > 0) {
    const key = pathParts.shift() ?? '';
    if (!(key in tempObject)) {
      return defaultValue;
    }

    tempObject = tempObject[key];
  }
  return tempObject;
}

export function set(object: Values, path: string, value: unknown): void {
  let tempObject = object;
  if (!isObject(tempObject)) {
    return;
  }

  const pathParts = path.split('.');

  while (pathParts.length > 1) {
    const key = pathParts.shift() ?? '';
    if (!isObject(tempObject[key])) {
      tempObject[key] = isIndex(pathParts[0]) ? [] : {};
    }

    tempObject = tempObject[key];
  }
  tempObject[pathParts[0]] = value;
}

function isIndex(value: unknown): boolean {
  const int = Number(value);
  return !Number.isNaN(int);
}

function isObject(value: unknown): boolean {
  return Boolean(value) && typeof value === 'object';
}
