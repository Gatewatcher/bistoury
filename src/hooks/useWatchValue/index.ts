import { useState } from "react";

export type UseWatchValueOnChangeParams<T> = {
  current: T;
  previous: T;
};

export type UseWatchValueOnChangeHandler<T> = (
  params: UseWatchValueOnChangeParams<T>
) => void;

/**
 * Don't use this hook for triggering side effects.
 */
export const useWatchValue = <T>(
  value: T,
  onChange: UseWatchValueOnChangeHandler<T>
) => {
  const [previous, setPrevious] = useState<T>(value);

  if (value === previous) return;

  setPrevious(value);

  onChange({ current: value, previous });
};
