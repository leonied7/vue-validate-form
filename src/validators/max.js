export default (value, max) => {
  if (value === undefined || value === null || value === '') {
    return false;
  }

  return Number(value) <= max;
};
