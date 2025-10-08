/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef } from 'react';

export const useGetLatest = (obj: any) => {
  const ref = useRef(obj);
  ref.current = obj;

  return useCallback(() => ref.current, []);
};

export const useAsyncDebounce = (defaultFn: any, defaultWait = 0) => {
  const debounceRef: any = useRef({});

  const getDefaultFn: any = useGetLatest(defaultFn);
  const getDefaultWait = useGetLatest(defaultWait);

  return useCallback(
    async (...args) => {
      if (!debounceRef.current.promise) {
        debounceRef.current.promise = new Promise((resolve, reject) => {
          debounceRef.current.resolve = resolve;
          debounceRef.current.reject = reject;
        });
      }

      if (debounceRef.current.timeout) {
        clearTimeout(debounceRef.current.timeout);
      }

      debounceRef.current.timeout = setTimeout(async () => {
        delete debounceRef.current.timeout;
        try {
          debounceRef.current.resolve(await getDefaultFn()(...args));
        } catch (err) {
          debounceRef.current.reject(err);
        } finally {
          delete debounceRef.current.promise;
        }
      }, getDefaultWait());

      return debounceRef.current.promise;
    },
    [getDefaultFn, getDefaultWait],
  );
};
