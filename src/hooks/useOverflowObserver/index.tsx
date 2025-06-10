import { useLayoutEffect, useState } from 'react';
import * as React from 'react';

import { first } from './../../utils-lang/array';

export const useOverflowObserver = (ref: React.RefObject<HTMLElement>) => {
  const [truncated, setTruncated] = useState(false);
  useLayoutEffect(() => {
    const currentElement = ref?.current;
    if (!window.ResizeObserver) {
      return;
    }

    const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      const entry = first(entries);
      const scrollWidth = entry.target.scrollWidth;
      const scrollHeight = entry.target.scrollHeight;
      const width = (entry.target as HTMLElement).offsetWidth;
      const height = (entry.target as HTMLElement).offsetHeight;
      setTruncated(scrollHeight > height || scrollWidth > width);
    });
    observer.observe(currentElement);
    return () => observer.unobserve(currentElement);
  }, [ref]);
  return truncated;
};
