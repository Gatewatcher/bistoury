import { isFunction } from "./../utils-lang";

export const areEqual = (arrayA: any[], arrayB: any[]): boolean => {
  if (arrayA.length !== arrayB.length) {
    return false;
  }

  for (let index = 0; index < arrayA.length; index++) {
    if (arrayA[index] !== arrayB[index]) {
      return false;
    }
  }

  return true;
};

export const filterBy = <T>(
  array: T[],
  filters: Record<string, boolean | ((params: any) => boolean)>
): T[] => {
  const filterKeys = Object.keys(filters);
  return array.filter((item) => {
    return filterKeys.every((key) => {
      if (!isFunction(filters[key])) {
        return filters[key] ?? true;
      }

      return (filters[key] as Function)(item[key]);
    });
  });
};

/**
 * @deprecated use range() instead.
 */
export const createRange = (start = 0, end: number) => {
  const length = end - start;
  return Array.from({ length }, (_, i) => start + i);
};

export const last = <T>(array: T[]): T | undefined => {
  return array.at(-1);
};

export const first = <T>(array: T[] | undefined): T | null => {
  return array?.length ? array[0] : null;
};

export const maxValueOf = <T>(array: T[], accessor: (value: T) => number) => {
  return Math.max(...array.map((o) => accessor(o)), 0);
};

export const toggleItem = <T>(arr: T[] | undefined, item: any) => {
  if (!arr) {
    return;
  }
  return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
};

export const formatArray = (arr: string[], limit = 3) => {
  return arr.length > limit
    ? `${arr.slice(0, limit).join(", ")}, ...`
    : arr.join(", ");
};

export const insertIf = <T>(predicate: boolean, ...elements: T[]) =>
  predicate ? elements : [];

export const unique = <T>(array: T[], key: keyof T) => {
  return [...new Map(array.map((item) => [item[key], item])).values()];
};

/**
 * Shuffle an array in place using the Fisher-Yates algorithm.
 */
export const shuffle = <T>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

/**
 * Return a shuffled copy of the parameter.
 */
export const shuffled = <T>(array: T[]) => {
  const result = [...array];
  shuffle(result);
  return result;
};

export type RangeParams = {
  start?: number;
  stop: number;
  step?: number;
};

export const range = ({ start = 0, stop, step = 1 }: RangeParams): number[] => {
  if (step === 0) {
    throw new RangeError("step cannot be equal to 0");
  }

  const isEmpty = (step > 0 && start >= stop) || (step < 0 && start <= stop);

  if (isEmpty) return [];

  const result = [];
  for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
    result.push(i);
  }

  return result;
};

export const splitArrayBy = <T>(
  array: T[],
  predicate: (item: T) => boolean
): [T[], T[]] => {
  return array.reduce(
    (acc, item) => {
      acc[predicate(item) ? 0 : 1].push(item);
      return acc;
    },
    [[], []]
  );
};

const strictEquals = <T>(e1: T, e2: T): boolean => e1 === e2;

export const mutuallyExclusive = <T>(
  array1: T[],
  array2: T[],
  predicate = strictEquals<T>
): T[] => {
  const uniqueArray1 = array1.filter(
    (e1) => array2.findIndex((e2) => predicate(e1, e2)) < 0
  );
  const uniqueArray2 = array2.filter(
    (e2) => array1.findIndex((e1) => predicate(e2, e1)) < 0
  );

  return uniqueArray1.concat(uniqueArray2);
};

/**
 * Subtract two arrays: return the values that are only in arrayA.
 */
export const arrayDifference = <T>(
  arrayA: T[],
  arrayB: T[],
  predicate = strictEquals<T>
) => arrayA.filter((a) => arrayB.findIndex((b) => predicate(a, b)) < 0);

export const groupBy = <T, K extends string | number>(
  items: T[],
  by: (item: T) => K
): Partial<Record<K, T[]>> => {
  const groups: Partial<Record<K, T[]>> = {};

  for (const item of items) {
    const key = by(item);
    const previous: T[] = groups[key] ?? [];
    previous.push(item);
    groups[key] = previous;
  }

  return groups;
};
