/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import type { RefObject } from 'react';

export const useKeepElementVisible = (
  ref: RefObject<HTMLLIElement | null>,
  dependencies: any[] = [],
) => {
  useEffect(() => {
    if (ref.current && ref.current.scrollIntoView) {
      ref.current.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies]);
};
