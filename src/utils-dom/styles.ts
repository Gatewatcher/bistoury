import { camelcase, pascalCase } from './../utils-lang';

export const stylesToCamelCase = (
  styles: CSSModuleClasses,
  ...str: string[]
) => {
  try {
    const key = camelcase(str.join(' '));
    return styles[key] ?? '';
  } catch {
    return '';
  }
};

export const stylesToPascalCase = (
  styles: CSSModuleClasses,
  ...str: string[]
) => {
  try {
    const key = pascalCase(str.join(' '));
    return styles[key] ?? '';
  } catch {
    return '';
  }
};
