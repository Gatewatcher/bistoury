export const getCSSVariableValue = (variable: string) => {
  return window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
};
