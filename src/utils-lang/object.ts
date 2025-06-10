/* eslint-disable @typescript-eslint/no-explicit-any */
import { isDefined } from './common';

export type AnyRecord = { [key: string]: any };

export const filterByKeys = <T>(
  filteredKeys: string[],
  data: T,
): Partial<T> => {
  return filteredKeys.reduce((obj, key) => ({ ...obj, [key]: data[key] }), {});
};

export const filterKeys = <T, K extends keyof T>(
  data: T,
  keys: K[],
): Pick<T, K> => {
  return keys.reduce(
    (acc, key) => ({
      ...acc,
      [key]: data[key],
    }),
    {} as Pick<T, K>,
  );
};

export const withoutKey = <T, K extends keyof T>(
  object: T,
  omittedKeys: K[],
): Omit<T, K> => {
  const result: Omit<T, K> = { ...object };
  omittedKeys.forEach(key => delete result[key as string]);
  return result;
};

export const removeEmpty = <T>(obj: T) => {
  for (const propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
  return obj;
};

export const isObject = (obj: any): obj is Object => {
  return obj instanceof Object;
};

export const isPlainObject = (
  value: unknown,
): value is Record<string, unknown> => {
  return (
    value !== null &&
    value !== undefined &&
    Object.getPrototypeOf(value) === Object.prototype
  );
};

export const isEmpty = <T>(obj: T) => {
  // because Object.keys(new Date()).length === 0;
  // we have to do some additional check
  return (
    obj && // 👈 null and undefined check
    Object.keys(obj).length === 0 &&
    // For a currently unknown reason, identity comparison over prototypes doesn't work
    // while running in Cypress, so we render the object as a string to check its type.
    Object.prototype.toString.call(obj) === '[object Object]'
  );
};

export const isObjectEqual = (objectA: AnyRecord, ObjectB: AnyRecord) => {
  if (Object.keys(objectA).length !== Object.keys(ObjectB).length) {
    return false;
  }
  let sameValues = true;
  for (const [key, value] of Object.entries(objectA)) {
    if (!(key in ObjectB) || ObjectB[key] !== value) {
      sameValues = false;
    }
  }
  return sameValues;
};

export const isObjectDeepEqual = (
  objectA: AnyRecord,
  ObjectB: AnyRecord,
): boolean => {
  if (Object.keys(objectA).length !== Object.keys(ObjectB).length) {
    return false;
  }
  let sameValues = true;
  for (const [key, value] of Object.entries(objectA)) {
    if (!(key in ObjectB)) {
      sameValues = false;
      break;
    }
    if (isObject(value)) {
      if (!isObjectDeepEqual(value, ObjectB[key])) {
        sameValues = false;
        break;
      }
    } else if (ObjectB[key] !== value) {
      sameValues = false;
      break;
    }
  }
  return sameValues;
};

export const deepMerge = <T = AnyRecord>(
  target: AnyRecord,
  ...sources: AnyRecord[]
): T => {
  for (const source of sources) {
    for (const key in source) {
      const newSource = source[key] as Record<string, unknown>;
      const newTarget = target[key] as Record<string, unknown>;

      if (Object(newSource) === newSource && Object(newTarget) === newTarget) {
        target[key] = deepMerge(newTarget, newSource);
        continue;
      }
      target[key] = source[key];
    }
  }

  return target as T;
};

export const getValue = <T>(
  object: AnyRecord,
  path: string | string[],
  defaultValue?: T,
): AnyRecord | T | undefined => {
  if (!path) return;

  const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g);
  const result = pathArray?.reduce((prev, key) => prev && prev[key], object);

  return isDefined(result) ? result : defaultValue;
};

/**
 * Returns an object that contains the key/value pairs from `values`
 * where the value differs from `reference`.
 *
 * [![Difference](https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Venn0100.svg/220px-Venn0100.svg.png)](https://fr.wikipedia.org/wiki/Alg%C3%A8bre_des_parties_d%27un_ensemble#Diff%C3%A9rence_et_diff%C3%A9rence_sym%C3%A9trique)
 *
 * @example
 * objectDiff({ foo: 'bar' }, { foo: 'baz' }) // { foo: 'bar' }
 * objectDiff({ foo: 42 }, {})                // { foo: 42 }
 * objectDiff({}, { foo: 42 })                // {}
 * objectDiff({ foo: undefined }, {})         // {}
 */
export const objectDiff = (
  value: Record<string, unknown>,
  reference: Record<string, unknown>,
) => {
  return Object.fromEntries(
    Object.entries(value).filter(([key, value]) => {
      return value !== reference[key];
    }),
  );
};

export const sortObjectKeys = <T extends object>(value: T, order: string[]) => {
  const entries = Object.entries(value).sort(([a], [b]) => {
    const indexOfA = order.indexOf(a);
    const indexOfB = order.indexOf(b);

    if (indexOfA >= 0 && indexOfB >= 0) {
      return indexOfA - indexOfB;
    } else if (indexOfA >= 0 || indexOfB >= 0) {
      return indexOfA >= 0 ? -1 : 1;
    } else {
      return a.localeCompare(b);
    }
  });
  return Object.fromEntries(entries) as T;
};
