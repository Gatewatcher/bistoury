import { RefObject, useEffect } from 'react';

export const useOnElementResize = (
  ref: RefObject<HTMLElement>,
  onResize: (entry?: ResizeObserverEntry) => void,
) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        onResize(entry);
      }
    });

    resizeObserver.observe(element);

    return () => {
      if (resizeObserver && element) {
        resizeObserver.unobserve(element);
        resizeObserver.disconnect();
      }
    };
  }, [ref, onResize]);
};
