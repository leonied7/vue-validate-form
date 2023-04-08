export function normalizeChildren(context, slotProps = null) {
  if (context.$scopedSlots.default) {
    return context.$scopedSlots.default(slotProps) || [];
  }

  return context.$slots.default || [];
}

export function has(object, path) {
  if (!isObject(object)) {
    return false;
  }
  let pathParts = path.split('.');

  while (pathParts.length) {
    const key = pathParts.shift();
    if (!(key in object)) {
      return false;
    }
    object = object[key];
  }

  return true;
}

export function get(object, path, defaultValue) {
  if (!isObject(object)) {
    return defaultValue;
  }
  let pathParts = path.split('.');
  while (pathParts.length) {
    const key = pathParts.shift();
    if (!(key in object)) {
      return defaultValue;
    }
    object = object[key];
  }
  return object;
}

export function set(object, path, value) {
  if (!isObject(object)) {
    return;
  }
  let pathParts = path.split('.');

  while (pathParts.length > 1) {
    const key = pathParts.shift();
    if (!isObject(object[key])) {
      object[key] = isIndex(pathParts[0]) ? [] : {};
    }
    object = object[key];
  }
  object[pathParts[0]] = value;
}

function isIndex(value) {
  const int = Number(value);
  return !Number.isNaN(int);
}

function isObject(value) {
  return !!value && typeof value == 'object';
}
