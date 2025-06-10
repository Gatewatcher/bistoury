/* eslint-disable @typescript-eslint/no-explicit-any */

// Adapted from https://github.com/component/debounce/blob/master/index.js

export const debounce = (
  func: () => void,
  wait: number,
  immediate?: boolean,
) => {
  let timeout: ReturnType<typeof setTimeout> | null;
  let args: any;
  let context: any;
  let timestamp: number;
  let result: void;
  if (null == wait) {
    wait = 100;
  }

  function later() {
    const last = Date.now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        context = args = null;
      }
    }
  }

  const debounced = function (...args: any) {
    context = this as any;
    timestamp = Date.now();
    const callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };

  debounced.clear = function () {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  debounced.flush = function () {
    if (timeout) {
      result = func.apply(context, args);
      context = args = null;

      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
};
