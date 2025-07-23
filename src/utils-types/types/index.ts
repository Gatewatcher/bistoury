import { circularLoader, isLoading } from '../constants';

export type TestId = string;
export type TestIds = Record<string, TestId>;

export type DataTestId = {
  'data-testid'?: TestId;
};

export type TestIdLoading = typeof isLoading | typeof circularLoader;

export type ExtractEnumInArray<T extends unknown[] | unknown> =
  T extends (infer U)[] ? U : never;

// https://stackoverflow.com/a/49725198/9239242
export type RequiredAtLeastOne<T, Keys extends keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

/**
 * type From = {
 *   age?: number
 * }
 * type To = Modify<From, {
 *   age: string
 * }>
 */
export type Modify<T, R> = Omit<T, keyof R> & R;

export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

/**
 * type A = { children: ReactNode }
 * type B = { icon: ReactElement }
 * type C = XOR<A, B>
 */
export type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

/**
 * type Person = {
 *   name: string;
 *   age: number;
 *   hasChildren: boolean
 * }
 * ValueOf<Person> ==> string | number | boolean
 */
export type ValueOf<T> = T[keyof T];

export type RequiredOnly<T, K extends keyof T> = Required<Pick<T, K>> &
  Partial<T>;

export type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

export type SetDifference<T, U> = T extends U ? never : T;
export type Diff<T extends object, U extends object> = Pick<
  T,
  SetDifference<keyof T, keyof U>
>;

export type NonPartial<T> = {
  [K in keyof Required<T> as T[K] extends never ? never : K]-?: T[K];
};

export type CamelCase<S extends string> =
  S extends `${infer Head}_${infer Tail}`
    ? `${Lowercase<Head>}${Capitalize<CamelCase<Tail>>}`
    : Lowercase<S>;

export type CamelCaseObjectKeys<T> = {
  [K in keyof T as CamelCase<Extract<K, string>>]: T[K] extends Array<infer U>
    ? U extends object
      ? CamelCaseObjectKeys<U>[]
      : T[K]
    : T[K] extends object
      ? CamelCaseObjectKeys<T[K]>
      : T[K];
};
