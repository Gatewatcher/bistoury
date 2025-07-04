/* eslint-disable @typescript-eslint/no-explicit-any */

export const isString = (str: any): str is string => {
  return typeof str === 'string';
};

export const removeAccents = (str: string): string => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const includesIgnoreAccentCase = (
  search: string,
  str: string,
): boolean => {
  return removeAccents(str)
    .toLowerCase()
    .includes(removeAccents(search).toLowerCase());
};

export const camelcase = (str: string): string => {
  const newString = str.replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) =>
    chr.toUpperCase(),
  );
  return `${newString.charAt(0).toLowerCase()}${newString.slice(1)}`;
};

export const pascalCase = (str: string): string => {
  const camelCased = camelcase(str);
  return `${camelCased.charAt(0).toUpperCase()}${camelCased.slice(1)}`;
};

export const splitWords = (sentence: string): string[] => {
  return sentence.match(
    /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g,
  );
};

export const snakeCase = (str: string): string => {
  return splitWords(str)
    .map(x => x.toLowerCase())
    .join('_');
};

export const toUpperCase = <T extends string>(value: T): Uppercase<T> => {
  return value.toUpperCase() as Uppercase<T>;
};

export const toLowerCase = <T extends string>(value: T): Lowercase<T> => {
  return value.toLowerCase() as Lowercase<T>;
};

export const escapeRegex = (text: string) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
