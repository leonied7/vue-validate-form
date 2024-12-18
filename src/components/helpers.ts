import type { Get, LiteralUnion, IfUnknown } from 'type-fest';
import type { Values } from '../types/values';
import type { Paths } from '../types/paths';

export function has<V extends Values>(object: V, path: LiteralUnion<Paths<V>, string>): boolean {
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

export function get<V extends Values, Path extends LiteralUnion<Paths<V>, string>, DV, Res extends IfUnknown<DV, Get<V, Path>, DV>>(object: V, path: Path, defaultValue?: DV): Res {
  let tempObject = object;
  if (!isObject(tempObject)) {
    return defaultValue as unknown as Res;
  }

  const pathParts = path.split('.');
  while (pathParts.length > 0) {
    const key = pathParts.shift() ?? '';
    if (!(key in tempObject)) {
      return defaultValue as unknown as Res;
    }

    tempObject = tempObject[key];
  }
  return tempObject as unknown as Res;
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
