/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import * as React from 'react';

export const useKeepElementVisible = (
  ref: React.MutableRefObject<HTMLLIElement | null>,
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
