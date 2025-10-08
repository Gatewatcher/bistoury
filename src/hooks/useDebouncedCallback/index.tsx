/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef } from 'react';

export const useDebouncedCallback = <T extends (...args: any[]) => void>(
  func: T,
  timeout = 300,
) => {
  const chrono = useRef<number | undefined>(undefined);

  return useCallback(
    (...args: Parameters<T>) => {
      const later = () => {
        clearTimeout(chrono.current);
        func(...args);
      };

      clearTimeout(chrono.current);
      chrono.current = window.setTimeout(later, timeout);
    },
    [func, timeout],
  );
};
