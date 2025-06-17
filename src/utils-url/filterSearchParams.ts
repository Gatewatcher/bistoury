import { isString, isURLSearchParams } from './../utils-lang';
import {
  filterParams,
  objectToURLSearchParams,
  removeEmptyParams,
  replaceParams,
  setDefaultParams,
} from './utils';

export type SearchParamsObject = {
  [key: string]: string | number | Array<string | number> | boolean | undefined;
};
export type SearchParams = URLSearchParams | string | SearchParamsObject;
export type FilterOptions = {
  include?: string[];
  exclude?: string[];
  replace?: SearchParamsObject;
  defaults?: SearchParamsObject;
  removeEmpty?: boolean;
};

export const filterSearchParams = (
  searchParams: SearchParams,
  {
    include,
    exclude,
    replace,
    defaults,
    removeEmpty = true,
  }: FilterOptions = {},
): URLSearchParams => {
  let resultSearchParams: URLSearchParams;
  if (searchParams === undefined) {
    resultSearchParams = new URLSearchParams();
  }
  if (isString(searchParams)) {
    resultSearchParams = new URLSearchParams(searchParams);
  } else if (isURLSearchParams(searchParams)) {
    resultSearchParams = searchParams;
  } else {
    resultSearchParams = objectToURLSearchParams(searchParams);
  }

  filterParams(resultSearchParams, { include, exclude });
  replaceParams(resultSearchParams, replace);
  setDefaultParams(resultSearchParams, defaults);
  removeEmpty && removeEmptyParams(resultSearchParams);

  return resultSearchParams;
};
