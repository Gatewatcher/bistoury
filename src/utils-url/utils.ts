/* eslint-disable @typescript-eslint/no-explicit-any */
import { isString, isURLSearchParams } from './../utils-lang';
import { SearchParams, SearchParamsObject } from './filterSearchParams';

export const filterParams = (
  params: URLSearchParams,
  {
    include,
    exclude,
  }: {
    include?: string[];
    exclude?: string[];
  },
) => {
  const excludeKeys: string[] = [];
  const shouldExclude = (key: string) =>
    (include && !include.includes(key)) || (exclude && exclude.includes(key));
  params.forEach((_, key) => {
    if (shouldExclude(key)) {
      excludeKeys.push(key);
    }
  });
  excludeKeys.forEach(excludeKey => params.delete(excludeKey));
};

export const replaceParams = (
  params: URLSearchParams,
  replace?: SearchParamsObject,
) => {
  const replaceEntries = Object.entries(replace ?? {});
  if (replaceEntries.length) {
    replaceEntries.forEach(([replaceKey, replaceValue]) => {
      if (params.has(replaceKey)) {
        if (Array.isArray(replaceValue)) {
          params.delete(replaceKey);
          replaceValue.forEach(value => {
            params.append(replaceKey, String(value));
          });
        } else {
          params.set(replaceKey, String(replaceValue));
        }
      }
    });
  }
};

export const setDefaultParams = (
  params: URLSearchParams,
  defaults?: SearchParamsObject,
) => {
  const defaultEntries = Object.entries(defaults ?? {});
  if (defaultEntries.length) {
    defaultEntries.forEach(([defaultKey, defaultValue]) => {
      if (!params.has(defaultKey)) {
        if (Array.isArray(defaultValue)) {
          defaultValue.forEach((value: string | number) => {
            params.append(defaultKey, String(value));
          });
        } else {
          params.set(defaultKey, String(defaultValue));
        }
      }
    });
  }
};

export const removeEmptyParams = (params: URLSearchParams) => {
  const filteredParams: [string, string[]][] = [];
  params.forEach((_, key) => {
    const values = params.getAll(key);
    const filteredValues = values.filter(value => value);
    if (filteredValues.length !== values.length) {
      filteredParams.push([key, filteredValues]);
    }
  });
  if (filteredParams.length) {
    filteredParams.forEach(([key, values]: any) => {
      params.delete(key);
      values.forEach((value: any) => {
        params.append(key, String(value));
      });
    });
  }
};

export const objectToURLSearchParams = (
  params: SearchParamsObject,
): URLSearchParams => {
  const resultParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach((value: string | number) =>
        resultParams.append(key, String(value)),
      );
    } else if (value !== undefined) {
      resultParams.set(key, String(value));
    }
  }
  return resultParams;
};

export const buildURLSearchParamsWithQuery = (
  queryObject: SearchParamsObject,
  otherObject?: SearchParamsObject,
) => {
  return objectToURLSearchParams({
    query: Object.entries({
      ...queryObject,
    })
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}:${v}`)
      .join(' '),
    ...otherObject,
  });
};

export const urlSearchParamsToObject = (params: URLSearchParams) => {
  const result: { [key: string]: string | string[] } = {};
  params.forEach((value, key) => {
    const currentResultValue = result[key];
    if (key in result) {
      if (!Array.isArray(currentResultValue)) {
        result[key] = [currentResultValue];
      }
      (result[key] as string[]).push(value);
    } else {
      result[key] = value;
    }
  });
  return result;
};

export const searchParamsToString = (params: SearchParams): string => {
  if (isString(params)) {
    return params;
  } else if (isURLSearchParams(params)) {
    return params.toString();
  }
  return objectToURLSearchParams(params).toString();
};

export const searchParamsToObject = (
  params: SearchParams,
): { [key: string]: string | string[] } => {
  const pString = searchParamsToString(params);
  const urlSearchParams = new URLSearchParams(pString);
  return urlSearchParamsToObject(urlSearchParams);
};

export const getUrlWithParams = (
  url: string,
  params: SearchParams | any,
): string => {
  const pString = searchParamsToString(params);
  return `${url}${pString ? `?${pString}` : ''}`;
};

export const createBaseRoute = (base: string): string => {
  return `${base}/*`;
};

export const getSearchParamsToObject = (
  params: URLSearchParams,
  name: string,
) => {
  const value = params.get(name);

  return {
    ...(!!value &&
      value !== 'undefined' &&
      value !== 'null' && { [name]: value }),
  };
};

export const generateLinkTo = (...links: string[]): string => {
  return links.filter(Boolean).join('/');
};

export const generateFullPaths = <T extends Record<string, string>>(
  base: string,
  paths: T,
): T =>
  Object.entries(paths).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: generateLinkTo(base, value),
    }),
    {},
  ) as T;

export const buildEndpointWithVariables = (
  path: string,
  variables: (string | number)[],
) => {
  return variables.reduce((acc: string, variable) => {
    return acc.replace('*', variable.toString());
  }, path);
};
