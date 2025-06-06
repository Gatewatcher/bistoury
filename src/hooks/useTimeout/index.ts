import { useCallback, useEffect, useRef } from "react";

type TimeoutId = ReturnType<typeof setTimeout>;

export const useTimeout = (): [(...args: any) => void, () => void] => {
  const timeout = useRef<TimeoutId | null>();

  // The same as the standard setTimeout function.
  const set = useCallback((fn: () => void, delay = 0) => {
    if (delay) {
      timeout.current = setTimeout(fn, delay);
    } else {
      fn();
    }
  }, []);

  // Prevent the potential scheduled call.
  const clear = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
  }, []);

  // Cleanup the timeout.
  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current);
    },
    []
  );

  return [set, clear];
};
