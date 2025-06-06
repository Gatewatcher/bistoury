import { useEffect } from "react";

import { useAsyncDebounce } from "..";

export type UseOnWindowResizeOptions = {
  delay?: number;
};

const defaultOptions: UseOnWindowResizeOptions = {
  delay: 250,
};

export const useOnWindowResize = (
  onWindowResize: (event: Event) => void,
  options: UseOnWindowResizeOptions = defaultOptions
) => {
  const cb = onWindowResize;
  const debouncedCb = useAsyncDebounce(cb, options.delay);

  useEffect(() => {
    window.addEventListener("resize", debouncedCb);
    return () => void window.removeEventListener("resize", debouncedCb);
  }, [debouncedCb]);
};
