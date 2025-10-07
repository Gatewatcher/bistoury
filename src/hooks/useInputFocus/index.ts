/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef } from 'react';
import type { RefObject } from 'react';

interface useInputFocusOptions {
  cursorPosition?: 'start' | 'end' | 'select';
  autofocus?: boolean;
}

export const useInputFocus = (
  options: useInputFocusOptions = {},
): [RefObject<any>, () => void] => {
  const { cursorPosition, autofocus } = Object.assign(
    { cursorPosition: 'end' },
    options,
  );

  const ref = useRef<any>(null);
  const focus = useCallback(() => {
    if (ref.current) {
      const length = ref.current.value.length;
      const rangeStart = cursorPosition === 'end' ? length : 0;
      const rangeEnd = cursorPosition === 'start' ? 0 : length;
      ref.current.setSelectionRange(rangeStart, rangeEnd);
      ref.current.focus();
    }
  }, [cursorPosition]);

  useEffect(() => {
    if (autofocus) focus();
  }, [autofocus, focus]);
  return [ref, focus];
};
