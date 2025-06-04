export const isFunction = (fn: any): fn is Function => {
  return typeof fn === 'function';
};
