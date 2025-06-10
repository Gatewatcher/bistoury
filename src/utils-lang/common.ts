/* eslint-disable @typescript-eslint/no-explicit-any */
import { isString } from './../utils-lang';

export const isDefined = <T>(value: T): value is NonNullable<T> => {
  return value !== undefined && value !== null;
};

export const isJSON = (json: any): boolean => {
  if (!isString(json)) {
    return false;
  }
  return /^[\],:{}\s]*$/.test(
    json
      .replace(/\\["\\\/bfnrtu]/g, '@')
      .replace(
        /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
        ']',
      )
      .replace(/(?:^|:|,)(?:\s*\[)+/g, ''),
  );
};
