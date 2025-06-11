export const getPropertyValue = (property: string) => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(property)
    .trim();
};
