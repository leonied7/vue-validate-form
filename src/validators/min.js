export default (value, min) => {
  if (value === undefined || value === null || value === '') {
    return false;
  }

  return Number(value) >= min;
};
