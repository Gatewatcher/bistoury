import { useCallback, useEffect, useState } from 'react';

export type UseRoveFocusOptions = {
  preventDefault?: boolean;
};

const DEFAULT_OPTIONS: UseRoveFocusOptions = {
  preventDefault: false,
};

export const useRoveFocus = (
  size: number,
  options: UseRoveFocusOptions = DEFAULT_OPTIONS,
) => {
  const [currentFocus, setCurrentFocus] = useState(0);
  const [currentSize, setCurrentSize] = useState(size);
  const { preventDefault } = options;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown') {
        preventDefault && e.preventDefault();
        setCurrentFocus(
          currentFocus === currentSize - 1 ? 0 : currentFocus + 1,
        );
      } else if (e.code === 'ArrowUp') {
        preventDefault && e.preventDefault();
        setCurrentFocus(currentFocus <= 0 ? currentSize - 1 : currentFocus - 1);
      }
    },
    [currentSize, currentFocus, setCurrentFocus, preventDefault],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, false);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, false);
    };
  }, [handleKeyDown]);

  return { currentFocus, setCurrentFocus, currentSize, setCurrentSize };
};
