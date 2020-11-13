export default (value) => {
  if (value === undefined || value === null) {
    return false;
  }

  if (Array.isArray(value)) {
    return !!value.length;
  }

  return !!String(value).trim().length;
};
