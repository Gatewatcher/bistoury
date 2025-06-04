export const setEqual = <T>(as: Set<T>, bs: Set<T>) => {
  if (as.size !== bs.size) {
    return false;
  }

  for (const a of as) {
    if (!bs.has(a)) {
      return false;
    }
  }

  return true;
};
