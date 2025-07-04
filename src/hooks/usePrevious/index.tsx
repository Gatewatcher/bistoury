import { useEffect, useRef } from 'react';

export function usePrevious<T = unknown>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
